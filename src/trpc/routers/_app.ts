import { createTRPCRouter } from "../init";
import { storeRouter } from "../procedures/store.procedure";
export const appRouter = createTRPCRouter({
  stores: storeRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
