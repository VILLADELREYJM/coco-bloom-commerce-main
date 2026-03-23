import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Product } from "@/data/types";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Image as ImageIcon, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AddedToCartToast } from "@/components/AddedToCartToast";

const tagColors: Record<string, string> = {
  new: "bg-primary text-primary-foreground",
  trending: "bg-secondary text-secondary-foreground",
  bestseller: "bg-accent text-accent-foreground",
};

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const ratingCount = product.ratingCount ?? 0;
  const ratingAverage = product.ratingAverage ?? 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) return;

    setIsAdding(true);
    addToCart(product);
    toast.custom(() => <AddedToCartToast />, { duration: 1500 });

    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) {
      toast.error("Out of stock");
      return;
    }
    toast.success("Proceeding to checkout...");
    navigate("/checkout", {
      state: { checkoutItems: [{ product, quantity: 1 }] },
    });
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden bg-muted flex items-center justify-center">
          {imageError ? (
            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <ImageIcon className="h-8 w-8" />
              <span className="text-xs">Image unavailable</span>
            </div>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          )}
        </div>
      </Link>
      {product.tag && (
        <Badge className={`absolute left-2 top-2 shadow-sm text-[10px] px-1.5 py-0.5 md:left-3 md:top-3 md:text-xs md:px-2.5 md:py-0.5 ${tagColors[product.tag] || ""}`}>
          {product.tag === "bestseller" ? "Best Seller" : product.tag === "new" ? "New" : "Trending"}
        </Badge>
      )}
      <div className="p-3 md:p-4">
        <p className="text-[10px] md:text-xs font-medium uppercase tracking-wider text-muted-foreground">{product.category}</p>
        <Link to={`/products/${product.id}`}>
          <h3 className="mt-1 font-display text-xs md:text-sm font-semibold leading-tight line-clamp-2 hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        <p className="mt-1.5 md:mt-2 font-display text-sm md:text-lg font-bold text-primary">₱{product.price.toLocaleString()}</p>
        <div className="mt-1.5 flex items-center gap-1 text-[10px] md:text-xs text-muted-foreground transition-colors duration-300">
          <Star className={`h-3.5 w-3.5 ${ratingCount > 0 ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/60"}`} />
          {ratingCount > 0 ? (
            <span>
              {ratingAverage.toFixed(1)} ({ratingCount})
            </span>
          ) : (
            <span>No ratings yet</span>
          )}
        </div>
        <div className="mt-1.5 md:mt-2 flex items-center gap-2 md:gap-4 text-[10px] md:text-xs text-muted-foreground">
          <span>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></span>
            {product.sold || 0} sold
          </span>
        </div>
        <div className="mt-2 md:mt-3 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex-1 h-8 px-2 text-[10px] md:h-9 md:px-4 md:text-sm transition-all duration-300 ${isAdding ? "scale-95 bg-primary/10 border-primary text-primary" : ""}`}
          >
            <ShoppingCart className={`h-3 w-3 mr-1 ${isAdding ? "animate-bounce" : ""}`} />
            {isAdding ? "Added" : "Cart"}
          </Button>
          <Button
            size="sm"
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            className="flex-1 h-8 px-2 text-[10px] md:h-9 md:px-4 md:text-sm transition-transform active:scale-95"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
