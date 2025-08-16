import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface User {
  id: string;
  email: string;
  passwordHash: string;
}

const users: User[] = []; // jak wyżej - pamięć tymczasowa

const JWT_SECRET = process.env.JWT_SECRET || "supersekretnyklucz";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ message: "Nieprawidłowy email lub hasło" });
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Nieprawidłowy email lub hasło" });
  }

  // Stwórz token JWT
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

  // Ustaw cookie z tokenem
  res.setHeader(
    "Set-Cookie",
    `token=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict`
  );

  return res.status(200).json({ message: "Zalogowano pomyślnie" });
}