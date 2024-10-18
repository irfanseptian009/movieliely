"use client";

import Navbar from "@/components/Navbar";
import { addFavorite } from "@/redux/slice";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";
import Link from "next/link";

const MoviePage = () => {
  const [movies, setMovies] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMovies = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=${page}`
      );
      const data = await res.json();
      setMovies(data.results);
      setTotalPages(data.total_pages); // Simpan total halaman dari API
    };

    const fetchNowPlaying = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=1`
      );
      const data = await res.json();
      setNowPlaying(data.results); // Simpan film Now Playing
    };

    fetchMovies();
    fetchNowPlaying();
  }, [page]); // Setiap kali halaman berubah, ambil film untuk halaman tersebut

  const handleAddFavorite = async (movie: {
    id: number;
    title: string;
    poster_path: string;
  }) => {
    const newFavorite = {
      id: movie.id.toString(),
      title: movie.title,
      imageUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    };

    const userId = Cookies.get("userId"); // Ambil userId dari cookie

    if (userId) {
      dispatch(addFavorite(newFavorite));

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
    } else {
      console.error("User not logged in");
    }
  }; // Fungsi untuk menambahkan film ke watchlist
  const handleAddToWatchlist = async (movie: {
    id: number;
    title: string;
    poster_path: string;
  }) => {
    const userId = Cookies.get("userId");

    const newWatchlistItem = {
      id: movie.id.toString(), // Konversi movieId ke String
      title: movie.title,
      imageUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    };

    if (userId) {
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
          // Optionally, you can refetch or update the watchlist state here
        } else {
          const data = await response.json();
          console.error("Failed to add movie to watchlist:", data);
        }
      } catch (error) {
        console.error("Error adding movie to watchlist:", error);
      }
    }
  };

  // Fungsi untuk mencari film berdasarkan input pengguna
  const handleSearch = async () => {
    if (searchTerm === "") {
      // Jika tidak ada input, kembali ke daftar film populer
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=${page}`
      );
      const data = await res.json();
      setMovies(data.results);
      setTotalPages(data.total_pages);
      return;
    }

    // Lakukan pencarian berdasarkan judul film
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

        {/* Carousel untuk Now Playing menggunakan Swiper.js */}
        <Swiper spaceBetween={50} slidesPerView={3} grabCursor>
          {nowPlaying.map((movie: any) => (
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

        {/* Pencarian */}
        <div className="mt-8">
          <h1 className="text-xl font-bold">Search Movies</h1>
          <input
            type="text"
            placeholder="Search for a movie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update state saat mengetik
            className="w-full p-2 border border-gray-300 rounded mt-2"
          />
          <button onClick={handleSearch} className="bg-blue-500 text-white p-2 mt-2">
            Search
          </button>
        </div>

        {/* Hasil Pencarian */}
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
          ))}{" "}
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
