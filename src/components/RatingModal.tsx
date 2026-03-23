import { useState } from "react";
import { getAuth } from "firebase/auth";
import { db } from "@/lib/firebase";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface RatingModalProps {
    transaction: any;
    orderRef: number;
    userId: string;
    onClose: () => void;
}

export function RatingModal({
    transaction: tx,
    orderRef,
    userId,
    onClose,
}: RatingModalProps) {
    const [productRatings, setProductRatings] = useState<
        Record<string, { rating: number; review: string }>
    >({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRatingChange = (productId: string, rating: number) => {
        setProductRatings((prev) => ({
            ...prev,
            [productId]: {
                rating,
                review: prev[productId]?.review || "",
            },
        }));
    };

    const handleReviewChange = (productId: string, review: string) => {
        setProductRatings((prev) => ({
            ...prev,
            [productId]: {
                rating: prev[productId]?.rating || 0,
                review,
            },
        }));
    };

    const handleSubmit = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            toast.error("You must be logged in.");
            return;
        }

        const uid = user.uid || userId;

        const ratedEntries = Object.entries(productRatings).filter(
            ([, value]) => value.rating > 0
        );

        if (ratedEntries.length === 0) {
            toast.error("Please select a rating.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Fetch user profile from 'users' collection to ensure accurate name/photo
            let userName = user.displayName || "Anonymous";
            let userPhoto = user.photoURL || "";

            try {
                const userDocSnap = await getDoc(doc(db, "users", uid));
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    if (userData.name) userName = userData.name;
                    // If the user has an image set in their profile, use it. Otherwise keep existing photoURL.
                    if (userData.image) userPhoto = userData.image;
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }

            for (const [productId, { rating, review }] of ratedEntries) {
                const ratingRef = doc(db, "ratings", `${productId}_${uid}`);

                await setDoc(
                    ratingRef,
                    {
                        rating,
                        review,
                        productId,
                        userId: uid,
                        userName: userName,
                        userPhoto: userPhoto,
                        timestamp: serverTimestamp(),
                    },
                    { merge: true }
                );

                const snapshot = await getDocs(
                    query(collection(db, "ratings"), where("productId", "==", productId))
                );

                let sum = 0;
                let count = 0;

                snapshot.forEach((ratingDoc) => {
                    const r = Number(ratingDoc.data().rating);
                    if (r > 0) {
                        sum += r;
                        count++;
                    }
                });

                await updateDoc(doc(db, "products", productId), {
                    ratingAverage: count ? Number((sum / count).toFixed(2)) : 0,
                    ratingCount: count,
                });
            }

            toast.success("Rating submitted!");
            onClose();
        } catch (err: any) {
            console.error(err);
            toast.error(err.code || "Error submitting");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-card p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-start justify-between">
                    <div>
                        <span className="rounded-lg bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                            Order #{orderRef}
                        </span>
                        <h2 className="mt-2 font-display text-2xl font-bold">Rate Products</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground"
                        type="button"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-6">
                    {(tx?.items || []).map((item: any) => (
                        <div
                            key={item.product.id}
                            className="rounded-lg border bg-background/60 p-4"
                        >
                            <div className="mb-4 flex items-center gap-3">
                                <img
                                    src={item.product.image || "/placeholder.svg"}
                                    alt={item.product.name}
                                    className="h-16 w-16 rounded object-cover"
                                />
                                <div>
                                    <p className="font-medium">{item.product.name}</p>
                                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="mb-2 text-sm font-semibold">Rating</p>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => handleRatingChange(item.product.id, star)}
                                            className="transition-all"
                                            type="button"
                                        >
                                            <Star
                                                className={`h-6 w-6 ${star <= (productRatings[item.product.id]?.rating || 0)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-muted-foreground"
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="mb-2 text-sm font-semibold">Review (Optional)</p>
                                <textarea
                                    value={productRatings[item.product.id]?.review || ""}
                                    onChange={(e) => handleReviewChange(item.product.id, e.target.value)}
                                    placeholder="Share your experience..."
                                    className="w-full rounded border bg-background px-3 py-2 text-sm placeholder-muted-foreground focus:border-green-400 focus:outline-none"
                                    rows={3}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-lg border border-muted-foreground/20 px-4 py-2 font-semibold text-foreground transition-all hover:bg-muted"
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex-1 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-all hover:bg-green-700 disabled:opacity-70"
                        type="button"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Ratings"}
                    </button>
                </div>
            </div>
        </div>
    );
}
