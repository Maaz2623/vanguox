import React, { Suspense } from "react";
import { SellerSection } from "./_components/seller-section";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const Page = () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.seller.getSellerAccount.queryOptions());

  return (
    <div className="flex w-full gap-x-2">
      <div className="w-[400px] border bg-white rounded-lg" />
      <div className="w-full">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<div>loading...</div>}>
            <SellerSection />
          </Suspense>
        </HydrationBoundary>
      </div>
    </div>
  );
};

export default Page;
