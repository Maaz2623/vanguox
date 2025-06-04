"use client";
import React, { useState } from "react";
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
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const Page = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    await authClient.forgetPassword(
      {
        email,
        redirectTo: "/auth/reset-password",
      },
      {
        onSuccess: () => {
          toast.dismiss();
          toast.success(`Email has been sent.`);
          setLoading(false);
        },
        onRequest: () => {
          setLoading(true);
          toast.loading(`Email is being sent...`);
        },
        onError: (ctx) => {
          toast.dismiss();
          toast.error(ctx.error.message);
          setLoading(false);
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
              <CardTitle>Forgot Password?</CardTitle>
              <CardDescription>
                Enter your email, A password reset mail will be sent to it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-y-2">
                <Label>Email</Label>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end items-center">
              <Button onClick={onSubmit}>Send Email</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </fieldset>
  );
};

export default Page;
