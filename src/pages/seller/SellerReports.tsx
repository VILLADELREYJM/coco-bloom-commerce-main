import { useMemo, useEffect, useState } from "react";
import SellerLayout from "@/components/SellerLayout";
import { useRealTimeTransactions } from "@/hooks/useRealTimeTransactions";
import { useRealTimeUsers } from "@/hooks/useRealTimeUsers";
import { useRealTimeProducts } from "@/hooks/useRealTimeProducts";
import {
  DollarSign,
  CalendarDays,
  Package,
  TrendingUp,
  Users,
  ShoppingBag,
  BadgeAlert,
  BarChart3,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const SellerReports = () => {
  const { transactions, loading: txLoading } = useRealTimeTransactions();
  const { users, loading: usersLoading } = useRealTimeUsers();
  const { products, loading: productsLoading } = useRealTimeProducts();

  const [newOrderNotification, setNewOrderNotification] = useState<string | null>(null);

  useEffect(() => {
    if (transactions.length > 0 && !txLoading) {
      const latestTx = transactions[0];
      // Simple check to show notification only if the transaction is very recent (e.g. within last 10 seconds) could be added here
      // For now, we keep the existing logic but just ensure it doesn't spam on reload
    }
  }, [transactions.length, txLoading]);

  // --- Metrics Calculations ---

  // 1. Users/Customers
  const totalRegisteredUsers = users.length;
  const customers = users.filter((user) => user.role !== "seller");
  const totalCustomers = customers.length;

  // 2. Sales & Orders
  // Filter out cancelled orders for revenue calculations to ensure accuracy
  const validTransactions = transactions.filter(tx => tx.status !== 'cancelled');

  const totalOrders = transactions.length; // Keep total count of all attempts
  const totalSales = validTransactions.reduce((sum, tx) => sum + (tx.total || 0), 0);

  const now = new Date();
  const todaySales = validTransactions
    .filter(t => new Date(t.date).toDateString() === now.toDateString())
    .reduce((s, t) => s + (t.total || 0), 0);

  const monthSales = validTransactions
    .filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, t) => s + (t.total || 0), 0);

  // 3. Inventory
  const totalStock = products.reduce((sum, item) => sum + (item.stock || 0), 0);
  const lowStockItems = products.filter((item) => (item.stock || 0) < 20);
  const outOfStockItems = products.filter((item) => (item.stock || 0) === 0);
  const totalInventoryValue = products.reduce((sum, item) => sum + ((item.price || 0) * (item.stock || 0)), 0);

  const mainStats = [
    {
      label: "Registered Users",
      value: totalRegisteredUsers.toLocaleString(),
      icon: Users,
      color: "text-sky-600",
      bg: "bg-sky-50",
      desc: `Buyers: ${totalCustomers.toLocaleString()}`
    },
    {
      label: "Total Revenue",
      value: `₱${totalSales.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      desc: "Lifetime earnings"
    },
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString(),
      icon: ShoppingBag,
      color: "text-violet-600",
      bg: "bg-violet-50",
      desc: "All time orders"
    },
    {
      label: "Total Stock",
      value: totalStock.toLocaleString(),
      icon: Package,
      color: "text-amber-600",
      bg: "bg-amber-50",
      desc: "Items across all products"
    },
  ];

  const salesStats = [
    {
      label: "Today's Sales",
      value: `₱${todaySales.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-blue-600"
    },
    {
      label: "This Month",
      value: `₱${monthSales.toLocaleString()}`,
      icon: CalendarDays,
      color: "text-purple-600"
    },
  ];

  const isLoading = txLoading || usersLoading || productsLoading;

  return (
    <SellerLayout>
      <div className="space-y-8 pb-20">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Analytics & Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Comprehensive view of your business performance and inventory health.
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {mainStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">{isLoading ? "..." : stat.value}</h3>
                  <p className="mt-1 text-xs text-slate-400">{stat.desc}</p>
                </div>
                <div className={`rounded-xl ${stat.bg} p-3 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Sales Performance Card */}
          <Card className="border-none shadow-sm lg:col-span-2">
            <CardHeader className="border-b border-slate-50 bg-white pb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-slate-500" />
                <CardTitle className="text-base font-bold text-slate-900">Sales Performance</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {salesStats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                    <div className="rounded-full bg-white p-3 shadow-sm ring-1 ring-slate-200">
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{stat.label}</p>
                      <p className="mt-1 text-xl font-bold text-slate-900">{isLoading ? "..." : stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-[#4a6b4a]/5 p-5 border border-[#4a6b4a]/10">
                <div className="flex items-center gap-2 text-[#4a6b4a] mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-bold text-sm">Revenue Insight</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  You have generated <span className="font-bold text-slate-900">₱{totalSales.toLocaleString()}</span> in total revenue from <span className="font-bold text-slate-900">{totalOrders}</span> orders.
                  Keep tracking your top-selling products to optimize inventory.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Health Card */}
          <Card className="border-none shadow-sm h-full">
            <CardHeader className="border-b border-slate-50 bg-white pb-4">
              <div className="flex items-center gap-2">
                <BadgeAlert className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-base font-bold text-slate-900">Inventory Health</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-500 font-medium">Total Inventory Value</span>
                  <span className="font-bold text-slate-900">₱{totalInventoryValue.toLocaleString()}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-slate-400 w-full rounded-full" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-red-100 bg-red-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-red-200" />
                    <span className="text-sm font-medium text-red-900">Out of Stock</span>
                  </div>
                  <span className="font-bold text-red-700">{outOfStockItems.length}</span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-amber-200" />
                    <span className="text-sm font-medium text-amber-900">Low Stock (&lt;20)</span>
                  </div>
                  <span className="font-bold text-amber-700">{lowStockItems.length}</span>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
                    <span className="text-sm font-medium text-slate-700">Total Products</span>
                  </div>
                  <span className="font-bold text-slate-900">{products.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SellerLayout>
  );
};

export default SellerReports;
