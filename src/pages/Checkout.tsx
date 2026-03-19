import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BuyerLayout from "@/components/BuyerLayout";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { user, addTransaction } = useAuth();
  const navigate = useNavigate();
  const [payment, setPayment] = useState("cod");
  const [delivery, setDelivery] = useState("delivery");

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login to complete your purchase");
      navigate("/login");
      return;
    }
    addTransaction(items, payment, delivery);
    clearCart();
    toast.success("Order placed successfully!");
    navigate("/transactions");
  };

  const paymentOptions = [
    { value: "cod", label: "Cash on Delivery" },
    { value: "gcash", label: "GCash" },
    { value: "bank", label: "Bank Transfer" },
    { value: "card", label: "Credit/Debit Card" },
  ];

  const deliveryOptions = [
    { value: "delivery", label: "Home Delivery" },
    { value: "pickup", label: "Store Pickup" },
  ];

  return (
    <BuyerLayout>
      <div className="container py-12">
        <h1 className="font-display text-3xl font-bold">Checkout</h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            {/* Payment */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="font-display text-lg font-bold">Payment Method</h2>
              <div className="mt-4 space-y-3">
                {paymentOptions.map(opt => (
                  <label key={opt.value} className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors ${payment === opt.value ? "border-primary bg-primary/5" : "hover:bg-muted"}`}>
                    <input type="radio" name="payment" value={opt.value} checked={payment === opt.value} onChange={() => setPayment(opt.value)} className="accent-primary" />
                    <span className="text-sm font-medium">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Delivery */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="font-display text-lg font-bold">Delivery Method</h2>
              <div className="mt-4 space-y-3">
                {deliveryOptions.map(opt => (
                  <label key={opt.value} className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors ${delivery === opt.value ? "border-primary bg-primary/5" : "hover:bg-muted"}`}>
                    <input type="radio" name="delivery" value={opt.value} checked={delivery === opt.value} onChange={() => setDelivery(opt.value)} className="accent-primary" />
                    <span className="text-sm font-medium">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="font-display text-lg font-bold">Order Summary</h2>
            <div className="mt-4 space-y-3">
              {items.map(item => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <img src={item.product.image} alt={item.product.name} className="h-12 w-12 rounded object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold">₱{(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between font-display text-xl font-bold">
                <span>Total</span><span className="text-primary">₱{total.toLocaleString()}</span>
              </div>
            </div>
            <Button onClick={handleCheckout} className="mt-6 w-full font-display text-base font-semibold" size="lg">
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </BuyerLayout>
  );
};

export default Checkout;
