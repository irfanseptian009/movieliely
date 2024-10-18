"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addFavorite } from "@/redux/slice";
import Navbar from "@/components/Navbar";
import Cookies from "js-cookie";

const MoviePage = () => {
  const [movies, setMovies] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State untuk input pencarian
  const [page, setPage] = useState(1); // State untuk halaman saat ini
  const [totalPages, setTotalPages] = useState(1); // State untuk total halaman dari API
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
      setNowPlaying(data.results);
    };

    fetchMovies();
    fetchNowPlaying();
  }, [page]); // Setiap kali halaman berubah, ambil film untuk halaman tersebut

  const handleAddFavorite = async (movie: any) => {
    const newFavorite = {
      id: movie.id,
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
          userId, // Kirim userId yang valid untuk kaitkan dengan pengguna
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

  // Fungsi untuk mencari film berdasarkan input pengguna
  const handleSearch = async () => {
    if (searchTerm === "") {
      // Jika tidak ada input, kembali ke daftar film populer
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&page=${page}`
      );
      const data = await res.json();
      setMovies(data.results);
      setTotalPages(data.total_pages); // Update total halaman untuk daftar populer
      return;
    }

    // Lakukan pencarian berdasarkan judul film
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${searchTerm}&language=en-US&page=${page}`
    );
    const data = await res.json();
    setMovies(data.results);
    setTotalPages(data.total_pages); // Update total halaman untuk hasil pencarian
  };

  // Fungsi untuk memuat halaman berikutnya
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1); // Ubah state halaman ke halaman berikutnya
    }
  };

  // Fungsi untuk memuat halaman sebelumnya
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1); // Ubah state halaman ke halaman sebelumnya
    }
  };

  return (
    <div>
      <Navbar />
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

        <h1 className="text-xl font-bold mt-8">Movie Results</h1>
        <div className="grid grid-cols-3 gap-4">
          {movies.map((movie) => (
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

        {/* Tombol Pagination */}
        <div className="flex justify-center space-x-4 mt-8">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className={`bg-gray-500 text-white p-2 rounded ${
              page === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className={`bg-gray-500 text-white p-2 rounded ${
              page === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Next
          </button>
        </div>

        <p className="text-center mt-4">
          Page {page} of {totalPages}
        </p>
      </div>
    </div>
  );
};

export default MoviePage;
