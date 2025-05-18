import { createTRPCRouter } from "../init";
import { storesRouter } from "../procedures/stores.procedure";
import { usersRouter } from "../procedures/users.procedure";
export const appRouter = createTRPCRouter({
  users: usersRouter,
  stores: storesRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
