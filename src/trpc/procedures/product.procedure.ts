import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { products, sizes, colors, productImages, stores } from "@/db/schema"; // adjust import paths
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { TRPCError } from "@trpc/server";

export const productsRouter = createTRPCRouter({
  getProducts: protectedProcedure.query(async () => {
    const productsList = await db.select().from(products);

    const formattedProducts = await Promise.all(
      productsList.map(async (product) => {
        const [productSizes, productColors, images] = await Promise.all([
          db.select().from(sizes).where(eq(sizes.productId, product.id)),
          db.select().from(colors).where(eq(colors.productId, product.id)),
          db
            .select()
            .from(productImages)
            .where(eq(productImages.productId, product.id)),
        ]);

        return {
          ...product,
          sizes: productSizes ?? [],
          colors: productColors ?? [],
          images: images ?? [],
        };
      })
    );

    return formattedProducts;
  }),
  getProductDetails: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
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

      const [store] = await db
        .select()
        .from(stores)
        .where(eq(stores.id, product.storeId));

      if (store.ownerId !== ctx.auth.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }

      const [productSizes, productColors, images] = await Promise.all([
        db.select().from(sizes).where(eq(sizes.productId, product.id)),
        db.select().from(colors).where(eq(colors.productId, product.id)),
        db
          .select()
          .from(productImages)
          .where(eq(productImages.productId, product.id)),
      ]);

      const formattedProduct = {
        ...product,
        sizes: productSizes ?? [],
        colors: productColors ?? [],
        images: images ?? [],
      };

      return formattedProduct;
    }),
  getProductsByStoreName: protectedProcedure
    .input(
      z.object({
        storeName: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const [store] = await db
        .select()
        .from(stores)
        .where(
          and(
            eq(stores.name, input.storeName),
            eq(stores.ownerId, ctx.auth.user.id)
          )
        );

      if (!store) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Store not found.",
        });
      }

      const data = await db
        .select()
        .from(products)
        .where(eq(products.storeId, store.id));

      if (!data.length) {
        return [];
      }

      return data;
    }),
  createProduct: protectedProcedure
    .input(
      z.object({
        storeName: z.string(),
        name: z.string(),
        description: z.string(),
        category: z.string(),
        price: z.string(),
        stockQuantity: z.number(),
        sizes: z
          .array(z.object({ name: z.string(), value: z.string() }))
          .optional(),
        colors: z
          .array(z.object({ name: z.string(), value: z.string() }))
          .optional(),
        images: z
          .array(
            z.object({
              url: z.string().url(),
              alt: z.string(),
              priority: z.number(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const [store] = await db
        .select()
        .from(stores)
        .where(eq(stores.name, input.storeName));
      if (!store) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Store does not exist.",
        });
      }
      const [product] = await db
        .insert(products)
        .values({
          storeId: store.id,
          name: input.name,
          description: input.description,
          category: input.category,
          price: input.price.toString(),
          stockQuantity: input.stockQuantity,
        })
        .returning();
      const productId = product.id;
      // Insert sizes
      if (input.sizes?.length) {
        await db.insert(sizes).values(
          input.sizes.map((size) => ({
            productId,
            name: size.name,
            value: size.value,
          }))
        );
      }
      // Insert colors
      if (input.colors?.length) {
        await db.insert(colors).values(
          input.colors.map((color) => ({
            productId,
            name: color.name,
            value: color.value,
          }))
        );
      }
      // Insert images
      if (input.images?.length) {
        await db.insert(productImages).values(
          input.images.map((img) => ({
            productId,
            url: img.url,
            alt: img.alt,
            priority: img.priority,
          }))
        );
      }
      return store;
    }),
});
