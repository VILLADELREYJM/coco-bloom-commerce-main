import { useState } from "react";
import SellerLayout from "@/components/SellerLayout";
import { products as defaultProducts } from "@/data/products";
import type { Product } from "@/data/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Image as ImageIcon } from "lucide-react";

const tagOptions: (Product["tag"] | undefined)[] = [undefined, "new", "trending", "bestseller"];

const defaultImageById = new Map(defaultProducts.map((product) => [product.id, product.image]));

const normalizeProductImage = (image: string) => {
  const value = (image || "").trim();
  if (!value) return "/placeholder.svg";

  if (
    value.startsWith("/") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:") ||
    value.startsWith("blob:")
  ) {
    return value;
  }

  const fileName = value.split("/").pop();
  return fileName ? `/images/${fileName}` : "/placeholder.svg";
};

const resolveProductImage = (product: Product) => {
  const normalized = normalizeProductImage(product.image);
  if (normalized.startsWith("blob:")) {
    return defaultImageById.get(product.id) || "/placeholder.svg";
  }
  return normalized;
};

const ProductStorefrontRow = ({
  product,
  onCycleTag,
  onToggleFeatured
}: {
  product: Product;
  onCycleTag: (id: string) => void;
  onToggleFeatured: (id: string) => void;
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <tr className="border-b last:border-0 hover:bg-muted/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded overflow-hidden bg-muted flex items-center justify-center border">
            {imageError ? (
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
            ) : (
              <img
                src={resolveProductImage(product)}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const img = e.currentTarget;
                  const defaultImage = defaultImageById.get(product.id);

                  if (img.dataset.fallbackTried !== "1" && defaultImage && img.src !== new URL(defaultImage, window.location.origin).href) {
                    img.dataset.fallbackTried = "1";
                    img.src = defaultImage;
                    return;
                  }

                  if (img.dataset.placeholderTried !== "1") {
                    img.dataset.placeholderTried = "1";
                    img.src = "/placeholder.svg";
                    return;
                  }

                  setImageError(true);
                }}
              />
            )}
          </div>
          <span className="font-medium line-clamp-2 md:line-clamp-1">{product.name}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{product.category}</td>
      <td className="px-4 py-3 font-medium">₱{product.price.toLocaleString()}</td>
      <td className="px-4 py-3 text-center">
        <button onClick={() => onCycleTag(product.id)} className="hover:opacity-80 transition-opacity">
          {product.tag ? <Badge variant="secondary" className="capitalize">{product.tag}</Badge> : <span className="text-xs text-muted-foreground border px-2 py-0.5 rounded-full">None</span>}
        </button>
      </td>
      <td className="px-4 py-3 text-center">
        <Button
          variant={product.featured ? "default" : "outline"}
          size="sm"
          onClick={() => onToggleFeatured(product.id)}
          className={product.featured ? "bg-green-600 hover:bg-green-700" : ""}
        >
          {product.featured ? "Featured" : "Add"}
        </Button>
      </td>
    </tr>
  );
};

const SellerStorefront = () => {
  const [items, setItems] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem("coircraft_seller_products");
      if (stored) {
        const parsed = JSON.parse(stored);
        const fixed = parsed.map((p: Product) => ({
          ...p,
          image: resolveProductImage(p),
        }));
        localStorage.setItem("coircraft_seller_products", JSON.stringify(fixed));
        return fixed;
      }
      return defaultProducts;
    } catch { return defaultProducts; }
  });

  const toggleFeatured = (id: string) => {
    const updated = items.map(p => p.id === id ? { ...p, featured: !p.featured } : p);
    setItems(updated);
    localStorage.setItem("coircraft_seller_products", JSON.stringify(updated));
    toast.success("Storefront updated");
  };

  const cycleTag = (id: string) => {
    const updated = items.map(p => {
      if (p.id !== id) return p;
      const currentIdx = tagOptions.indexOf(p.tag);
      const nextIdx = (currentIdx + 1) % tagOptions.length;
      return { ...p, tag: tagOptions[nextIdx] };
    });
    setItems(updated);
    localStorage.setItem("coircraft_seller_products", JSON.stringify(updated));
  };

  return (
    <SellerLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Manage Storefront</h1>
          <p className="mt-1 text-sm text-muted-foreground">Toggle featured products and set product tags</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (confirm("Reset to default products? This will clear custom changes.")) {
              localStorage.removeItem("coircraft_seller_products");
              setItems(defaultProducts);
              toast.success("Reset to default products");
            }
          }}
        >
          Reset Data
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium w-[40%]">Product</th>
                <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Category</th>
                <th className="px-4 py-3 text-left font-medium">Price</th>
                <th className="px-4 py-3 text-center font-medium">Tag</th>
                <th className="px-4 py-3 text-center font-medium">Featured</th>
              </tr>
            </thead>
            <tbody>
              {items.map(p => (
                <ProductStorefrontRow
                  key={p.id}
                  product={p}
                  onCycleTag={cycleTag}
                  onToggleFeatured={toggleFeatured}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SellerLayout>
  );
};


export default SellerStorefront;
