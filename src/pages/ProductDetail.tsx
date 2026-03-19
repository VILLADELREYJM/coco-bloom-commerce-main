import { useParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import BuyerLayout from "@/components/BuyerLayout";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, Minus, Plus, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRealTimeProducts } from "@/hooks/useRealTimeProducts";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading } = useRealTimeProducts();
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

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
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`Added ${quantity} item${quantity > 1 ? "s" : ""} to cart!`);
    setQuantity(1);
  };

  const handleBuyNow = () => {
    if (product?.stock === 0) {
      toast.error("Out of stock");
      return;
    }
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      toast.success(`Added ${quantity} item${quantity > 1 ? "s" : ""} to cart! Proceeding to checkout...`);
      setTimeout(() => navigate("/checkout"), 500);
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
      <div className="container py-12">
        <Link to="/products" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="overflow-hidden rounded-lg border bg-muted flex items-center justify-center min-h-96">
            {imageError ? (
              <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <ImageIcon className="h-12 w-12" />
                <span className="text-sm">Image unavailable</span>
              </div>
            ) : (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={() => setImageError(true)}
              />
            )}
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{product.category}</span>
              {product.tag && <Badge variant="secondary">{product.tag}</Badge>}
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold">{product.name}</h1>
            <p className="mt-4 leading-relaxed text-muted-foreground">{product.description}</p>
            <p className="mt-6 font-display text-3xl font-bold text-primary">₱{product.price.toLocaleString()}</p>
            <p className="mt-1 text-sm text-muted-foreground">{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>

            {/* Quantity Selector */}
            <div className="mt-6">
              <p className="text-sm font-medium mb-2">Quantity</p>
              <div className="flex items-center gap-3 border rounded-lg w-fit p-2">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity === 1 || product.stock === 0}
                  className="p-1 hover:bg-muted rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock || product.stock === 0}
                  className="p-1 hover:bg-muted rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-3">
              <Button
                size="lg"
                variant="outline"
                className="flex-1 font-display font-semibold h-12"
                disabled={product.stock === 0}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
              <Button
                size="lg"
                className="flex-1 font-display font-semibold h-12 bg-red-500 hover:bg-red-600"
                disabled={product.stock === 0}
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </BuyerLayout>
  );
};

export default ProductDetail;
