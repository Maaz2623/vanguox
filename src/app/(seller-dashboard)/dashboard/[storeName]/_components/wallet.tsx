"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown, Wallet2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IBM_Plex_Mono } from "next/font/google";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const jetbrains = IBM_Plex_Mono({
  weight: ["400"],
});

export const Wallet = () => {
  const trpc = useTRPC();

  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const { data: hasFundAccount, isLoading } = useQuery(
    trpc.wallets.getFundAccount.queryOptions()
  );

  const { data } = useQuery(trpc.wallets.getWalletDetails.queryOptions());

  const withdrawMutation = useMutation(
    trpc.wallets.withdrawFunds.mutationOptions()
  );

  const queryClient = useQueryClient();

  const handleWithdrawal = () => {
    setLoading(true);
    const toastId = toast.loading("Requesting for withdrawal...");
    withdrawMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Withdrawal request has been placed", {
          id: toastId,
        });
      },
      onError: (error) => {
        toast.error(error.message, {
          id: toastId,
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries(
          trpc.wallets.getWalletDetails.queryOptions()
        );
        setLoading(false);
      },
    });
  };

  return (
    <>
      <fieldset disabled={loading}>
        <CreateFundAccountDialog open={open} setOpen={setOpen} />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="p-2 hover:bg-muted rounded-xl border border-border"
            >
              <Wallet2Icon className="h-5 w-5 text-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 rounded-2xl shadow-lg bg-background border border-border p-5 space-y-5">
            <div className="flex justify-center items-center">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Balance</p>
                {!data && <Skeleton className="bg-gray-100 h-[30px] w-full" />}
                {data && (
                  <h2
                    className={`text-2xl font-semibold tracking-tight text-foreground mt-1 ${jetbrains.className}`}
                  >
                    ₹{data.balance}
                  </h2>
                )}
                {data && (
                  <Badge className="mt-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    <p className="text-xs text-muted-foreground">
                      Withdrawable
                    </p>
                    <p className="text-xs font-medium text-green-500">
                      ₹{data.withdrawable}
                    </p>
                  </Badge>
                )}
              </div>
            </div>
            <div className="w-full flex justify-center items-center">
              <Button
                disabled={isLoading}
                size={`sm`}
                onClick={() => {
                  if (!hasFundAccount) {
                    setOpen(true);
                  } else {
                    handleWithdrawal();
                  }
                }}
              >
                <ArrowDown />
              </Button>
            </div>

            <div className="w-full pt-2">
              <Button variant="outline" className="w-full rounded-xl">
                View History
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </fieldset>
    </>
  );
};

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  contact: z.string().min(10),
  ifsc: z.string().min(5),
  accountNumber: z.string().min(6),
});

type FormData = z.infer<typeof formSchema>;

export const CreateFundAccountDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const trpc = useTRPC();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const [isPending, setIsPending] = useState(false);

  const createMutation = useMutation(
    trpc.razorpay.createFundAccount.mutationOptions()
  );

  const onSubmit = (data: FormData) => {
    setIsPending(true);
    const toastId = toast.loading("Creating fund account");
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Fund account created", {
          id: toastId,
        });
      },
      onError: (error) => {
        console.log(error);
        toast.error("Error", {
          id: toastId,
        });
      },
      onSettled: () => {
        setIsPending(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Set Up Bank Account</DialogTitle>
          <DialogDescription>
            Enter your bank details to receive payouts to your account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Mohammed Maaz"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Phone Number</Label>
            <Input
              id="contact"
              type="tel"
              placeholder="9876543210"
              {...register("contact")}
            />
            {errors.contact && (
              <p className="text-xs text-red-500">{errors.contact.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ifsc">Bank IFSC Code</Label>
            <Input id="ifsc" placeholder="SBIN0001234" {...register("ifsc")} />
            {errors.ifsc && (
              <p className="text-xs text-red-500">{errors.ifsc.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              placeholder="000012345678"
              {...register("accountNumber")}
            />
            {errors.accountNumber && (
              <p className="text-xs text-red-500">
                {errors.accountNumber.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl mt-2"
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create Fund Account"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
