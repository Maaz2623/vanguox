"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { AppleIcon, SettingsIcon, UserIcon } from "lucide-react";

const Dock = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="absolute h-20 w-full bottom-0 left-0 justify-center items-center pb-2 flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div
        className={cn(
          "border backdrop-blur-sm border-white/50 transition duration-200 gap-3 flex translate-y-16 justify-center items-center px-4 py-1 h-[fit-content] w-[fit-content] bg-black/70 rounded-lg",
          isVisible && "translate-y-0"
        )}
      >
        <div className="p-1.5 rounded-md bg-transparent hover:bg-white/10 cursor-pointer transition-all">
          <AppleIcon
            size={35}
            className="hover:scale-110 transition-all "
          />
        </div>
        <div className="p-1.5 rounded-md bg-transparent hover:bg-white/10 cursor-pointer transition-all">
          <SettingsIcon size={35} className="hover:scale-110 transition-all " />
        </div>
        <div className="p-1.5 rounded-md bg-transparent hover:bg-white/10 cursor-pointer transition-all">
          <UserIcon size={35} className="hover:scale-110 transition-all " />
        </div>
      </div>
    </div>
  );
};

export default Dock;
