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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    console.log(values);
  };

  const isPending = form.formState.isSubmitting;

  return (
    <div className="w-full p-6 flex justify-center items-center bg-green-500 max-w-md">
      <Card className="w-full text-center">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-6">
          <div className="flex flex-col gap-y-2">
            <Label>Email</Label>
            <Input
              placeholder="m@example.com"
              className="focus-visible:ring-0 p-2"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label>Password</Label>
            <Input
              placeholder="*****"
              className="focus-visible:ring-0 p-2"
              type="password"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
