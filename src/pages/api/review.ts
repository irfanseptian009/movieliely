import { PrismaClient } from "@prisma/client";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

// Initialize Prisma Client
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { userId, movie } = req.body;

    // Validate incoming data
    if (!userId || !ObjectId.isValid(userId) || !movie || !movie.id) {
      return res.status(400).json({ message: "Invalid userId or movie data" });
    }

    try {
      // Convert userId to ObjectId
      const userObjectId = new ObjectId(userId);

      // Check if the user exists
      const user = await prisma.user.findUnique({
        where: { id: userObjectId.toString() },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the movie is already in the watchlist
      const existingWatchlistItem = await prisma.watchlist.findFirst({
        where: {
          movieId: movie.id, // movie.id is treated as a string
          userId: userObjectId.toString(), // Ensure userId is properly formatted
        },
      });

      if (existingWatchlistItem) {
        return res.status(400).json({ message: "Movie already in watchlist" });
      }

      // Add movie to the watchlist
      const newWatchlistItem = await prisma.watchlist.create({
        data: {
          movieId: movie.id, // movie.id as a string
          title: movie.title,
          imageUrl: movie.imageUrl,
          overview: movie.overview,
          release_date: movie.release_date ? new Date(movie.release_date) : null,
          rating: movie.rating || 0,
          genres: movie.genres,
          userId: userObjectId.toString(), // Convert userId to string to store it properly
        },
      });

      res
        .status(200)
        .json({ message: "Movie added to watchlist", watchlistItem: newWatchlistItem });
    } catch (error) {
      console.error("Error adding movie to watchlist:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
