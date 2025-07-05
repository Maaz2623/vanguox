import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "../init";
import z from "zod";
import { ee } from "../routers/_app";
import { on } from "events";
import { observable } from "@trpc/server/observable";
import { Message } from "../../../prisma/generated/prisma";
import { GoogleGenAI } from "@google/genai";
import { KEYWORD_EXTRACTOR_PROMPT, SUMMARIZER_PROMPT } from "@/prompt";
import { TRPCError } from "@trpc/server";


export const messagesRouter = createTRPCRouter({
    getMany: baseProcedure.input(z.object({
        chatId: z.string()
    })).query(async () => {
        const messages = await prisma.message.findMany({
            where: {
                chatId: "64bd38e0-3443-4610-86f6-28f5309c5a8c"
            }
        })


        return messages
    }),
    onMessageAdd: baseProcedure
    .input(z.object({ chatId: z.string() }))
   .subscription(({ input, signal }) => {
    return observable<Message>((emit) => {
      // Async behavior inside, but not the outer function
      (async () => {
        const iterator = on(ee, "message:add", { signal });

        for await (const [data] of iterator) {
          const msg = data as Message;
          if (msg.chatId === input.chatId) {
            emit.next(msg);
          }
        }
      })();


      // Return teardown logic (optional)
      return () => {
        // You can optionally remove listeners or handle cleanup here
      };
    });
    }),
    create: baseProcedure.input(
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
        role: "ASSISTANT",
        type: "RESULT",
        chatId: input.chatId,
        summary: summary,
        keywords: keywords,
      },
    });

    ee.emit("message:add", aiMessage)

    return {
      summary,
      keywords,
    };
  }),
})