import { getSubdomain } from "@/helpers/get-subdomain";
import StoreFrontLayout from "@/modules/store-front/store-front-layout";
import VanguoxFrontLayout from "@/modules/vanguox-front/vanguox-front-layout";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const MainPage = async () => {
  const host = (await headers()).get("host") || "";
  const subdomain = await getSubdomain(host);

  const isRootDomain =
    host === "vanguox.com" ||
    host === "www.vanguox.com" ||
    host === "localhost" ||
    host === "localhost:3000";

  // ✅ Case: Subdomain (e.g., tsf.vanguox.com)
  if (!isRootDomain && subdomain) {
    prefetch(
      trpc.stores.getStoreByNameAndUserId.queryOptions({
        storeName: subdomain,
      })
    );

    return (
      <HydrateClient>
        <ErrorBoundary fallback={<div>error</div>}>
          <Suspense fallback={<div>loading...</div>}>
            <StoreFrontLayout subdomain={subdomain} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    );
  }

  // 🚫 Subdomain exists, but no store found
  if (!isRootDomain && !subdomain) {
    notFound(); // Triggers 404
  }

  // ✅ Root domain (vanguox.com)
  return <VanguoxFrontLayout />;
};

export default MainPage;
