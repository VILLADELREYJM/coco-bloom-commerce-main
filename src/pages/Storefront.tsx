import BuyerLayout from "@/components/BuyerLayout";
import ProductCard from "@/components/ProductCard";
import { useRealTimeProducts } from "@/hooks/useRealTimeProducts";
import type { Product } from "@/data/types";

const Section = ({ title, items }: { title: string; items: Product[] }) => (
  items.length > 0 ? (
    <div>
      <h2 className="font-display text-xl font-bold">{title}</h2>
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  ) : null
);

const Storefront = () => {
  const { products, loading } = useRealTimeProducts();
  const newProducts = products.filter(p => p.tag === "new");
  const trending = products.filter(p => p.tag === "trending");
  const bestsellers = products.filter(p => p.tag === "bestseller");

  return (
    <BuyerLayout>
      <div className="container space-y-12 py-12">
        <div>
          <h1 className="font-display text-3xl font-bold">Storefront</h1>
          <p className="mt-1 text-muted-foreground">Discover our curated collections {loading && "(loading...)"}</p>
        </div>
        <Section title="🆕 New Arrivals" items={newProducts} />
        <Section title="🔥 Trending Now" items={trending} />
        <Section title="⭐ Best Sellers" items={bestsellers} />
      </div>
    </BuyerLayout>
  );
};

export default Storefront;
