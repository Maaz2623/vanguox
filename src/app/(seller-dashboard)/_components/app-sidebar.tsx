"use client";

import * as React from "react";
import {
  ChartArea,
  ClipboardListIcon,
  Command,
  LifeBuoy,
  Package2Icon,
  Send,
} from "lucide-react";

import { NavProjects } from "@/app/(seller-dashboard)/_components/nav-projects";
import { NavSecondary } from "@/app/(seller-dashboard)/_components/nav-secondary";
import { NavUser } from "@/app/(seller-dashboard)/_components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { StoreComboboxSelector } from "./store-combobox-selector";
import { authClient } from "@/lib/auth-client";
import { useParams } from "next/navigation";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = authClient.useSession();

  const { storeName } = useParams<{
    storeName: string;
  }>();

  const data = {
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
    projects: [
      {
        name: "Overview",
        url: `/dashboard/${storeName}`,
        icon: ChartArea,
      },
      {
        name: "Products",
        url: `/dashboard/${storeName}/products`,
        icon: Package2Icon,
      },
      {
        name: "Orders",
        url: `/dashboard/${storeName}/orders`,
        icon: ClipboardListIcon,
      },
    ],
  };

  const user = {
    name: session.data?.user?.name as string,
    email: session.data?.user?.email as string,
    image: session.data?.user?.image as string,
  };
  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <StoreComboboxSelector>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium capitalize">
                    {storeName}
                  </span>
                  <span className="truncate text-xs">Store</span>
                </div>
              </StoreComboboxSelector>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser name={user.name} email={user.email} image={user.image} />{" "}
      </SidebarFooter>
    </Sidebar>
  );
}
