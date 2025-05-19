import { headers } from "next/headers";
import { StoreNavbar } from "./_components/store-navbar";
import { getSubdomain } from "@/lib/utils";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const host = (await headers()).get("host")!;

  const subdomain = getSubdomain(host);

  if (!subdomain) return <div>No store with this name</div>;  

  return (
    <div>
      <StoreNavbar />
      {children}
    </div>
  );
}
