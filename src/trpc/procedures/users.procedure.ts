import { createTRPCRouter, protectedProcedure } from "../init";
import { TRPCError } from "@trpc/server";

export const usersRouter = createTRPCRouter({
  getUserData: protectedProcedure.query(async ({ ctx }) => {
    const { userData: user } = ctx;

    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User data not found in context",
      });
    }

    return user;
  }),
});
