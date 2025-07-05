import z from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { prisma } from "@/lib/db";


export const productsRouter = createTRPCRouter({
  getMany: baseProcedure.input(z.object({
    keywords: z.array(z.string())
  })).query(async ({input}) => {
    const products = await prisma.product.findMany({
        where: {
            keywords: {
                hasSome: input.keywords
            }
        }
    })

    return products
  })
});
