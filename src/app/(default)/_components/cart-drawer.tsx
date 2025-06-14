"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { MinusIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

interface CartDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const CartDrawer = ({ open, setOpen }: CartDrawerProps) => {
  const isMobile = useIsMobile();

  const trpc = useTRPC();

  const { data: cartItems } = useQuery(trpc.cart.getCartItems.queryOptions());

  if (!cartItems) return <div>loading...</div>;

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent className="px-3 h-[800px]">
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-semibold">
            Your Cart
          </DrawerTitle>
          <DrawerDescription className="text-sm text-muted-foreground">
            Review your selected items before checking out.
          </DrawerDescription>
        </DrawerHeader>
        <Separator />
        <div className="mt-6 flex flex-col gap-4 h-[50%]">
          {cartItems.length === 0 ? (
            <div className="text-center text-muted-foreground mt-10">
              Your cart is empty.
            </div>
          ) : (
            <>
              <ScrollArea
                className={cn("flex-1 pr-2 h-[200px]", isMobile && "h-[150px]")}
              >
                <div className="flex flex-col gap-y-4">
                  {cartItems.map((item) => (
                    <CartProductCard product={item} key={item.id} />
                  ))}
                </div>
              </ScrollArea>
              <Separator />
            </>
          )}
        </div>
        <div>
          <DrawerFooter>
            {cartItems.length > 0 && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">₹{200}</span>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">Checkout</Button>
                </div>
              </>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

type Product = inferRouterOutputs<AppRouter>["cart"]["getCartItem"];

interface CartProductCard {
  product: Product;
}

const CartProductCard = ({ product }: CartProductCard) => {
  const trpc = useTRPC();

  const { data: cartProduct } = useQuery(
    trpc.cart.getCartItem.queryOptions({
      productId: product.id,
    })
  );

  if (!cartProduct) return <div>loading....</div>;

  return (
    <div
      key={product.id}
      className="flex gap-4 border px-3 py-2 rounded-lg items-center"
    >
      <Image
        src={product.images[0].url}
        alt={product.images[0].alt || "image"}
        width={50}
        height={50}
        className="w-16 h-16 rounded-md object-cover border"
      />
      <div className="flex-1">
        <h4 className="font-medium text-sm">{cartProduct.name}</h4>
        <div className="text-xs text-muted-foreground">
          ₹{cartProduct.price} × {cartProduct.quantity}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Button size="icon" variant="ghost" className="hover:bg-white">
            <MinusIcon className="w-4 h-4 " />
          </Button>
          <span className="text-sm">{cartProduct.quantity}</span>
          <Button size="icon" variant="ghost" className="hover:bg-white">
            <PlusIcon className="w-4 h-4 " />
          </Button>
        </div>
      </div>
      <div className="font-medium text-sm">
        ₹{Number(cartProduct.price) * cartProduct.quantity}
      </div>
    </div>
  );
};
