import { SearchBar } from "@/components/search-bar";
import { Navbar } from "./_components/navbar";
import VanguoxFrontPage from "./vanguox-front-page";

export default async function VanguoxFrontLayout() {
  return (
    <>
      <Navbar />
      <div className="px-3 py-3">
        <SearchBar />
        <VanguoxFrontPage />
      </div>
    </>
  );
}
