import { useState, useMemo } from "react";
import BuyerLayout from "@/components/BuyerLayout";
import ProductCard from "@/components/ProductCard";
import RevealOnScroll from "@/components/RevealOnScroll";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";
import { useRealTimeProducts } from "@/hooks/useRealTimeProducts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Products = () => {
  const { products, loading } = useRealTimeProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("popular");

  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map(p => p.category)))], [products]);

  const filtered = useMemo(() => {
    let result = products.filter(p =>
      (category === "All" || p.category === category) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))
    );

    const items = [...result];
    switch (sort) {
      case "price-low": items.sort((a, b) => a.price - b.price); break;
      case "price-high": items.sort((a, b) => b.price - a.price); break;
      case "latest": items.sort((a, b) => (b.tag === "new" ? 1 : 0) - (a.tag === "new" ? 1 : 0)); break;
      case "top-sales": items.sort((a, b) => (b.tag === "bestseller" ? 1 : 0) - (a.tag === "bestseller" ? 1 : 0)); break;
      case "popular":
      default: items.sort((a, b) => (b.tag === "trending" ? 1 : 0) - (a.tag === "trending" ? 1 : 0));
    }
    return items;
  }, [search, category, sort, products]);

  return (
    <BuyerLayout>
      <div className="container py-12 max-w-7xl px-6">
        {/* Minimal Search - Icon Right */}
        <RevealOnScroll className="w-full mb-10">
          <div className="relative group">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-11 pr-12 rounded-md border-slate-200 bg-white focus:ring-1 focus:ring-primary/20 transition-all focus:shadow-md"
            />
            <div className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-slate-400">
              <Search className="h-4 w-4" />
            </div>
          </div>
        </RevealOnScroll>

        {/* Unified Filter & Sort Bar */}
        <RevealOnScroll delay={100} className="mb-10">
          <div className="flex flex-col xl:flex-row gap-6 p-4 bg-white rounded-xl shadow-sm border border-slate-200/60 sticky top-20 z-20 md:static">

            {/* Categories (Pills) */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 overflow-x-auto pb-2 xl:pb-0 scrollbar-hide mask-fade-right">
                {categories.map(c => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all whitespace-nowrap active:scale-95 ${category === c
                        ? "bg-[#4a6b4a] text-white shadow-md shadow-green-900/10 ring-2 ring-green-600/20"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/50"
                      }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Sorting (Segmented Control) */}
            <div className="flex items-center justify-between xl:justify-end gap-4 border-t xl:border-t-0 border-slate-100 pt-4 xl:pt-0">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:block">Sort By</span>
              <div className="flex items-center bg-slate-100/80 p-1.5 rounded-lg border border-slate-200/50">
                {[
                  { id: "popular", label: "Popular" },
                  { id: "latest", label: "Latest" },
                  { id: "top-sales", label: "Top Sales" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSort(item.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all active:scale-95 ${sort === item.id
                        ? "bg-white text-[#4a6b4a] shadow-sm ring-1 ring-slate-200"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                      }`}
                  >
                    {item.label}
                  </button>
                ))}

                {/* Price Dropdown */}
                <div className="pl-1 ml-1 border-l border-slate-200">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all outline-none active:scale-95 ${sort.startsWith('price')
                          ? "bg-white text-[#4a6b4a] shadow-sm ring-1 ring-slate-200"
                          : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                        }`}>
                        Price <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-white rounded-lg shadow-xl border-slate-100 p-1">
                      <DropdownMenuItem
                        onClick={() => setSort("price-low")}
                        className={`px-3 py-2.5 text-sm cursor-pointer rounded-md ${sort === "price-low" ? "bg-[#4a6b4a]/10 text-[#4a6b4a] font-medium" : "text-slate-700 hover:bg-slate-50"}`}
                      >
                        Price: Low to High
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSort("price-high")}
                        className={`px-3 py-2.5 text-sm cursor-pointer rounded-md ${sort === "price-high" ? "bg-[#4a6b4a]/10 text-[#4a6b4a] font-medium" : "text-slate-700 hover:bg-slate-50"}`}
                      >
                        Price: High to Low
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Product Grid */}
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p, index) => (
            <RevealOnScroll key={p.id} delay={index * 50}>
              <div className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-lg h-full">
                <ProductCard product={p} />
              </div>
            </RevealOnScroll>
          ))}
        </div>

        {/* Empty State */}
        {!loading && filtered.length === 0 && (
          <div className="mt-20 text-center py-20 border border-dashed rounded-xl border-slate-200">
            <p className="text-slate-400 text-sm italic">No items found matching your filter.</p>
          </div>
        )}

        {loading && (
          <div className="mt-20 flex justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#4a6b4a] border-t-transparent" />
          </div>
        )}
      </div>
    </BuyerLayout>
  );
};

export default Products;