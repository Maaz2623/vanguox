import { auth } from "@/auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import { initTRPC, TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";

export const createTRPCContext = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user.id;

  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async function isAuthed(
  opts
) {
  const { ctx } = opts;

  if (!ctx.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  const [userData] = await db
    .select()
    .from(user)
    .where(eq(user.id, ctx.userId))
    .limit(1);

  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return opts.next({
    ctx: {
      userId: userData.id,
      userData,
    },
  });
});
