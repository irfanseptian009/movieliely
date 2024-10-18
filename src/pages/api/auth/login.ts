import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(401).json({ message: "User not found" });

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

  res.status(200).json({ message: "Login successful", userId: user.id });
}
