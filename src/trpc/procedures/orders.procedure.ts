import { createTRPCRouter, protectedProcedure } from "../init";
import { db } from "@/db";
import {
  cart,
  cartItems,
  orderItems,
  orders,
  products,
  sellerWallet,
  stores,
} from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { generateOrderId } from "@/lib/functions";
import { TRPCError } from "@trpc/server";
import { eq, inArray, sql } from "drizzle-orm";
import Razorpay from "razorpay";
import { z } from "zod";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const ordersRouter = createTRPCRouter({
  postPayment: protectedProcedure
    .input(
      z.object({
        razorpayOrderId: z.string(), // this is your `orders.id`
        paymentId: z.string(), // optional: to store or log
      })
    )
    .mutation(async ({ input }) => {
      const razorpayId = input.razorpayOrderId;

      // 1. Fetch the order
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.razorpayId, razorpayId));

      if (!order) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Order not found" });
      }

      // Prevent double payment
      if (order.status === "paid") {
        return { message: "Order already paid" };
      }

      // 2. Fetch all order items
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));

      // 3. Fetch products
      const productIds = items.map((i) => i.productId);
      const productsData = await db
        .select({
          id: products.id,
          storeId: products.storeId,
        })
        .from(products)
        .where(inArray(products.id, productIds));

      // 4. Fetch stores → sellers
      const storeIds = [...new Set(productsData.map((p) => p.storeId))];
      const storeData = await db
        .select({
          id: stores.id,
          userId: stores.ownerId,
        })
        .from(stores)
        .where(inArray(stores.id, storeIds));

      const storeToSellerMap = Object.fromEntries(
        storeData.map((store) => [store.id, store.userId])
      );

      // 5. Distribute money to sellers
      const sellerEarnings: Record<string, number> = {};

      for (const item of items) {
        const product = productsData.find((p) => p.id === item.productId);
        if (!product) continue;

        const sellerId = storeToSellerMap[product.storeId];
        const amount = Number(item.priceAtPurchase) * item.quantity;

        if (!sellerEarnings[sellerId]) sellerEarnings[sellerId] = 0;
        sellerEarnings[sellerId] += amount;
      }

      // 6. Update each seller's wallet
      for (const [sellerId, amount] of Object.entries(sellerEarnings)) {
        const [existingWallet] = await db
          .select()
          .from(sellerWallet)
          .where(eq(sellerWallet.userId, sellerId));

        if (existingWallet) {
          // Update balance
          await db
            .update(sellerWallet)
            .set({
              balance: sql`${sellerWallet.balance} + ${amount}`,
              updatedAt: new Date(),
            })
            .where(eq(sellerWallet.userId, sellerId));
        } else {
          // Create new wallet
          await db.insert(sellerWallet).values({
            userId: sellerId,
            balance: amount.toFixed(2),
          });
        }
      }

      // 7. Update order payment status
      await db
        .update(orders)
        .set({
          status: "paid",
          updatedAt: new Date(),
        })
        .where(eq(orders.id, order.id));

      return { message: "Payment processed and wallets updated." };
    }),

  createOrder: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      console.log("🔐 Razorpay Config:", {
        key: process.env.RAZORPAY_KEY_ID,
        secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const userId = ctx.auth.user.id;
      console.log("➡️ Starting order creation for user:", userId);

      const [userCart] = await db
        .select()
        .from(cart)
        .where(eq(cart.userId, userId));

      if (!userCart) {
        console.error("❌ No cart found for user:", userId);
        throw new Error("Cart not found");
      }

      const userCartItems = await db
        .select()
        .from(cartItems)
        .where(eq(cartItems.cartId, userCart.id));

      if (userCartItems.length === 0) {
        console.error("❌ Cart is empty for user:", userId);
        throw new Error("Your cart is empty");
      }

      const productIds = userCartItems.map((item) => item.productId);

      const productsData = await db
        .select()
        .from(products)
        .where(inArray(products.id, productIds));

      const productsPriceMap = Object.fromEntries(
        productsData.map((p) => [p.id, p.price])
      );

      const totalAmount = userCartItems.reduce((acc, item) => {
        const price = productsPriceMap[item.productId];
        if (price === undefined) {
          console.error(`❌ Price not found for product ID: ${item.productId}`);
          throw new Error(`Product with ID ${item.productId} is unavailable`);
        }
        return acc + Number(price) * item.quantity;
      }, 0);

      if (totalAmount <= 0) {
        console.error("❌ Invalid total amount:", totalAmount);
        throw new Error("Total amount must be greater than zero");
      }

      const customOrderId = generateOrderId();
      console.log("🧾 Generated custom order ID:", customOrderId);

      // Razorpay Order Creation
      const razorpayOrder = await razorpay.orders.create({
        amount: totalAmount * 100, // amount in paise
        currency: "INR",
        receipt: customOrderId,
        notes: {
          userId,
        },
      });

      if (!razorpayOrder || !razorpayOrder.id) {
        console.error("❌ Razorpay order creation failed", razorpayOrder);
        throw new Error("Failed to create order with Razorpay");
      }

      console.log("✅ Razorpay order created:", razorpayOrder.id);

      const [newOrder] = await db
        .insert(orders)
        .values({
          id: customOrderId,
          userId,
          cartId: userCart.id,
          totalAmount: totalAmount.toString(),
          razorpayId: razorpayOrder.id,
        })
        .returning();

      const orderItemsData = userCartItems.map((item) => ({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: productsPriceMap[item.productId],
      }));

      await db.insert(orderItems).values(orderItemsData);
      console.log("🛒 Order items inserted:", orderItemsData.length);

      await db.delete(cartItems).where(eq(cartItems.cartId, userCart.id));
      console.log("🧹 Cart items cleared for cart:", userCart.id);

      await sendEmail({
        to: ctx.auth.user.email,
        subject: "ORDER PLACED",
        text: `Congratulations! Your order ${newOrder.id} has been placed.`,
      });
      console.log("📧 Confirmation email sent to:", ctx.auth.user.email);

      return {
        message: "Order created successfully",
        orderId: newOrder.id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      };
    } catch (err) {
      console.error(
        "❌ Error in createOrder mutation:",
        JSON.stringify(err, null, 2)
      );

      if (err instanceof Error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: err.message,
        });
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unknown server error",
        cause: err,
      });
    }
  }),
});
