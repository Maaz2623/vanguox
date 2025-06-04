import { createTRPCRouter } from "../init";
import { sellerRouter } from "./procedures/seller.procedure";
export const appRouter = createTRPCRouter({
  seller: sellerRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
