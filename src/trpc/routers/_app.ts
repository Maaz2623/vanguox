import { createTRPCRouter } from "../init";
import { cartRouter } from "../procedures/cart.procedure";
import { ordersRouter } from "../procedures/orders.procedure";
import { productsRouter } from "../procedures/product.procedure";
import { razorpayRouter } from "../procedures/razorpay.procedure";
import { storeRouter } from "../procedures/store.procedure";
import { wishlistRouter } from "../procedures/wishlist.procedure";
export const appRouter = createTRPCRouter({
  stores: storeRouter,
  products: productsRouter,
  wishlist: wishlistRouter,
  cart: cartRouter,
  orders: ordersRouter,
  razorpay: razorpayRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
