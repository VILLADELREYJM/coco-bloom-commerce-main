import SellerLayout from "@/components/SellerLayout";
import { useMemo, useState } from "react";
import { useRealTimeUsers } from "@/hooks/useRealTimeUsers";
import { useRealTimeTransactions } from "@/hooks/useRealTimeTransactions";
import { sellerDb } from "@/lib/firebaseSeller";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Users, Mail, Phone, MapPin, Eye } from "lucide-react";
import type { Transaction } from "@/data/types";

const SellerUsers = () => {
    const { users, loading: usersLoading } = useRealTimeUsers(sellerDb);
    const { transactions, loading: txLoading } = useRealTimeTransactions(sellerDb);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);

    const registeredUsers = useMemo(() => {
        const txByUser = new Map<string, Transaction[]>();

        transactions.forEach((tx) => {
            if (!tx.userId) return;
            const existing = txByUser.get(tx.userId) ?? [];
            existing.push(tx);
            txByUser.set(tx.userId, existing);
        });

        return users.map((user) => {
            const userTx = [...(txByUser.get(user.id) ?? [])].sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            const orderCount = userTx.length;
            const totalSpent = userTx.reduce((sum, tx) => sum + (tx.total || 0), 0);

            return { ...user, orderCount, totalSpent, orders: userTx };
        });
    }, [users, transactions]);

    const loading = usersLoading || txLoading;

    return (
        <SellerLayout>
            <div className="space-y-6 pb-20 md:pb-0">
                <div>
                    <h1 className="font-display text-2xl font-bold text-slate-900">Customers & History</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Manage customers and view their order history.</p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="rounded-full bg-sky-50 p-3 text-sky-600">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Customers</p>
                            <p className="text-2xl font-bold text-slate-900">{registeredUsers.length}</p>
                        </div>
                    </div>
                </div>

                <Card className="border-none shadow-sm">
                    <CardHeader className="border-b border-slate-100 bg-white px-6 py-4">
                        <CardTitle className="text-base font-semibold text-slate-900">Registered Customers</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex h-40 items-center justify-center text-sm text-slate-500">Loading customer data...</div>
                        ) : registeredUsers.length === 0 ? (
                            <div className="flex h-40 items-center justify-center text-sm text-slate-500">
                                No registered customers found.
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                                        <TableHead className="w-[50px]"></TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Contact Info</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead className="text-right">Orders</TableHead>
                                        <TableHead className="text-right">Total Spent</TableHead>
                                        <TableHead className="text-center">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {registeredUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <Avatar className="h-10 w-10 border border-slate-100">
                                                    <AvatarImage src={user.image} className="object-cover" />
                                                    <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">
                                                        {user.name?.charAt(0) || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-semibold text-slate-900">{user.name}</p>
                                                <Badge variant="outline" className="mt-1 border-slate-200 text-[10px] uppercase text-slate-500 font-medium">
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-slate-500">
                                                <div className="flex flex-col gap-1 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                                                        {user.email}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                                                        {user.mobile || "No phone"}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate-500 max-w-[200px]" title={user.address}>
                                                <div className="flex items-start gap-2 text-sm line-clamp-2">
                                                    <MapPin className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
                                                    {user.address || "No address"}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">{user.orderCount}</TableCell>
                                            <TableCell className="text-right font-bold text-[#4a6b4a]">₱{user.totalSpent.toLocaleString()}</TableCell>
                                            <TableCell className="text-center">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSelectedUser(user)}
                                                    className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full"
                                                >
                                                    <Eye className="h-4 w-4 text-slate-500" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* User Order History Dialog */}
                <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
                    <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-slate-100">
                                    <AvatarImage src={selectedUser?.image} className="object-cover" />
                                    <AvatarFallback>{selectedUser?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-lg font-bold text-slate-900">{selectedUser?.name}</p>
                                    <p className="text-sm font-normal text-muted-foreground">Order History</p>
                                </div>
                            </DialogTitle>
                        </DialogHeader>

                        <div className="mt-4 space-y-4">
                            {!selectedUser?.orders?.length ? (
                                <div className="rounded-lg border border-dashed p-8 text-center text-slate-500">
                                    No orders found for this customer.
                                </div>
                            ) : (
                                selectedUser.orders.map((order: Transaction) => (
                                    <div key={order.id} className="rounded-lg border bg-card p-4 transition-all hover:bg-slate-50/50">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-mono text-sm font-bold">#{order.id.slice(0, 8).toUpperCase()}</span>
                                                    <Badge className={`capitalize ${order.status === "pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : order.status === "processing"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : order.status === "shipped"
                                                                ? "bg-orange-100 text-orange-700"
                                                                : order.status === "delivered"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : order.status === "completed"
                                                                        ? "bg-emerald-100 text-emerald-700"
                                                                        : "bg-red-100 text-red-700"
                                                        }`}>
                                                        {order.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(order.date).toLocaleString()}
                                                </p>

                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 bg-white border rounded-full px-2 py-1">
                                                            <img
                                                                src={(item.product as any).image || "/placeholder.svg"}
                                                                alt=""
                                                                className="h-5 w-5 rounded-full object-cover"
                                                                onError={(e) => e.currentTarget.src = "/placeholder.svg"}
                                                            />
                                                            <span className="text-xs font-medium text-slate-700">
                                                                {item.product.name} ×{item.quantity}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-[#4a6b4a]">₱{order.total?.toLocaleString()}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{order.items.length} items</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </SellerLayout>
    );
};

export default SellerUsers;
