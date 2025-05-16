import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "../init";
import { user } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

export const usersRouter = createTRPCRouter({
  getUserData: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    const [data] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!data) {
      throw new TRPCError({
        code: "NOT_FOUND",
      });
    }

    return data;
  }),
});
