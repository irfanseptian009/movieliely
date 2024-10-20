"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useEffect, useState } from "react";

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
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/3">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={500}
              height={750}
              className="rounded-lg"
            />
          </div>
          <div className="lg:w-2/3 lg:pl-8">
            <h1 className="text-3xl font-bold">{movie.title}</h1>
            <p className="mt-4 text-gray-600">{movie.overview}</p>
            <p className="mt-4">
              <strong>Release Date:</strong> {movie.release_date}
            </p>
            <p className="mt-2">
              <strong>Rating:</strong> {movie.vote_average} / 10
            </p>
            <p className="mt-2">
              <strong>Runtime:</strong> {movie.runtime} minutes
            </p>
            <p className="mt-2">
              <strong>Genres:</strong>{" "}
              {movie.genres && movie.genres.length > 0
                ? movie.genres.map((genre: { name: string }) => genre.name).join(", ")
                : "N/A"}
            </p>
            <p className="mt-2">
              <strong>Original Language:</strong> {movie.original_language}
            </p>
            <p className="mt-2">
              <strong>Production Companies:</strong>{" "}
              {movie.production_companies && movie.production_companies.length > 0
                ? movie.production_companies
                    .map((company: { name: string }) => company.name)
                    .join(", ")
                : "N/A"}
            </p>
            <p className="mt-2">
              <strong>Tagline:</strong> {movie.tagline || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
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
}

export default MovieDetailPage;
