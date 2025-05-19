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

  const subdomain = await getSubdomain(host);

  if (!subdomain) return <div>No store with this name</div>;

  return (
    <div>
      {!subdomain ? <Navbar /> : <StoreNavbar />}
      <div className="px-3 py-3">{children}</div>
    </div>
  );
}
