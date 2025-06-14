import { createTRPCRouter, protectedProcedure } from "../init";
import { db } from "@/db";
import { cart, cartItems, orderItems, orders, products } from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { generateOrderId } from "@/lib/functions";
import { eq, inArray } from "drizzle-orm";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const ordersRouter = createTRPCRouter({
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

    const [newOrder] = await db
      .insert(orders)
      .values({
        id: customOrderId,
        userId,
        cartId: userCart.id,
        totalAmount: totalAmount.toString(),
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

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // amount in paise
      currency: "INR",
      receipt: newOrder.id,
      notes: {
        userId,
      },
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
