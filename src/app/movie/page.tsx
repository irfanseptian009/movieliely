"use client";

import Navbar from "@/components/Navbar";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview?: string;
  release_date?: string;
  vote_average?: number;
  genres?: { name: string }[];
}

const MoviePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page] = useState(1);
  const [, setTotalPages] = useState(1);

  // Fetch movies and now playing on initial load
  useEffect(() => {
    const fetchMovies = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=${page}`
      );
      const data = await res.json();
      setMovies(data.results);
    };

    const fetchNowPlaying = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
      );
      const data = await res.json();
      setNowPlaying(data.results); // Store now playing movies
    };

    fetchMovies();
    fetchNowPlaying();
  }, [page]); // Fetch movies when page changes

  // Add to Favorite function
  const handleAddFavorite = async (movie: Movie) => {
    const newFavorite = {
      id: movie.id.toString(),
      title: movie.title,
      imageUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      overview: movie.overview,
      release_date: movie.release_date,
      rating: movie.vote_average,
      genres: movie.genres
        ? movie.genres.map((genre) => genre.name) // Safeguard: Check if genres is defined
        : [], // If undefined, set an empty array
    };

    const userId = Cookies.get("userId"); // Get userId from cookie

    if (userId) {
      try {
        const response = await fetch("/api/favorite", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            movie: newFavorite,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          console.error("Error saving favorite movie:", data);
        }
      } catch (error) {
        console.error("Error saving favorite movie:", error);
      }
    } else {
      console.error("User not logged in");
    }
  };

  // Add to Watchlist function
  const handleAddToWatchlist = async (movie: Movie) => {
    const userId = Cookies.get("userId");

    if (!userId) {
      console.error("User not logged in");
      return;
    }

    const newWatchlistItem = {
      id: movie.id.toString(),
      title: movie.title,
      imageUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      overview: movie.overview || "No overview available",
      release_date: movie.release_date || "Unknown release date",
      rating: movie.vote_average || 0,
      genres: movie.genres?.map((genre) => genre.name).join(", ") || "N/A",
    };

    try {
      const response = await fetch("/api/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          movie: newWatchlistItem,
        }),
      });

      if (response.ok) {
        console.log("Movie added to watchlist");
      } else {
        const data = await response.json();
        console.error("Failed to add movie to watchlist:", data);
      }
    } catch (error) {
      console.error("Error adding movie to watchlist:", error);
    }
  };

  // Search movies by user input
  const handleSearch = async () => {
    if (searchTerm === "") {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=${page}`
      );
      const data = await res.json();
      setMovies(data.results);
      setTotalPages(data.total_pages);
      return;
    }

    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${searchTerm}&language=en-US&page=${page}`
    );
    const data = await res.json();
    setMovies(data.results);
    setTotalPages(data.total_pages);
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto">
        <h1 className="text-xl font-bold">Now Playing</h1>

        <Swiper spaceBetween={50} slidesPerView={3} grabCursor>
          {nowPlaying.map((movie: Movie) => (
            <SwiperSlide key={movie.id}>
              <div className="w-full">
                <Link href={`/movie/${movie.id}`}>
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    width={500}
                    height={750}
                    className="rounded-lg"
                  />
                </Link>
                <Link href={`/movie/${movie.id}`}>
                  <h2 className="mt-2 text-center">{movie.title}</h2>
                </Link>
                <button
                  onClick={() => handleAddFavorite(movie)}
                  className="bg-blue-500 text-white p-2 mt-2 w-full"
                >
                  Add to Favorite
                </button>
                <button
                  onClick={() => handleAddToWatchlist(movie)}
                  className="bg-yellow-500 text-white p-2 mt-2 w-full"
                >
                  Add to Watchlist
                </button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="mt-8">
          <h1 className="text-xl font-bold">Search Movies</h1>
          <input
            type="text"
            placeholder="Search for a movie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-2"
          />
          <button onClick={handleSearch} className="bg-blue-500 text-white p-2 mt-2">
            Search
          </button>
        </div>

        <h1 className="text-xl font-bold mt-8">Movie Results</h1>
        <div className="grid grid-cols-3 gap-4">
          {movies.map((movie: Movie) => (
            <div key={movie.id}>
              <Link href={`/movie/${movie.id}`}>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  width={500}
                  height={750}
                  className="rounded-lg"
                />
              </Link>
              <Link href={`/movie/${movie.id}`}>
                <h2 className="mt-2 text-center">{movie.title}</h2>
              </Link>
              <button
                onClick={() => handleAddFavorite(movie)}
                className="bg-blue-500 text-white p-2 mt-2 w-full"
              >
                Add to Favorite
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
