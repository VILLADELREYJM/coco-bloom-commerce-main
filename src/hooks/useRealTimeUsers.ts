import { useEffect, useState } from "react";
import { collection, onSnapshot, query, type Firestore } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { User } from "@/data/types";

const USERS_CACHE_KEY = "seller_users_cache_v1";

export function useRealTimeUsers(firestore: Firestore = db) {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const cached = localStorage.getItem(USERS_CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached) as User[];
                if (Array.isArray(parsed)) {
                    setUsers(parsed);
                    setLoading(false);
                }
            }
        } catch {
            // Ignore cache parse errors and continue with live snapshot
        }

        const q = query(collection(firestore, "users"));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const nextUsers = snapshot.docs.map((docSnap) => ({
                    id: docSnap.id,
                    ...(docSnap.data() as Omit<User, "id">),
                })) as User[];

                setUsers(nextUsers);
                try {
                    localStorage.setItem(USERS_CACHE_KEY, JSON.stringify(nextUsers));
                } catch {
                    // Ignore write errors (private mode / storage limits)
                }
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching users:", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [firestore]);

    return { users, loading };
}
