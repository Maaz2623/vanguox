import { createTRPCRouter, protectedProcedure } from "../init";
export const appRouter = createTRPCRouter({
  hello: protectedProcedure.query(async ({ ctx }) => {
    return `Hello ${ctx.auth.user.name}`;
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
