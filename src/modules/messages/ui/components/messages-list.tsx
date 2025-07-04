import { ScrollArea } from "@/components/ui/scroll-area";
import { MessagesCard } from "./messages-card";
import { useEffect, useRef } from "react";

type MessageType = "USER" | "ASSISTANT";

interface Message {
  type: MessageType;
  content: string;
}

export const MessagesList = () => {
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages: Message[] = [
    {
      type: "USER",
      content: "Hey, can you help me understand how to deploy a Next.js app?",
    },
    {
      type: "ASSISTANT",
      content:
        "Sure! You can deploy a Next.js app using Vercel, Netlify, or your own server. Vercel is the easiest—just connect your GitHub repo.",
    },
    {
      type: "USER",
      content: "What if I want to use my own server with Bun?",
    },
    {
      type: "ASSISTANT",
      content:
        "Great choice! You can build the app with `next build`, export it with `next export` for static, or use a custom server with `bun run`. Want a code snippet?",
    },
    {
      type: "USER",
      content: "Yes, please share the code for Bun server integration.",
    },
    {
      type: "ASSISTANT",
      content:
        "Here's a basic example:\n\n```ts\nimport { serve } from 'bun';\nserve({\n  fetch(req) {\n    return new Response('Hello from Bun + Next.js!');\n  },\n});\n```",
    },
    {
      type: "USER",
      content: "Thanks! That’s really helpful. How about integrating tRPC?",
    },
    {
      type: "ASSISTANT",
      content:
        "For tRPC, you'll need to create a tRPC router and integrate it with your server entry. Want a boilerplate?",
    },
    {
      type: "USER",
      content: "Yes, that would be awesome!",
    },
    {
      type: "ASSISTANT",
      content:
        "Here's a simple setup:\n\n```ts\nimport { appRouter } from './router';\nconst handler = createHTTPHandler({ router: appRouter });\n\nserve((req) => handler(req));\n```",
    },
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages.length]);

  return (
    <ScrollArea className="h-[405px] overflow-y-auto pr-8 flex flex-col">
      <div className="flex flex-col gap-y-4">
        {messages.map((message) => (
          <MessagesCard
            key={message.content}
            type={message.type}
            content={message.content}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
};
