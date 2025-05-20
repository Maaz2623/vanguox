import { getSubdomain } from "@/helpers/get-subdomain";
import StoreFrontLayout from "@/modules/store-front/store-front-layout";
import VanguoxFrontLayout from "@/modules/vanguox-front/vanguox-front-layout";
import { headers } from "next/headers";
import React from "react";
import { notFound } from "next/navigation";

const MainPage = async () => {
  if (process.env.NODE_ENV === "production") {
    const host = (await headers()).get("host") || ""; // ❗ no await

    const subdomain = await getSubdomain(host);

    // Optionally check against a whitelist of valid subdomains
    if (host && host !== "vanguox.com" && !subdomain) {
      notFound(); // Show 404 page if subdomain exists but store not found
    }

    // Show store layout if subdomain is found
    if (subdomain) {
      return <StoreFrontLayout />;
    }
  } else {
    // Otherwise, show the root Vanguox layout
    return <VanguoxFrontLayout />;
  }
};

export default MainPage;
