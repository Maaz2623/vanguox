"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const NavUserButton = () => {
  const trpc = useTRPC();

  const { data: user } = useQuery(trpc.users.getUserData.queryOptions());

  return (
    <div>
      <Avatar>
        <DropdownMenu>
          <DropdownMenuTrigger>
            {user && user.image && (
              <AvatarImage className="cursor-pointer" src={user.image} />
            )}
            <AvatarFallback>CN</AvatarFallback>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-4">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Avatar>
    </div>
  );
};
