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
      // Simpan film ke watchlist pengguna
      const savedWatchlistItem = await prisma.watchlist.create({
        data: {
          userId,
          movieId: movie.id, // pastikan id film dalam bentuk string
          title: movie.title,
          imageUrl: movie.imageUrl,
        },
      });
      res.status(200).json(savedWatchlistItem);
    } catch (error) {
      console.error("Error saving movie to watchlist:", error);
      res.status(500).json({ error: "Failed to save movie to watchlist" });
    }
  } else if (method === "GET") {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "UserId is required" });
    }

    try {
      // Ambil watchlist pengguna berdasarkan userId
      const watchlistMovies = await prisma.watchlist.findMany({
        where: { userId: userId as string },
      });

      res.status(200).json(watchlistMovies);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      res.status(500).json({ error: "Failed to fetch watchlist" });
    }
  } else if (method === "DELETE") {
    const { movieId, userId } = req.body;

    try {
      // Hapus film dari watchlist pengguna
      await prisma.watchlist.deleteMany({
        where: {
          userId: userId,
          movieId: movieId,
        },
      });
      res.status(200).json({ message: "Movie removed from watchlist" });
    } catch (error) {
      console.error("Error removing movie from watchlist:", error);
      res.status(500).json({ error: "Failed to remove movie from watchlist" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET", "DELETE"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
