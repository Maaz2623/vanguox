import { db } from "@/db";
import { sellerAccount } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import z from "zod";

export const sellerRouter = createTRPCRouter({
  getSellerAccount: protectedProcedure.query(async ({ ctx }) => {
    const [data] = await db
      .select()
      .from(sellerAccount)
      .where(eq(sellerAccount.userId, ctx.auth.user.id));

    return {
      exists: !!data,
      account: data,
    };
  }),
  createSellerAccount: protectedProcedure
    .input(
      z.object({
        upiId: z
          .string()
          .trim()
          .min(5, "UPI ID is too short")
          .max(50, "UPI ID is too long")
          .regex(/^[\w.-]+@[\w.-]+$/, "Invalid UPI ID format"),

        accountHolderName: z
          .string()
          .trim()
          .min(3, "Name is too short")
          .max(100, "Name is too long"),

        accountNumber: z
          .string()
          .trim()
          .min(6, "Account number is too short")
          .max(20, "Account number is too long"),

        ifscCode: z
          .string()
          .trim()
          .toUpperCase()
          .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC Code"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if seller account already exists
      const [existing] = await db
        .select()
        .from(sellerAccount)
        .where(eq(sellerAccount.userId, ctx.auth.user.id));

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Seller account already exists for this user.",
        });
      }

      // Create new seller account
      try {
        const [data] = await db
          .insert(sellerAccount)
          .values({
            userId: ctx.auth.user.id,
            upiId: input.upiId.trim().toLowerCase(),
            accountNumber: input.accountNumber.trim(),
            bankAccountHolderName: input.accountHolderName.trim(),
            ifscCode: input.ifscCode.trim().toUpperCase(),
          })
          .returning();

        return { id: data.id };
      } catch (err) {
        console.error("Failed to create seller account:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create seller account. Please try again later.",
        });
      }
    }),
});
