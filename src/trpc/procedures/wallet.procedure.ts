import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "../init";
import {
  orderItems,
  orders,
  razorpayFundAccounts,
  sellerWallet,
  withdrawals,
} from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

export const walletRouter = createTRPCRouter({
  getFundAccount: protectedProcedure.query(async ({ ctx }) => {
    const [fundAccount] = await db
      .select()
      .from(razorpayFundAccounts)
      .where(eq(razorpayFundAccounts.userId, ctx.auth.user.id));

    if (!fundAccount) {
      return false;
    }

    return true;
  }),
  getWalletDetails: protectedProcedure.query(async ({ ctx }) => {
    const [wallet] = await db
      .select()
      .from(sellerWallet)
      .where(eq(sellerWallet.userId, ctx.auth.user.id));

    const withdrawableAmountQuery = await db
      .select({
        withdrawable: sql<number>`COALESCE(SUM(${orderItems.priceAtPurchase} * ${orderItems.quantity}), 0)`,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(and(eq(orders.status, "paid"), eq(orderItems.isSettled, true)));

    return {
      balance: wallet.balance,
      withdrawable: withdrawableAmountQuery[0].withdrawable,
    };
  }),
  withdrawFunds: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.auth.user.id;

    const [wallet] = await db
      .select()
      .from(sellerWallet)
      .where(eq(sellerWallet.userId, userId));

    if (!wallet) {
      throw new Error("Wallet not found.");
    }

    // ✅ Fetch total withdrawable amount
    const [{ withdrawable }] = await db
      .select({
        withdrawable: sql<number>`COALESCE(SUM(${orderItems.priceAtPurchase} * ${orderItems.quantity}), 0)`,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(and(eq(orders.status, "paid"), eq(orderItems.isSettled, true)));

    const amount = Number(withdrawable);

    if (!amount || amount <= 0) {
      throw new Error("No withdrawable funds available.");
    }

    const [fundAccount] = await db
      .select()
      .from(razorpayFundAccounts)
      .where(eq(razorpayFundAccounts.userId, ctx.auth.user.id));

    // ✅ TODO: Replace with your stored fund_account_id for this user
    const fundAccountId = fundAccount.id;

    if (!fundAccountId) {
      throw new Error("Fund account not linked to user.");
    }

    // ✅ Log the withdrawal
    const [withdrawal] = await db
      .insert(withdrawals)
      .values({
        userId,
        amount: amount.toString(),
        status: "processing",
        createdAt: new Date(),
      })
      .returning();

    // ✅ Deduct amount from wallet
    await db
      .update(sellerWallet)
      .set({
        balance: sql`${sellerWallet.balance} - ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(sellerWallet.userId, userId));

    // ✅ Mark all settled items as withdrawn (you can customize filter)
    await db
      .update(orderItems)
      .set({ isSettled: false }) // Or mark as withdrawn if you track that
      .where(eq(orderItems.isSettled, true));

    return withdrawal;
  }),
});
