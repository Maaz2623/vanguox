"use client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const HomePage = () => {
  const trpc = useTRPC();

  const { data } = useQuery(trpc.hello.queryOptions());

  const name = {
    firstName: "Mohammed",
    lastName: "Maaz"
  }

  console.log(name.firstName, name.lastName)



  if (!data) return <div>loading...</div>;


  return <div>HomePage. Response: {JSON.stringify(data)}</div>;
};

export default HomePage;
