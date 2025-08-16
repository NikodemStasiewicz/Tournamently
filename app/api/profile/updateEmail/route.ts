// app/api/profile/updateEmail/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
  }

  const { email } = await req.json();
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Niepoprawny email" }, { status: 400 });
  }

  // opcjonalnie: walidacja formatu email...
  try {
    // sprawdź czy email nie jest zajęty
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== user.id) {
      return NextResponse.json({ error: "Email jest już używany" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { email },
      select: { id: true, email: true },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (err) {
    console.error("updateEmail error:", err);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}