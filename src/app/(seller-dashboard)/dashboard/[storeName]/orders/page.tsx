import React, { Suspense } from "react";
import { OrdersTable } from "./_components/orders-table";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";

interface PageProps {
  params: Promise<{
    storeName: string;
  }>;
}

const OrdersPage = async ({ params }: PageProps) => {
  const { storeName } = await params;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.products.getProductsByStoreName.queryOptions({
      storeName: storeName,
    })
  );

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>loading...</div>}>
          <OrdersTable storeName={storeName} />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
};

export default OrdersPage;
