import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "../init";
import { cart, cartItems, productImages, products } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const cartRouter = createTRPCRouter({
  getCartItem: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const [userCart] = await db
        .select()
        .from(cart)
        .where(eq(cart.userId, ctx.auth.user.id));

      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, input.productId));

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found.",
        });
      }

      const images = await db
        .select()
        .from(productImages)
        .where(eq(productImages.productId, product.id));

      const data = await db
        .select()
        .from(cartItems)
        .where(
          and(
            eq(cartItems.cartId, userCart.id),
            eq(cartItems.productId, input.productId)
          )
        );

      const formattedProduct = {
        id: product.id,
        images: images,
        quantity: data.length,
        price: product.price,
        name: product.name,
      };

      return formattedProduct;
    }),
  getCartItems: protectedProcedure.query(async ({ ctx }) => {
    const [userCart] = await db
      .select()
      .from(cart)
      .where(eq(cart.userId, ctx.auth.user.id));

    if (!userCart) {
      const [newCart] = await db
        .insert(cart)
        .values({
          userId: ctx.auth.user.id,
        })
        .returning();

      const data = await db
        .select()
        .from(cartItems)
        .where(eq(cartItems.cartId, newCart.id));

      return data;
    }

    const data = await db
      .select()
      .from(cartItems)
      .where(eq(cartItems.cartId, userCart.id));

    return data;
  }),
  addToCart: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [cartExists] = await db
        .select()
        .from(cart)
        .where(eq(cart.userId, ctx.auth.user.id));

      if (!cartExists) {
        const [newCart] = await db
          .insert(cart)
          .values({
            userId: ctx.auth.user.id,
          })
          .returning();

        const [addedProduct] = await db
          .insert(cartItems)
          .values({
            productId: input.productId,
            cartId: newCart.id,
          })
          .returning();

        return addedProduct.id;
      }

      const [addedProduct] = await db
        .insert(cartItems)
        .values({
          productId: input.productId,
          cartId: cartExists.id,
        })
        .returning();

      return addedProduct.id;
    }),
});
