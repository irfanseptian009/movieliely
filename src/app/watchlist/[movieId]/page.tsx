"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaStar,
  FaClock,
  FaLanguage,
  FaFilm,
  FaTag,
  FaFire,
} from "react-icons/fa";

const MovieDetailPage = ({ params }: { params: { movieId: string } }) => {
  const { movieId } = params;
  const [movie, setMovie] = useState<MovieDetails | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
      );
      const data = await res.json();
      setMovie(data);
    };

    fetchMovieDetails();
  }, [movieId]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-950 text-white">
        <div className="container mx-auto p-4 sm:p-8">
          <div className="bg-gradient-to-r from-red-500 via-red-950 to-black rounded-lg shadow-lg p-4 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:space-x-8 items-center lg:items-start">
              {/* Movie Poster */}
              <div className="w-full lg:w-1/3 mb-6 lg:mb-0">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  width={400}
                  height={600}
                  className="rounded-lg shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Movie Details */}
              <div className="lg:w-2/3">
                <h1 className="text-3xl sm:text-4xl font-bold text-lime-400 mb-4">
                  {movie.title}
                </h1>
                <p className="text-base sm:text-lg text-gray-400 mb-6">
                  {movie.overview}
                </p>

                {/* Icons and details */}
                <div className="space-y-4">
                  <p className="flex items-center text-base sm:text-lg">
                    <FaCalendarAlt className="mr-2 text-lime-500" />
                    <strong>Release Date:</strong> {movie.release_date}
                  </p>

                  <p className="flex items-center text-base sm:text-lg">
                    <FaStar className="mr-2 text-yellow-400" />
                    <strong>Rating:</strong> {movie.vote_average} / 10
                  </p>

                  <p className="flex items-center text-base sm:text-lg">
                    <FaClock className="mr-2 text-blue-400" />
                    <strong>Runtime:</strong> {movie.runtime} minutes
                  </p>

                  <p className="flex items-center text-base sm:text-lg">
                    <FaFilm className="mr-2 text-green-400" />
                    <strong>Genres:</strong>{" "}
                    {movie.genres.map((genre) => genre.name).join(", ")}
                  </p>

                  <p className="flex items-center text-base sm:text-lg">
                    <FaLanguage className="mr-2 text-purple-400" />
                    <strong>Original Language:</strong>{" "}
                    {movie.original_language.toUpperCase()}
                  </p>

                  <p className="flex items-center text-base sm:text-lg">
                    <FaTag className="mr-2 text-pink-400" />
                    <strong>Tagline:</strong> {movie.tagline || "N/A"}
                  </p>

                  <p className="flex items-center text-base sm:text-lg">
                    <FaFilm className="mr-2 text-red-500" />
                    <strong>Production Companies:</strong>{" "}
                    {movie.production_companies.map((company) => company.name).join(", ")}
                  </p>

                  <p className="flex items-center text-base sm:text-lg">
                    <FaFire className="mr-2 text-orange-400" />
                    <strong>Status:</strong> Released
                  </p>
                </div>

                {/* Release Date and Popularity */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center text-base sm:text-lg space-y-2 sm:space-x-4">
                  <p className="flex items-center">
                    <FaCalendarAlt className="mr-2 text-gray-300" /> {movie.release_date}
                  </p>
                  <p className="flex items-center">
                    <FaFire className="mr-2 text-orange-400" /> Popularity:{" "}
                    {movie.popularity}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

interface MovieDetails {
  poster_path: string;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  runtime: number;
  genres: Array<{ name: string }>;
  original_language: string;
  production_companies: Array<{ name: string }>;
  tagline: string;
  popularity: number;
}

export default MovieDetailPage;
