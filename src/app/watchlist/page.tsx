"use client";

import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Movie {
  id: string;
  title: string;
  imageUrl: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  user: {
    email: string;
  };
}

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [reviewsMap, setReviewsMap] = useState<Record<string, Review[]>>({});
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch watchlist saat halaman dimuat
  useEffect(() => {
    const userId = Cookies.get("userId");

    if (userId) {
      fetch(`/api/watchlist?userId=${userId}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setWatchlist(data);

          // Setelah mendapatkan watchlist, fetch reviews untuk setiap film
          data.forEach((movie: Movie) => {
            fetch(`/api/review?watchlistId=${movie.id}`)
              .then((res) => res.json())
              .then((reviewData) => {
                setReviewsMap((prev) => ({
                  ...prev,
                  [movie.id]: reviewData,
                }));
              })
              .catch((err) =>
                console.error(`Error fetching reviews for movieId ${movie.id}:`, err)
              );
          });
        })
        .catch((err) => console.error("Error fetching watchlist:", err));
    }
  }, []);

  // Ambil rata-rata rating dari review
  const getAverageRating = (reviews: Review[]) => {
    if (reviews.length === 0) return "No reviews yet";
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1) + " / 5";
  };

  // Tambahkan review baru
  const handleAddReview = async () => {
    const userId = Cookies.get("userId");
    if (userId && selectedMovieId && newReview.rating > 0 && newReview.comment) {
      setIsSubmitting(true); // Mulai submit
      try {
        const response = await fetch("/api/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            watchlistId: selectedMovieId,
            rating: newReview.rating,
            comment: newReview.comment,
          }),
        });
        if (response.ok) {
          const newReviewData = await response.json();
          setReviewsMap((prev) => ({
            ...prev,
            [selectedMovieId]: [...(prev[selectedMovieId] || []), newReviewData],
          })); // Tambahkan review baru ke state
          setNewReview({ rating: 0, comment: "" }); // Reset form setelah submit
        }
      } catch (error) {
        console.error("Error adding review:", error);
      } finally {
        setIsSubmitting(false); // Selesai submit
      }
    } else {
      alert("Please provide both a rating and a comment.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Watchlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {watchlist.map((movie) => (
          <div
            key={movie.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <Link href={`/watchlist/${movie.id}`}>
              <Image
                src={movie.imageUrl}
                alt={movie.title}
                width={500}
                height={750}
                className="w-full h-auto"
              />
            </Link>
            <div className="p-4">
              <h2 className="text-xl font-semibold">{movie.title}</h2>
              <p className="text-sm text-gray-600">
                {reviewsMap[movie.id]
                  ? getAverageRating(reviewsMap[movie.id])
                  : "Loading reviews..."}
              </p>
              <button
                onClick={() => setSelectedMovieId(movie.id)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
              >
                View Reviews
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedMovieId && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Reviews for Movie {selectedMovieId}</h2>
          <div className="space-y-4">
            {reviewsMap[selectedMovieId]?.length > 0 ? (
              reviewsMap[selectedMovieId].map((review) => (
                <div key={review.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                  <p className="text-sm text-gray-600">
                    <strong>{review.user ? review.user.email : "Unknown User"}:</strong>{" "}
                    {review.comment} - {review.rating}/5
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No reviews yet. Be the first to add a review!
              </p>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Add a Review</h3>
            <div className="mb-4">
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                Rating (1-5):
              </label>
              <input
                type="number"
                id="rating"
                max="5"
                min="1"
                value={newReview.rating}
                onChange={(e) =>
                  setNewReview({ ...newReview, rating: parseInt(e.target.value, 10) })
                }
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700"
              >
                Comment:
              </label>
              <textarea
                id="comment"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
                rows={4}
              />
            </div>
            <button
              onClick={handleAddReview}
              disabled={isSubmitting}
              className={`${
                isSubmitting ? "bg-gray-500" : "bg-green-500"
              } text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300`}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
