"use client";

import Navbar from "@/components/Navbar";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Movie {
  id: string;
  title: string;
  imageUrl: string;
  overview: string;
  release_date: string;
  rating: number;
  genres: string[];
}

const ProfilePage = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    const userId = Cookies.get("userId");

    if (userId) {
      fetch(`/api/favorite?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setFavorites(data);
        })
        .catch((err) => console.error("Error fetching favorite movies:", err));
    }
  }, []);

  const handleDeleteFavorite = async (movieId: string) => {
    const response = await fetch("/api/favorite", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movieId }),
    });

    if (response.ok) {
      setFavorites((prevFavorites) =>
        prevFavorites.filter((movie) => movie.id !== movieId)
      );
    } else {
      console.error("Failed to delete movie");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mt-4">Your Favorite Movies</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {favorites.length > 0 ? (
            favorites.map((movie) => (
              <div
                key={movie.id}
                className="bg-white shadow-md rounded-lg p-4 transition duration-300 hover:shadow-lg"
              >
                <Link href={`/movie/${movie.id}`}>
                  <Image
                    src={movie.imageUrl}
                    alt={movie.title}
                    width={500}
                    height={750}
                    className="rounded-lg"
                  />
                </Link>
                <Link href={`/movie/${movie.id}`}>
                  <h2 className="text-lg font-semibold text-center mt-2">
                    {movie.title}
                  </h2>
                </Link>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Overview:</strong> {movie.overview}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Release Date:</strong>{" "}
                  {new Date(movie.release_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Rating:</strong> {movie.rating}/10
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Genres:</strong> {movie.genres.join(", ")}
                </p>
                <button
                  onClick={() => handleDeleteFavorite(movie.id)}
                  className="mt-2 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-300"
                >
                  Delete Favorite
                </button>
              </div>
            ))
          ) : (
            <p className="text-center mt-4 text-gray-600">
              No favorite movies added yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
