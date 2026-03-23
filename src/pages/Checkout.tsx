import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BuyerLayout from "@/components/BuyerLayout";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { CartItem } from "@/data/types";

const Checkout = () => {
  const { items, removeFromCart, updateQuantity } = useCart();
  const { user, addTransaction } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("cod");
  const [delivery, setDelivery] = useState("delivery");
  const checkoutItems =
    ((location.state as { checkoutItems?: CartItem[] } | null)?.checkoutItems || items)
      .filter((item) => item?.product?.id && item.quantity > 0);
  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee = delivery === "delivery" ? 50 : 0;
  const grandTotal = subtotal + shippingFee;

  const steps = useMemo(
    () => ["Cart", "Shipping", "Payment", "Place Order"],
    []
  );

  useEffect(() => {
    if (checkoutItems.length === 0) {
      navigate("/cart");
    }
  }, [checkoutItems.length, navigate]);

  if (checkoutItems.length === 0) {
    return null;
  }

  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login to complete your purchase");
      navigate("/login");
      return;
    }
    addTransaction(checkoutItems, payment, delivery);

    checkoutItems.forEach((checkoutItem) => {
      const existingCartItem = items.find(
        (cartItem) => cartItem.product.id === checkoutItem.product.id
      );

      if (!existingCartItem) return;

      const remainingQty = existingCartItem.quantity - checkoutItem.quantity;

      if (remainingQty > 0) {
        updateQuantity(checkoutItem.product.id, remainingQty);
      } else {
        removeFromCart(checkoutItem.product.id);
      }
    });

    toast.success("Order placed successfully!");
    navigate("/transactions");
  };

  const handleNext = () => {
    if (step === 2) {
      if (!fullName.trim() || !phoneNumber.trim()) {
        toast.error("Please complete your full name and phone number");
        return;
      }

      if (delivery === "delivery" && !address.trim()) {
        toast.error("Please provide your shipping address");
        return;
      }
    }

    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
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
      <div className="bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container py-10 md:py-14">
          <h1 className="font-display text-3xl font-bold md:text-4xl">Checkout</h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Complete your order in four simple steps.
          </p>

          <div className="mt-6 rounded-2xl border bg-card p-4 md:p-6">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {steps.map((label, index) => {
                const current = index + 1;
                const active = step === current;
                const done = step > current;

                return (
                  <div
                    key={label}
                    className={`rounded-xl border px-3 py-3 text-center transition-colors ${active
                        ? "border-primary bg-primary/10"
                        : done
                          ? "border-primary/40 bg-primary/5"
                          : "border-border bg-muted/30"
                      }`}
                  >
                    <div
                      className={`mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${active || done
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                        }`}
                    >
                      {current}
                    </div>
                    <p className="text-xs font-semibold md:text-sm">{label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border bg-card p-5 md:p-6">
              {step === 1 && (
                <div>
                  <h2 className="font-display text-xl font-bold">Cart</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Review your selected items before shipping.
                  </p>

                  <div className="mt-5 space-y-3">
                    {checkoutItems.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center gap-3 rounded-lg border bg-muted/20 p-3"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-14 w-14 rounded-md object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 text-sm font-semibold">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-primary">
                          ₱{(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="font-display text-xl font-bold">Shipping</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Enter your shipping details and delivery preference.
                  </p>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-1">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Juan Dela Cruz"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="09XXXXXXXXX"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Shipping Address</Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street, Barangay, City, Province"
                        disabled={delivery === "pickup"}
                      />
                      {delivery === "pickup" && (
                        <p className="text-xs text-muted-foreground">
                          Address is optional for store pickup.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <Label>Delivery Method</Label>
                    {deliveryOptions.map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${delivery === opt.value
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/40"
                          }`}
                      >
                        <input
                          type="radio"
                          name="delivery"
                          value={opt.value}
                          checked={delivery === opt.value}
                          onChange={() => setDelivery(opt.value)}
                          className="accent-primary"
                        />
                        <span className="text-sm font-medium">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="font-display text-xl font-bold">Payment</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Choose your preferred payment method.
                  </p>

                  <div className="mt-5 space-y-3">
                    {paymentOptions.map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${payment === opt.value
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted/40"
                          }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={opt.value}
                          checked={payment === opt.value}
                          onChange={() => setPayment(opt.value)}
                          className="accent-primary"
                        />
                        <span className="text-sm font-medium">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="font-display text-xl font-bold">Place Order</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Confirm your details and complete your purchase.
                  </p>

                  <div className="mt-5 space-y-3 rounded-xl border bg-muted/20 p-4 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Customer</span>
                      <span className="font-medium">{fullName || "-"}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Phone</span>
                      <span className="font-medium">{phoneNumber || "-"}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="font-medium">
                        {deliveryOptions.find((opt) => opt.value === delivery)?.label}
                      </span>
                    </div>
                    {delivery === "delivery" && (
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">Address</span>
                        <span className="max-w-[60%] text-right font-medium">{address || "-"}</span>
                      </div>
                    )}
                    <div className="flex justify-between gap-4">
                      <span className="text-muted-foreground">Payment</span>
                      <span className="font-medium">
                        {paymentOptions.find((opt) => opt.value === payment)?.label}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="mt-5 w-full font-display text-base font-semibold"
                    size="lg"
                  >
                    Place Order
                  </Button>
                </div>
              )}

              <div className="mt-6 flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={step === 1}
                >
                  Back
                </Button>

                {step < 4 ? (
                  <Button type="button" onClick={handleNext}>
                    Continue
                  </Button>
                ) : (
                  <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                    Review from Cart
                  </Button>
                )}
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-5 md:p-6">
              <h2 className="font-display text-lg font-bold">Order Summary</h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Items</span>
                  <span>
                    {checkoutItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₱{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>
                    {shippingFee > 0 ? `₱${shippingFee.toLocaleString()}` : "Free"}
                  </span>
                </div>
              </div>

              <div className="mt-4 border-t pt-4">
                <div className="flex items-center justify-between font-display text-2xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">₱{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <p className="mt-4 text-xs text-muted-foreground">
                Step {step} of 4: {steps[step - 1]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </BuyerLayout>
  );
};

export default Checkout;
