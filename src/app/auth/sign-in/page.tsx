"use client";
import React, { useState } from "react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { FullScreenLoader } from "@/components/full-screen-loader";
import { toast } from "sonner";

const SignUpPage = () => {
  const [formType, setFormType] = useState<"login" | "signup">("login");

  return (
    <div className="flex min-h-screen justify-center items-center px-4">
      <div className="w-full max-w-sm px-4 perspective-1000">
        <AnimatePresence mode="wait" initial={false}>
          {formType === "login" ? (
            <motion.div
              key="login"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="backface-hidden"
            >
              <LoginForm formType={formType} setFormType={setFormType} />
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="backface-hidden"
            >
              <SignUpForm formType={formType} setFormType={setFormType} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SignUpPage;

interface FormProps extends React.ComponentProps<"div"> {
  formType: "login" | "signup";
  setFormType: (formType: "login" | "signup") => void;
}

function LoginForm({ className, formType, setFormType, ...props }: FormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const signupPromise = new Promise(async (resolve, reject) => {
      const result = await authClient.signIn.email(
        {
          email,
          password,
        },
        {
          onRequest: () => setLoading(true),
          onSuccess: () => {
            setLoading(false);
            resolve("Signed in successfully");
            router.push(`/`);
          },
          onError(ctx) {
            setLoading(false);

            // Build custom error message
            let message = ctx.error.message;
            if (ctx.error.status === 403) {
              message = "Please verify your email address.";
            }

            reject(new Error(message));
          },
        }
      );

      // Fallback rejection in case result contains error but onError wasn't triggered
      if (result && "error" in result && result.error) {
        reject(new Error(result.error.message));
      }
    });

    toast.promise(signupPromise, {
      loading: "Signing in...",
      success: (msg) => `${String(msg)}. verify email`,
      error: (err) =>
        err instanceof Error ? err.message : "Something went wrong",
    });
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
          <form onSubmit={handleFormSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-1">
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
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </div>
          </form>
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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const signupPromise = new Promise(async (resolve, reject) => {
      const result = await authClient.signUp.email(
        {
          name,
          email,
          password,
        },
        {
          onRequest: () => setLoading(true),
          onSuccess: () => {
            setLoading(false);
            resolve("Account created successfully");
            router;
          },
          onError(ctx) {
            setLoading(false);
            reject(new Error(ctx.error.message));
            router.push(`/`);
          },
        }
      );

      // Optionally check result.error for additional rejection
      if (result && "error" in result && result.error) {
        reject(new Error(result.error.message));
      }
    });

    toast.promise(signupPromise, {
      loading: "Creating account...",
      success: (msg) => String(msg),
      error: (err) =>
        err instanceof Error ? err.message : "Something went wrong",
    });
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
          <form onSubmit={handleFormSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  onChange={(e) => setName(e.target.value)}
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  type="password"
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Create Account
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
