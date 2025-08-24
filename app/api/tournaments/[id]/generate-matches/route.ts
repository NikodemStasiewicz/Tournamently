import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { createParticipantBracketInDb } from "@/app/lib/createBracketInDb";

export async function POST(request: Request, context: { params: { id: string } }) {
  const tournamentId = context.params.id;

  try {
    // Pobierz turniej
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
    });

    if (!tournament) {
      return NextResponse.json({ error: "Turniej nie istnieje." }, { status: 404 });
    }

    // Pobierz uczestników (user lub team)
    const participants = await prisma.tournamentParticipant.findMany({
      where: { tournamentId },
      select: { userId: true, teamId: true },
    });

    if (participants.length < 2) {
      return NextResponse.json({ error: "Za mało uczestników." }, { status: 400 });
    }

    // Zbuduj listę entries dla generatora (userId lub teamId)
    const entries = participants.map((p) => ({
      userId: p.userId ?? null,
      teamId: p.teamId ?? null,
    }));

    await createParticipantBracketInDb(tournamentId, entries, tournament.format);

    return NextResponse.json({ message: "Drabinka wygenerowana" });
  } catch (error) {
    console.error("Błąd generowania meczów:", error);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
