import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import type { Product } from "@/data/types";

function normalizeProductImage(image: unknown): string {
    const raw = typeof image === "string" ? image.trim() : "";
    if (!raw) return "";

    // Already-good URLs
    if (raw.startsWith("data:image/")) return raw;
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    if (raw.startsWith("/images/")) {
        // Fix accidental nested assets folder: /images/assets/x.jpg -> /images/x.jpg
        return raw.replace(/^\/images\/assets\//, "/images/");
    }

    // Common legacy values stored in Firestore
    // Examples: "@/assets/product-coir-block.jpg", "src/assets/product-coir-block.jpg", "/src/assets/product-coir-block.jpg"
    let filename = raw.split("?")[0].split("#")[0].split("/").pop();
    if (!filename) return raw;

    // If Firestore stored a Vite-built asset filename with a hash suffix, strip it.
    // Example: product-coir-rope-BHYOKHrB.jpg -> product-coir-rope.jpg
    // Example: logo-3fA0bC9D.png -> logo.png
    const hashSuffix = /^(.*)-[a-zA-Z0-9]{8,}(\.(?:png|jpe?g|webp|gif|svg))$/;
    const match = filename.match(hashSuffix);
    if (match) {
        filename = `${match[1]}${match[2]}`;
    }

    return `/images/${filename}`;
}

export function useRealTimeProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen to all products in real-time
        const q = query(collection(db, "products"));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const prods = snapshot.docs.map((docSnap) => {
                    const data = docSnap.data() as Omit<Product, "id">;
                    return {
                        id: docSnap.id,
                        ...data,
                        image: normalizeProductImage((data as any).image),
                    } as Product;
                });

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
