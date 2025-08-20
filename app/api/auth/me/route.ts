import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const cookieStore = await cookies(); // ⬅️ poprawka
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return Response.json({ user: null });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    return Response.json({ user });
  } catch (err) {
    return Response.json({ user: null });
  }
}
