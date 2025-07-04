"use client";
import { ChatList } from "../components/chat-list";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ChatView } from "./chat-view";

export const HomeView = () => {
  return (
    <div className="flex flex-col h-ful flex-1">
      <ResizablePanelGroup
        direction="horizontal"
        className="flex flex-col flex-1"
      >
        <ResizablePanel className="" defaultSize={20} maxSize={30} minSize={15}>
          <ChatList />
        </ResizablePanel>
        <div className="mx-1.5 flex flex-col justify-center items-center">
          <ResizableHandle className=" h-[80%]" withHandle />
        </div>
        <ResizablePanel className="" defaultSize={80} minSize={70}>
          <ChatView />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
