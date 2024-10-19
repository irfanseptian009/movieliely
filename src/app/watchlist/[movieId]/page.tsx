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

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);

  // Fetch watchlist on page load
  useEffect(() => {
    const userId = Cookies.get("userId");

    if (userId) {
      fetch(`/api/watchlist?userId=${userId}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setWatchlist(data);
        })
        .catch((err) => console.error("Error fetching watchlist:", err));
    }
  }, []);

  // Delete a movie from watchlist
  const handleRemoveFromWatchlist = async (movieId: string) => {
    const userId = Cookies.get("userId");

    if (userId) {
      try {
        const response = await fetch("/api/watchlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, movieId }),
        });

        if (response.ok) {
          setWatchlist((prevWatchlist) =>
            prevWatchlist.filter((movie) => movie.id !== movieId)
          );
        } else {
          const data = await response.json();
          console.error("Failed to remove movie from watchlist:", data);
        }
      } catch (error) {
        console.error("Error removing movie from watchlist:", error);
      }
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
            <Link href={`/movie/${movie.id}`}>
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
              <button
                onClick={() => handleRemoveFromWatchlist(movie.id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
              >
                Remove from Watchlist
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchlistPage;
