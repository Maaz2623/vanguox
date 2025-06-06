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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export const SellerOnboardingForm = () => {
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [open, setOpen] = useState(true);
  const [direction, setDirection] = useState<1 | -1>(1); // to determine animation direction

  const steps = [
    { title: "Personal Info", component: <PersonalInfoSection /> },
    { title: "Account Info", component: <AccountInfoSection /> },
    { title: "Payment Info", component: <PaymentInfoSection /> },
  ];

  const currentStep = steps[step];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="w-full max-w-[90vw] md:max-w-[600px] flex flex-col justify-between"
      >
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Complete your onboarding</DialogTitle>
            <DialogDescription>
              Please provide the required information to get started.
            </DialogDescription>
          </DialogHeader>
        </VisuallyHidden>

        <div className="flex flex-col gap-y-7 overflow-hidden">
          <OnboardingHeader step={step} steps={steps} />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ x: direction === 1 ? 100 : -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction === 1 ? -100 : 100, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep.component}
            </motion.div>
          </AnimatePresence>
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              setDirection(-1);
              setStep((prev) => Math.max(prev - 1, 0) as 0 | 1 | 2 | 3 | 4);
            }}
            disabled={step === 0}
            variant={`outline`}
          >
            Back
          </Button>

          {step < steps.length - 1 ? (
            <Button
              variant={`outline`}
              onClick={() => {
                setDirection(1);
                setStep(
                  (prev) =>
                    Math.min(prev + 1, steps.length - 1) as 0 | 1 | 2 | 3 | 4
                );
              }}
              disabled={step === steps.length - 1}
            >
              Next
            </Button>
          ) : (
            <Button>Confirm</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const OnboardingHeader = ({
  step,
  steps,
}: {
  step: number;
  steps: { title: string }[];
}) => {
  return (
    <div className="flex justify-between items-center mt-6 gap-x-6">
      {steps.map((s, idx) => (
        <React.Fragment key={idx}>
          <div
            className={cn(
              "text-center flex justify-center items-center flex-col duration-100 text-base transition-colors",
              step > idx ? "text-green-600" : "text-gray-500"
            )}
          >
            <AnimatePresence mode="wait">
              {step > idx ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  <CheckCircle2Icon className="size-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="number"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="font-semibold"
                >
                  {idx + 1}
                </motion.div>
              )}
            </AnimatePresence>
            <p className="mt-1">{s.title}</p>
          </div>

          {idx < steps.length - 1 && (
            <div className="w-[50px]">
              <Separator />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const PersonalInfoSection = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold tracking-wider">Personal Details</h3>

      <div className="mt-4 flex flex-col gap-y-4">
        <div className="flex gap-x-3">
          <div className="flex flex-col gap-y-1">
            <Label className="font-medium">Full Name</Label>
            <Input className="bg-gray-100" placeholder="John Doe" />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label className="font-medium">Phone Number</Label>
            <Input className="bg-gray-100 " placeholder="9999955628" />
          </div>
        </div>
      </div>
    </div>
  );
};

const AccountInfoSection = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold tracking-wider">Account Details</h3>

      <div className="mt-4 flex flex-col gap-y-4">
        <div className="flex gap-x-3">
          <div className="flex flex-col gap-y-1">
            <Label className="font-medium">Full Name</Label>
            <Input className="bg-gray-100" placeholder="John Doe" />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label className="font-medium">Phone Number</Label>
            <Input className="bg-gray-100 " placeholder="9999955628" />
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentInfoSection = () => {
  return (
    <div>
      <h3 className="text-xl font-semibold tracking-wider">Payment Details</h3>

      <div className="mt-4 flex flex-col gap-y-4">
        <div className="flex gap-x-3">
          <div className="flex flex-col gap-y-1">
            <Label className="font-medium">Full Name</Label>
            <Input className="bg-gray-100" placeholder="John Doe" />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label className="font-medium">Phone Number</Label>
            <Input className="bg-gray-100 " placeholder="9999955628" />
          </div>
        </div>
      </div>
    </div>
  );
};
