// components/FullScreenLoader.tsx
"use client";

import { Loader2Icon, LoaderIcon } from "lucide-react";

export const FullScreenLoader = ({ text }: { text?: string }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
      <div className="flex flex-col justify-center gap-y-2 items-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500" />{" "}
      </div>
    </div>
  );
};
