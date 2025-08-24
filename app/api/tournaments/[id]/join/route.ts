
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { createParticipantBracketInDb } from "@/app/lib/createBracketInDb";

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

    // Pobierz turniej i waliduj typ
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      select: { format: true, participantLimit: true, tournamentType: true },
    });

    if (!tournament) {
      return NextResponse.json({ error: "Turniej nie istnieje" }, { status: 404 });
    }

    if (tournament.tournamentType === "TEAM_ONLY") {
      return NextResponse.json({ error: "Ten turniej przyjmuje tylko zespoły" }, { status: 400 });
    }

    // Sprawdź, czy użytkownik już jest zapisany
    const existing = await prisma.tournamentParticipant.findFirst({
      where: { tournamentId, userId },
    });

    if (existing) {
      return NextResponse.json({ error: "Jesteś już zapisany na ten turniej" }, { status: 400 });
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

    // Jeśli po dodaniu osiągnięto komplet uczestników -> generuj drabinkę uczestników (użytkownicy i zespoły)
    if (currentCount + 1 === tournament.participantLimit) {
      const participants = await prisma.tournamentParticipant.findMany({
        where: { tournamentId },
        select: { userId: true, teamId: true },
      });
      const entries = participants.map((p) => ({
        userId: p.userId ?? null,
        teamId: p.teamId ?? null,
      }));
      await createParticipantBracketInDb(tournamentId, entries, tournament.format);
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
