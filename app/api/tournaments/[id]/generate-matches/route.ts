import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

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

    // Pobierz uczestników
    const participants = await prisma.tournamentParticipant.findMany({
      where: { tournamentId },
    });

    if (participants.length < 2) {
      return NextResponse.json({ error: "Za mało uczestników." }, { status: 400 });
    }

    // Wymieszaj uczestników
    const shuffled = participants.sort(() => Math.random() - 0.5);
    const totalPlayers = shuffled.length;
    const matches = [];

    // Utwórz mecze 1. rundy
    for (let i = 0; i < totalPlayers; i += 2) {
      const player1 = shuffled[i];
      const player2 = shuffled[i + 1];

      const match = await prisma.match.create({
        data: {
          tournamentId,
          round: 1,
          matchNumber: i / 2 + 1,
          bracket: "winners",
          player1Id: player1.userId,
          player2Id: player2?.userId || null,
          // Jeśli player2 == null, to BYE – automatyczna wygrana
        },
      });

      matches.push(match);
    }

    return NextResponse.json({ message: "Mecze 1. rundy wygenerowane", matches });
  } catch (error) {
    console.error("Błąd generowania meczów:", error);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
