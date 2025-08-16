// app/api/profile/updatePassword/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
  }

  const { oldPassword, newPassword } = await req.json();
  if (!oldPassword || !newPassword || newPassword.length < 6) {
    return NextResponse.json({ error: "Niepoprawne dane (hasło musi mieć min. 6 znaków)" }, { status: 400 });
  }

  try {
    // pobierz usera z DB (hash)
    const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { password: true } });
    if (!dbUser) return NextResponse.json({ error: "Nie znaleziono użytkownika" }, { status: 404 });

    const matches = await bcrypt.compare(oldPassword, dbUser.password);
    if (!matches) return NextResponse.json({ error: "Niepoprawne obecne hasło" }, { status: 400 });

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("updatePassword error:", err);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
