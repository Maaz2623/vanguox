import { caller } from "@/trpc/server";
import React from "react";

const HomePage = async () => {
  const data = await caller.hello({
    text: "Mohammed Maaz",
  });

  return <div>Hello: {data.greeting}</div>;
};

export default HomePage;
