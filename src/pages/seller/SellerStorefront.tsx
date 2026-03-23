import { useState } from "react";
import SellerLayout from "@/components/SellerLayout";
import { products as defaultProducts } from "@/data/products";
import type { Product } from "@/data/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ProductUpdatedToast } from "@/components/ProductUpdatedToast";
import { Image as ImageIcon, Star } from "lucide-react";

const tagOptions: (Product["tag"] | undefined)[] = [undefined, "new", "trending", "bestseller"];

const defaultImageById = new Map(defaultProducts.map((product) => [String(product.id), product.image]));

const getDefaultImage = (product: Product) => {
  return (
    defaultImageById.get(String(product.id)) ||
    defaultProducts.find((item) => item.name === product.name)?.image ||
    "/placeholder.svg"
  );
};

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
    return getDefaultImage(product);
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
                  const defaultImage = getDefaultImage(product);

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
    toast.custom(() => <ProductUpdatedToast type="update" />, { duration: 1500 });
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
      </div>

      {/* Mobile Grid */}
      <div className="grid grid-cols-2 gap-3 md:hidden pb-20">
        {items.map((p) => (
          <div key={p.id} className="relative bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full active:scale-[0.98] transition-all">
            <div className="relative aspect-square w-full bg-slate-100">
              <img
                src={resolveProductImage(p)}
                alt={p.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  const defaultImage = getDefaultImage(p);

                  if (
                    target.dataset.fallbackTried !== "1" &&
                    defaultImage &&
                    target.src !== new URL(defaultImage, window.location.origin).href
                  ) {
                    target.dataset.fallbackTried = "1";
                    target.src = defaultImage;
                    return;
                  }

                  if (target.dataset.placeholderTried !== "1") {
                    target.dataset.placeholderTried = "1";
                    target.src = "/placeholder.svg";
                  }
                }}
              />
              <button
                onClick={() => toggleFeatured(p.id)}
                className={`absolute top-2 right-2 p-1.5 rounded-full shadow-sm backdrop-blur-sm z-10 transition-colors border ${p.featured ? 'bg-yellow-100 border-yellow-200 text-yellow-600' : 'bg-white/90 border-slate-200 text-slate-400'}`}
              >
                <Star className={`h-4 w-4 ${p.featured ? "fill-current" : ""}`} />
              </button>
            </div>

            <div className="p-3 flex flex-col flex-1">
              <div className="flex justify-between items-start gap-2 mb-1">
                <h3 className="font-semibold text-xs text-slate-900 leading-tight line-clamp-2 min-h-[2rem]">
                  {p.name}
                </h3>
              </div>

              <div className="mt-auto pt-2 border-t border-slate-100 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Price</span>
                  <span className="font-bold text-[#4a6b4a] text-sm">₱{p.price.toLocaleString()}</span>
                </div>

                <button
                  onClick={() => cycleTag(p.id)}
                  className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md border text-[10px] font-bold uppercase tracking-wider transition-colors ${p.tag ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-white border-dashed border-slate-300 text-slate-400'}`}
                >
                  Tag: {p.tag ? <span className="text-[#4a6b4a] underline decoration-wavy underline-offset-2">{p.tag}</span> : "None"}
                </button>
              </div>
            </div>
            {p.featured && (
              <div className="absolute top-2 left-2 bg-yellow-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">
                FEATURED
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="hidden md:block overflow-hidden rounded-lg border bg-card">
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
