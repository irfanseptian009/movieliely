"use client";

import Footer from "@/components/Footer";
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
    const userId = Cookies.get("userId");

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
    <>
      <Navbar />
      <div className="bg-gray-950 text-white min-h-screen">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
            Your Favorite Movies
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.length > 0 ? (
              favorites.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-gray-800 shadow-md rounded-lg overflow-hidden hover:shadow-red-500/50 transition-shadow duration-500 ease-in-out transform hover:scale-105"
                >
                  <Link href={`/movie/${movie.movieId}`}>
                    <Image
                      src={movie.imageUrl}
                      alt={movie.title}
                      width={500}
                      height={750}
                      className="w-full h-auto rounded-lg"
                    />

                    <div className="p-4">
                      <h2 className="text-xl font-semibold text-center sm:text-2xl">
                        {movie.title}
                      </h2>
                      <p className="mt-4 text-sm text-gray-300 sm:text-base">
                        <strong>Overview:</strong> {movie.overview}
                      </p>
                      <p className="mt-2 text-sm text-gray-300 sm:text-base">
                        <strong>Release Date:</strong>{" "}
                        {new Date(movie.release_date).toLocaleDateString()}
                      </p>
                      <p className="mt-2 text-sm text-gray-300 sm:text-base">
                        <strong>Rating:</strong> {movie.rating}/10
                      </p>
                      <p className="mt-2 text-sm text-gray-300 sm:text-base">
                        <strong>Genres:</strong> {movie.genres.join(", ")}
                      </p>
                    </div>
                  </Link>
                  <button
                    onClick={() => handleDeleteFavorite(movie.id)}
                    className="mt-4 m-5 bg-red-600 text-white p-3 rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300 w-full"
                  >
                    Delete Favorite
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 text-lg">
                No favorite movies added yet.
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
