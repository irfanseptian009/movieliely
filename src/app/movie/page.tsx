"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addFavorite } from "@/redux/slice";

const MoviePage = () => {
  const [movies, setMovies] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMovies = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
      );
      const data = await res.json();
      setMovies(data.results);
    };

    const fetchNowPlaying = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
      );
      const data = await res.json();
      setNowPlaying(data.results);
    };

    fetchMovies();
    fetchNowPlaying();
  }, []);

  const handleAddFavorite = async (movie: any) => {
    const newFavorite = {
      id: movie.id,
      title: movie.title,
      imageUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    };

    // Ambil userId yang disimpan di localStorage
    const userId = localStorage.getItem("userId");

    if (userId) {
      // Dispatch ke Redux
      dispatch(addFavorite(newFavorite));

      // Simpan ke database via API
      const response = await fetch("/api/favorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId, // Kirim ObjectId yang valid
          movie: newFavorite,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("Error saving favorite movie:", data);
      }
    } else {
      console.error("User not logged in");
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-xl font-bold">Now Playing</h1>
      <div className="grid grid-cols-3 gap-4">
        {nowPlaying.slice(0, 6).map((movie) => (
          <div key={movie.id}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
            <h2>{movie.title}</h2>
            <button
              onClick={() => handleAddFavorite(movie)}
              className="bg-blue-500 text-white p-2 mt-2"
            >
              Add to Favorite
            </button>
          </div>
        ))}
      </div>

      <h1 className="text-xl font-bold mt-8">Popular Movies</h1>
      <div className="grid grid-cols-3 gap-4">
        {movies.slice(0, 30).map((movie) => (
          <div key={movie.id}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
            <h2>{movie.title}</h2>
            <button
              onClick={() => handleAddFavorite(movie)}
              className="bg-blue-500 text-white p-2 mt-2"
            >
              Add to Favorite
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviePage;
