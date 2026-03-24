import { useState, useEffect, useMemo } from "react";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, type Firestore } from "firebase/firestore";
import type { Product } from "@/data/types";
import { normalizeImageSrc } from "@/lib/image";

export function useRealTimeProducts(firestore: Firestore = db) {
    const [rawProducts, setRawProducts] = useState<Product[]>([]);
    const [ratingsByProduct, setRatingsByProduct] = useState<
        Record<string, { average: number; count: number }>
    >({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen to all products in real-time
        const q = query(collection(firestore, "products"));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const prods = snapshot.docs.map((docSnap) => {
                    const data = docSnap.data() as Omit<Product, "id">;
                    return {
                        id: docSnap.id,
                        ...data,
                        image: normalizeImageSrc((data as any).image),
                    } as Product;
                });

                setRawProducts(prods);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [firestore]);

    useEffect(() => {
        const ratingsQuery = query(collection(firestore, "ratings"));

        const unsubscribe = onSnapshot(
            ratingsQuery,
            (snapshot) => {
                const stats: Record<string, { sum: number; count: number }> = {};

                snapshot.forEach((docSnap) => {
                    const data = docSnap.data() as { rating?: number; productId?: string };
                    const productId = data.productId;
                    const rating = Number(data.rating);

                    if (!productId || !Number.isFinite(rating) || rating < 1) return;

                    if (!stats[productId]) {
                        stats[productId] = { sum: 0, count: 0 };
                    }

                    stats[productId].sum += Math.min(5, rating);
                    stats[productId].count += 1;
                });

                const aggregated: Record<string, { average: number; count: number }> = {};
                Object.entries(stats).forEach(([productId, { sum, count }]) => {
                    aggregated[productId] = {
                        average: count > 0 ? sum / count : 0,
                        count,
                    };
                });

                setRatingsByProduct(aggregated);
            },
            (error) => {
                console.error("Error fetching product ratings:", error);
            }
        );

        return () => unsubscribe();
    }, [firestore]);

    const products = useMemo(
        () =>
            rawProducts.map((product) => ({
                ...product,
                ratingAverage:
                    ratingsByProduct[product.id]?.average ?? product.ratingAverage ?? 0,
                ratingCount:
                    ratingsByProduct[product.id]?.count ?? product.ratingCount ?? 0,
            })),
        [rawProducts, ratingsByProduct]
    );

    return { products, loading };
}
