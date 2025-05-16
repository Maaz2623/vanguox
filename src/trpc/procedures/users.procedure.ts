import { createTRPCRouter, protectedProcedure } from "../init";
import { TRPCError } from "@trpc/server";

export const usersRouter = createTRPCRouter({
  getUserData: protectedProcedure.query(async ({ ctx }) => {
    const { userData: user } = ctx;

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    return user;
  }),
});
