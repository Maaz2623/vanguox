"use client";

import * as React from "react";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconLayoutColumns,
  IconPlus,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateProductDialog } from "@/components/create-product-dialog";
import { useTRPC } from "@/trpc/client";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export const schema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
  category: z.string(),
  description: z.string().nullable(),
  storeId: z.string(),
  price: z.string(), // because it's from a numeric column
  stockQuantity: z.number(),
});

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Store Name",
    cell: ({ row }) => <TableCellViewer item={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.category}
      </Badge>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[250px]  truncate text-xs">
        {row.original.description || "-"}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <div className="text-start text-sm ">
        ₹{Number(row.original.price).toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "stockQuantity",
    header: "Stock",
    cell: ({ row }) => (
      <div className="text-start pl-2 text-sm w-20">
        {row.original.stockQuantity}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = row.original.createdAt
        ? new Date(row.original.createdAt)
        : null;
      return (
        <div className="text-start text-sm text-muted-foreground">
          {date ? date.toLocaleDateString() : "-"}
        </div>
      );
    },
  },
  // Optional:
  // {
  //   accessorKey: "updatedAt",
  //   header: "Updated",
  //   cell: ({ row }) => {
  //     const date = row.original.updatedAt
  //       ? new Date(row.original.updatedAt)
  //       : null;
  //     return (
  //       <div className="text-right text-sm text-muted-foreground">
  //         {date ? date.toLocaleDateString() : "-"}
  //       </div>
  //     );
  //   },
  // },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export function DataTable({ storeName }: { storeName: string }) {
  const trpc = useTRPC();

  const { data: products } = useSuspenseQuery(
    trpc.products.getProductsByStoreName.queryOptions({
      storeName,
    })
  );

  const [data] = React.useState(() => products);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [createProductDialogOpen, setCreateProductDialogOpen] =
    React.useState(false);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <>
      <CreateProductDialog
        storeName={storeName}
        open={createProductDialogOpen}
        setOpen={setCreateProductDialogOpen}
      />
      <div className="w-full flex-col justify-start gap-6">
        <div className="flex items-center mb-3">
          <div className="flex items-center justify-between w-full gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <IconLayoutColumns />
                  <span className="hidden lg:inline">Customize Columns</span>
                  <span className="lg:hidden">Columns</span>
                  <IconChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-full flex justify-between items-center"
              >
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide()
                  )
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="default"
              size="sm"
              onClick={() => setCreateProductDialogOpen(true)}
            >
              <IconPlus />
              <span className="">Add Product</span>
            </Button>
          </div>
        </div>

        <div className="relative flex flex-col gap-4 overflow-auto">
          <div className="overflow-hidden rounded-lg border ">
            <Table className="">
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8 ">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between px-4">
            <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex w-full items-center gap-8 lg:w-fit">
              <div className="hidden items-center gap-2 lg:flex">
                <Label htmlFor="rows-per-page" className="text-sm font-medium">
                  Rows per page
                </Label>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                    <SelectValue
                      placeholder={table.getState().pagination.pageSize}
                    />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-fit items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
              <div className="ml-auto flex items-center gap-2 lg:ml-0">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <IconChevronsLeft />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <IconChevronLeft />
                </Button>
                <Button
                  variant="outline"
                  className="size-8"
                  size="icon"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <IconChevronRight />
                </Button>
                <Button
                  variant="outline"
                  className="hidden size-8 lg:flex"
                  size="icon"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <IconChevronsRight />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const trpc = useTRPC();

  const { data: product, isLoading } = useQuery(
    trpc.products.getProductDetails.queryOptions({
      productId: item.id,
    })
  );

  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Product Details</DrawerTitle>
          <DrawerDescription>Full product metadata</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-[75%] shadow-inner py-4 mx-4 rounded-lg border">
          <div className="px-4 pb-6 space-y-4">
            <div className="space-y-2">
              <Label>Store Name</Label>
              {isLoading ? (
                <Skeleton className="h-9 w-full rounded-md" />
              ) : (
                <Input readOnly value={product?.name || "—"} />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                {isLoading ? (
                  <Skeleton className="h-9 w-full rounded-md" />
                ) : (
                  <Input readOnly value={product?.category || "—"} />
                )}
              </div>
              <div className="space-y-2">
                <Label>Price</Label>
                {isLoading ? (
                  <Skeleton className="h-9 w-full rounded-md" />
                ) : (
                  <Input
                    readOnly
                    value={
                      product?.price
                        ? `₹${Number(product.price).toFixed(2)}`
                        : "—"
                    }
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              {isLoading ? (
                <Skeleton className="h-9 w-full rounded-md" />
              ) : (
                <Input readOnly value={product?.description || "—"} />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Stock</Label>
                {isLoading ? (
                  <Skeleton className="h-9 w-full rounded-md" />
                ) : (
                  <Input readOnly value={String(product?.stockQuantity || 0)} />
                )}
              </div>
              <div className="space-y-2">
                <Label>In Stock</Label>
                {isLoading ? (
                  <Skeleton className="h-9 w-full rounded-md" />
                ) : (
                  <Input
                    readOnly
                    value={product?.stockQuantity ? "Yes" : "No"}
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Created At</Label>
                {isLoading ? (
                  <Skeleton className="h-9 w-full rounded-md" />
                ) : (
                  <Input
                    readOnly
                    value={
                      product?.createdAt
                        ? new Date(product.createdAt).toLocaleString()
                        : "—"
                    }
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label>Updated At</Label>
                {isLoading ? (
                  <Skeleton className="h-9 w-full rounded-md" />
                ) : (
                  <Input
                    readOnly
                    value={
                      product?.updatedAt
                        ? new Date(product.updatedAt).toLocaleString()
                        : "—"
                    }
                  />
                )}
              </div>
            </div>

            {isLoading || !product ? (
              <>
                <Skeleton className="h-4 w-20" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-12 rounded-md" />
                  <Skeleton className="h-6 w-10 rounded-md" />
                  <Skeleton className="h-6 w-16 rounded-md" />
                </div>
              </>
            ) : (
              product?.sizes?.length > 0 && (
                <div className="space-y-2">
                  <Label>Sizes</Label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <Badge
                        key={size.name}
                      >{`${size.name}: ${size.value}`}</Badge>
                    ))}
                  </div>
                </div>
              )
            )}

            {isLoading || !product ? (
              <>
                <Skeleton className="h-4 w-20" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-12 rounded-md" />
                  <Skeleton className="h-6 w-10 rounded-md" />
                  <Skeleton className="h-6 w-16 rounded-md" />
                </div>
              </>
            ) : (
              product?.colors?.length > 0 && (
                <div className="space-y-2">
                  <Label>Colors</Label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <Badge
                        key={color.name}
                      >{`${color.name}: ${color.value}`}</Badge>
                    ))}
                  </div>
                </div>
              )
            )}

            {isLoading || !product ? (
              <>
                <Skeleton className="h-4 w-20" />
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className="aspect-square w-full rounded-md"
                    />
                  ))}
                </div>
              </>
            ) : (
              product?.images?.length > 0 && (
                <div className="space-y-2">
                  <Label>Images</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {product.images.map((img) => (
                      <div key={img.url} className="aspect-square relative">
                        <Image
                          src={img.url}
                          alt={img.alt || "Product Image"}
                          fill
                          className="rounded-md object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </ScrollArea>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
