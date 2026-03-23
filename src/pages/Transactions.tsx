import BuyerLayout from "@/components/BuyerLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Package,
  Settings,
  ShoppingCart,
  Star,
  Truck,
  XCircle,
} from "lucide-react";
import { normalizeImageSrc } from "@/lib/image";
import { useState } from "react";
import { RatingModal } from "@/components/RatingModal";
import type { Transaction } from "@/data/types";

const STATUS_FLOW: Array<Transaction["status"]> = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "completed",
];

const BUYER_STATUS_FILTERS = [
  "all",
  "pending",
  "processing",
  "shipped",
  "delivered",
  "completed",
] as const;

type BuyerStatusFilter = (typeof BUYER_STATUS_FILTERS)[number];

const STATUS_META: Record<
  Transaction["status"],
  { label: string; className: string; icon: typeof Clock }
> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-700",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    className: "bg-blue-100 text-blue-700",
    icon: Settings,
  },
  shipped: {
    label: "Shipped",
    className: "bg-orange-100 text-orange-700",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    className: "bg-green-100 text-green-700",
    icon: Package,
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700",
    icon: XCircle,
  },
};

const formatTimestamp = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getStatusTimestamp = (tx: Transaction, status: Transaction["status"]) => {
  const history = tx.statusHistory || [];
  const entry = history.find((item) => item.status === status);
  if (entry?.at) return entry.at;
  if (status === "pending") return tx.date;
  return null;
};

const Transactions = () => {
  const { user, transactions } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [ratingTransaction, setRatingTransaction] = useState<{
    id: string;
    index: number;
  } | null>(null);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<BuyerStatusFilter>("all");

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const selectedRatingTransaction = ratingTransaction
    ? sortedTransactions.find((tx) => tx.id === ratingTransaction.id)
    : null;
  const filteredTransactions =
    statusFilter === "all"
      ? sortedTransactions
      : sortedTransactions.filter((tx) => tx.status === statusFilter);

  if (!user) {
    return (
      <BuyerLayout>
        <div className="container flex min-h-[50vh] items-center justify-center py-16 text-center">
          <div>
            <h1 className="font-display text-2xl font-bold">Please Login</h1>
            <p className="mt-1 text-muted-foreground">
              You need to be logged in to view your transactions
            </p>
            <Link to="/login">
              <Button className="mt-4 font-display">Login</Button>
            </Link>
          </div>
        </div>
      </BuyerLayout>
    );
  }

  return (
    <BuyerLayout>
      <div className="bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container py-10 md:py-14">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                Orders
              </p>
              <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
                Transaction History
              </h1>
              <p className="mt-3 text-sm text-muted-foreground md:text-base">
                Review your recent purchases, track delivery progress, and quickly reorder anything you liked.
              </p>
            </div>
            <div className="rounded-2xl border bg-card px-4 py-3 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Total orders
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-foreground">
                {sortedTransactions.length}
              </p>
            </div>
          </div>

          {sortedTransactions.length === 0 ? (
            <div className="mt-16 rounded-3xl border bg-card px-6 py-14 text-center shadow-sm">
              <Package className="mx-auto h-16 w-16 text-muted-foreground/40" />
              <h2 className="mt-5 font-display text-2xl font-bold">No transactions yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Your completed orders will appear here. Start shopping to see a clean order history with tracking and reorder actions.
              </p>
              <Link to="/products">
                <Button className="mt-6 font-display">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="mb-4 flex flex-wrap gap-2">
                {BUYER_STATUS_FILTERS.map((filter) => (
                  <Button
                    key={filter}
                    variant={statusFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(filter)}
                    className={statusFilter === filter ? "bg-[#4a6b4a] hover:bg-[#3d5a3d]" : "bg-white"}
                  >
                    {filter === "all"
                      ? "All"
                      : filter.charAt(0).toUpperCase() + filter.slice(1)}
                    <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-900">
                      {filter === "all"
                        ? sortedTransactions.length
                        : sortedTransactions.filter((tx) => tx.status === filter).length}
                    </span>
                  </Button>
                ))}
              </div>

              {filteredTransactions.length === 0 ? (
                <div className="rounded-3xl border bg-card px-6 py-14 text-center shadow-sm">
                  <h2 className="font-display text-2xl font-bold">No {statusFilter} orders</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try another filter to view your other transactions.
                  </p>
                </div>
              ) : filteredTransactions.map((tx, index) => {
                const statusMeta = STATUS_META[tx.status];
                const StatusIcon = statusMeta.icon;
                const isTracking = trackingOrderId === tx.id;
                const flowStatuses =
                  tx.status === "cancelled"
                    ? (["pending", "cancelled"] as Array<Transaction["status"]>)
                    : STATUS_FLOW;
                const firstItem = tx.items[0];

                return (
                  <div
                    key={tx.id}
                    className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
                      <div className="bg-footer px-5 py-5 text-footer-foreground sm:px-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-footer-foreground/60">
                              Order #{index + 1}
                            </p>
                            <h2 className="mt-2 line-clamp-1 text-xl font-semibold sm:text-2xl">
                              {firstItem?.product.name}
                            </h2>
                            <p className="mt-1 text-sm text-footer-foreground/80">
                              {firstItem ? `${firstItem.quantity} item${firstItem.quantity > 1 ? "s" : ""}` : "Order details"}
                            </p>
                          </div>

                          <span
                            className={`inline-flex items-center gap-2 self-start rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.className}`}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {statusMeta.label}
                          </span>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-footer-foreground/80">
                          <span className="inline-flex items-center gap-2 rounded-full bg-footer-foreground/10 px-3 py-1">
                            <CalendarDays className="h-4 w-4" />
                            {new Date(tx.date).toLocaleDateString("en-PH", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <button
                            onClick={() =>
                              setTrackingOrderId(isTracking ? null : tx.id)
                            }
                            className="inline-flex items-center gap-2 rounded-full border border-footer-foreground/20 bg-footer-foreground/10 px-3 py-1 text-xs font-semibold text-footer-foreground transition-colors hover:bg-footer-foreground/20"
                            type="button"
                          >
                            {isTracking ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                            Track order
                          </button>
                        </div>

                        <div className="mt-6 rounded-2xl border border-footer-foreground/20 bg-footer-foreground/10 p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={normalizeImageSrc(firstItem?.product.image) || "/placeholder.svg"}
                              alt={firstItem?.product.name}
                              className="h-20 w-20 rounded-2xl object-cover ring-1 ring-footer-foreground/20"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg";
                              }}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-2 text-base font-medium text-footer-foreground sm:text-lg">
                                {firstItem?.product.name}
                              </p>
                              <p className="mt-1 text-sm text-footer-foreground/70">
                                ₱{firstItem?.product.price.toLocaleString()} each
                              </p>
                            </div>
                          </div>

                          {tx.items.length > 1 && (
                            <div className="mt-4 space-y-2 border-t border-footer-foreground/20 pt-4">
                              {tx.items.slice(1).map((item: any, idx: number) => (
                                <div
                                  key={`${tx.id}-${item.product.id}-${idx}`}
                                  className="flex items-center justify-between gap-3 text-sm text-footer-foreground/85"
                                >
                                  <span className="line-clamp-1">{item.product.name}</span>
                                  <span className="shrink-0">x{item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col justify-between gap-6 bg-card px-5 py-5 sm:px-6">
                        <div>
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                              Status timeline
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Tap to expand
                            </p>
                          </div>

                          {isTracking && (
                            <div className="mt-4 rounded-2xl border bg-muted/40 p-4">
                              <div className="space-y-3">
                                {flowStatuses.map((status, statusIndex) => {
                                  const meta = STATUS_META[status];
                                  const Icon = meta.icon;
                                  const isActive = tx.status === status;
                                  const isReached =
                                    tx.status !== "cancelled" &&
                                    STATUS_FLOW.indexOf(tx.status) >= statusIndex;
                                  const timestamp = getStatusTimestamp(tx, status);

                                  return (
                                    <div
                                      key={status}
                                      className="flex items-center justify-between gap-3 text-xs"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span
                                          className={`flex h-6 w-6 items-center justify-center rounded-full ${isActive
                                            ? meta.className
                                            : isReached
                                              ? "bg-primary/15 text-primary"
                                              : "bg-muted text-muted-foreground"
                                            }`}
                                        >
                                          <Icon className="h-3.5 w-3.5" />
                                        </span>
                                        <span
                                          className={
                                            isActive
                                              ? "font-semibold text-foreground"
                                              : "text-muted-foreground"
                                          }
                                        >
                                          {meta.label}
                                        </span>
                                      </div>
                                      <span className="text-muted-foreground">
                                        {formatTimestamp(timestamp)}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div className="rounded-2xl bg-muted/60 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                              Total amount
                            </p>
                            <p className="mt-2 font-display text-3xl font-bold text-foreground">
                              ₱{tx.total.toLocaleString()}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <button
                              onClick={() => {
                                tx.items.forEach((item: any) => {
                                  for (let i = 0; i < item.quantity; i++) {
                                    addToCart(item.product);
                                  }
                                });
                                navigate("/checkout");
                              }}
                              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                            >
                              <ShoppingCart className="h-4 w-4" />
                              Buy again
                            </button>
                            <button
                              onClick={() =>
                                setRatingTransaction({ id: tx.id, index: index + 1 })
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted/40"
                            >
                              <Star className="h-4 w-4" />
                              Rate products
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      {ratingTransaction && user && selectedRatingTransaction && (
        <RatingModal
          transaction={selectedRatingTransaction}
          orderRef={ratingTransaction.index}
          userId={user.id}
          onClose={() => setRatingTransaction(null)}
        />
      )}
    </BuyerLayout>
  );
};

export default Transactions;
