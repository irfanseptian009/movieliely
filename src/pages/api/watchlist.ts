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
      // Menyimpan film ke watchlist berdasarkan userId
      const savedMovie = await prisma.watchlist.create({
        data: {
          title: movie.title,
          imageUrl: movie.imageUrl,
          userId, // Kaitkan dengan userId dari pengguna yang login
          movieId: movie.id.toString(), // Pastikan movieId disimpan sebagai string
        },
      });
      res.status(200).json(savedMovie);
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
      // Mengambil daftar watchlist berdasarkan userId
      const watchlistMovies = await prisma.watchlist.findMany({
        where: { userId: userId as string },
      });

      res.status(200).json(watchlistMovies);
    } catch (error) {
      console.error("Error fetching watchlist movies:", error);
      res.status(500).json({ error: "Failed to fetch watchlist movies" });
    }
  } else if (method === "DELETE") {
    const { movieId } = req.body;

    if (!movieId) {
      return res.status(400).json({ error: "MovieId is required" });
    }

    try {
      // Menghapus film dari watchlist berdasarkan movieId
      await prisma.watchlist.delete({
        where: {
          id: movieId, // Menghapus berdasarkan id dari tabel watchlist
        },
      });
      res.status(200).json({ message: "Movie deleted from watchlist successfully" });
    } catch (error) {
      console.error("Error deleting movie from watchlist:", error);
      res.status(500).json({ error: "Failed to delete movie from watchlist" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET", "DELETE"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
