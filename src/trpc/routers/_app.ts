import { createTRPCRouter } from "../init";
import { usersRouter } from "../procedures/users.procedure";
export const appRouter = createTRPCRouter({
  users: usersRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
