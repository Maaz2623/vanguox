import { headers } from "next/headers";
import { StoreNavbar } from "./_components/store-navbar";
import { getSubdomain } from "@/helpers/get-subdomain";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const host = (await headers()).get("host")!;

  const subdomain = await getSubdomain(host);

  if (!subdomain) return <div>No store with this name</div>;

  console.log(subdomain);

  return (
    <div>
      <StoreNavbar />
      {children}
    </div>
  );
}
