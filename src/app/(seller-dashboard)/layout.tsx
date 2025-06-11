import React from "react";
import { AppSidebar } from "./_components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SidebarButton } from "@/components/sidebar-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="border shadow-none">
          <header className="flex h-14 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-4 justify-between w-full">
              <div className="flex ">
                <SidebarButton />
                <Separator
                  className="h-6 w-px bg-border"
                  orientation="vertical"
                />
              </div>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-5">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
