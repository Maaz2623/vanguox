"use client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const HomePage = () => {
  const trpc = useTRPC();

  const { data } = useQuery(trpc.hello.queryOptions());

  if (!data) return <div>loading...</div>;

  return <div>HomePage. Response: {JSON.stringify(data)}</div>;
};

export default HomePage;
