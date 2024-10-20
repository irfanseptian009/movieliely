"use client";

import Navbar from "@/components/Navbar";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface Movie {
  id: string;
  title: string;
  imageUrl: string;
  overview?: string;
  release_date?: string;
  rating?: number;
  movieId: string;
}

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);

  // Fetch the watchlist when the component loads
  useEffect(() => {
    const fetchWatchlist = async () => {
      const userId = Cookies.get("userId");

      if (!userId) {
        toast.error("User not logged in");
        return;
      }

      try {
        const response = await fetch(`/api/watchlist?userId=${userId}`);

        if (response.ok) {
          const data = await response.json();
          setWatchlist(data);
        } else {
          toast.error("Failed to fetch watchlist");
        }
      } catch (error) {
        console.error("Error fetching watchlist:", error);
        toast.error("Error fetching watchlist");
      }
    };
    fetchWatchlist();
  }, []);

  // Handle delete movie from watchlist
  const handleDelete = async (movieId: string) => {
    try {
      const response = await fetch("/api/watchlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieId }),
      });

      if (response.ok) {
        // Update the watchlist by filtering out the deleted movie
        setWatchlist((prevWatchlist) =>
          prevWatchlist.filter((movie) => movie.id !== movieId)
        );
        toast.success("Movie removed from watchlist");
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to delete movie");
      }
    } catch (error: unknown) {
      console.error("Error deleting movie from watchlist:", error);
      toast.error("Error deleting movie from watchlist");
    }
  };
  return (
    <>
      <Navbar />
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Your Watchlist</h1>
        {watchlist.length > 0 ? (
          <div className="grid grid-cols-3 gap-6">
            {watchlist.map((movie) => (
              <div key={movie.id} className="bg-gray-800 p-4 rounded-lg">
                <Link href={`/watchlist/${movie.movieId}`}>
                  <Image
                    src={movie.imageUrl}
                    alt={movie.title}
                    width={500}
                    height={750}
                    className="w-full h-auto"
                  />
                </Link>

                <h2 className="text-lg font-bold mb-2">{movie.title}</h2>
                <p className="text-gray-400 mb-4">{movie.overview}</p>
                <p className="text-gray-400 mb-4">
                  Rating: {movie.rating?.toFixed(1) || "N/A"}
                </p>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded"
                  onClick={() => handleDelete(movie.id)}
                >
                  Remove from Watchlist
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">Your watchlist is empty.</p>
        )}
      </div>
    </>
  );
};

export default WatchlistPage;
