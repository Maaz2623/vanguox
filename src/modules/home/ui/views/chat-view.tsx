import { MessagesList } from "@/modules/messages/ui/components/messages-list";
import { MessageForm } from "../components/chat-form";
import { useOptimistic, useState } from "react";

export const ChatView = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any[]>([]);
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (prev, newMessage: any) => [...prev, newMessage]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 rounded-lg">
        <MessagesList
          messages={optimisticMessages}
          setMessages={setMessages}
          addOptimisticMessage={addOptimisticMessage}
        />
      </div>
      <div className="mx-auto w-full pr-8">
        <MessageForm addOptimisticMessage={addOptimisticMessage} />
      </div>
    </div>
  );
};
