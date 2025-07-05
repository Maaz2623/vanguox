import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";

interface MessagesCardProps {
  role: "USER" | "ASSISTANT";
  content: string;
}

export const MessagesCard = ({ role, content }: MessagesCardProps) => {
  if (role === "USER") {
    return <UserMessage content={content} />;
  } else {
    return <AssistantMessage content={content} />;
  }
};

const UserMessage = ({ content }: { content: string }) => {
  return (
    <div className="w-full flex justify-end">
      <Card className="shadow-none w-fit max-w-[60%] p-4 bg-[#3e4bbb] text-white border-none">
        {content}
      </Card>
    </div>
  );
};

const AssistantMessage = ({ content }: { content: string }) => {
  return (
    <div
      className={cn(
        "flex flex-col group px-2 pb-4 max-w-[70%]"
        // type === "ERROR" && "text-red-700 dark:text-red-500"
      )}
    >
      <div className="flex items-center gap-2 pl-2 mb-2">
        <Image
          src={`/logo.svg`}
          alt="vibe"
          width={18}
          height={18}
          className="shrink-0"
        />
        <span className="text-sm font-medium">Vanguox</span>
        <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 font-medium">
          {format(Date.now(), "HH:mm 'on' MM dd, yyyy")}
        </span>
      </div>
      <div className="w-full flex justify-start">
        <Card className="shadow-none bg-sidebar w-fit p-5 border-none">
          {content}
        </Card>
      </div>
    </div>
  );
};
