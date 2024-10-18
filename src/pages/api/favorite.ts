import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, movie } = req.body;

  // Validasi bahwa userId adalah ObjectId yang valid
  if (!userId || !movie) {
    return res.status(400).json({ error: "Invalid userId or movie data" });
  }

  try {
    const savedMovie = await prisma.movie.create({
      data: {
        title: movie.title,
        imageUrl: movie.imageUrl,
        user: { connect: { id: userId } }, // Hubungkan dengan userId yang valid
      },
    });
    res.status(200).json(savedMovie);
  } catch (error) {
    console.error("Error saving favorite movie:", error);
    res.status(500).json({ error: "Failed to save favorite movie" });
  }
}
