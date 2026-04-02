import DashboardLayout from "@/features/dashboard/dashboard-layout";
import React from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
