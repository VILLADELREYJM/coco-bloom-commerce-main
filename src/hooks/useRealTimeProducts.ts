import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import type { Product } from "@/data/types";

export function useRealTimeProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen to all products in real-time
        const q = query(collection(db, "products"));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const prods = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Product[];

                setProducts(prods);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return { products, loading };
}
