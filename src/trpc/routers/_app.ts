import { createTRPCRouter } from '../init';
import { messagesRouter } from '../procedures/messages.procedure';
import { productsRouter } from '../procedures/products.procedure';

import { EventEmitter } from "events";

export const ee = new EventEmitter() 

export const appRouter = createTRPCRouter({
  product: productsRouter,
  message: messagesRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;