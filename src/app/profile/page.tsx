"use client";

import { useEffect, useState } from "react";

interface Movie {
  id: string;
  title: string;
  imageUrl: string;
}

const ProfilePage = () => {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  useEffect(() => {
    // Ambil userId dari localStorage
    const userId = localStorage.getItem("userId");

    // Jika userId valid, fetch daftar favorit
    if (userId) {
      fetch(`/api/favorite?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setFavorites(data);
        })
        .catch((err) => console.error("Error fetching favorite movies:", err));
    }
  }, []);

  // Fungsi untuk menghapus film dari favorit
  const handleDeleteFavorite = async (movieId: string) => {
    const response = await fetch("/api/favorite", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movieId }),
    });

    if (response.ok) {
      // Update daftar favorit di state setelah berhasil dihapus
      setFavorites((prevFavorites) =>
        prevFavorites.filter((movie) => movie.id !== movieId)
      );
    } else {
      console.error("Failed to delete movie");
    }
  };

  return (
    <div className="container mx-auto">
      <h1>Your Favorite Movies</h1>
      <div className="grid grid-cols-3 gap-4">
        {favorites.map((movie) => (
          <div key={movie.id}>
            <img src={movie.imageUrl} alt={movie.title} />
            <h2>{movie.title}</h2>
            <button
              onClick={() => handleDeleteFavorite(movie.id)}
              className="bg-red-500 text-white p-2 mt-2"
            >
              Delete Favorite
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
