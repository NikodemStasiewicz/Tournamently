
import { prisma } from "@/app/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const matchId = params.id;
  const { winnerId } = await req.json();

  const match = await prisma.match.findUnique({
    where: { id: matchId },
  });

  if (!match || !winnerId) {
    return new Response("Invalid match or winner", { status: 400 });
  }

  const player1Id = match.player1Id;
  const player2Id = match.player2Id;

  if (![player1Id, player2Id].includes(winnerId)) {
    return new Response("Winner must be one of the players in the match", { status: 400 });
  }

  const loserId = winnerId === player1Id ? player2Id : player1Id;

  // Zapisz zwycięzcę w obecnym meczu
  await prisma.match.update({
    where: { id: matchId },
    data: { winnerId },
  });

  // Przenieś zwycięzcę do kolejnego meczu (jeśli slot jest pusty)
  if (match.nextMatchId && match.nextMatchPlayerSlot) {
    const nextMatch = await prisma.match.findUnique({
      where: { id: match.nextMatchId },
    });

    if (nextMatch) {
      const slotField = match.nextMatchPlayerSlot === 1 ? "player1Id" : "player2Id";
      if (!nextMatch[slotField]) {
        await prisma.match.update({
          where: { id: match.nextMatchId },
          data: { [slotField]: winnerId },
        });
      }
    }
  }

  // Przenieś przegranego do dolnej drabinki (jeśli dotyczy i slot jest pusty)
  const tournament = await prisma.tournament.findUnique({
    where: { id: match.tournamentId },
  });

  if (
    tournament?.format === "DOUBLE_ELIMINATION" &&
    match.bracket === "winners" &&
    loserId &&
    match.nextLoserMatchId &&
    match.nextLoserMatchPlayerSlot
  ) {
    const nextLoserMatch = await prisma.match.findUnique({
      where: { id: match.nextLoserMatchId },
    });

    if (nextLoserMatch) {
      const loserSlotField = match.nextLoserMatchPlayerSlot === 1 ? "player1Id" : "player2Id";
      if (!nextLoserMatch[loserSlotField]) {
        await prisma.match.update({
          where: { id: match.nextLoserMatchId },
          data: { [loserSlotField]: loserId },
        });
      }
    }
  }

  return new Response("Match result saved", { status: 200 });
}