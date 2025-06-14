import React, { Suspense } from "react";
import { ProductsContainer } from "./_components/products-container";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Navbar } from "@/components/navbar";

export const dynamic = "force-dynamic";

const HomePage = async () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.products.getProducts.queryOptions());

  void queryClient.prefetchQuery(trpc.cart.getCartItems.queryOptions());

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<div>loading</div>}>
          <Navbar />
        </Suspense>
      </HydrationBoundary>

      <div className="flex gap-x-2">
        <div className="w-[20vw] bg-white rounded-lg border" />
        <div className="w-full">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<div>loading...</div>}>
              <ProductsContainer />
            </Suspense>
          </HydrationBoundary>
        </div>
      </div>
    </>
  );
};

export default HomePage;
