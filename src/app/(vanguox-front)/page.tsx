import { caller } from "@/trpc/server";
import React from "react";

const VanguoxFrontPage = async () => {
  const data = await caller.users.getUserData();

  return <div>Vanguox Front Page {JSON.stringify(data)}</div>;
};

export default VanguoxFrontPage;
