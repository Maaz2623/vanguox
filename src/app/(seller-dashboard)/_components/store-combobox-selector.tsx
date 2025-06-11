"use client";

import * as React from "react";
import { ChevronsUpDown, PlusCircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSidebar } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { CreateStoreDialog } from "@/components/create-store-dialog";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function StoreComboboxSelector({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const { open: sidebarOpen } = useSidebar();

  const trpc = useTRPC();

  const router = useRouter();

  const { data } = useQuery(trpc.stores.getStoresByUserId.queryOptions());
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="flex justify-center items-center" asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full flex justify-between items-center py-6 bg-gray-100 shadow-none border-none",
              !sidebarOpen && "pl-5",
              !sidebarOpen && "justify-center"
            )}
          >
            {children}
            {sidebarOpen && <ChevronsUpDown />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search framework..." className="h-9" />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {data &&
                  data.map((store) => (
                    <CommandItem
                      key={store.id}
                      value={store.name}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                        router.push(`/dashboard/${currentValue}`);
                      }}
                    >
                      {store.name}
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CreateStoreDialog
                  open={createDialogOpen}
                  setOpen={setCreateDialogOpen}
                >
                  <CommandItem
                    onClick={(e) => e.preventDefault()}
                    onSelect={() => {
                      setCreateDialogOpen(true);
                    }}
                  >
                    <PlusCircleIcon />
                    Create
                  </CommandItem>
                </CreateStoreDialog>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
