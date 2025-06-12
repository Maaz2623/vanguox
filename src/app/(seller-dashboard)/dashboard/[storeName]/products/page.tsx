import React, { Suspense } from "react";
import { DataTable } from "./_components/data-table";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface PageProps {
  params: Promise<{
    storeName: string;
  }>;
}

const ProductsPage = async ({ params }: PageProps) => {
  const { storeName } = await params;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.products.getProductsByStoreName.queryOptions({
      storeName,
    })
  );

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense>
          <DataTable storeName={storeName} />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
};

export default ProductsPage;
