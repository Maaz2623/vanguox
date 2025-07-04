"use client";
import { ChatList } from "../components/chat-list";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export const HomeView = () => {
  return (
    <div className="border flex flex-col h-ful flex-1">
      <ResizablePanelGroup
        direction="horizontal"
        className="flex flex-col flex-1"
      >
        <ResizablePanel className="" defaultSize={20} maxSize={30} minSize={15}>
          <ChatList />
        </ResizablePanel>
        <ResizableHandle className="mx-2" />
        <ResizablePanel className="" defaultSize={80} minSize={70}>
          Two
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
