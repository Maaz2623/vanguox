import { ScrollArea } from "@/components/ui/scroll-area";
import { MessagesCard } from "./messages-card";

export const MessagesList = () => {
  return (
    <ScrollArea className="h-[405px] overflow-y-auto px-12 flex flex-col">
      <div className="flex flex-col gap-y-4">
        {Array.from({ length: 5 }).map((message, i) => (
          <MessagesCard type="USER" key={i} />
        ))}
        {Array.from({ length: 5 }).map((message, i) => (
          <MessagesCard type="ASSISTANT" key={i} />
        ))}
      </div>
    </ScrollArea>
  );
};
