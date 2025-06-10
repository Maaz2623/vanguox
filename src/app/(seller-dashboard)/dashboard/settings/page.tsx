"use client";
import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

const Page = () => {
  const { storeName } = useParams<{
    storeName: string;
  }>();

  const trpc = useTRPC();

  const router = useRouter();

  const mutation = useMutation(trpc.stores.deleteByStoreName.mutationOptions());

  const handleDelete = async () => {
    const deleteStore = mutation.mutateAsync(
      {
        storeName,
      },
      {
        onSuccess: () => {
          router.push(`/`);
        },
      }
    );
    toast.promise(deleteStore, {
      loading: `Deleting Store: ${storeName}`,
      success: `"${storeName}" store has been deleted.`,
      error: "Something went wrong",
    });
  };

  return (
    <div>
      <Card className="w-full shadow-none">
        <div className="md:flex justify-center  space-y-3 md:justify-between items-center w-full">
          <div className="w-full">
            <CardHeader className="w-full text-center md:text-start">
              <CardTitle>Delete Store</CardTitle>
              <CardDescription>
                {" "}
                This action cannot be undone. This will permanently delete your
                store and all associated data.
              </CardDescription>
            </CardHeader>
          </div>
          <div className="md:pr-6 px-4 w-full md:w-fit flex justify-center items-center">
            <ConfirmationDialog
              title="Delete Store"
              description="This action cannot be undone. It will permanently delete your store and all of its related data"
              onConfirm={handleDelete}
            >
              <Button variant={`destructive`} className="w-full md:w-fit">
                Delete
              </Button>
            </ConfirmationDialog>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Page;
