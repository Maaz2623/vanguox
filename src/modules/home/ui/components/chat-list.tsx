import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export const ChatList = () => {
  return (
    <div className="border flex flex-col flex-1 bg-sidebar rounded-xl py-4 px-2">
      <div className="border flex flex-col gap-y-4">
        <div className="border">
          <Button className="w-full">
            <PlusIcon />
            New
          </Button>
        </div>

        <div className="flex flex-col gap-y-2 flex-1">
          <span className="text-xs text-muted-foreground mb-2">
            Chat History
          </span>
          <div className="flex flex-col overflow-y-auto max-h-[423px] scrollbar-thin">
            <div className="h-full flex flex-col w-full pr-2 gap-y-1">
              {Array.from({ length: 20 }).map((_, i) => (
                <Button
                  key={i}
                  variant="ghost"
                  className="justify-start hover:bg-accent text-sm truncate w-full text-muted-foreground rounded-[8px]!"
                >
                  Chat with Assistant #{i + 1}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
