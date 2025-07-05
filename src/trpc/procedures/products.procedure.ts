import { prisma } from "@/lib/db";
import { GoogleGenAI } from "@google/genai";
import { baseProcedure, createTRPCRouter } from "../init";
import { KEYWORD_EXTRACTOR_PROMPT, SUMMARIZER_PROMPT } from "@/prompt";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { ee } from "../routers/_app";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure.input(
    z.object({
      query: z.string(),
      chatId: z.string()
    })
  ).mutation(async ({ input }) => {


    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
    });

   // Consider passing this dynamically later

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        content: input.query,
        role: "USER",
        type: "RESULT",
        chatId: input.chatId,
      },
    });

    ee.emit("message:add", userMessage)

    let summary = "";
    let keywords: string[] = [];

    try {
      // Get summary
      const responseSummary = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: SUMMARIZER_PROMPT }] },
          { role: "user", parts: [{ text: input.query }] },
        ],
      });

      if (!responseSummary.text?.trim()) throw new Error("No summary returned");

      summary = responseSummary.text.trim();

      // Get keywords
      const responseKeywords = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: KEYWORD_EXTRACTOR_PROMPT }] },
          { role: "user", parts: [{ text: input.query }] },
        ],
      });

      if (!responseKeywords.text?.trim()) throw new Error("No keywords returned");

      keywords = responseKeywords.text
        .split(",")
        .map(k => k.trim())
        .filter(k => k.length > 0);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = await prisma.message.create({
        data: {
          content: "Something went wrong",
          type: "ERROR",
          role: "ASSISTANT",
          chatId: input.chatId,
        },
      });

      ee.emit("message:add", errorMessage)

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message || "Failed to process AI response",
      });
    }

    // Save AI response
    const aiMessage = await prisma.message.create({
      data: {
        content: summary,
        role: "ASSISTANT",
        type: "RESULT",
        chatId: input.chatId,
      },
    });

    ee.emit("message:add", aiMessage)

    
    // Fetch matching products
    const products = await prisma.product.findMany({
      where: {
        keywords: {
          hasSome: keywords,
        },
      },
    });
    

    return {
      summary,
      keywords,
      products, // Uncomment when returning products
    };
  }),
});
