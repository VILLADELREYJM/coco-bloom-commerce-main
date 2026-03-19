import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { Product } from "@/data/types";
import { useCart } from "@/contexts/CartContext";
import { ShoppingCart, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const tagColors: Record<string, string> = {
  new: "bg-primary text-primary-foreground",
  trending: "bg-secondary text-secondary-foreground",
  bestseller: "bg-accent text-accent-foreground",
};

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleBuyNow = () => {
    if (product.stock === 0) {
      toast.error("Out of stock");
      return;
    }
    addToCart(product);
    toast.success("Added to cart! Proceeding to checkout...");
    setTimeout(() => navigate("/checkout"), 500);
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md">
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
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          )}
        </div>
      </Link>
      {product.tag && (
        <Badge className={`absolute left-3 top-3 ${tagColors[product.tag] || ""}`}>
          {product.tag === "bestseller" ? "Best Seller" : product.tag === "new" ? "New" : "Trending"}
        </Badge>
      )}
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{product.category}</p>
        <h3 className="mt-1 font-display text-sm font-semibold leading-tight">{product.name}</h3>
        <p className="mt-2 font-display text-lg font-bold text-primary">₱{product.price.toLocaleString()}</p>
        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
          <span>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
            {product.sold || 0} sold
          </span>
        </div>
        <div className="mt-3 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className="flex-1"
          >
            <ShoppingCart className="h-3 w-3 mr-1" /> Cart
          </Button>
          <Button
            size="sm"
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            className="flex-1"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
