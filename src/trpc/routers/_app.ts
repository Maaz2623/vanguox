import { createTRPCRouter } from "../init";
import { productsRouter } from "../procedures/product.procedure";
import { storeRouter } from "../procedures/store.procedure";
import { wishlistRouter } from "../procedures/wishlist.procedure";
export const appRouter = createTRPCRouter({
  stores: storeRouter,
  products: productsRouter,
  wishlist: wishlistRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
