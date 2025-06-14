import { createTRPCRouter } from "../init";
import { cartRouter } from "../procedures/cart.procedure";
import { productsRouter } from "../procedures/product.procedure";
import { storeRouter } from "../procedures/store.procedure";
import { wishlistRouter } from "../procedures/wishlist.procedure";
export const appRouter = createTRPCRouter({
  stores: storeRouter,
  products: productsRouter,
  wishlist: wishlistRouter,
  cart: cartRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
