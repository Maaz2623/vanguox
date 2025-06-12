"use client";

import { Button } from "@/components/ui/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconShoppingCartPlus } from "@tabler/icons-react";
import { useTRPC } from "@/trpc/client";

type Products = inferRouterOutputs<AppRouter>["products"]["getProducts"];

export const ProductsContainer = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.products.getProducts.queryOptions());

  return (
    <div className="flex flex-wrap justify-center items-center gap-6 bg-white p-8 rounded-lg border">
      {data.map((product: Products[number]) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </div>
  );
};

interface ProductCardProps {
  product: Products[number];
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="w-[300px]">
      <Card>
        <CardHeader>
          <CardTitle className="w-[180px] truncate border">
            {product.name}
          </CardTitle>
          <CardDescription className="border w-[150px] truncate">
            {product.description}
          </CardDescription>
          <CardAction>
            <Button variant={`outline`}>
              <IconShoppingCartPlus />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
}
