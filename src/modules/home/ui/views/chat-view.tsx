import { MessagesList } from "@/modules/messages/ui/components/messages-list";
import { MessageForm } from "../components/chat-form";

export const ChatView = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 rounded-lg">
        <MessagesList />
      </div>
      <div className="mx-auto w-full pr-8">
        <MessageForm />
      </div>
    </div>
  );
};
