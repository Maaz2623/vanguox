import { ScrollArea } from "@/components/ui/scroll-area";
import { MessagesCard } from "./messages-card";
import { useEffect, useRef, useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";

export const MessagesList = () => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const trpc = useTRPC();
  const chatId = "64bd38e0-3443-4610-86f6-28f5309c5a8c";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any[]>([]);

  const { data: initialMessages } = useQuery(
    trpc.message.getMany.queryOptions({ chatId })
  );

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  useSubscription(
    trpc.message.onMessageAdd.subscriptionOptions(
      { chatId },
      {
        onData: (newMsg) => {
          setMessages((prev) => [...prev, newMsg]);
        },
      }
    )
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages.length]);

  return (
    <ScrollArea className="h-[405px] overflow-y-auto pr-8 flex flex-col">
      <div className="flex flex-col gap-y-4">
        {messages.map((message, i) => (
          <MessagesCard key={i} role={message.role} content={message.content} />
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
};
