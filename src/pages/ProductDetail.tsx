import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import BuyerLayout from "@/components/BuyerLayout";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, Minus, Plus, Image as ImageIcon, ShieldCheck, Leaf, Star, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRealTimeProducts } from "@/hooks/useRealTimeProducts";
import { AddedToCartToast } from "@/components/AddedToCartToast";
import ProductCard from "@/components/ProductCard";
import { ProductReviews } from "@/components/ProductReviews";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useRealTimeProducts();
  const product = products.find(p => p.id === id);

  // Get similar products
  const similarProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product, products]);

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const ratingAverage = product?.ratingAverage ?? 0;
  const ratingCount = product?.ratingCount ?? 0;
  const roundedRating = Math.round(ratingAverage);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!product || product.stock === 0) {
      toast.error("Out of stock");
      return;
    }

    setIsAdding(true);
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    toast.custom(() => <AddedToCartToast />, { duration: 1500 });

    setTimeout(() => {
      setIsAdding(false);
      setQuantity(1);
    }, 500);
  };

  const handleBuyNow = () => {
    if (product?.stock === 0) {
      toast.error("Out of stock");
      return;
    }
    if (product) {
      toast.success("Proceeding to checkout...");
      navigate("/checkout", {
        state: { checkoutItems: [{ product, quantity }] },
      });
    }
  };

  if (!product) {
    return (
      <BuyerLayout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl font-bold">Product Not Found</h1>
          <Link to="/products" className="mt-4 inline-block text-primary hover:underline">← Back to Products</Link>
        </div>
      </BuyerLayout>
    );
  }

  return (
    <BuyerLayout>
      <div className="container py-8 md:py-12">
        <Link to="/products" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>

        <div className="grid gap-8 lg:gap-12 md:grid-cols-2 items-start">
          {/* Product Image Section */}
          <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm p-4 md:p-8 flex items-center justify-center min-h-[400px] md:min-h-[500px]">
            {product.tag && (
              <Badge className="absolute top-4 left-4 text-sm px-3 py-1 shadow-md z-10" variant="secondary">
                {product.tag}
              </Badge>
            )}
            {imageError ? (
              <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                <ImageIcon className="h-16 w-16 opacity-20" />
                <span className="text-sm font-medium">Image unavailable</span>
              </div>
            ) : (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain max-h-[500px] animate-in fade-in zoom-in duration-500 hover:scale-105 transition-transform cursor-zoom-in"
                onError={() => setImageError(true)}
              />
            )}
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium uppercase tracking-wider">{product.category}</span>
                <span>•</span>
                <div className="flex items-center gap-1 transition-colors duration-300">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      className={`h-4 w-4 ${ratingCount > 0 && value <= roundedRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground/50"
                        }`}
                    />
                  ))}
                  {ratingCount > 0 ? (
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({ratingAverage.toFixed(1)} • {ratingCount})
                    </span>
                  ) : (
                    <span className="ml-1 text-xs text-muted-foreground">(No ratings yet)</span>
                  )}
                </div>
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
                {product.name}
              </h1>
            </div>

            <div className="flex items-end gap-4 pb-4 border-b">
              <p className="font-display text-4xl font-bold text-primary">₱{product.price.toLocaleString()}</p>
              <div className="flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </div>
            </div>

            <p className="leading-relaxed text-muted-foreground text-lg">
              {product.description}
            </p>

            {/* Selection & Actions */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Quantity</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border-2 border-input rounded-xl bg-background h-14 w-full sm:w-auto">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity === 1 || product.stock === 0}
                    className="h-full px-4 hover:bg-muted transition-colors rounded-l-lg disabled:opacity-50 text-muted-foreground hover:text-foreground"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="w-16 text-center font-display font-bold text-xl">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock || product.stock === 0}
                    className="h-full px-4 hover:bg-muted transition-colors rounded-r-lg disabled:opacity-50 text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 flex gap-3">
                  <Button
                    size="lg"
                    variant="outline"
                    className={`flex-1 h-14 text-lg border-2 border-primary text-primary hover:bg-primary/5 hover:text-primary transition-all duration-300 ${isAdding ? "scale-95 bg-primary/10" : ""}`}
                    disabled={product.stock === 0}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className={`mr-2 h-5 w-5 ${isAdding ? "animate-bounce" : ""}`} />
                    {isAdding ? "Added!" : "Add to Cart"}
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1 h-14 text-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white border-none"
                    disabled={product.stock === 0}
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="flex items-start gap-3 rounded-xl bg-secondary/10 p-4 transition-colors hover:bg-secondary/20">
                <div className="p-2 rounded-full bg-background text-secondary shadow-sm">
                  <Leaf className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">100% Authentic</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Sourced directly from verified local farmers.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-primary/10 p-4 transition-colors hover:bg-primary/20">
                <div className="p-2 rounded-full bg-background text-primary shadow-sm">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Secure Purchase</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Protected by our money-back guarantee.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 border-t pt-12">
          <ProductReviews productId={product.id} />
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="mt-20 border-t pt-12">
            <h2 className="font-display text-2xl font-bold mb-8">Similar Products You May Like</h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {similarProducts.map((p) => (
                <div key={p.id} className="h-full">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </BuyerLayout>
  );
};

export default ProductDetail;
