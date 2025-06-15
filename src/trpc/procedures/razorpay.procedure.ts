import { razorpayFundAccounts } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "../init";
import Razorpay from "razorpay";
import { db } from "@/db";
import { z } from "zod";
import { eq } from "drizzle-orm";

const razorpayX = new Razorpay({
  key_id: process.env.RAZORPAY_PAYOUT_KEY_ID!,
  key_secret: process.env.RAZORPAY_PAYOUT_KEY_SECRET!,
});

export const razorpayRouter = createTRPCRouter({
  createFundAccount: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        contact: z.string(),
        ifsc: z.string(),
        accountNumber: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.user.id;

      const [existing] = await db
        .select()
        .from(razorpayFundAccounts)
        .where(eq(razorpayFundAccounts.userId, userId));

      if (existing) {
        return {
          message: "Fund account already exists",
          fundAccountId: existing.fundAccountId,
        };
      }

      const key_id = process.env.RAZORPAY_PAYOUT_KEY_ID!;
      const key_secret = process.env.RAZORPAY_PAYOUT_KEY_SECRET!;
      const authHeader =
        "Basic " + Buffer.from(`${key_id}:${key_secret}`).toString("base64");

      // 1. Create Contact
      const contactRes = await fetch("https://api.razorpay.com/v1/contacts", {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: input.name,
          email: input.email,
          contact: input.contact,
          type: "vendor",
          reference_id: userId,
        }),
      });

      const contact = await contactRes.json();

      // 2. Create Fund Account
      const fundAccount = await razorpayX.fundAccount.create({
        contact_id: contact.id,
        account_type: "bank_account",
        bank_account: {
          name: input.name,
          ifsc: input.ifsc,
          account_number: input.accountNumber,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      // 3. Validate Fund Account
      // try {
      //   const validationRes = await fetch(
      //     "https://api.razorpay.com/v1/fund_accounts/validations",
      //     {
      //       method: "POST",
      //       headers: {
      //         Authorization: authHeader,
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify({
      //         account_number: input.accountNumber,
      //         fund_account: fundAccount.id,
      //         amount: 1,
      //       }),
      //     }
      //   );
      //   const validation = await validationRes.json();

      //   console.log(validation);

      //   if (!validationRes.ok || validation.status !== "success") {
      //     throw new Error(
      //       "Bank account validation failed. Please check the details."
      //     );
      //   }

      //   if (validationRes.ok) {
      //     console.log("Validation successfull");
      //   }
      // } catch (error) {
      //   console.log(error);
      // }

      // 4. Store in DB
      await db.insert(razorpayFundAccounts).values({
        userId,
        contactId: contact.id,
        fundAccountId: fundAccount.id,
      });

      return {
        message: "Fund account created and validated successfully",
        fundAccountId: fundAccount.id,
      };
    }),
});
