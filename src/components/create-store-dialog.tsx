"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { authClient } from "@/lib/auth-client";
import { ScrollArea } from "./ui/scroll-area";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

export const CreateStoreDialog = ({
  children,
  open,
  setOpen,
}: {
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const { data } = authClient.useSession();

  const trpc = useTRPC();

  const [storeName, setStoreName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState(data?.user.email || "");
  const [loading, setLoading] = useState(false);

  const mutation = useMutation(trpc.stores.createStore.mutationOptions());

  const queryClient = useQueryClient();

  const router = useRouter();

  const handleClearInputs = () => {
    setStoreName("");
    setCategory("");
    setDescription("");
    setEmail("");
  };

  const handleCreate = async () => {
    const toastId = toast.loading("Creating store...");
    setLoading(true);
    mutation.mutate(
      {
        name: storeName,
        category,
        description,
        email,
      },
      {
        onSuccess: (data) => {
          router.push(`/dashboard/${data.name}`);
          toast.success("Store Created.", {
            id: toastId,
          });
          setOpen(false);
          handleClearInputs();
        },
        onError: (error) => {
          toast.error(`${error.message}`, {
            id: toastId,
          });
        },
        onSettled: () => {
          setLoading(false);
          queryClient.invalidateQueries(
            trpc.stores.getStoresByUserId.queryOptions()
          );
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <fieldset disabled={loading}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              🚀 Launch Your Dream Store!
            </DialogTitle>
            <DialogDescription>
              Let's get started with just a few quick details. Your journey to
              success begins here 🌟
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable Form Content */}

          <ScrollArea className="max-h-[60vh] overflow-y-auto pr-2">
            <div className="space-y-6 mt-4 pb-4 p-1">
              <div className="flex flex-col sm:flex-row sm:gap-x-4 gap-y-6">
                <div className="flex flex-col gap-y-1.5 w-full">
                  <Label htmlFor="storeName">🏪 Store Name</Label>
                  <Input
                    id="storeName"
                    placeholder="e.g., mystore"
                    value={storeName}
                    required
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-y-1.5 w-full">
                  <Label htmlFor="category">📦 Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., fashion, electronics, etc."
                    value={category}
                    required
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-y-1.5">
                <Label htmlFor="description">📝 Description</Label>
                <Textarea
                  id="description"
                  placeholder="Briefly describe what your store is about..."
                  value={description}
                  required
                  onChange={(e) => setDescription(e.target.value)}
                  className="resize-none"
                />
              </div>

              <div className="flex flex-col gap-y-1.5">
                <Label htmlFor="email">📧 Contact Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g., contact@mystore.com"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </ScrollArea>

          {/* Footer below scroll area */}
          <DialogFooter className="mt-6">
            <Button className="w-full sm:w-auto" onClick={handleCreate}>
              🎉 Create Store
            </Button>
          </DialogFooter>
        </fieldset>
      </DialogContent>
    </Dialog>
  );
};
