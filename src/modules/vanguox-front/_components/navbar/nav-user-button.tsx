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
import { Skeleton } from "@/components/ui/skeleton";
import { authClient, signOut } from "@/lib/auth-client";
import { motion } from "framer-motion";

export const NavUserButton = () => {
  const { data } = authClient.useSession();

  const user = data?.user;

  return (
    <div>
      <Avatar>
        <DropdownMenu>
          <DropdownMenuTrigger>
            {user && user.image && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <AvatarImage
                  className="cursor-pointer rounded-lg"
                  src={user.image}
                />
              </motion.div>
            )}
            <AvatarFallback className="size-10 rounded-lg">
              <Skeleton className="bg-gray-400 shadow-sm" />
            </AvatarFallback>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="bottom" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => {
                signOut().then(() => {
                  window.location.href = "/auth/sign-in";
                });
              }}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Avatar>
    </div>
  );
};
