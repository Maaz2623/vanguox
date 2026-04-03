"use client";

import { AIInput } from "@/components/custom/ai-input";
import { Highlight } from "@/components/custom/highlight";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const ChatTemplate = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-full justify-center items-center space-y-8 mt-50 flex-col flex">
        <h3 className={cn("text-4xl font-medium", poppins.className)}>
          What's on your <Highlight>mind?</Highlight>
        </h3>
        <AIInput className="overflow-visible" />
      </div>
    </div>
  );
};
