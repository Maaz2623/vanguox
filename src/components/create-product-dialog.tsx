"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "./ui/switch";
import { LoaderIcon, PlusCircleIcon, X } from "lucide-react";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useUploadThing } from "@/lib/uploadthing";

export function CreateProductDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [message, setMessage] = useState("🚀 Create");

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");

  const [enableColors, setEnableColors] = useState(false);
  const [enableSizes, setEnableSizes] = useState(false);
  const [enableImages, setEnableImages] = useState(false);

  const [colorName, setColorName] = useState("");
  const [colorValue, setColorValue] = useState("#000000");
  const [colors, setColors] = useState<{ name: string; value: string }[]>([]);

  const handleAddColor = () => {
    if (!colorName.trim() || !colorValue.trim()) return;

    setColors((prev) => [...prev, { name: colorName, value: colorValue }]);
    setColorName("");
    setColorValue("#000000");
  };

  const [sizeName, setSizeName] = useState("");
  const [sizeValue, setSizeValue] = useState("");
  const [sizes, setSizes] = useState<{ name: string; value: string }[]>([]);

  const handleClear = () => {
    setName("");
    setCategory("");
    setDescription("");
    setPrice("");
    setStockQuantity("");

    setEnableColors(false);
    setEnableSizes(false);
    setEnableImages(false);

    setColorName("");
    setColorValue("#000000");
    setColors([]);

    setSizeName("");
    setSizeValue("");
    setSizes([]);

    setProductImages([]);
  };

  const [productImages, setProductImages] = useState<
    { file: File; alt: string; priority: number }[]
  >([]);

  const trpc = useTRPC();

  const mutation = useMutation(trpc.products.createProduct.mutationOptions());

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: () => {
      setMessage("");
    },
    onUploadBegin: () => {
      setMessage("Uploading");
    },
  });

  const handleCreate = async () => {
    setLoading(true);

    let uploadedImages: { url: string; alt: string; priority: number }[] = [];

    if (enableImages && productImages.length > 0) {
      const uploaded = await startUpload(productImages.map((img) => img.file));

      if (!uploaded || uploaded.length !== productImages.length) {
        throw new Error("Some images failed to upload.");
      }

      uploadedImages = uploaded.map((res, index) => ({
        url: res.ufsUrl,
        alt: productImages[index].alt.trim(),
        priority: productImages[index].priority,
      }));
    }
    setMessage("Creating product");
    mutation.mutate(
      {
        storeName: "next", // replace with actual store ID
        name: name,
        description: description,
        category: category,
        price: price,
        stockQuantity: Number(stockQuantity),
        sizes: enableSizes
          ? sizes.map((s) => ({
              name: s.name.trim(),
              value: s.value.trim(),
            }))
          : [],
        colors: enableColors
          ? colors.map((c) => ({
              name: c.name.trim(),
              value: c.value.trim(),
            }))
          : [],
        images: uploadedImages,
      },
      {
        onSuccess: () => {
          toast.success("Product created.");
          handleClear(); // 👈 clear the form fields here
        },
        onError: (error) => {
          toast.error(error.message);
        },
        onSettled: () => {
          setOpen(false);
          setLoading(false);
          setMessage("🚀 Create");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]  flex flex-col">
        <fieldset disabled={loading}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              🛒 Add a New Product
            </DialogTitle>
            <DialogDescription>
              Add essential product details to list it in your store 🏷️
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] border-y shadow-inner mt-3 custom-scroll overflow-y-auto pr-2">
            <div className="space-y-6 mt-4 pb-4 p-1">
              <div className="flex flex-col gap-y-1.5">
                <Label htmlFor="name">📛 Product Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Cotton T-Shirt"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-y-1.5">
                <Label htmlFor="category">📦 Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Fashion"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-y-1.5">
                <Label htmlFor="description">📝 Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the product..."
                  className="resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex w-full gap-x-3">
                <div className="flex flex-col gap-y-1.5">
                  <Label htmlFor="price">💰 Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="e.g., 499.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-y-1.5">
                  <Label htmlFor="stock">📦 Stock Quantity</Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="e.g., 100"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                  />
                </div>
              </div>
              <Separator />

              <div className="flex flex-col gap-y-1.5">
                <div className="space-y-4">
                  <div className="flex items-end justify-between">
                    <span className="text-xl font-semibold">Colors</span>
                    <Switch
                      checked={enableColors}
                      onCheckedChange={setEnableColors}
                    />
                  </div>
                  {enableColors && (
                    <>
                      <div className="flex gap-x-2 justify-between items-end">
                        <div className="flex gap-x-3 items-end w-full">
                          <div className="w-[200px] flex flex-col gap-y-1">
                            <Label htmlFor="colorName">Color Name</Label>
                            <Input
                              id="colorName"
                              placeholder="e.g., Red"
                              value={colorName}
                              onChange={(e) => setColorName(e.target.value)}
                            />
                          </div>
                          <div className="flex flex-1 flex-col gap-y-1">
                            <Label htmlFor="colorValue">Color Value</Label>
                            <Input
                              id="colorValue"
                              type="color"
                              value={colorValue}
                              onChange={(e) => setColorValue(e.target.value)}
                            />
                          </div>
                        </div>
                        <Button variant="outline" onClick={handleAddColor}>
                          <PlusCircleIcon />
                        </Button>
                      </div>

                      <div className="mt-4">
                        <Label className="text-sm">🎨 Added Colors</Label>

                        {colors.length > 0 ? (
                          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {colors.map((color, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-x-3 border rounded-md px-3 py-2"
                              >
                                <div
                                  className="w-6 h-6 rounded-full border"
                                  style={{ backgroundColor: color.value }}
                                />
                                <span className="text-sm text-muted-foreground">
                                  {color.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground mt-2">
                            No colors added yet.
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  <Separator />
                  <div className="flex items-end justify-between">
                    <span className="text-xl font-semibold">Sizes</span>
                    <Switch
                      checked={enableSizes}
                      onCheckedChange={setEnableSizes}
                    />
                  </div>
                  {enableSizes && (
                    <>
                      <div className="flex gap-x-2 justify-between items-end">
                        <div className="flex gap-x-3 items-end w-full">
                          <div className="w-[200px] flex flex-col gap-y-1">
                            <Label htmlFor="sizeName">Size Name</Label>
                            <Input
                              id="sizeName"
                              placeholder="e.g., Large"
                              value={sizeName}
                              onChange={(e) => setSizeName(e.target.value)}
                            />
                          </div>
                          <div className="flex flex-1 flex-col gap-y-1">
                            <Label htmlFor="sizeValue">Size Value</Label>
                            <Input
                              id="sizeValue"
                              placeholder="e.g., L"
                              value={sizeValue}
                              onChange={(e) => setSizeValue(e.target.value)}
                            />
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            if (!sizeName.trim() || !sizeValue.trim()) return;
                            setSizes((prev) => [
                              ...prev,
                              { name: sizeName, value: sizeValue },
                            ]);
                            setSizeName("");
                            setSizeValue("");
                          }}
                        >
                          <PlusCircleIcon />
                        </Button>
                      </div>

                      <div className="mt-4">
                        <Label className="text-sm">📏 Added Sizes</Label>

                        {sizes.length > 0 ? (
                          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {sizes.map((size, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-x-3 border rounded-md px-3 py-2"
                              >
                                <div className="text-sm font-medium">
                                  {size.value}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {size.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground mt-2">
                            No sizes added yet.
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-semibold">
                      Product Images
                    </span>
                    <Switch
                      checked={enableImages}
                      onCheckedChange={setEnableImages}
                    />
                  </div>
                  {enableImages && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="productImage">
                          🖼️ Upload Product Images
                        </Label>
                        <Input
                          id="productImage"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = e.target.files;
                            if (!files) return;

                            const fileArray = Array.from(files).map((file) => ({
                              file,
                              alt: "",
                              priority: 0,
                            }));

                            setProductImages((prev) => [...prev, ...fileArray]);
                          }}
                        />
                      </div>

                      <div className="mt-4">
                        <Label className="text-sm">🧾 Uploaded Images</Label>

                        {productImages.length > 0 ? (
                          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {productImages.map((img, index) => (
                              <div
                                key={index}
                                className="border rounded-md p-3 relative flex flex-col gap-2"
                              >
                                {/* ❌ Remove Button */}
                                <button
                                  disabled={loading}
                                  type="button"
                                  className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-1 shadow hover:bg-gray-100"
                                  onClick={() => {
                                    const updated = [...productImages];
                                    updated.splice(index, 1);
                                    setProductImages(updated);
                                  }}
                                >
                                  <X className="w-4 h-4 text-gray-600" />
                                </button>

                                <Image
                                  src={URL.createObjectURL(img.file)}
                                  alt="preview"
                                  className="w-full h-40 object-cover rounded"
                                  width={500} // approximate width
                                  height={160} // matches h-40 (~160px)
                                  unoptimized // required for blob/file URLs
                                />

                                <div className="flex flex-col gap-y-1">
                                  <Label htmlFor={`alt-${index}`}>
                                    Alt Text
                                  </Label>
                                  <Input
                                    id={`alt-${index}`}
                                    placeholder="e.g., Front view of red t-shirt"
                                    value={img.alt}
                                    onChange={(e) => {
                                      const updated = [...productImages];
                                      updated[index].alt = e.target.value;
                                      setProductImages(updated);
                                    }}
                                  />
                                </div>

                                <div className="flex flex-col gap-y-1">
                                  <Label htmlFor={`priority-${index}`}>
                                    Priority
                                  </Label>
                                  <Input
                                    id={`priority-${index}`}
                                    type="number"
                                    min={0}
                                    placeholder="0"
                                    value={img.priority}
                                    onChange={(e) => {
                                      const updated = [...productImages];
                                      updated[index].priority = Number(
                                        e.target.value
                                      );
                                      setProductImages(updated);
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground mt-2">
                            No images uploaded yet.
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="mt-6">
            <Button className="w-full sm:w-auto" onClick={handleCreate}>
              {loading && <LoaderIcon className="animate-spin" />}
              {message}
            </Button>
          </DialogFooter>
        </fieldset>
      </DialogContent>
    </Dialog>
  );
}
