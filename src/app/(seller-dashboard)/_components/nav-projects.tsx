"use client";

import {
  type LucideIcon,
  LoaderIcon,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingUrl, setLoadingUrl] = useState("");
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => {
          const isActive = item.url === pathname;

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                onClick={() => {
                  if (item.url !== pathname) {
                    setLoadingUrl(item.url);
                    startTransition(() => {
                      router.push(item.url);
                    });
                  }
                }}
                className={cn(
                  "justify-between",
                  isActive && "bg-gray-100 text-blue-600 hover:text-blue-600"
                )}
              >
                <div className="flex items-center gap-2">
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {isPending && loadingUrl === item.url && (
                  <LoaderIcon className="w-4 h-4 animate-spin text-blue-600" />
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
