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
    const userId = ctx.auth.user.id;

    const [userCart] = await db
      .select()
      .from(cart)
      .where(eq(cart.userId, userId));

    const userCartItems = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.cartId, userCart.id));

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
      return acc + Number(price) * item.quantity;
    }, 0);

    const customOrderId = generateOrderId();

    // 👉 Create Razorpay order before inserting into DB
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // amount in paise
      currency: "INR",
      receipt: customOrderId,
      notes: {
        userId,
      },
    });

    // ✅ Store the Razorpay order ID in DB
    const [newOrder] = await db
      .insert(orders)
      .values({
        id: customOrderId,
        userId,
        cartId: userCart.id,
        totalAmount: totalAmount.toString(),
        razorpayId: razorpayOrder.id, // ✅ THIS IS THE FIX
      })
      .returning();

    const orderItemsData = userCartItems.map((item) => ({
      orderId: newOrder.id,
      productId: item.productId,
      quantity: item.quantity,
      priceAtPurchase: productsPriceMap[item.productId],
    }));

    await db.insert(orderItems).values(orderItemsData);
    await db.delete(cartItems).where(eq(cartItems.cartId, userCart.id));

    await sendEmail({
      to: ctx.auth.user.email,
      subject: "ORDER PLACED",
      text: `Congratulations your order: ${newOrder.id} has been placed.`,
    });

    return {
      message: "Order created successfully",
      orderId: newOrder.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    };
  }),
});
