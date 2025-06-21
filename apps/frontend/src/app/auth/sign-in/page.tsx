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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

function LoginForm({ className, setFormType }: FormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpDialog, setOtpDialog] = useState(false);

  const router = useRouter();

  const handleOtpVerification = async () => {
    await authClient.emailOtp.verifyEmail(
      {
        email,
        otp,
      },
      {
        onSuccess: async () => {
          toast.dismiss();
          toast.success(`Email verified!`);
          await authClient.signIn.email(
            {
              email,
              password,
            },
            {
              onRequest: () => setLoading(true),
              onSuccess: () => {
                setLoading(false);
                toast.success("Signed in successfully");
                router.push(`/`);
              },
              onError: async (ctx) => {
                setLoading(false);

                // Build custom error message
                if (ctx.error.status === 403) {
                  await authClient.emailOtp.sendVerificationOtp(
                    {
                      email: email,
                      type: "email-verification",
                    },
                    {
                      onRequest: () => {
                        toast.loading(`Sending OTP...`);
                      },
                      onSuccess: () => {
                        toast.dismiss();
                        toast.success(`OTP sent to ${email}. Please verify!`);
                        setOtpDialog(true);
                      },
                      onError: (ctx) => {
                        toast.error(ctx.error.message);
                      },
                    }
                  );
                }
              },
            }
          );
          setLoading(false);
        },
        onError: (ctx) => {
          toast.dismiss();
          toast.error(ctx.error.message);
        },
        onRequest: () => {
          toast.loading(`Verifying OTP`);
        },
      }
    );
  };

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
          onError: async (ctx) => {
            setLoading(false);

            // Build custom error message
            if (ctx.error.status === 403) {
              await authClient.emailOtp.sendVerificationOtp(
                {
                  email: email,
                  type: "email-verification",
                },
                {
                  onRequest: () => {
                    toast.loading(`Sending OTP...`);
                  },
                  onSuccess: () => {
                    toast.dismiss();
                    toast.success(`OTP sent to ${email}. Please verify!`);
                    setOtpDialog(true);
                  },
                  onError: (ctx) => {
                    toast.error(ctx.error.message);
                  },
                }
              );
            }
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
      success: (msg) => `${String(msg)}.`,
      error: (err) =>
        err instanceof Error ? err.message : "Something went wrong",
    });
  };

  const handleGoogleLogin = async () => {
    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL:
          process.env.NODE_ENV === "production"
            ? `${process.env.VERCEL_APP_URL}`
            : "https://localhost:3000",
      },
      {
        onSuccess: () => {
          setLoading(false);
          toast.dismiss();
          toast.success(`Signed in with Google. Redirecting...`);
        },
        onRequest: () => {
          setLoading(true);
          toast.loading(`Signing in with Google.`);
        },
        onError: (ctx) => {
          setLoading(false);
          toast.dismiss();
          toast.error(`${ctx.error.message}`);
        },
      }
    );
  };

  return (
    <fieldset disabled={loading}>
      <OTPVerifierDialog
        open={otpDialog}
        setOpen={setOtpDialog}
        action={handleOtpVerification}
        setOtp={setOtp}
      />
      <div className={cn("flex flex-col gap-4", className)}>
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="">
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
                    <Link
                      href="/auth/forgot-password"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
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
            <div className="gap-y-4 my-4 flex flex-col">
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="">
                {/* <Button variant="outline" type="button" className="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                fill="currentColor"
                  />
                </svg>
                <span className="sr-only">Login with Apple</span>
              </Button> */}
                <Button
                  onClick={handleGoogleLogin}
                  variant="outline"
                  type="button"
                  className="w-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <p className="">Login with Google</p>
                </Button>
                {/* <Button variant="outline" type="button" className="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                    fill="currentColor"
                  />
                </svg>
                <span className="sr-only">Login with Meta</span>
              </Button> */}
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
          </CardContent>
        </Card>
      </div>
    </fieldset>
  );
}

function SignUpForm({ className, setFormType }: FormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpDialog, setOtpDialog] = useState(false);
  const [otp, setOtp] = useState("");

  const handleGoogleLogin = async () => {
    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL:
          process.env.NODE_ENV === "production"
            ? process.env.VERCEL_URL
            : "https://localhost:3000",
      },
      {
        onSuccess: () => {
          setLoading(false);
          toast.dismiss();
          toast.success(`Signed in with Google. Redirecting...`);
        },
        onRequest: () => {
          setLoading(true);
          toast.loading(`Signing in with Google.`);
        },
        onError: (ctx) => {
          setLoading(false);
          toast.dismiss();
          toast.error(`${ctx.error.message}`);
        },
      }
    );
  };

  const handleOtpVerification = async () => {
    await authClient.emailOtp.verifyEmail(
      {
        email,
        otp,
      },
      {
        onSuccess: () => {
          toast.dismiss();
          toast.success(`Email verified! Please log in again.`);
          setFormType("login");
          setLoading(false);
        },
        onError: (ctx) => {
          toast.dismiss();
          toast.error(ctx.error.message);
        },
        onRequest: () => {
          toast.loading(`Verifying OTP`);
        },
      }
    );
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await authClient.signUp.email(
      {
        name,
        email,
        password,
        callbackURL:
          process.env.NODE_ENV === "production"
            ? `${process.env.VERCEL_APP_URL}`
            : "https://localhost:3000",
      },
      {
        onRequest: () => {
          toast.loading(`Creating account`);
          setLoading(true);
        },
        onSuccess: async () => {
          toast.dismiss();
          toast.success(`Account created. Please verify your email address`);
          await authClient.emailOtp.sendVerificationOtp(
            {
              email: email,
              type: "email-verification",
            },
            {
              onRequest: () => {
                toast.loading(`Sending OTP`);
              },
              onSuccess: () => {
                toast.dismiss();
                toast.success(`OTP send to ${email}`);
                setOtpDialog(true);
              },
              onError: (ctx) => {
                toast.error(ctx.error.message);
              },
            }
          );
        },
        onError(ctx) {
          setLoading(false);
          toast.error(ctx.error.message);
        },
      }
    );
  };

  // ✅ Return JSX from the component itself
  return (
    <fieldset disabled={loading}>
      <OTPVerifierDialog
        open={otpDialog}
        setOpen={setOtpDialog}
        action={handleOtpVerification}
        setOtp={setOtp}
      />
      <div className={cn("flex flex-col gap-4", className)}>
        <Card>
          <CardHeader>
            <CardTitle>Create a new account</CardTitle>
            <CardDescription>
              Fill the details below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit}>
              <div className="flex flex-col gap-4">
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

            <div className="gap-y-4 my-4 flex flex-col">
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <Button
                onClick={handleGoogleLogin}
                type="button"
                variant="outline"
                className="w-full"
              >
                Sign in with Google
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </fieldset>
  );
}

const OTPVerifierDialog = ({
  open,
  setOpen,
  action,
  setOtp,
}: {
  open: boolean;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
  setOpen: (open: boolean) => void;
  action: () => void;
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent onEscapeKeyDown={(e) => e.preventDefault()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Email Verification</AlertDialogTitle>
          <AlertDialogDescription>
            Enter the otp sent to your email address.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="w-full flex justify-center items-center">
          <fieldset disabled={loading}>
            <InputOTP onChange={(e) => setOtp(e)} maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </fieldset>
        </div>
        <AlertDialogFooter>
          <Button
            onClick={() => {
              setLoading(true);
              action();
              setLoading(false);
              setOpen(false);
            }}
          >
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
