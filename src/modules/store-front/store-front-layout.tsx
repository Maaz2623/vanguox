import { SearchBar } from "@/components/search-bar";
import { StoreNavbar } from "./_components/store-navbar";
import StoreFrontPage from "./store-front-page";

export default async function StoreFrontLayout() {
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
