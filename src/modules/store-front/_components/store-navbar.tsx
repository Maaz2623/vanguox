"use client";
import { Button } from "@/components/ui/button";
import {
  MinusIcon,
  PlusIcon,
  SettingsIcon,
  ShoppingCartIcon,
} from "lucide-react";
import { Settings } from "lucide-react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export const StoreNavbar = () => {
  const [open, setOpen] = useState(false);

  const trpc = useTRPC();

  const { data } = useQuery(
    trpc.stores.getStoreByNameAndUserId.queryOptions({
      storeName: "next",
    })
  );

  return (
    <>
      <div className="border-b px-3 py-5 flex justify-between items-center">
        <Image
          src="/logo.svg"
          height={150}
          width={150}
          alt="logo"
          priority
          className="w-[150px] h-auto"
        />

        <div />

        <div className="flex justify-center items-center gap-x-3">
          {data && data.store && <StoreSettingsDialog storeName={data.store.name} />}
          <Button
            variant={`outline`}
            size={`icon`}
            className="shadow-none"
            onClick={() => setOpen(true)}
          >
            <ShoppingCartIcon />
          </Button>
        </div>
      </div>

      <CartSheet
        open={open}
        setOpen={setOpen}
        cart={[
          {
            product: {
              id: "1",
              title: "Red Hoodie",
              price: 1499,
              image: "/headphones.jpg",
            },
            quantity: 2,
          },
        ]}
        addToCart={(id) => console.log("Add", id)}
        removeFromCart={(id) => console.log("Remove", id)}
        clearCart={() => console.log("Clear cart")}
        checkout={() => console.log("Checkout")}
      />
    </>
  );
};

type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

type CartSheetProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  cart: CartItem[];
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  checkout: () => void;
};

export const CartSheet = ({
  open,
  setOpen,
  cart,
  addToCart,
  removeFromCart,
  checkout,
}: CartSheetProps) => {
  const total = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="px-3">
        <SheetHeader>
          <SheetTitle className="text-2xl font-semibold">Your Cart</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Review your selected items before checking out.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-4 h-[70vh]">
          {cart.length === 0 ? (
            <div className="text-center text-muted-foreground mt-10">
              Your cart is empty.
            </div>
          ) : (
            <ScrollArea className="flex-1 pr-2">
              <div className="flex flex-col gap-4">
                {cart.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex gap-4 bg-gray-100 px-3 py-2 rounded-lg items-center"
                  >
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={50}
                      height={50}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{product.title}</h4>
                      <div className="text-xs text-muted-foreground">
                        ₹{product.price} × {quantity}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="hover:bg-white"
                          onClick={() => removeFromCart(product.id)}
                        >
                          <MinusIcon className="w-4 h-4 " />
                        </Button>
                        <span className="text-sm">{quantity}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="hover:bg-white"
                          onClick={() => addToCart(product.id)}
                        >
                          <PlusIcon className="w-4 h-4 " />
                        </Button>
                      </div>
                    </div>
                    <div className="font-medium text-sm">
                      ₹{product.price * quantity}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          <Separator />

          {cart.length > 0 && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">₹{total}</span>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" onClick={checkout}>
                  Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

const StoreSettingsDialog = ({ storeName }: { storeName: string }) => {
  const router = useRouter();
  return (
    <DropdownMenu>
      {/* Invisible trigger to anchor the dropdown */}
      <DropdownMenuTrigger asChild>
        <Button variant={`outline`} size={`icon`}>
          <SettingsIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" side="bottom" align="end">
        <DropdownMenuLabel className="text-muted-foreground">
          My Store
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => router.push(`/stores/${storeName}/manage`)}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Manage</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
