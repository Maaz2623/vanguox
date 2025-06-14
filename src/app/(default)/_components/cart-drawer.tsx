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
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { MinusIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { toast } from "sonner";

interface CartDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const CartDrawer = ({ open, setOpen }: CartDrawerProps) => {
  const isMobile = useIsMobile();

  const trpc = useTRPC();

  const { data: cartItems, isLoading } = useSuspenseQuery(
    trpc.cart.getCartItems.queryOptions()
  );
  const subtotal = cartItems.reduce((total, item) => {
    return total + item.quantity * Number(item.product.price);
  }, 0);

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
                {isLoading || !cartItems ? (
                  <Skeleton className="h-[100px] w-full" />
                ) : (
                  <div className="flex flex-col gap-y-4">
                    {cartItems.map((item) => (
                      <CartProductCard
                        key={item.id}
                        productId={item.productId}
                        quantity={item.quantity}
                      />
                    ))}
                  </div>
                )}
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
                  <span className="font-semibold">₹{subtotal}</span>
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

const CartProductCard = ({
  productId,
  quantity,
}: {
  productId: string;
  quantity: number;
}) => {
  const trpc = useTRPC();

  const { data: cartProduct, isLoading } = useQuery(
    trpc.cart.getCartItem.queryOptions({
      productId: productId,
    })
  );

  const [loading, setLoading] = useState(false);

  const addToCartMutation = useMutation(trpc.cart.addToCart.mutationOptions());
  const removeFromCartMutation = useMutation(
    trpc.cart.removeItem.mutationOptions()
  );

  const queryClient = useQueryClient();

  if (!cartProduct)
    return <Skeleton className="w-full h-[100px] bg-gray-100" />;

  const handleRemoveFromCart = () => {
    setLoading(true);
    const toastId = toast.loading("Removing item from cart...");
    removeFromCartMutation.mutate(
      {
        productId: cartProduct.id,
      },
      {
        onSuccess: () => {
          toast.success("Item updated.", {
            id: toastId,
          });
        },
        onError: () => {
          toast.error("Could not update item.", {
            id: toastId,
          });
        },
        onSettled: () => {
          (async () => {
            await Promise.all([
              queryClient.invalidateQueries(
                trpc.cart.getCartItems.queryOptions()
              ),
              queryClient.invalidateQueries(
                trpc.cart.getCartItem.queryOptions({
                  productId: cartProduct.id,
                })
              ),
            ]);
            setLoading(false);
          })();
        },
      }
    );
  };

  const handleAddToCart = () => {
    setLoading(true);
    const toastId = toast.loading("Add item to cart...");
    addToCartMutation.mutate(
      {
        productId: cartProduct.id,
      },
      {
        onSuccess: () => {
          toast.success("Cart updated.", {
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
              productId: cartProduct.id,
            })
          );
          setLoading(false);
        },
      }
    );
  };

  return (
    <fieldset disabled={loading || isLoading}>
      <div
        key={productId}
        className="flex gap-4 h-[100px] border px-3 py-2 rounded-lg items-center"
      >
        {cartProduct.images.length ? (
          <Image
            src={cartProduct.images[0].url}
            alt={cartProduct.images[0].alt || "image"}
            width={50}
            height={50}
            className="w-16 h-16 rounded-md object-cover border"
          />
        ) : (
          <div className="size-16 rounded-md text-muted-foreground flex justify-center items-center bg-gray-100">
            <p className="text-[10px]">No Image</p>
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-medium text-sm">{cartProduct.name}</h4>
          <div className="text-xs text-muted-foreground">
            ₹{cartProduct.price} × {cartProduct.quantity}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-white"
              onClick={handleRemoveFromCart}
            >
              <MinusIcon className="w-4 h-4 " />
            </Button>
            <span className="text-sm">{quantity}</span>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleAddToCart}
              className="hover:bg-white"
            >
              <PlusIcon className="w-4 h-4 " />
            </Button>
          </div>
        </div>
        <div className="font-medium text-sm">
          ₹{Number(cartProduct.price) * cartProduct.quantity}
        </div>
      </div>
    </fieldset>
  );
};
