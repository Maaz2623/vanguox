import { betterAuth } from "better-auth";
import { PrismaClient } from "../../prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";


const prisma = new PrismaClient(prisma);
export const auth = betterAuth({});
