import { SearchBar } from "@/components/search-bar";
import { StoreNavbar } from "./_components/store-navbar";

export default async function StoreFrontLayout({
  subdomain,
  children,
}: {
  children?: React.ReactNode;
  subdomain?: string | null;
}) {
  if (subdomain) {
    console.log(subdomain);
  } else {
    console.log("No subdomain");
  }
  return (
    <>
      <StoreNavbar subdomain={subdomain as string} />
      <div className="px-3 py-3">
        <SearchBar />
        {children}
      </div>
    </>
  );
}
