import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { stores } from "@/db/schema";

export const storesRouter = createTRPCRouter({
  createStore: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      if (!input.name) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Name for store is not provided",
        });
      }

      const [newStore] = await db
        .insert(stores)
        .values({
          name: input.name,
          ownerId: ctx.userId,
        })
        .returning();

      return newStore;
    }),
});
