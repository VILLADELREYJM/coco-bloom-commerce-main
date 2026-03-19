import { useMemo, useEffect, useState } from "react";
import SellerLayout from "@/components/SellerLayout";
import { products as defaultProducts } from "@/data/products";
import type { Transaction } from "@/data/types";
import { DollarSign, CalendarDays, Package, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRealTimeTransactions } from "@/hooks/useRealTimeTransactions";

function getInventory() {
  try {
    const s = localStorage.getItem("coircraft_inventory");
    return s ? JSON.parse(s) : defaultProducts;
  } catch { return defaultProducts; }
}

const SellerReports = () => {
  const { transactions, loading } = useRealTimeTransactions();
  const inventory = useMemo(getInventory, []);
  const [newOrderNotification, setNewOrderNotification] = useState<string | null>(null);

  useEffect(() => {
    if (transactions.length > 0 && !loading) {
      const latestTx = transactions[0];
      const totalItems = latestTx.items.reduce((sum, item) => sum + item.quantity, 0);
      setNewOrderNotification(`🔔 New order received! ${totalItems} items - ₱${latestTx.total.toLocaleString()}`);
      const timer = setTimeout(() => setNewOrderNotification(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [transactions.length, loading]);

  const now = new Date();
  const todaySales = transactions
    .filter(t => new Date(t.date).toDateString() === now.toDateString())
    .reduce((s, t) => s + t.total, 0);

  const monthSales = transactions
    .filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, t) => s + t.total, 0);

  const totalStock = inventory.reduce((s: number, p: any) => s + p.stock, 0);
  const lowStock = inventory.filter((p: any) => p.stock < 50);

  const cards = [
    { icon: DollarSign, label: "Today's Sales", value: `₱${todaySales.toLocaleString()}`, color: "text-primary" },
    { icon: CalendarDays, label: "Monthly Sales", value: `₱${monthSales.toLocaleString()}`, color: "text-secondary" },
    { icon: TrendingUp, label: "Total Transactions", value: String(transactions.length), color: "text-accent" },
    { icon: Package, label: "Total Stock", value: totalStock.toLocaleString(), color: "text-primary" },
  ];

  return (
    <SellerLayout>
      {newOrderNotification && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-300 bg-green-50 p-4">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <p className="text-sm font-medium text-green-700">{newOrderNotification}</p>
        </div>
      )}

      <h1 className="font-display text-2xl font-bold">Reports</h1>
      <p className="mt-1 text-sm text-muted-foreground">Real-time sales and inventory overview</p>

      {/* Value Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(c => (
          <div key={c.label} className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-muted p-2">
                <c.icon className={`h-5 w-5 ${c.color}`} />
              </div>
              <span className="text-sm text-muted-foreground">{c.label}</span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Inventory Report */}
      <div className="mt-8">
        <h2 className="font-display text-lg font-bold">Inventory Report</h2>
        <div className="mt-4 overflow-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Product</th>
                <th className="px-4 py-3 text-left font-medium">Category</th>
                <th className="px-4 py-3 text-right font-medium">Stock</th>
                <th className="px-4 py-3 text-right font-medium">Value</th>
                <th className="px-4 py-3 text-center font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((p: any) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                  <td className="px-4 py-3 text-right">{p.stock}</td>
                  <td className="px-4 py-3 text-right font-medium">₱{(p.price * p.stock).toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.stock < 50 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                      {p.stock < 50 ? "Low Stock" : "In Stock"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-lg font-bold"> Orders</h2>
          <div className="mt-4 space-y-4">
            {transactions.slice(0, 10).map(tx => (
              <div key={tx.id} className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">Order #{tx.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleString("en-PH")}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {tx.items.map(item => (
                        <span key={item.product.id} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                          {item.product.name.split("(")[0].trim()} ×{item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg font-bold text-primary">₱{tx.total.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">{tx.paymentMethod}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </SellerLayout>
  );
};

export default SellerReports;
