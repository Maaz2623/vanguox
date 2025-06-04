"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  if (!token) {
    return (
      <div className="flex min-h-screen justify-center items-center">
        <p>Token not found</p>
      </div>
    );
  }

  const onSubmit = async () => {
    await authClient.resetPassword(
      {
        newPassword: password,
        token,
      },
      {
        onSuccess: () => {
          toast.dismiss();
          toast.success(`Password has been reset.`);
          setLoading(false);
          router.push(`/auth/sign-in`);
        },
        onError: (ctx) => {
          toast.dismiss();
          toast.error(ctx.error.message);
          setLoading(false);
        },
        onRequest: () => {
          setLoading(true);
          toast.loading(`Resetting Password....`);
        },
      }
    );
  };

  return (
    <fieldset disabled={loading}>
      <div className="flex min-h-screen justify-center items-center">
        <div className="w-[400px]">
          <Card>
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>
                Enter your email, A password reset mail will be sent to it.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-y-2">
                <Label>New Password</Label>
                <Input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter password again"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end items-center">
              <Button
                disabled={password !== confirmPassword}
                onClick={onSubmit}
              >
                Reset
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </fieldset>
  );
};

export default ResetPasswordForm;
