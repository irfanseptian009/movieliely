"use client";

import Navbar from "@/components/Navbar";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Movie {
  id: string;
  title: string;
  imageUrl: string;
  overview: string;
  release_date: string;
  rating: number;
  genres: string[];
  movieId: string;
}

const ProfilePage = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    const userId = Cookies.get("userId"); // Get userId from cookie

    if (userId) {
      fetch(`/api/favorite?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setFavorites(data);
        })
        .catch((err) => {
          console.error("Error fetching favorite movies:", err);
          toast.error("Failed to load favorite movies");
        });
    } else {
      toast.error("User not logged in");
    }
  }, []);

  const handleDeleteFavorite = async (movieId: string) => {
    try {
      const response = await fetch("/api/favorite", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieId }),
      });

      if (response.ok) {
        const updatedFavorites = favorites.filter((movie) => movie.id !== movieId);
        setFavorites(updatedFavorites);
        toast.success("Favorite movie deleted successfully");
      } else {
        toast.error("Failed to delete favorite movie");
      }
    } catch (error) {
      console.error("Error deleting favorite:", error);
      toast.error("Error deleting favorite movie");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Favorite Movies</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.length > 0 ? (
            favorites.map((movie) => (
              <div
                key={movie.id}
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <Link href={`/movie/${movie.movieId}`}>
                  <Image
                    src={movie.imageUrl}
                    alt={movie.title}
                    width={500}
                    height={750}
                    className="w-full h-auto"
                  />
                </Link>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-center">{movie.title}</h2>
                  <p className="mt-2 text-sm text-gray-600">
                    <strong>Overview:</strong> {movie.overview}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    <strong>Release Date:</strong>{" "}
                    {new Date(movie.release_date).toLocaleDateString()}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    <strong>Rating:</strong> {movie.rating}/10
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    <strong>Genres:</strong> {movie.genres.join(", ")}
                  </p>
                  <button
                    onClick={() => handleDeleteFavorite(movie.id)}
                    className="mt-4 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-300"
                  >
                    Delete Favorite
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No favorite movies added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
