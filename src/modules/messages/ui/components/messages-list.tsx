import { ScrollArea } from "@/components/ui/scroll-area";
import { MessagesCard } from "./messages-card";
import { startTransition, useEffect, useRef } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useSubscription } from "@trpc/tanstack-react-query";

export const MessagesList = ({
  messages,
  setMessages,
  addOptimisticMessage,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addOptimisticMessage: (msg: any) => void;
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const shouldScrollRef = useRef(false); // 🧠 track if we should scroll
  const trpc = useTRPC();
  const chatId = "64bd38e0-3443-4610-86f6-28f5309c5a8c";

  const { data: initialMessages } = useQuery(
    trpc.message.getMany.queryOptions({ chatId })
  );

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages, setMessages]);

  useSubscription(
    trpc.message.onMessageAdd.subscriptionOptions(
      { chatId },
      {
        onData: (newMsg) => {
          shouldScrollRef.current = true;
          setMessages((prev) => [...prev, newMsg]);
          startTransition(() => {
            addOptimisticMessage(newMsg);
          });
        },
      }
    )
  );

  useEffect(() => {
    if (shouldScrollRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      shouldScrollRef.current = false;
    }
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
