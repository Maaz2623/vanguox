import { createTRPCRouter } from "../init";
import { productsRouter } from "../procedures/product.procedure";
import { storeRouter } from "../procedures/store.procedure";
export const appRouter = createTRPCRouter({
  stores: storeRouter,
  products: productsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
