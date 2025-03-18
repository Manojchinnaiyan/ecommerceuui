// components/products/product-reviews.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, User, ChevronDown, ChevronUp } from "lucide-react";
import { getProductReviews } from "@/lib/api/products";
import { useAuth } from "@/lib/hooks/use-auth";
import { Review } from "@/types/product";
import { formatDate } from "@/lib/utils/formatters";
import { toast } from "react-toastify";

interface ProductReviewsProps {
  productId: number;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  // Fetch reviews on component mount
  useState(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const data = await getProductReviews(productId);
        setReviews(data);
        setError(null);
      } catch (err) {
        setError("Failed to load reviews. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please log in to leave a review");
      router.push("/login");
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5");
      return;
    }

    if (comment.trim() === "") {
      toast.error("Please enter a review comment");
      return;
    }

    try {
      setSubmitting(true);

      // Add review API call would go here
      // const newReview = await addProductReview(productId, { rating, comment });

      // For now, we'll simulate adding a review
      const newReview: Review = {
        id: Math.floor(Math.random() * 1000),
        user: {
          id: user?.id || 0,
          email: user?.email || "",
          first_name: user?.first_name || "",
          last_name: user?.last_name || "",
        },
        rating,
        comment,
        created_at: new Date().toISOString(),
      };

      setReviews([newReview, ...reviews]);
      setComment("");
      setRating(5);
      setShowReviewForm(false);

      toast.success("Review submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit review. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>;
  }

  return (
    <div>
      {/* Review Summary */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Customer Reviews</h3>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  className={
                    star <=
                    Math.round(
                      reviews.reduce((sum, review) => sum + review.rating, 0) /
                        (reviews.length || 1)
                    )
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
              <span className="ml-2 text-sm font-medium">
                {reviews.length > 0
                  ? `${(
                      reviews.reduce((sum, review) => sum + review.rating, 0) /
                      reviews.length
                    ).toFixed(1)} out of 5 (${reviews.length} ${
                      reviews.length === 1 ? "review" : "reviews"
                    })`
                  : "No reviews yet"}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-4 py-2 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors flex items-center"
          >
            {showReviewForm ? (
              <>
                <ChevronUp size={16} className="mr-1" />
                Hide Review Form
              </>
            ) : (
              <>
                <ChevronDown size={16} className="mr-1" />
                Write a Review
              </>
            )}
          </button>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">Write a Review</h3>

          {!isAuthenticated ? (
            <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-4">
              Please{" "}
              <button
                onClick={() => router.push("/login")}
                className="underline font-medium hover:text-blue-800"
              >
                log in
              </button>{" "}
              to write a review.
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating
                </label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        size={24}
                        className={
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Review
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Share your experience with this product..."
                  required
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Review List */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6">
              <div className="flex items-start">
                <div className="bg-gray-100 rounded-full p-2 mr-3">
                  <User size={20} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <h4 className="font-medium text-gray-900 mr-2">
                      {review.user.first_name} {review.user.last_name}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatDate(review.created_at)}
                    </span>
                  </div>
                  <div className="flex mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No reviews yet. Be the first to leave a review!
        </div>
      )}
    </div>
  );
}
