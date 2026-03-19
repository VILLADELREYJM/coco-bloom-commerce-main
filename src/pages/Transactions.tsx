import BuyerLayout from "@/components/BuyerLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { normalizeImageSrc } from "@/lib/image";

const Transactions = () => {
  const { user, transactions } = useAuth();

  if (!user) {
    return (
      <BuyerLayout>
        <div className="container flex min-h-[50vh] items-center justify-center py-16 text-center">
          <div>
            <h1 className="font-display text-2xl font-bold">Please Login</h1>
            <p className="mt-1 text-muted-foreground">You need to be logged in to view your transactions</p>
            <Link to="/login"><Button className="mt-4 font-display">Login</Button></Link>
          </div>
        </div>
      </BuyerLayout>
    );
  }

  return (
    <BuyerLayout>
      <div className="container py-12">
        <h1 className="font-display text-3xl font-bold">Transaction History</h1>
        <p className="mt-1 text-muted-foreground">View your past orders</p>

        {transactions.length === 0 ? (
          <div className="mt-16 text-center">
            <Package className="mx-auto h-16 w-16 text-muted-foreground/40" />
            <p className="mt-4 text-muted-foreground">No transactions yet</p>
            <Link to="/products"><Button className="mt-4 font-display">Start Shopping</Button></Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {transactions.map(tx => (
              <div key={tx.id} className="rounded-lg border bg-card p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Order #{tx.id.slice(0, 8).toUpperCase()}</p>
                    <p className="mt-1 text-sm font-medium">{new Date(tx.date).toLocaleDateString("en-PH", { dateStyle: "long" })}</p>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary capitalize">{tx.status}</span>
                    <p className="mt-1 font-display text-lg font-bold text-primary">₱{tx.total.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {tx.items.map(item => (
                    <div key={item.product.id} className="flex items-center gap-3 text-sm">
                      <img
                        src={normalizeImageSrc(item.product.image) || "/placeholder.svg"}
                        alt={item.product.name}
                        className="h-10 w-10 rounded object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                      <span className="flex-1">{item.product.name}</span>
                      <span className="text-muted-foreground">x{item.quantity}</span>
                      <span className="font-medium">₱{(item.product.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                  <span>Payment: {tx.paymentMethod.toUpperCase()}</span>
                  <span>Delivery: {tx.deliveryMethod === "delivery" ? "Home Delivery" : "Store Pickup"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BuyerLayout>
  );
};

export default Transactions;
