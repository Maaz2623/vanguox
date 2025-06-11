"use client";
import { SidebarCloseIcon, SidebarOpenIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useSidebar } from "./ui/sidebar";

export const SidebarButton = () => {
  const { toggleSidebar, open } = useSidebar();

  return (
    <Button onClick={() => toggleSidebar()} variant={`ghost`}>
      {open ? <SidebarCloseIcon /> : <SidebarOpenIcon />}
    </Button>
  );
};
