import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params; // tu awaitujemy Promise<{ id: string }>
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Brak ID turnieju" }, { status: 400 });
  }

  try {
    const matches = await prisma.match.findMany({
      where: { tournamentId: id },
      orderBy: { round: "asc" },
    });

    return NextResponse.json({ matches });
  } catch (error) {
    console.error("Błąd pobierania meczów:", error);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}