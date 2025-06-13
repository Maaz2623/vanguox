import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "../init";
import { z } from "zod";
import { wishlist } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const wishlistRouter = createTRPCRouter({
  getProduct: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const [product] = await db
        .select()
        .from(wishlist)
        .where(
          and(
            eq(wishlist.productId, input.productId),
            eq(wishlist.userId, ctx.auth.user.id)
          )
        );

      if (product) {
        return true;
      } else {
        return false;
      }
    }),
  addProduct: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [isExisting] = await db
        .select()
        .from(wishlist)
        .where(
          and(
            eq(wishlist.productId, input.productId),
            eq(wishlist.userId, ctx.auth.user.id)
          )
        );

      if (isExisting) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Product already exists in wishlist.",
        });
      }

      const [addedProduct] = await db
        .insert(wishlist)
        .values({
          productId: input.productId,
          userId: ctx.auth.user.id,
        })
        .returning();

      return addedProduct;
    }),
  removeProduct: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [isExisting] = await db
        .select()
        .from(wishlist)
        .where(
          and(
            eq(wishlist.productId, input.productId),
            eq(wishlist.userId, ctx.auth.user.id)
          )
        );

      if (!isExisting) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Product does not exist in wishlist.",
        });
      }

      const [removedProduct] = await db
        .delete(wishlist)
        .where(
          and(
            eq(wishlist.productId, input.productId),
            eq(wishlist.userId, ctx.auth.user.id)
          )
        )
        .returning();

      return removedProduct;
    }),
});
