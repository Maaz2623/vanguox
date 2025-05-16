"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowUpRightFromSquareIcon } from "lucide-react";

interface ProductCardProps {
  title: string;
  description: string;
  price: string;
  rating: number; // from 0 to 5
  shopName: string;
  imageUrl: string;
}

export const ProductCard = ({
  title,
  description,
  price,
  rating,
  shopName,
  imageUrl,
}: ProductCardProps) => {
  return (
    <div className="group relative w-[320px] max-w-sm overflow-hidden rounded-3xl border border-zinc-200 bg-white p-4 shadow-md transition-all duration-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
      <div className="relative h-48 w-full overflow-hidden rounded-2xl">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="mt-4 space-y-2">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
          {title}
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {description}
        </p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < rating ? "currentColor" : "none"}
                strokeWidth={1.5}
              />
            ))}
          </div>

          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {shopName}
          </span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
            {price}
          </span>
          <Button className="rounded-full px-5 py-2 text-sm font-medium">
            Go to shop <ArrowUpRightFromSquareIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};
