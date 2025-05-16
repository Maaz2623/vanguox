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

// Dummy store list — replace with dynamic data later
const userStores = [
  { id: "1", name: "ElectroMart" },
  { id: "2", name: "FashionHub" },
  { id: "3", name: "BookNest" },
];

export const NavStoreButton = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="shadow-none">
          <StoreIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
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

        <DropdownMenuItem>
          <PlusCircle className="mr-2 h-4 w-4 text-green-600" />
          Create Store
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
