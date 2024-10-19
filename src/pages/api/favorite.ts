import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === "POST") {
    const { userId, movie } = req.body;

    if (!userId || !movie) {
      return res.status(400).json({ error: "Invalid userId or movie data" });
    }

    try {
      const savedMovie = await prisma.movie.create({
        data: {
          title: movie.title,
          imageUrl: movie.imageUrl,
          overview: movie.overview || "",
          release_date: movie.release_date ? new Date(movie.release_date) : null,
          rating: movie.rating || 0,
          genres: movie.genres || [],
          userId,
        },
      });
      res.status(200).json(savedMovie);
    } catch (error) {
      console.error("Error saving favorite movie:", error);
      res.status(500).json({ error: "Failed to save favorite movie" });
    }
  } else if (method === "GET") {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "UserId is required" });
    }

    try {
      const favoriteMovies = await prisma.movie.findMany({
        where: { userId: userId as string },
        select: {
          id: true,
          title: true,
          imageUrl: true,
          overview: true,
          release_date: true,
          rating: true,
          genres: true,
        },
      });

      res.status(200).json(favoriteMovies);
    } catch (error) {
      console.error("Error fetching favorite movies:", error);
      res.status(500).json({ error: "Failed to fetch favorite movies" });
    }
  } else if (method === "DELETE") {
    const { movieId } = req.body;

    if (!movieId) {
      return res.status(400).json({ error: "MovieId is required" });
    }

    try {
      await prisma.movie.delete({
        where: { id: movieId },
      });
      res.status(200).json({ message: "Movie deleted successfully" });
    } catch (error) {
      console.error("Error deleting movie:", error);
      res.status(500).json({ error: "Failed to delete movie" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET", "DELETE"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
