import { Link } from "react-router-dom";
import BuyerLayout from "@/components/BuyerLayout";
import ProductCard from "@/components/ProductCard";
import TestimonialSection from "@/components/TestimonialSection";
import RevealOnScroll from "@/components/RevealOnScroll";
import { ArrowRight, Leaf, Truck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRealTimeProducts } from "@/hooks/useRealTimeProducts";

const Index = () => {
  const { products, loading } = useRealTimeProducts();
  const featured = products.filter(p => p.featured).slice(0, 4);

  return (
    <BuyerLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 animate-in fade-in duration-1000">
          <img src="/images/hero-coir.jpg" alt="Coconut coir fibers" className="h-full w-full object-cover scale-105 transition-transform [transition-duration:20s] hover:scale-110" />
          <div className="absolute inset-0 bg-foreground/60" />
        </div>
        <div className="container relative z-10 py-24 md:py-36">
          <div className="max-w-2xl animate-in slide-in-from-bottom-8 duration-700 ease-out">
            <h1 className="font-display text-3xl font-extrabold leading-tight text-card sm:text-4xl md:text-5xl lg:text-6xl">
              Sustainable Coir Products from the Philippines
            </h1>
            <p className="mt-4 text-base text-card/80 animate-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-backwards sm:text-lg">
              Eco-friendly coconut fiber products for gardening, construction, and everyday use. Naturally strong, biodegradable, and locally sourced.
            </p>
            <div className="mt-8 flex flex-col gap-3 animate-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-backwards sm:flex-row">
              <Link to="/products">
                <Button size="lg" className="w-full font-display font-semibold transition-transform active:scale-95 shadow-lg hover:shadow-xl hover:-translate-y-0.5 sm:w-auto">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/storefront">
                <Button
                  size="lg"
                  className="w-full bg-black text-white font-display font-semibold hover:bg-white hover:text-black border border-black transition-all active:scale-95 shadow-lg hover:shadow-xl hover:-translate-y-0.5 sm:w-auto"
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
            { icon: Leaf, title: "100% Natural", desc: "Made from renewable coconut husks", delay: 0 },
            { icon: Truck, title: "Nationwide Delivery", desc: "Fast shipping across the Philippines", delay: 150 },
            { icon: Shield, title: "Quality Assured", desc: "Tested for strength and durability", delay: 300 },
          ].map((v, i) => (
            <RevealOnScroll key={v.title} delay={v.delay} className="flex items-start gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors cursor-default">
              <div className="rounded-lg bg-primary/10 p-3 ring-1 ring-primary/20">
                <v.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg">{v.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container py-16">
        <RevealOnScroll className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl font-bold md:text-3xl text-primary">Featured Products</h2>
            <p className="mt-1 text-muted-foreground">Our best-selling and newest coir products</p>
          </div>
          <Link to="/products" className="hidden text-sm font-medium text-primary hover:underline md:block transition-transform hover:translate-x-1">
            View All Products →
          </Link>
        </RevealOnScroll>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {featured.map((p, index) => (
            <RevealOnScroll key={p.id} delay={index * 100}>
              <div className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-lg h-full">
                <ProductCard product={p} />
              </div>
            </RevealOnScroll>
          ))}
        </div>
        {featured.length === 0 && !loading && (
          <p className="mt-8 text-center text-sm text-muted-foreground">Featured products coming soon!</p>
        )}
      </section>

      {/* Testimonials */}
      <RevealOnScroll>
        <TestimonialSection />
      </RevealOnScroll>
    </BuyerLayout>
  );
};

export default Index;
