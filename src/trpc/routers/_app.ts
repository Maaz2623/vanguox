import { createTRPCRouter } from "../init";
import { razorpayRouter } from "./procedures/razorpay.procedure";
import { sellerRouter } from "./procedures/seller.procedure";
export const appRouter = createTRPCRouter({
  seller: sellerRouter,
  razorpay: razorpayRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
