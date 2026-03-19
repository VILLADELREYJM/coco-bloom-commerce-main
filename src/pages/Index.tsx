import { Link } from "react-router-dom";
import BuyerLayout from "@/components/BuyerLayout";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Leaf, Truck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-coir.jpg";
import { useRealTimeProducts } from "@/hooks/useRealTimeProducts";

const Index = () => {
  const { products, loading } = useRealTimeProducts();
  const featured = products.filter(p => p.featured).slice(0, 4);

  return (
    <BuyerLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Coconut coir fibers" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-foreground/60" />
        </div>
        <div className="container relative z-10 py-24 md:py-36">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl font-extrabold leading-tight text-card md:text-5xl lg:text-6xl">
              Sustainable Coir Products from the Philippines
            </h1>
            <p className="mt-4 text-lg text-card/80">
              Eco-friendly coconut fiber products for gardening, construction, and everyday use. Naturally strong, biodegradable, and locally sourced.
            </p>
            <div className="mt-8 flex gap-3">
              <Link to="/products">
                <Button size="lg" className="font-display font-semibold">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/storefront">
                <Button
                  size="lg"
                  className="bg-black text-white font-display font-semibold hover:bg-white hover:text-black border border-black transition-colors"
                >
                  Browse Storefront
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="border-b bg-card">
        <div className="container grid gap-8 py-12 md:grid-cols-3">
          {[
            { icon: Leaf, title: "100% Natural", desc: "Made from renewable coconut husks" },
            { icon: Truck, title: "Nationwide Delivery", desc: "Fast shipping across the Philippines" },
            { icon: Shield, title: "Quality Assured", desc: "Tested for strength and durability" },
          ].map(v => (
            <div key={v.title} className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <v.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold">{v.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container py-16">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">Featured Products</h2>
            <p className="mt-1 text-muted-foreground">Our best-selling and newest coir products</p>
          </div>
          <Link to="/products" className="hidden text-sm font-medium text-primary hover:underline md:block">
            View All Products →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {featured.length === 0 && !loading && (
          <p className="mt-8 text-center text-sm text-muted-foreground">Featured products coming soon!</p>
        )}
      </section>
    </BuyerLayout>
  );
};

export default Index;
