"use server";
import { db } from "@/db";
import { stores } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getSubdomain(hostname: string): Promise<string | null> {
  const parts = hostname.split(".");
  if (parts.length < 3) return null;

  const [domain] = await db
    .select()
    .from(stores)
    .where(eq(stores.name, parts[0]));

  if (!domain) return null;

  return domain.name;
}
