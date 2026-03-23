import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface Review {
    id: string;
    rating: number;
    review: string;
    userName: string;
    userPhoto?: string;
    timestamp?: any;
    userId: string;
}

interface ProductReviewsProps {
    productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                // Fetch reviews for this product
                const q = query(
                    collection(db, "ratings"),
                    where("productId", "==", productId)
                );

                const snapshot = await getDocs(q);
                const fetchedReviews = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Review[];

                // Sort in memory (newest first)
                fetchedReviews.sort((a, b) => {
                    const timeA = a.timestamp?.seconds || 0;
                    const timeB = b.timestamp?.seconds || 0;
                    return timeB - timeA;
                });

                setReviews(fetchedReviews);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchReviews();
        }
    }, [productId]);

    if (loading) {
        return (
            <div className="py-12 flex justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="py-16 text-center border-t border-b border-dashed border-slate-200 bg-slate-50/50 rounded-xl my-8">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 mb-4">
                    <Star className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">No reviews yet</h3>
                <p className="text-slate-500 mt-1">Be the first to share your thoughts on this product.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between border-b pb-6">
                <div>
                    <h2 className="font-display text-2xl font-bold text-slate-900">Customer Reviews</h2>
                    <p className="text-slate-500 mt-1 text-sm">Based on {reviews.length} authentic ratings</p>
                </div>
            </div>

            <div className="grid gap-6">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="group flex gap-4 p-5 sm:p-6 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-slate-200 hover:-translate-y-0.5"
                    >
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-white shadow-sm ring-1 ring-slate-100">
                            <AvatarImage src={review.userPhoto} alt={review.userName} />
                            <AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/5 text-primary font-bold">
                                {(review.userName || "A").charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div>
                                    <p className="font-semibold text-sm text-slate-900">{review.userName || "Anonymous User"}</p>
                                    <p className="text-xs text-slate-400 font-medium">
                                        {review.timestamp?.seconds
                                            ? formatDistanceToNow(new Date(review.timestamp.seconds * 1000), { addSuffix: true })
                                            : "Recently"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-0.5 bg-yellow-50 px-2.5 py-1 rounded-full border border-yellow-100 self-start sm:self-auto">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`h-3 w-3 ${star <= review.rating
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "fill-slate-200 text-slate-200"
                                                }`}
                                        />
                                    ))}
                                    <span className="ml-1.5 text-xs font-bold text-yellow-700">{review.rating}.0</span>
                                </div>
                            </div>

                            {review.review ? (
                                <div className="pt-1">
                                    <p className="text-sm text-slate-600 leading-relaxed text-pretty">
                                        "{review.review}"
                                    </p>
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400 italic pt-1">No written review</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
