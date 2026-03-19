import { useState, useMemo } from "react";
import BuyerLayout from "@/components/BuyerLayout";
import ProductCard from "@/components/ProductCard";
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
        <div className="w-full mb-10">
          <div className="relative group">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-11 pr-12 rounded-md border-slate-200 bg-white focus:ring-1 focus:ring-primary/20"
            />
            <div className="absolute right-0 top-0 h-full w-12 flex items-center justify-center text-slate-400">
              <Search className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Unified Filter & Sort Bar (Matches Image 1) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">

          {/* Categories (Left Aligned) */}
          <div className="flex items-center gap-8">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`text-sm font-medium transition-colors ${category === c ? "text-[#4a6b4a]" : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Sorting Group (Right Aligned) */}
          <div className="flex items-center gap-2 bg-[#f8f9fa] p-1 rounded-md">
            <button
              onClick={() => setSort("popular")}
              className={`px-5 py-2 text-sm font-medium rounded transition-all ${sort === "popular"
                  ? "bg-white text-[#ee4d2d] shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
                }`}
            >
              Popular
            </button>

            <button
              onClick={() => setSort("latest")}
              className={`px-5 py-2 text-sm font-medium transition-all ${sort === "latest" ? "text-[#ee4d2d]" : "text-slate-500 hover:text-slate-800"
                }`}
            >
              Latest
            </button>

            <button
              onClick={() => setSort("top-sales")}
              className={`px-5 py-2 text-sm font-medium transition-all ${sort === "top-sales" ? "text-[#ee4d2d]" : "text-slate-500 hover:text-slate-800"
                }`}
            >
              Top Sales
            </button>

            {/* Price Dropdown (Matches Image 2) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 outline-none">
                  Price <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white rounded-sm shadow-lg border-slate-100 p-0">
                <DropdownMenuItem
                  onClick={() => setSort("price-low")}
                  className="px-4 py-3 text-sm text-slate-700 cursor-pointer hover:bg-slate-50 border-b border-slate-50 rounded-none"
                >
                  Price: Low to High
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSort("price-high")}
                  className="px-4 py-3 text-sm text-slate-700 cursor-pointer hover:bg-slate-50 rounded-none"
                >
                  Price: High to Low
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} />
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