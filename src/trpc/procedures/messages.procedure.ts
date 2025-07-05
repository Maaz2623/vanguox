import { prisma } from "@/lib/db";
import { baseProcedure, createTRPCRouter } from "../init";
import z from "zod";
import { ee } from "../routers/_app";
import { on } from "events";
import { observable } from "@trpc/server/observable";
import { Message } from "../../../prisma/generated/prisma";


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
})