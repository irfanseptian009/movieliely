// pages/MoviePage.tsx

"use client";

import Navbar from "@/components/Navbar";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import {
  fetchMovies,
  fetchNowPlaying,
  fetchPopularMovies,
  fetchUpcomingMovies,
  fetchTopRatedMovies,
  fetchSearchMovies,
  setSearchTerm,
  setHasSearched,
} from "../redux/movieSlice";
import { RootState, AppDispatch } from "../redux/store";
import Footer from "@/components/Footer";
import { HeartIcon, PlusIcon } from "@heroicons/react/24/solid";
import { toast } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";

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
  const dispatch = useDispatch<AppDispatch>();

  const {
    movies,
    nowPlaying,
    popularMovies,
    upcomingMovies,
    topRatedMovies,
    searchTerm,
    hasSearched,
    page,
  } = useSelector((state: RootState) => state.movie);

  useEffect(() => {
    if (!hasSearched) {
      dispatch(fetchMovies());
    }
    dispatch(fetchNowPlaying());
    dispatch(fetchPopularMovies());
    dispatch(fetchUpcomingMovies());
    dispatch(fetchTopRatedMovies());
  }, [dispatch, page, hasSearched]);

  const handleAddFavorite = async (movie: Movie) => {
    const newFavorite = {
      id: movie.id.toString(),
      title: movie.title,
      imageUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      overview: movie.overview,
      release_date: movie.release_date,
      rating: movie.vote_average,
      genres: movie.genres ? movie.genres.map((genre) => genre.name) : [],
    };

    const userId = Cookies.get("userId");

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
        if (response.ok) {
          toast.success("Movie added to favorites!");
        } else {
          toast.error("Error adding movie to favorites: " + data.message);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error("Error adding movie to favorites: " + error.message);
        } else {
          toast.error("An unknown error occurred while adding movie to favorites");
        }
      }
    } else {
      toast.error("User not logged in");
    }
  };

  const handleAddToWatchlist = async (movie: Movie) => {
    const userId = Cookies.get("userId");

    if (!userId) {
      toast.error("User not logged in");
      return;
    }

    const newWatchlistItem = {
      id: movie.id.toString(),
      title: movie.title,
      imageUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      overview: movie.overview || "No overview available",
      release_date: movie.release_date || null,
      rating: movie.vote_average || 0,
      genres: Array.isArray(movie.genres) ? movie.genres : [],
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
        toast.success("Movie added to watchlist!");
      } else {
        const data = await response.json();
        toast.error(`Failed to add movie to watchlist: ${data.message}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Error adding movie to watchlist: ${error.message}`);
      } else {
        toast.error("Error adding movie to watchlist.");
      }
    }
  };

  const handleSearch = () => {
    dispatch(setHasSearched(true));
    if (searchTerm === "") {
      dispatch(fetchMovies());
    } else {
      dispatch(fetchSearchMovies(searchTerm));
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <div className="container mx-auto px-8">
        <div className="mt-8">
          <h1 className="text-3xl font-bold mb-4">Search Movies</h1>
          <input
            type="text"
            placeholder="Search for a movie..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            className="w-full p-4 text-black rounded-lg"
          />
          <button
            onClick={handleSearch}
            className="bg-red-600 text-white p-4 mt-4 w-full rounded-lg hover:bg-red-700 transition"
          >
            Search
          </button>
        </div>

        {hasSearched && (
          <>
            <h1 className="text-3xl font-bold mt-8">Movie Results</h1>
            {movies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {movies.map((movie: Movie) => (
                  <div
                    key={movie.id}
                    className="bg-gray-900 p-4 rounded-lg shadow-lg overflow-hidden hover:shadow-red-500/100 transition-shadow duration-500 ease-in-out transform hover:scale-105"
                  >
                    <Link href={`/movie/${movie.id}`}>
                      <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        width={500}
                        height={750}
                        className="rounded-lg hover:opacity-80 transition"
                      />
                    </Link>
                    <Link href={`/movie/${movie.id}`}>
                      <h2 className="mt-2 text-lg font-semibold">{movie.title}</h2>
                    </Link>

                    {/* Add to Favorite Button with Heart Icon */}
                    <button
                      onClick={() => handleAddFavorite(movie)}
                      className="bg-red-600 text-white p-2 mt-4 w-full rounded-lg flex items-center justify-center hover:bg-red-700 transition"
                    >
                      <HeartIcon className="w-5 h-5 mr-2" /> Add to Favorite
                    </button>

                    {/* Add to Watchlist Button with Plus Icon */}
                    <button
                      onClick={() => handleAddToWatchlist(movie)}
                      className="bg-gray-800 text-white p-2 mt-2 w-full rounded-lg flex items-center justify-center hover:bg-gray-900 transition"
                    >
                      <PlusIcon className="w-5 h-5 mr-2" /> Add to Watchlist
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 mt-4">
                No results found. Please try a different search term.
              </p>
            )}
          </>
        )}

        <h1 className="text-3xl font-bold mt-8 mb-8">Now Playing</h1>
        <div className="relative w-full rounded-3xl h-[70vh]">
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            navigation={true}
            modules={[Autoplay, EffectFade, Navigation]}
            className="h-full rounded-3xl"
          >
            {nowPlaying.map((movie: Movie) => (
              <SwiperSlide key={movie.id}>
                <div className="relative w-full h-full rounded-3xl">
                  <div className="absolute rounded-3xl inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                  <Link href={`/movie/${movie.id}`}>
                    <Image
                      src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="w-full h-full rounded-3xl object-center transition-transform duration-1000 transform hover:scale-105"
                    />
                  </Link>
                  <div className="absolute bottom-10 left-10 text-white z-20">
                    <h2 className="text-4xl font-bold mb-2 animate-fadeIn">
                      {movie.title}
                    </h2>
                    <p className="text-lg w-2/3 line-clamp-3 animate-fadeInDelay">
                      {movie.overview}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Popular Movies Section */}
        <h1 className="text-3xl text-center font-bold mt-8 mb-8">Popular Movies</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-44">
          {popularMovies.map((movie: Movie) => (
            <div
              key={movie.id}
              className="bg-gray-900 p-4 rounded-lg shadow-lg overflow-hidden hover:shadow-red-500/100 transition-shadow duration-500 ease-in-out transform hover:scale-105"
            >
              <Link href={`/movie/${movie.id}`}>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  width={500}
                  height={750}
                  className="rounded-lg hover:opacity-80 transition"
                />
              </Link>
              <Link href={`/movie/${movie.id}`}>
                <h2 className="mt-2 text-lg font-semibold">{movie.title}</h2>
              </Link>

              {/* Add to Favorite Button with Heart Icon */}
              <button
                onClick={() => handleAddFavorite(movie)}
                className="bg-red-600 text-white p-2 mt-4 w-full rounded-lg flex items-center justify-center hover:bg-red-700 transition"
              >
                <HeartIcon className="w-5 h-5 mr-2" /> Add to Favorite
              </button>

              {/* Add to Watchlist Button with Plus Icon */}
              <button
                onClick={() => handleAddToWatchlist(movie)}
                className="bg-gray-800 text-white p-2 mt-2 w-full rounded-lg flex items-center justify-center hover:bg-gray-900 transition"
              >
                <PlusIcon className="w-5 h-5 mr-2" /> Add to Watchlist
              </button>
            </div>
          ))}
        </div>

        {/* Upcoming Movies Section */}
        <h1 className="text-3xl text-center font-bold mt-8 mb-8">Upcoming Movies</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-40">
          {upcomingMovies.map((movie: Movie) => (
            <div
              key={movie.id}
              className="bg-gray-900 p-4 rounded-lg shadow-lg overflow-hidden hover:shadow-red-500/100 transition-shadow duration-500 ease-in-out transform hover:scale-105"
            >
              <Link href={`/movie/${movie.id}`}>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  width={500}
                  height={750}
                  className="rounded-lg hover:opacity-80 transition"
                />
              </Link>
              <Link href={`/movie/${movie.id}`}>
                <h2 className="mt-2 text-lg font-semibold">{movie.title}</h2>
              </Link>

              {/* Add to Favorite Button with Heart Icon */}
              <button
                onClick={() => handleAddFavorite(movie)}
                className="bg-red-600 text-white p-2 mt-4 w-full rounded-lg flex items-center justify-center hover:bg-red-700 transition"
              >
                <HeartIcon className="w-5 h-5 mr-2" /> Add to Favorite
              </button>

              {/* Add to Watchlist Button with Plus Icon */}
              <button
                onClick={() => handleAddToWatchlist(movie)}
                className="bg-gray-800 text-white p-2 mt-2 w-full rounded-lg flex items-center justify-center hover:bg-gray-900 transition"
              >
                <PlusIcon className="w-5 h-5 mr-2" /> Add to Watchlist
              </button>
            </div>
          ))}
        </div>

        {/* Top Rated Movies Section */}
        <h1 className="text-3xl text-center font-bold mt-8 mb-8">Top Rated Movies</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-40">
          {topRatedMovies.map((movie: Movie) => (
            <div
              key={movie.id}
              className="bg-gray-900 p-4 rounded-lg shadow-lg overflow-hidden hover:shadow-red-500/100 transition-shadow duration-500 ease-in-out transform hover:scale-105"
            >
              <Link href={`/movie/${movie.id}`}>
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  width={500}
                  height={750}
                  className="rounded-lg hover:opacity-80 transition"
                />
              </Link>
              <Link href={`/movie/${movie.id}`}>
                <h2 className="mt-2 text-lg font-semibold">{movie.title}</h2>
              </Link>

              {/* Add to Favorite Button with Heart Icon */}
              <button
                onClick={() => handleAddFavorite(movie)}
                className="bg-red-600 text-white p-2 mt-4 w-full rounded-lg flex items-center justify-center hover:bg-red-700 transition"
              >
                <HeartIcon className="w-5 h-5 mr-2" /> Add to Favorite
              </button>

              {/* Add to Watchlist Button with Plus Icon */}
              <button
                onClick={() => handleAddToWatchlist(movie)}
                className="bg-gray-800 text-white p-2 mt-2 w-full rounded-lg flex items-center justify-center hover:bg-gray-900 transition"
              >
                <PlusIcon className="w-5 h-5 mr-2" /> Add to Watchlist
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MoviePage;
