"use client";
// <-- hooks can only be used in client components
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
export default function Page() {
  const trpc = useTRPC();
  const greeting = useQuery(trpc.hello.queryOptions({ text: "maaz" }));
  if (!greeting.data) return <div>Loading...</div>;
  return <div>{greeting.data.greeting}</div>;
}
