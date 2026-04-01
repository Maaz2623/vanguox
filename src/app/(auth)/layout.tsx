import AuthLayout from "@/features/auth/auth-layout";
import React from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
