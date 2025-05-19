import { headers } from "next/headers";
import { Navbar } from "./_components/navbar";
import { getSubdomain } from "@/helpers/get-subdomain";
import { StoreNavbar } from "../(store-front)/stores/[storeName]/_components/store-navbar";

export default async function VanguoxFrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const host = (await headers()).get("host")!;
  const isSubdomain = host.split(".").length > 2;

  let subdomain: string | null = null;

  if (isSubdomain) {
    subdomain = await getSubdomain(host);
    if (!subdomain) return <div>No store with this name</div>;
  }

  return (
    <div>
      {isSubdomain ? <StoreNavbar /> : <Navbar />}
      <div className="px-3 py-3">{children}</div>
    </div>
  );
}
