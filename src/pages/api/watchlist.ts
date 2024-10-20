import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  // Handle adding a movie to the watchlist
  if (method === "POST") {
    const { userId, movie } = req.body;

    if (!userId || !movie) {
      return res.status(400).json({ error: "Invalid userId or movie data" });
    }

    try {
      const savedMovie = await prisma.watchlist.create({
        data: {
          title: movie.title,
          imageUrl: movie.imageUrl,
          overview: movie.overview || "",
          release_date: movie.release_date ? new Date(movie.release_date) : null,
          rating: movie.rating || 0,
          genres: movie.genres || [],
          userId,
          movieId: movie.id, // Ensure movieId is passed correctly
        },
      });
      res.status(200).json(savedMovie);
    } catch (error) {
      console.error("Error saving movie to watchlist:", error);
      res.status(500).json({ error: "Failed to save movie to watchlist" });
    }

    // Handle fetching movies from the watchlist
  } else if (method === "GET") {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "UserId is required" });
    }

    try {
      const watchlistMovies = await prisma.watchlist.findMany({
        where: { userId: userId as string },
        select: {
          id: true,
          title: true,
          imageUrl: true,
          overview: true,
          release_date: true,
          rating: true,
          genres: true,
          movieId: true,
        },
      });

      res.status(200).json(watchlistMovies);
    } catch (error) {
      console.error("Error fetching watchlist movies:", error);
      res.status(500).json({ error: "Failed to fetch watchlist movies" });
    }

    // Handle deleting a movie from the watchlist
  } else if (method === "DELETE") {
    const { movieId } = req.body;

    if (!movieId) {
      return res.status(400).json({ error: "MovieId is required" });
    }

    try {
      await prisma.watchlist.delete({
        where: { id: movieId },
      });
      res.status(200).json({ message: "Movie deleted successfully from watchlist" });
    } catch (error) {
      console.error("Error deleting movie from watchlist:", error);
      res.status(500).json({ error: "Failed to delete movie from watchlist" });
    }
  } else {
    // Handle unsupported methods
    res.setHeader("Allow", ["POST", "GET", "DELETE"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
