import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, type Firestore } from "firebase/firestore";
import type { Transaction } from "@/data/types";
import { normalizeImageSrc } from "@/lib/image";

const TRANSACTIONS_CACHE_KEY = "seller_transactions_cache_v1";

export function useRealTimeTransactions(firestore: Firestore = db) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const cached = localStorage.getItem(TRANSACTIONS_CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached) as Transaction[];
                if (Array.isArray(parsed)) {
                    setTransactions(parsed);
                    setLoading(false);
                }
            }
        } catch {
            // Ignore cache parse errors and continue with live snapshot
        }

        // Listen to all transactions in real-time
        const q = query(collection(firestore, "transactions"));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const txs = snapshot.docs.map((docSnap) => {
                    const data = docSnap.data() as Omit<Transaction, "id">;
                    // Ensure items is an array before mapping
                    const rawItems = Array.isArray(data.items) ? data.items : [];

                    const items = rawItems.map((item) => ({
                        ...item,
                        product: {
                            ...item.product,
                            image: normalizeImageSrc((item.product as any)?.image),
                        },
                    }));

                    return {
                        id: docSnap.id,
                        ...data,
                        items,
                    };
                });

                // Sort by date descending (newest first)
                const sortedTxs = txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setTransactions(sortedTxs);
                try {
                    localStorage.setItem(TRANSACTIONS_CACHE_KEY, JSON.stringify(sortedTxs));
                } catch {
                    // Ignore write errors (private mode / storage limits)
                }
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching transactions:", error);
                setTransactions([]);
                try {
                    localStorage.removeItem(TRANSACTIONS_CACHE_KEY);
                } catch {
                    // Ignore storage errors
                }
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [firestore]);

    return { transactions, loading };
}
