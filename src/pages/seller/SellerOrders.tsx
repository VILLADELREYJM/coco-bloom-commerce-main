import { useEffect, useMemo, useRef, useState } from "react";
import SellerLayout from "@/components/SellerLayout";
import { useRealTimeTransactions } from "@/hooks/useRealTimeTransactions";
import { useRealTimeUsers } from "@/hooks/useRealTimeUsers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { sellerAuth, sellerDb } from "@/lib/firebaseSeller";
import { doc, getDoc, updateDoc, writeBatch } from "firebase/firestore";
import {
    CalendarDays,
    CreditCard,
    Eye,
    MapPin,
    Mail,
    Package,
    Phone,
    User as UserIcon,
} from "lucide-react";
import type { Transaction } from "@/data/types";
import { toast } from "sonner";

const statusOptions: Array<Transaction["status"] | "all"> = [
    "all",
    "pending",
    "processing",
    "shipped",
    "delivered",
    "completed",
    "cancelled",
];

const STATUS_BADGE: Record<Transaction["status"], string> = {
    pending: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    processing: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    shipped: "bg-orange-100 text-orange-700 hover:bg-orange-100",
    delivered: "bg-green-100 text-green-700 hover:bg-green-100",
    completed: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    cancelled: "bg-red-100 text-red-700 hover:bg-red-100",
};

const ALLOWED_TRANSITIONS: Record<Transaction["status"], Transaction["status"][]> = {
    pending: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: ["completed"],
    completed: [],
    cancelled: [],
};

const SellerOrders = () => {
    const { transactions, loading } = useRealTimeTransactions(sellerDb);
    const { users } = useRealTimeUsers(sellerDb);
    const [filter, setFilter] = useState<Transaction["status"] | "all">("all");
    const [selectedOrder, setSelectedOrder] = useState<Transaction | null>(null);
    const hasInitializedLiveFeedRef = useRef(false);
    const knownOrderIdsRef = useRef<Set<string>>(new Set());

    const filteredOrders = useMemo(() => {
        return filter === "all" ? transactions : transactions.filter((tx) => tx.status === filter);
    }, [transactions, filter]);

    const getCustomer = (userId?: string) => {
        return userId ? users.find((user) => user.id === userId) : undefined;
    };

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return "Invalid Date";
        }
    };

    useEffect(() => {
        if (loading) return;

        const currentIds = new Set(transactions.map((tx) => tx.id));

        if (!hasInitializedLiveFeedRef.current) {
            hasInitializedLiveFeedRef.current = true;
            knownOrderIdsRef.current = currentIds;
            return;
        }

        const newOrders = transactions.filter((tx) => !knownOrderIdsRef.current.has(tx.id));

        if (newOrders.length > 0) {
            const latest = [...newOrders].sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )[0];

            toast.success(
                newOrders.length === 1 ? "New order received" : `${newOrders.length} new orders received`,
                {
                    description: latest
                        ? `Latest: #${latest.id.slice(0, 8).toUpperCase()} • ₱${(latest.total || 0).toLocaleString()}`
                        : undefined,
                }
            );
        }

        knownOrderIdsRef.current = currentIds;
    }, [transactions, loading]);

    const restoreInventoryForOrder = async (order: Transaction) => {
        const batch = writeBatch(sellerDb);

        for (const item of order.items || []) {
            const productId = item.product?.id;
            const quantity = item.quantity || 0;
            if (!productId || quantity <= 0) continue;

            const productRef = doc(sellerDb, "products", productId);
            const productSnap = await getDoc(productRef);
            if (!productSnap.exists()) continue;

            const data = productSnap.data();
            const currentStock = data.stock || 0;
            const currentSold = data.sold || 0;

            batch.update(productRef, {
                stock: currentStock + quantity,
                sold: Math.max(0, currentSold - quantity),
            });
        }

        await batch.commit();
    };

    const updateOrderStatus = async (order: Transaction, nextStatus: Transaction["status"]) => {
        try {
            if (!sellerAuth.currentUser) {
                toast.error("Seller is not authenticated in Firebase. Please sign in with Firebase account.");
                return;
            }

            const allowedNext = ALLOWED_TRANSITIONS[order.status] || [];
            if (!allowedNext.includes(nextStatus)) {
                toast.error(`Invalid transition: ${order.status} → ${nextStatus}`);
                return;
            }

            const orderRef = doc(sellerDb, "transactions", order.id);
            const nextHistory = [
                ...(order.statusHistory || []),
                { status: nextStatus, at: new Date().toISOString() },
            ];

            await updateDoc(orderRef, {
                status: nextStatus,
                statusHistory: nextHistory,
            });

            setSelectedOrder((prev) =>
                prev ? { ...prev, status: nextStatus, statusHistory: nextHistory } : prev
            );

            if (nextStatus === "cancelled") {
                try {
                    await restoreInventoryForOrder(order);
                } catch (inventoryError) {
                    console.error("Order cancelled but failed to restore inventory:", inventoryError);
                    toast.warning("Order cancelled, but inventory restore failed. Please check stock manually.");
                    return;
                }
            }

            toast.success(`Order updated to ${nextStatus}`);
        } catch (error) {
            console.error("Failed to update order status:", error);
            const code = typeof error === "object" && error && "code" in error
                ? String((error as { code?: string }).code)
                : "";

            if (code === "permission-denied") {
                toast.error("Permission denied by Firestore rules. Check seller read/update rules.");
                return;
            }

            toast.error("Failed to update order status");
        }
    };

    return (
        <SellerLayout>
            <div className="space-y-6 pb-20 md:pb-0">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="font-display text-2xl font-bold text-slate-900">Orders</h1>
                        <p className="mt-1 text-sm text-muted-foreground">Manage and track your customer orders.</p>
                    </div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
                    {statusOptions.map((option) => (
                        <Button
                            key={option}
                            variant={filter === option ? "default" : "outline"}
                            onClick={() => setFilter(option)}
                            className={`${filter === option ? "bg-[#4a6b4a] hover:bg-[#3d5a3d]" : "bg-white"} flex-shrink-0 h-8 text-xs`}
                            size="sm"
                        >
                            {option === "all" ? "All" : option.charAt(0).toUpperCase() + option.slice(1)}
                            <Badge variant="secondary" className="ml-2 bg-slate-100 text-slate-900 px-1.5 py-0 h-5 min-w-[1.25rem] flex items-center justify-center">
                                {option === "all" ? transactions.length : transactions.filter((tx) => tx.status === option).length}
                            </Badge>
                        </Button>
                    ))}
                </div>

                <Card className="border-none shadow-sm">
                    <CardHeader className="border-b border-slate-100 bg-white px-6 py-4">
                        <CardTitle className="text-base font-semibold text-slate-900">Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex h-40 items-center justify-center text-sm text-slate-500">Loading orders...</div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="flex h-40 items-center justify-center text-sm text-slate-500">
                                No orders found for this filter.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table className="min-w-[600px] md:min-w-full">
                                    <TableHeader>
                                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                                            <TableHead className="w-[80px] md:w-[100px] px-2 md:px-4 text-xs md:text-sm">Order ID</TableHead>
                                            <TableHead className="hidden md:table-cell text-xs md:text-sm">Date</TableHead>
                                            <TableHead className="px-2 md:px-4 text-xs md:text-sm">Customer</TableHead>
                                            <TableHead className="px-2 md:px-4 text-xs md:text-sm">Status</TableHead>
                                            <TableHead className="px-2 md:px-4 text-xs md:text-sm">Total</TableHead>
                                            <TableHead className="text-right px-2 md:px-4 text-xs md:text-sm">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredOrders.map((tx) => {
                                            const customer = getCustomer(tx.userId);
                                            return (
                                                <TableRow key={tx.id}>
                                                    <TableCell className="font-mono font-medium text-slate-900 px-2 md:px-4 text-xs md:text-sm whitespace-nowrap">
                                                        #{tx.id.slice(0, 8).toUpperCase()}
                                                    </TableCell>
                                                    <TableCell className="text-slate-500 hidden md:table-cell text-xs md:text-sm whitespace-nowrap">
                                                        {formatDate(tx.date)}
                                                    </TableCell>
                                                    <TableCell className="px-2 md:px-4">
                                                        <div className="flex items-center gap-1.5 md:gap-2">
                                                            {customer?.image ? (
                                                                <img
                                                                    src={customer.image}
                                                                    alt={customer.name}
                                                                    className="h-5 w-5 md:h-6 md:w-6 rounded-full object-cover flex-shrink-0"
                                                                />
                                                            ) : (
                                                                <div className="flex h-5 w-5 md:h-6 md:w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] md:text-xs font-bold text-slate-500">
                                                                    {customer?.name?.[0] || "?"}
                                                                </div>
                                                            )}
                                                            <span className="font-medium text-slate-900 text-xs md:text-sm truncate max-w-[80px] md:max-w-none block">
                                                                {customer?.name || "Guest"}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-2 md:px-4">
                                                        <Badge
                                                            className={`pointer-events-none capitalize px-1.5 py-0 md:px-2.5 md:py-0.5 text-[10px] md:text-xs whitespace-nowrap ${STATUS_BADGE[tx.status]}`}
                                                        >
                                                            {tx.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="font-bold text-[#4a6b4a] px-2 md:px-4 text-xs md:text-sm whitespace-nowrap">
                                                        ₱{tx.total?.toLocaleString() || "0"}
                                                    </TableCell>
                                                    <TableCell className="text-right px-2 md:px-4">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setSelectedOrder(tx)}
                                                            className="h-7 w-7 md:h-8 md:w-8 p-0"
                                                        >
                                                            <Eye className="h-3.5 w-3.5 md:h-4 md:w-4 text-slate-500" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                    <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
                        {selectedOrder && (
                            <>
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2 text-xl">
                                        Order Details <Badge variant="outline">#{selectedOrder.id.slice(0, 8).toUpperCase()}</Badge>
                                    </DialogTitle>
                                </DialogHeader>

                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Customer Information */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                            <UserIcon className="h-4 w-4 text-[#4a6b4a]" /> Customer Information
                                        </h3>
                                        <Card className="border shadow-none bg-slate-50/50">
                                            <CardContent className="p-4 space-y-3">
                                                {(() => {
                                                    const customer = getCustomer(selectedOrder.userId);
                                                    return (
                                                        <>
                                                            <div className="flex items-center gap-3">
                                                                {customer?.image ? (
                                                                    <img src={customer.image} alt={customer.name} className="h-10 w-10 rounded-full object-cover" />
                                                                ) : (
                                                                    <div className="bg-slate-200 h-10 w-10 rounded-full flex items-center justify-center text-slate-500 font-bold">
                                                                        {customer?.name?.[0] || "?"}
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <p className="font-semibold text-slate-900">{customer?.name || "Guest Checkout"}</p>
                                                                    <p className="text-xs text-slate-500">ID: {selectedOrder.userId || "N/A"}</p>
                                                                </div>
                                                            </div>
                                                            <Separator className="bg-slate-200" />
                                                            <div className="grid gap-2 text-sm">
                                                                <div className="flex items-center gap-2 text-slate-600">
                                                                    <Mail className="h-3.5 w-3.5" />
                                                                    <span>{customer?.email || "No email provided"}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-slate-600">
                                                                    <Phone className="h-3.5 w-3.5" />
                                                                    <span>{customer?.mobile || "No phone number"}</span>
                                                                </div>
                                                                <div className="flex items-start gap-2 text-slate-600">
                                                                    <MapPin className="h-3.5 w-3.5 mt-0.5" />
                                                                    <span>{customer?.address || "No address on file"}</span>
                                                                </div>
                                                            </div>
                                                        </>
                                                    );
                                                })()}
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Order Summary & Payment */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                            <CreditCard className="h-4 w-4 text-[#4a6b4a]" /> Order Info
                                        </h3>
                                        <Card className="border shadow-none bg-slate-50/50">
                                            <CardContent className="p-4 grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs font-medium text-slate-500 uppercase">Order Date</p>
                                                    <p className="text-sm font-semibold text-slate-900 mt-1 flex items-center gap-1">
                                                        <CalendarDays className="h-3.5 w-3.5" />
                                                        {formatDate(selectedOrder.date)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-slate-500 uppercase">Status</p>
                                                    <Badge className={`mt-1 capitalize ${STATUS_BADGE[selectedOrder.status]}`}>
                                                        {selectedOrder.status}
                                                    </Badge>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-slate-500 uppercase">Payment Method</p>
                                                    <p className="text-sm font-semibold text-slate-900 mt-1">{selectedOrder.paymentMethod}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-slate-500 uppercase">Delivery Method</p>
                                                    <p className="text-sm font-semibold text-slate-900 mt-1">{selectedOrder.deliveryMethod}</p>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {selectedOrder.status !== "completed" && selectedOrder.status !== "cancelled" && (
                                            <div className="rounded-lg border bg-white p-4">
                                                <p className="text-xs font-semibold uppercase text-slate-500">Update Status</p>
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {selectedOrder.status === "pending" && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => updateOrderStatus(selectedOrder, "processing")}
                                                                className="bg-blue-600 hover:bg-blue-700"
                                                            >
                                                                Accept Order
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => updateOrderStatus(selectedOrder, "cancelled")}
                                                                className="border-red-200 text-red-700 hover:bg-red-50"
                                                            >
                                                                Cancel Order
                                                            </Button>
                                                        </>
                                                    )}

                                                    {selectedOrder.status === "processing" && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => updateOrderStatus(selectedOrder, "shipped")}
                                                                className="bg-orange-600 hover:bg-orange-700"
                                                            >
                                                                Mark Shipped
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => updateOrderStatus(selectedOrder, "cancelled")}
                                                                className="border-red-200 text-red-700 hover:bg-red-50"
                                                            >
                                                                Cancel Order
                                                            </Button>
                                                        </>
                                                    )}

                                                    {selectedOrder.status === "shipped" && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => updateOrderStatus(selectedOrder, "delivered")}
                                                            className="bg-green-600 hover:bg-green-700"
                                                        >
                                                            Mark Delivered
                                                        </Button>
                                                    )}

                                                    {selectedOrder.status === "delivered" && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => updateOrderStatus(selectedOrder, "completed")}
                                                            className="bg-emerald-600 hover:bg-emerald-700"
                                                        >
                                                            Mark Completed
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Order Items Table */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                        <Package className="h-4 w-4 text-[#4a6b4a]" /> Order Items
                                    </h3>
                                    <div className="rounded-lg border border-slate-200 overflow-hidden">
                                        <Table>
                                            <TableHeader className="bg-slate-50">
                                                <TableRow>
                                                    <TableHead className="w-[50px]"></TableHead>
                                                    <TableHead>Product</TableHead>
                                                    <TableHead className="text-right">Price</TableHead>
                                                    <TableHead className="text-right">Qty</TableHead>
                                                    <TableHead className="text-right">Total</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {selectedOrder.items.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            <div className="h-10 w-10 rounded-md bg-slate-100 overflow-hidden">
                                                                <img src={item.product?.image || "/placeholder.svg"} alt={item.product?.name || "Unknown Product"} className="h-full w-full object-cover" />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <p className="font-medium text-slate-900">{item.product?.name || "Unknown Product"}</p>
                                                            <p className="text-xs text-slate-500 line-clamp-1">{item.product?.description || ""}</p>
                                                        </TableCell>
                                                        <TableCell className="text-right">₱{(item.product?.price || 0).toLocaleString()}</TableCell>
                                                        <TableCell className="text-right">x{item.quantity || 1}</TableCell>
                                                        <TableCell className="text-right font-semibold">₱{((item.product?.price || 0) * (item.quantity || 1)).toLocaleString()}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t border-slate-100">
                                    <div className="w-full md:w-1/3 bg-slate-50 p-4 rounded-xl space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Subtotal</span>
                                            <span className="font-medium">₱{selectedOrder.total.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500">Shipping</span>
                                            <span className="font-medium">Free</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between items-center text-lg font-bold text-[#4a6b4a]">
                                            <span>Total</span>
                                            <span>₱{selectedOrder.total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </SellerLayout>
    );
};

export default SellerOrders;
