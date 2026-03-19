import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Product, CartItem } from "@/data/types";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_KEY = "coircraft_cart";

function getStored(): CartItem[] {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch { return []; }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(getStored);

  const persist = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem(CART_KEY, JSON.stringify(newItems));
  };

  const addToCart = useCallback((product: Product) => {
    const current = getStored();
    const existing = current.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += 1;
      persist([...current]);
    } else {
      persist([...current, { product, quantity: 1 }]);
    }
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    persist(getStored().filter(i => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    if (qty < 1) return removeFromCart(productId);
    const current = getStored();
    const item = current.find(i => i.product.id === productId);
    if (item) { item.quantity = qty; persist([...current]); }
  }, []);

  const clearCart = useCallback(() => persist([]), []);

  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
