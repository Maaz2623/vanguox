import { MessageForm } from "../components/chat-form";

export const ChatView = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1">Chats</div>
      <MessageForm />
    </div>
  );
};
