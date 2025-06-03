"use client";
import React, { useState } from "react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { FullScreenLoader } from "@/components/full-screen-loader";

const SignUpPage = () => {
  const [formType, setFormType] = useState<"login" | "signup">("login");

  return (
    <div className="flex min-h-screen justify-center items-center">
      <div className="w-[30%]">
        {formType === "login" ? (
          <LoginForm formType={formType} setFormType={setFormType} />
        ) : (
          <SignUpForm setFormType={setFormType} formType={formType} />
        )}
      </div>
    </div>
  );
};

export default SignUpPage;

interface FormProps extends React.ComponentProps<"div"> {
  formType: "login" | "signup";
  setFormType: (formType: "login" | "signup") => void;
}

function LoginForm({ className, setFormType, formType, ...props }: FormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleFormSubmit = async () => {
    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          setLoading(false);
          router.push(`/`);
        },
        onError(context) {
          setLoading(false);
          alert(context.error);
        },
      }
    );
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  type="password"
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleFormSubmit}
                  type="submit"
                  className="w-full"
                >
                  Login
                </Button>
                <Button variant="outline" className="w-full">
                  Login with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Button
                onClick={() => setFormType("signup")}
                size={`sm`}
                variant={`link`}
                className="underline underline-offset-4 cursor-pointer w-13 text-sm"
              >
                Sign up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function SignUpForm({ className, formType, setFormType, ...props }: FormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleFormSubmit = async () => {
    await authClient.signUp.email(
      {
        name,
        email,
        password,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          setLoading(false);
          router.push(`/`);
        },
        onError(context) {
          setLoading(false);
          alert(context.error);
        },
      }
    );
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create a new account</CardTitle>
          <CardDescription>
            Fill the details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  onChange={(e) => setName(e.target.value)}
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  type="password"
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full"
                  onClick={handleFormSubmit}
                >
                  Create Account
                </Button>
                <Button variant="outline" className="w-full">
                  Login with Google
                </Button>
              </div>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Button
              onClick={() => setFormType("login")}
              size={`sm`}
              variant={`link`}
              className="underline underline-offset-4 cursor-pointer w-13 text-sm"
            >
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
