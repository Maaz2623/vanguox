import React from "react";
import { Navbar } from "./_components/navbar";
export default async function CustomerHomeLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="px-2 py-2">
      <Navbar /> {children}
    </div>
  );
}
