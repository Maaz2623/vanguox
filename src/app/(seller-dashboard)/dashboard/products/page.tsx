import React from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ProductsTable } from "../../_components/(store-admin-dashboard)/products-table";
import { Suspense } from "react";
import { getQueryClient, trpc } from "@/trpc/server";

interface PageProps {
  params: Promise<{
    storeName: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { storeName } = await params;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.products.getProductsByStoreName.queryOptions({
      storeName: storeName,
    })
  );

  return (
    <div className="px-4 lg:px-6">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>loading...</div>}>
          <ProductsTable storeName={storeName} />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
};

export default Page;
