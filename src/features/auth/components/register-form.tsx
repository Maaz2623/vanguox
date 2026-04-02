"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import z from "zod";
import { Controller, Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const registerSchema = z
  .object({
    email: z.string().min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    await authClient.signUp.email(
      {
        name: values.email,
        email: values.email,
        password: values.confirmPassword,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          router.push(`/`);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    );
  };

  const isPending = form.formState.isSubmitting;

  return (
    <div className="w-full p-6 flex justify-center items-center max-w-md">
      <Card className="w-full text-center shadow-md">
        <CardHeader>
          <CardTitle>Get Started</CardTitle>
          <CardDescription>Create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldSet disabled={isPending}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-6"
            >
              <FieldGroup>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel>Email</FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="m@example.com"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <div className="flex items-center justify-between">
                        <FieldLabel>Password</FieldLabel>
                        <Link
                          aria-disabled={isPending}
                          href={`/forgot-password`}
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <Input
                        type="password"
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="*******"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <div className="flex items-center justify-between">
                        <FieldLabel>Confirm Password</FieldLabel>
                      </div>
                      <Input
                        type="password"
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="*******"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
              <Field>
                <div className="flex flex-col">
                  <Button type="submit" className="w-full">
                    Sign in
                  </Button>
                </div>
              </Field>
              <div>
                <FieldSeparator>Or continue with</FieldSeparator>
              </div>
              <div className="flex flex-col space-y-4">
                <Button className="w-full" variant={`outline`}>
                  <FaGoogle className="size-4 mr-1" />
                  Sign in with Google
                </Button>
                <Button className="w-full" variant={`outline`}>
                  <FaGithub className="size-4 mr-1" />
                  Sign in with Github
                </Button>
              </div>
              <div>
                <p>
                  Already have an account?{" "}
                  <Link
                    aria-disabled={isPending}
                    href={`/sign-in`}
                    className="underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </FieldSet>
        </CardContent>
      </Card>
    </div>
  );
};
