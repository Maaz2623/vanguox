import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { stores } from "@/db/schema";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const storeRouter = createTRPCRouter({
  getStoresByUserId: protectedProcedure.query(async ({ ctx }) => {
    const data = await db
      .select()
      .from(stores)
      .where(eq(stores.ownerId, ctx.auth.user.id));

    if (data.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "You haven't created any stores yet.",
      });
    }

    return data;
  }),
  createStore: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        category: z.string(),
        description: z.string(),
        email: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { auth } = ctx;

      const [existingStore] = await db
        .select()
        .from(stores)
        .where(eq(stores.name, input.name));

      if (existingStore) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Store name already exists.",
        });
      }

      const [newStore] = await db
        .insert(stores)
        .values({
          name: input.name,
          description: input.description,
          category: input.category,
          email: input.email,
          ownerId: auth.user.id,
        })
        .returning();

      return newStore;
    }),
});
