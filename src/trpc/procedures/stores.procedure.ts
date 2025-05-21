import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";
import { stores } from "@/db/schema";
import { eq } from "drizzle-orm";

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
  getStoreByNameAndUserId: protectedProcedure
    .input(
      z.object({
        storeName: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      if (!input.storeName) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Name for store is not provided",
        });
      }

      const [store] = await db
        .select()
        .from(stores)
        .where(eq(stores.name, input.storeName))
        .limit(1);

      return {
        store,
        owner: store.ownerId === ctx.userId,
      };
    }),
});
