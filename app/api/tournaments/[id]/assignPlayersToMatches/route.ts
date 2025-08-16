  import { NextResponse } from "next/server";
  import { prisma } from "@/app/lib/prisma";
  import { createBracketInDb } from "@/app/lib/createBracketInDb";

  export async function POST(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    const tournamentId = params.id;

    try {
      const tournament = await prisma.tournament.findUnique({
        where: { id: tournamentId },
      });

      if (!tournament) {
        return NextResponse.json({ error: "Turniej nie istnieje." }, { status: 404 });
      }

      const participants = await prisma.tournamentParticipant.findMany({
        where: { tournamentId },
      });

      const userIds = participants.map(p => p.userId).filter(Boolean) as string[];

      if (userIds.length < 2) {
        return NextResponse.json({ error: "Za mało uczestników." }, { status: 400 });
      }

      await createBracketInDb(tournamentId, userIds, tournament.format);

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Błąd przy przypisywaniu graczy:", error);
      return NextResponse.json({ error: "Błąd serwera." }, { status: 500 });
    }
  }
