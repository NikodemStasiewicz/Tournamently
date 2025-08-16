import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

interface User {
  id: string;
  email: string;
  passwordHash: string;
}

const users: User[] = []; // na start, pamięć (nie do produkcji!)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password || password.length < 6) {
    return res.status(400).json({ message: "Nieprawidłowe dane" });
  }

  // Sprawdź czy użytkownik istnieje
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ message: "Użytkownik już istnieje" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = { id: crypto.randomUUID(), email, passwordHash };
  users.push(newUser);

  return res.status(201).json({ message: "Użytkownik utworzony" });
}
