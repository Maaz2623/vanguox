"use client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2Icon, CheckIcon } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export const SellerSection = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.seller.getSellerAccount.queryOptions()
  );

  const [open, setOpen] = useState(false);

  return (
    <>
      <SellerAccountForm open={open} setOpen={setOpen} />
      <div className="flex flex-col gap-y-2">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-xl tracking-wide">Seller Mode</CardTitle>
            <CardDescription>
              Enable your seller dashboard and features
            </CardDescription>
            <CardAction>
              <Button
                onClick={() => setOpen(true)}
                disabled={data.exists}
                size={`sm`}
              >
                {data.exists && <CheckIcon className="size-4" />}
                {data.exists ? "Activated" : "Activate"}
              </Button>
            </CardAction>
          </CardHeader>
          <Separator />
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>

        <Card className="shadow-none w-full">
          <CardHeader>
            <CardTitle className="text-xl tracking-wide">
              Payment Details
            </CardTitle>
            <CardDescription>
              Edit and manage your saved payment information.
            </CardDescription>
            <CardAction>
              <Button
                onClick={() => setOpen(true)}
                disabled={data.exists}
                size={`sm`}
              >
                {data.exists && <CheckIcon className="size-4" />}
                {data.exists ? "Activated" : "Activate"}
              </Button>
            </CardAction>
          </CardHeader>

          <Separator />

          <CardContent>
            <fieldset disabled={data.exists}>
              <div className="space-y-8">
                {/* UPI Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-muted-foreground">
                    UPI Details
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="upi" className="font-medium">
                      UPI ID
                    </Label>
                    <Input
                      value={data.exists ? data.account.upiId : ""}
                      id="upi"
                      readOnly
                      placeholder="Enter your UPI ID"
                      className="w-[400px]"
                    />
                  </div>
                </div>

                <Separator />

                {/* Bank Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-muted-foreground">
                    Bank Account Details
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="accountHolder" className="font-medium">
                      Account Holder Name
                    </Label>
                    <Input
                      value={
                        data.exists ? data.account.bankAccountHolderName : ""
                      }
                      id="accountHolder"
                      readOnly
                      placeholder="Enter account holder name"
                      className="w-[400px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber" className="font-medium">
                      Account Number
                    </Label>
                    <Input
                      readOnly
                      value={data.exists ? data.account.accountNumber : ""}
                      id="accountNumber"
                      placeholder="Enter bank account number"
                      className="w-[400px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ifsc" className="font-medium">
                      IFSC Code
                    </Label>
                    <Input
                      readOnly
                      value={data.exists ? data.account.ifscCode : ""}
                      id="ifsc"
                      placeholder="Enter IFSC code"
                      className="w-[400px]"
                    />
                  </div>
                </div>
              </div>
            </fieldset>
          </CardContent>

          <CardFooter />
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
            <CardAction>Card Action</CardAction>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

const SellerAccountForm = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const trpc = useTRPC();

  const activateMutation = useMutation(
    trpc.seller.createSellerAccount.mutationOptions()
  );

  const querClient = useQueryClient();

  const [upiId, setUpiId] = useState("");
  const [bankAccountHolderName, setbankAccountHolderName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const [ifscCode, setIfscCode] = useState("");

  const onSubmit = async () => {
    setLoading(true);
    toast.loading(`Activating...`);
    activateMutation.mutate(
      {
        upiId,
        accountHolderName: bankAccountHolderName,
        accountNumber: bankAccountNumber,
        ifscCode: ifscCode,
      },
      {
        onSuccess: () => {
          toast.dismiss();
          toast.success("Seller account activated");
          querClient.invalidateQueries(
            trpc.seller.getSellerAccount.queryOptions()
          );
          setOpen(false);
          setLoading(false);
        },
        onError: (ctx) => {
          toast.dismiss();
          toast.error(ctx.message);
          setLoading(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <fieldset disabled={loading}>
          <VisuallyHidden>
            <DialogHeader>
              <DialogTitle>Activate Seller Mode</DialogTitle>
              <DialogDescription>
                Enter your payment details to enable selling features.
              </DialogDescription>
            </DialogHeader>
          </VisuallyHidden>

          <header className="flex w-full justify-center items-center gap-x-4">
            <div className="flex flex-col justify-center items-center">
              <span>1</span>
              <p className="text-center">Personal Info</p>
            </div>
            <div className="w-[50px] mx-3">
              <Separator orientation="horizontal" className="" />
            </div>

            <div className="flex flex-col justify-center items-center">
              <span><CheckCircle2Icon /></span>
              <p className="text-center">Account Info</p>
            </div>

            <div className="w-[50px] mx-3">
              <Separator orientation="horizontal" className="" />
            </div>
            <div className="flex flex-col justify-center items-center">
              <span>3</span>
              <p className="text-center">Payment Info</p>
            </div>
          </header>

          <div className="flex-col hidden gap-y-4 py-4">
            {/* UPI Section */}
            <div className="space-y-2">
              <Label htmlFor="upi" className="font-medium">
                UPI ID
              </Label>
              <Input
                onChange={(e) => setUpiId(e.target.value)}
                id="upi"
                placeholder="Enter your UPI ID"
                className="w-full"
              />
            </div>

            {/* Account Holder Name */}
            <div className="space-y-2">
              <Label htmlFor="accountHolder" className="font-medium">
                Account Holder Name
              </Label>
              <Input
                onChange={(e) => setbankAccountHolderName(e.target.value)}
                id="accountHolder"
                placeholder="Enter account holder name"
                className="w-full"
              />
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <Label htmlFor="accountNumber" className="font-medium">
                Account Number
              </Label>
              <Input
                onChange={(e) => setBankAccountNumber(e.target.value)}
                id="accountNumber"
                placeholder="Enter bank account number"
                className="w-full"
              />
            </div>

            {/* IFSC Code */}
            <div className="space-y-2">
              <Label htmlFor="ifsc" className="font-medium">
                IFSC Code
              </Label>
              <Input
                onChange={(e) => setIfscCode(e.target.value)}
                id="ifsc"
                placeholder="Enter IFSC code"
                className="w-full"
              />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={onSubmit}>Save & Activate</Button>
          </DialogFooter>
        </fieldset>
      </DialogContent>
    </Dialog>
  );
};
