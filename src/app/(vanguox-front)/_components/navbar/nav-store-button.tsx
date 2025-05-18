"use client";
import { Button } from "@/components/ui/button";
import {
  StoreIcon,
  PlusCircle,
  Package,
  Settings,
  ShoppingCart,
  WarehouseIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Dummy store list — replace with dynamic data later
const userStores = [
  { id: "1", name: "ElectroMart" },
  { id: "2", name: "FashionHub" },
  { id: "3", name: "BookNest" },
];

export const NavStoreButton = () => {
  const [createStoreDialog, setCreateStoreDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="shadow-none">
            <StoreIcon className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" side="bottom">
          <DropdownMenuLabel>Stores Created</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {userStores.map((store) => (
            <DropdownMenuItem key={store.id}>
              <WarehouseIcon />
              {store.name}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Store Management</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Orders
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Package className="mr-2 h-4 w-4" />
            Products
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setCreateStoreDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4 text-green-600" />
            Create Store
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateStoreDialog
        open={createStoreDialog}
        setOpen={setCreateStoreDialog}
      />
    </>
  );
};

const CreateStoreDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [shopName, setShopName] = useState("");
  const trpc = useTRPC();

  const mutation = useMutation(trpc.stores.createStore.mutationOptions());

  const router = useRouter();

  const handleCreateStore = async () => {
    const createStore = mutation.mutateAsync(
      {
        name: shopName,
      },

      {
        onSuccess: (data) => {
          toast.promise(createStore, {
            loading: "Creating your store",
            success: "Store has been created. Redirecting...",
            error: "Something went wrong",
          });
          router.push(`/stores/${data.name}`);
          setShopName("");
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a new store</DialogTitle>
          <DialogDescription>
            Give your store a unique name. You can change this later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="shop-name">Shop Name</Label>
            <Input
              disabled={mutation.isPending}
              id="shop-name"
              placeholder="e.g. FreshMart, PixelHub..."
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={mutation.isPending}
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button disabled={mutation.isPending} onClick={handleCreateStore}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
