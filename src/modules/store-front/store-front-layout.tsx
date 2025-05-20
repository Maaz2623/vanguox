import { SearchBar } from "@/components/search-bar";
import { StoreNavbar } from "./_components/store-navbar";
import StoreFrontPage from "./store-front-page";

export default async function StoreFrontLayout({
  subdomain,
}: {
  subdomain?: string | null;
}) {
  if (subdomain) {
    console.log(subdomain);
  } else {
    console.log("No subdomain");
  }
  return (
    <>
      <StoreNavbar />
      <div className="px-3 py-3">
        <SearchBar />
        <StoreFrontPage />
      </div>
    </>
  );
}
