
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { createBracketInDb } from "@/app/lib/createBracketInDb";

interface Params {
  params: { id: string };
}

export async function POST(request: Request, context: Params) {
  const { params } = context;
  const tournamentId = params.id;

  if (!tournamentId) {
    return NextResponse.json({ error: "Niepoprawne ID turnieju" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "Brak ID użytkownika" }, { status: 400 });
    }

    // Sprawdź, czy użytkownik już jest zapisany
    const existing = await prisma.tournamentParticipant.findFirst({
      where: { tournamentId, userId },
    });

    if (existing) {
      return NextResponse.json({ error: "Jesteś już zapisany na ten turniej" }, { status: 400 });
    }

    // Pobierz turniej (format i limit) oraz sprawdź dostępność miejsc
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      select: { format: true, participantLimit: true },
    });

    if (!tournament) {
      return NextResponse.json({ error: "Turniej nie istnieje" }, { status: 404 });
    }

    const currentCount = await prisma.tournamentParticipant.count({
      where: { tournamentId },
    });

    if (currentCount >= tournament.participantLimit) {
      return NextResponse.json({ error: "Turniej jest pełny" }, { status: 400 });
    }

    // Dodaj użytkownika do turnieju
    await prisma.tournamentParticipant.create({
      data: {
        tournamentId,
        userId,
      },
    });

    // Jeśli po dodaniu osiągnięto komplet uczestników -> generuj drabinkę
    if (currentCount + 1 === tournament.participantLimit) {
      const participants = await prisma.tournamentParticipant.findMany({
        where: { tournamentId },
        select: { userId: true },
      });
      const userIds = participants.map((p) => p.userId);
      await createBracketInDb(tournamentId, userIds, tournament.format);
    }

    return NextResponse.json({ message: "Dołączono do turnieju." });
  } catch (error) {
    console.error("Błąd w join/route.ts:", error);
    return NextResponse.json(
      { error: "Coś poszło nie tak" },
      { status: 500 }
    );
  }
}
