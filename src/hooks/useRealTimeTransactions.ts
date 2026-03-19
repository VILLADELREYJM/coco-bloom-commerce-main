import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, Transaction as FirebaseTransaction } from "firebase/firestore";
import type { Transaction } from "@/data/types";
import { normalizeImageSrc } from "@/lib/image";

export function useRealTimeTransactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen to all transactions in real-time
        const q = query(collection(db, "transactions"));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const txs = snapshot.docs.map((docSnap) => {
                    const data = docSnap.data() as Omit<Transaction, "id">;
                    const items = (data.items || []).map((item) => ({
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
                    } as Transaction;
                });

                // Sort by date descending (newest first)
                setTransactions(txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching transactions:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { transactions, loading };
}
