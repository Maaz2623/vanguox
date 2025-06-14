"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
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
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Products = inferRouterOutputs<AppRouter>["products"]["getProducts"];

export const ProductsContainer = () => {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.products.getProducts.queryOptions());

  const mockArray = Array.from({ length: 20 }, (_, i) => i + 1);

  return (
    <div className="flex flex-wrap justify-center items-center gap-6 bg-white p-8 rounded-lg border">
      {!data &&
        mockArray.map((item) => (
          <Skeleton key={item} className="w-[300px] h-[380px] bg-gray-100" />
        ))}
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

  const [cartLoading, setCartLoading] = useState(false);

  const addMutation = useMutation(trpc.wishlist.addProduct.mutationOptions());
  const removeMutation = useMutation(
    trpc.wishlist.removeProduct.mutationOptions()
  );

  const addToCartMutation = useMutation(trpc.cart.addToCart.mutationOptions());

  const { data: productExists, isLoading } = useQuery(
    trpc.wishlist.getProduct.queryOptions({
      productId: product.id,
    })
  );

  const handleAddToCart = () => {
    setCartLoading(true);
    const toastId = toast.loading("Add item to cart...");
    addToCartMutation.mutate(
      {
        productId: product.id,
      },
      {
        onSuccess: () => {
          toast.success("Item added to cart.", {
            id: toastId,
          });
        },
        onError: () => {
          toast.error("Could not add item to cart.", {
            id: toastId,
          });
        },
        onSettled: () => {
          queryClient.invalidateQueries(trpc.cart.getCartItems.queryOptions());
          queryClient.invalidateQueries(
            trpc.cart.getCartItem.queryOptions({
              productId: product.id,
            })
          );
          setCartLoading(false);
        },
      }
    );
  };

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
      <fieldset disabled={cartLoading}>
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
                      productExists ? "fill-red-500" : "fill-none"
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
            <div className="w-full flex justify-end items-center">
              <Button
                size="sm"
                className=""
                onClick={(e) => {
                  e.preventDefault(); // prevent link navigation
                  // handleAddToCart(product.id);
                  handleAddToCart();
                }}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </fieldset>
    </Link>
  );
}
