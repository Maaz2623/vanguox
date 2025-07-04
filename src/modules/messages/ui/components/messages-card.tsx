import { Card } from "@/components/ui/card";

interface MessagesCardProps {
  type: "USER" | "ASSISTANT";
  content: string;
}

export const MessagesCard = ({ type, content }: MessagesCardProps) => {
  if (type === "USER") {
    return <UserMessage content={content} />;
  } else {
    return <AssistantMessage content={content} />;
  }
};

const UserMessage = ({ content }: { content: string }) => {
  return (
    <div className="w-full flex justify-end">
      <Card className="shadow-none w-fit max-w-[60%] px-3 py-2 bg-[#3e4bbb] text-white border-none">
        {content}
      </Card>
    </div>
  );
};

const AssistantMessage = ({ content }: { content: string }) => {
  return (
    <div className="w-full flex justify-start">
      <Card className="shadow-none bg-sidebar w-fit max-w-[60%] px-3 py-2 border-none">
        {content}
      </Card>
    </div>
  );
};
