"use client";

import Navbar from "@/components/Navbar";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Import Link dari Next.js

interface Movie {
  id: string;
  title: string;
  imageUrl: string;
}

const ProfilePage = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    const userId = Cookies.get("userId"); // Ambil userId dari cookie

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
        <h1>Your Favorite Movies</h1>
        <div className="grid grid-cols-3 gap-4">
          {favorites.map((movie) => (
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
              <Link href={`/movie/${movie.id}`}>
                <h2 className="text-center mt-2">{movie.title}</h2>
              </Link>
              <button
                onClick={() => handleDeleteFavorite(movie.id)}
                className="bg-red-500 text-white p-2 mt-2 w-full"
              >
                Delete Favorite
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
