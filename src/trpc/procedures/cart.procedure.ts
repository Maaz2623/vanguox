import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "../init";
import { cart, cartItems, productImages, products } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const cartRouter = createTRPCRouter({
  removeItem: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [userCart] = await db
        .select()
        .from(cart)
        .where(eq(cart.userId, ctx.auth.user.id));

      if (!userCart) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cart not found.",
        });
      }

      const [item] = await db
        .select()
        .from(cartItems)
        .where(
          and(
            eq(cartItems.cartId, userCart.id),
            eq(cartItems.productId, input.productId)
          )
        );

      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Item not in cart.",
        });
      }

      if (item.quantity > 1) {
        // Decrease quantity
        await db
          .update(cartItems)
          .set({ quantity: item.quantity - 1 })
          .where(eq(cartItems.id, item.id));
      } else {
        // Remove item from cart
        await db.delete(cartItems).where(eq(cartItems.id, item.id));
      }

      return { success: true };
    }),

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

      const [data] = await db
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
        quantity: data.quantity,
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
      await db
        .insert(cart)
        .values({
          userId: ctx.auth.user.id,
        })
        .returning();

      return [];
    }

    const data = await db
      .select({
        id: cartItems.id,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        createdAt: cartItems.createdAt,
        product: {
          id: products.id,
          name: products.name,
          price: products.price,
        },
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.cartId, userCart.id))
      .orderBy(cartItems.createdAt);

    return data.reverse();
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

      const cartId = cartExists
        ? cartExists.id
        : (
            await db
              .insert(cart)
              .values({ userId: ctx.auth.user.id })
              .returning()
          )[0].id;

      // ✅ Check if item already exists in cart
      const [existingItem] = await db
        .select()
        .from(cartItems)
        .where(
          and(
            eq(cartItems.cartId, cartId),
            eq(cartItems.productId, input.productId)
          )
        );

      if (existingItem) {
        // ✅ Increment quantity
        await db
          .update(cartItems)
          .set({ quantity: existingItem.quantity + 1 })
          .where(eq(cartItems.id, existingItem.id));

        return existingItem.id;
      } else {
        // ✅ Insert new item with quantity 1
        const [addedProduct] = await db
          .insert(cartItems)
          .values({
            productId: input.productId,
            cartId: cartId,
            quantity: 1,
          })
          .returning();

        return addedProduct.id;
      }
    }),
});
