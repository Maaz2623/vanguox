"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";
import { useTRPC } from "@/trpc/client";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Heart, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type Products = inferRouterOutputs<AppRouter>["products"]["getProducts"];

export const ProductsContainer = () => {
  const trpc = useTRPC();

  const { data } = useQuery(trpc.products.getProducts.queryOptions());

  if (!data) {
    return <div>loading...</div>;
  }

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
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);

  const [added, setAdded] = useState(false);

  const addMutation = useMutation(trpc.wishlist.addProduct.mutationOptions());
  const removeMutation = useMutation(
    trpc.wishlist.removeProduct.mutationOptions()
  );

  const { data: productExists, isLoading } = useQuery(
    trpc.wishlist.getProduct.queryOptions({
      productId: product.id,
    })
  );

  useEffect(() => {
    if (!isLoading && productExists !== undefined) {
      setAdded(!!productExists); // cast to boolean just in case
    }
  }, [productExists, isLoading]);

  const handleAddProduct = () => {
    setLoading(true);
    const toastId = toast.loading("Adding to wishlist...");
    addMutation.mutate(
      {
        productId: product.id,
      },
      {
        onSuccess: () => {
          toast.success("Product added to wishlist", {
            id: toastId,
          });
          setAdded(true);
        },
        onError: () => {
          toast.error("Couldn't add to wishlist", {
            id: toastId,
          });
        },
        onSettled: () => {
          queryClient.invalidateQueries(
            trpc.wishlist.getProduct.queryOptions({
              productId: product.id,
            })
          );
          setLoading(false);
        },
      }
    );
  };

  const handleRemoveProduct = () => {
    const toastId = toast.loading("Removing product from wishlist...");
    setLoading(true);

    removeMutation.mutate(
      {
        productId: product.id,
      },
      {
        onSuccess: () => {
          toast.success("Product removed from wishlist", {
            id: toastId,
          });
          setAdded(false);
        },
        onError: (error) => {
          toast.error(error.message, {
            id: toastId,
          });
        },
        onSettled: () => {
          queryClient.invalidateQueries(
            trpc.wishlist.getProduct.queryOptions({
              productId: product.id,
            })
          );
          setLoading(false);
        },
      }
    );
  };

  return (
    <Link href={`/products/${product.id}`} className="relative">
      <div className="w-[300px] cursor-pointer h-[380px] border rounded-xl shadow-sm overflow-hidden bg-background transition hover:shadow-md">
        {/* Image Section */}
        <div className="w-full h-[200px] relative flex justify-center items-center border-b bg-muted/20 overflow-hidden">
          {product.images?.[0] ? (
            <Image
              src={product.images[0].url}
              alt="Product Image"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex justify-center items-center text-muted-foreground text-sm">
              No Image
            </div>
          )}

          {/* Wishlist Icon */}
          {!isLoading && (
            <fieldset disabled={loading}>
              <Button
                variant={`outline`}
                className="absolute top-2 right-2 z-10 bg-white/70 backdrop-blur-md rounded-full p-1 hover:bg-white"
                onClick={(e) => {
                  e.preventDefault(); // prevent navigation
                  // handleWishlist(product.id);
                  if (productExists) {
                    handleRemoveProduct();
                  } else {
                    handleAddProduct();
                  }
                }}
              >
                <Heart
                  className={cn(
                    "w-4 h-4 text-red-500",
                    added ? "fill-red-500" : "fill-none"
                  )}
                />
              </Button>
            </fieldset>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Name + Category + Shop */}
          <div className="flex justify-between items-start gap-2">
            <div className="space-y-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <h4 className="text-base font-semibold leading-tight line-clamp-1 max-w-[180px]">
                      {product.name}
                    </h4>
                  </TooltipTrigger>
                  <TooltipContent>{product.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                Sold by:{" "}
                <span className="font-medium">{product.store.storeName}</span>
              </p>
            </div>

            <Badge variant="outline" className="text-xs whitespace-nowrap">
              {product.category}
            </Badge>
          </div>

          {/* Description */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description || "No description"}
                </p>
              </TooltipTrigger>
              <TooltipContent>{product.description}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Price and Rating */}
          <div className="flex justify-between items-center">
            <span className="text-base font-semibold text-primary">
              ₹{product.price}
            </span>
            <div className="flex items-center gap-1 text-yellow-500 text-xs">
              <Star className="w-4 h-4 fill-yellow-400" />3
            </div>
          </div>

          {/* Add to Cart */}
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.preventDefault(); // prevent link navigation
              // handleAddToCart(product.id);
            }}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
}
