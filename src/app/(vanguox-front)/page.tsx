import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import React, { Suspense } from "react";

const VanguoxFrontPage = async () => {
  await prefetch(trpc.users.getUserData.queryOptions());

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<p>error</p>}>
        <Suspense fallback={<div>Loading...</div>}>
          <div>Vanguox Front Page</div>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default VanguoxFrontPage;
