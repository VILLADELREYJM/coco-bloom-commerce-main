import { Link } from "react-router-dom";
import BuyerLayout from "@/components/BuyerLayout";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useState } from "react";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, total } = useCart();

  const [selected, setSelected] = useState<string[]>(items.map(i => i.product.id));

  const toggleItem = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectedTotal = items
    .filter(i => selected.includes(i.product.id))
    .reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <BuyerLayout>
        <div className="container flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
          <h1 className="mt-4 font-display text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-1 text-muted-foreground">Browse our products and add some items</p>
          <Link to="/products"><Button className="mt-6 font-display">Shop Now</Button></Link>
        </div>
      </BuyerLayout>
    );
  }

  return (
    <BuyerLayout>
      <div className="container py-12">
        <h1 className="font-display text-3xl font-bold">Shopping Cart</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">

          <div className="space-y-4 lg:col-span-2">

            {items.map(item => (
              <div key={item.product.id} className="flex gap-4 rounded-lg border bg-card p-4">

                {/* CHECKBOX ADDED */}
                <input
                  type="checkbox"
                  checked={selected.includes(item.product.id)}
                  onChange={() => toggleItem(item.product.id)}
                  className="mt-6 h-4 w-4"
                />

                <img src={item.product.image} alt={item.product.name} className="h-24 w-24 rounded-md object-cover" />

                <div className="flex flex-1 flex-col justify-between">

                  <div>
                    <h3 className="font-display font-semibold">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.product.category}</p>
                  </div>

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="rounded border p-1 hover:bg-muted">
                        <Minus className="h-3 w-3" />
                      </button>

                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>

                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="rounded border p-1 hover:bg-muted">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <span className="font-display font-bold text-primary">
                      ₱{(item.product.price * item.quantity).toLocaleString()}
                    </span>

                    <button onClick={() => removeFromCart(item.product.id)} className="p-1 text-destructive hover:text-destructive/80">
                      <Trash2 className="h-4 w-4" />
                    </button>

                  </div>

                </div>
              </div>
            ))}

          </div>

          <div className="rounded-lg border bg-card p-6">

            <h2 className="font-display text-lg font-bold">
              Order Summary
            </h2>

            <div className="mt-4 space-y-2 text-sm">

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Subtotal
                </span>

                <span>
                  ₱{selectedTotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Shipping
                </span>

                <span>
                  Calculated at checkout
                </span>
              </div>

            </div>

            <div className="mt-4 border-t pt-4">

              <div className="flex justify-between font-display text-lg font-bold">
                <span>
                  Total
                </span>

                <span className="text-primary">
                  ₱{selectedTotal.toLocaleString()}
                </span>
              </div>

            </div>

            <Link to="/checkout">
              <Button className="mt-6 w-full font-display font-semibold">
                Proceed to Checkout
              </Button>
            </Link>

          </div>

        </div>
      </div>
    </BuyerLayout>
  );
};

export default Cart;