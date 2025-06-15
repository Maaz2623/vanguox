import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const Page = async () => {
  const data = await caller.stores.getStoresByUserId();

  redirect(`/dashboard/${data[0].name}`);
};

export default Page;
