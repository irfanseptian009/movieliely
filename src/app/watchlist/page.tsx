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

  // Fetch watchlist saat halaman dimuat
  useEffect(() => {
    const userId = Cookies.get("userId");

    if (userId) {
      fetch(`/api/watchlist?userId=${userId}`, {
        method: "GET",
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error("Invalid response");
          }
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setWatchlist(data);
          } else {
            console.error("Invalid data format:", data);
          }
        })
        .catch((err) => console.error("Error fetching watchlist movies:", err));
    }
  }, []);

  // Fungsi untuk menghapus film dari watchlist
  const handleRemoveFromWatchlist = async (movieId: string) => {
    const userId = Cookies.get("userId");

    console.log("Removing movie with movieId:", movieId, "and userId:", userId);

    if (userId) {
      try {
        const response = await fetch("/api/watchlist", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ movieId, userId }),
        });

        if (response.ok) {
          console.log("Movie removed from watchlist");
          setWatchlist((prevWatchlist) =>
            prevWatchlist.filter((movie) => movie.id !== movieId)
          );
        } else {
          const errorData = await response.json();
          console.error("Failed to remove movie from watchlist:", errorData);
        }
      } catch (error) {
        console.error("Error removing movie from watchlist:", error);
      }
    }
  };

  return (
    <div>
      <h1>Your Watchlist</h1>
      <div className="grid grid-cols-3 gap-4">
        {Array.isArray(watchlist) && watchlist.length > 0 ? (
          watchlist.map((movie) => (
            <div key={movie.id}>
              <Link href={`/movie/${movie.id}`}>
                <Image
                  src={movie.imageUrl}
                  alt={movie.title}
                  width={500}
                  height={750}
                  className="rounded-lg"
                />
              </Link>
              <h2 className="text-center mt-2">{movie.title}</h2>
              <button
                onClick={() => handleRemoveFromWatchlist(movie.id)}
                className="bg-red-500 text-white p-2 mt-2 w-full"
              >
                Remove from Watchlist
              </button>
            </div>
          ))
        ) : (
          <p>Your watchlist is empty.</p>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;
