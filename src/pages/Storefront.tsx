import BuyerLayout from "@/components/BuyerLayout";
import ProductCard from "@/components/ProductCard";
import RevealOnScroll from "@/components/RevealOnScroll";
import { useRealTimeProducts } from "@/hooks/useRealTimeProducts";
import type { Product } from "@/data/types";

const Section = ({ title, items }: { title: string; items: Product[] }) => (
  items.length > 0 ? (
    <RevealOnScroll>
      <h2 className="font-display text-xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {items.map((p, index) => (
          <RevealOnScroll key={p.id} delay={index * 100}>
            <div className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-lg h-full">
              <ProductCard product={p} />
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </RevealOnScroll>
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
        <RevealOnScroll className="mb-8">
          <h1 className="font-display text-3xl font-bold">Storefront</h1>
          <p className="mt-1 text-muted-foreground">Discover our curated collections {loading && "(loading...)"}</p>
        </RevealOnScroll>
        <Section title="🆕 New Arrivals" items={newProducts} />
        <Section title="🔥 Trending Now" items={trending} />
        <Section title="⭐ Best Sellers" items={bestsellers} />
      </div>
    </BuyerLayout>
  );
};

export default Storefront;
