import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === "POST") {
    const { userId, watchlistId, rating, comment } = req.body;

    // Validasi input
    if (!userId || !watchlistId || !rating || !comment) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // Simpan review baru ke database
      const newReview = await prisma.review.create({
        data: {
          userId,
          watchlistId,
          rating: parseInt(rating, 10),
          comment,
        },
      });
      res.status(200).json(newReview);
    } catch (error) {
      console.error("Error adding review:", error);
      res.status(500).json({ error: "Failed to add review" });
    }
  } else if (method === "GET") {
    const { watchlistId } = req.query;

    if (!watchlistId) {
      return res.status(400).json({ error: "WatchlistId is required" });
    }

    try {
      const reviews = await prisma.review.findMany({
        where: { watchlistId: String(watchlistId) },
        include: {
          user: {
            select: { email: true }, // Sertakan email user
          },
        },
      });
      res.status(200).json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  } else if (method === "DELETE") {
    const { reviewId } = req.body;

    if (!reviewId) {
      return res.status(400).json({ error: "ReviewId is required" });
    }

    try {
      await prisma.review.delete({
        where: { id: String(reviewId) },
      });
      res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ error: "Failed to delete review" });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET", "DELETE"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
