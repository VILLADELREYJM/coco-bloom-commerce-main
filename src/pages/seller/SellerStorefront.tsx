import { useState } from "react";
import SellerLayout from "@/components/SellerLayout";
import { products as defaultProducts } from "@/data/products";
import type { Product } from "@/data/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const tagOptions: (Product["tag"] | undefined)[] = [undefined, "new", "trending", "bestseller"];

const SellerStorefront = () => {
  const [items, setItems] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem("coircraft_seller_products");
      return stored ? JSON.parse(stored) : defaultProducts;
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
      <h1 className="font-display text-2xl font-bold">Manage Storefront</h1>
      <p className="mt-1 text-sm text-muted-foreground">Toggle featured products and set product tags</p>

      <div className="mt-6 overflow-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Product</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-left font-medium">Price</th>
              <th className="px-4 py-3 text-center font-medium">Tag</th>
              <th className="px-4 py-3 text-center font-medium">Featured</th>
            </tr>
          </thead>
          <tbody>
            {items.map(p => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="h-10 w-10 rounded object-cover" />
                    <span className="font-medium">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                <td className="px-4 py-3 font-medium">₱{p.price.toLocaleString()}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => cycleTag(p.id)}>
                    {p.tag ? <Badge variant="secondary">{p.tag}</Badge> : <span className="text-xs text-muted-foreground">none</span>}
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <Button variant={p.featured ? "default" : "outline"} size="sm" onClick={() => toggleFeatured(p.id)}>
                    {p.featured ? "Featured" : "Add"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SellerLayout>
  );
};

export default SellerStorefront;
