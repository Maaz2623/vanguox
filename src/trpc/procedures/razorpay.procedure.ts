import { createTRPCRouter, protectedProcedure } from "../init";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const razorpayRouter = createTRPCRouter({
  createOrder: protectedProcedure.mutation(async ({}) => {
    const order = await razorpay.orders.create({
      amount: 100 * 100,
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    });

    return order;
  }),
});
