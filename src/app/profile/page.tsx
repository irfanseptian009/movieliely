"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { removeFavorite } from "@/redux/slice";

const ProfilePage = () => {
  const favorites = useSelector((state: RootState) => state.favorite.movies);
  const dispatch = useDispatch();

  const handleRemoveFavorite = async (movieId: string) => {
    try {
      const res = await fetch("/api/favorite", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieId }),
      });

      if (res.ok) {
        dispatch(removeFavorite(movieId));
      }
    } catch (error) {
      console.error("Error removing favorite movie", error);
    }
  };

  return (
    <div className="container mx-auto">
      <h1>Your Favorite Movies</h1>
      <div className="grid grid-cols-3 gap-4">
        {favorites.map((movie) => (
          <div key={movie.id} className="border p-4">
            <img src={movie.imageUrl} alt={movie.title} />
            <h2>{movie.title}</h2>
            <button
              onClick={() => handleRemoveFavorite(movie.id)}
              className="bg-red-500 text-white px-2 py-1 mt-2"
            >
              Remove from Favorite
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
