import { prisma } from "@/app/lib/prisma";
import { NextRequest } from "next/server";

/**
 * Supports two flows:
 * - Solo matches (legacy): body = { winnerId: string } (User ID). Uses Match.player1Id/player2Id and match.winnerId.
 * - Team/participant-based matches: body = { participantId: string }. Uses MatchParticipant records (userId or teamId) and sets isWinner flag.
 *   Propagates winner/loser to configured next matches by creating MatchParticipant entries in the target slot when empty.
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const matchId = params.id;
  const body = await req.json().catch(() => ({} as any));
  const { winnerId, participantId } = body ?? {};

  // Fetch match with participants and tournament to decide path
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      tournament: true,
      participants: true,
    },
  });

  if (!match) {
    return new Response("Invalid match", { status: 400 });
  }

  // If participant-based (teams or mixed)
  if (participantId || (match.participants && match.participants.length > 0)) {
    const winnerPId = String(participantId || "");
    if (!winnerPId) {
      return new Response("Missing participantId", { status: 400 });
    }

    const participants = match.participants;
    if (participants.length === 0) {
      return new Response("Match has no participants", { status: 400 });
    }

    const winnerP = participants.find((p) => p.id === winnerPId);
    if (!winnerP) {
      return new Response("Participant does not belong to this match", { status: 400 });
    }

    const loserP = participants.find((p) => p.slot !== winnerP.slot) || null;

    // Reset flags and mark winner
    await prisma.matchParticipant.updateMany({
      where: { matchId },
      data: { isWinner: false },
    });
    await prisma.matchParticipant.update({
      where: { id: winnerP.id },
      data: { isWinner: true },
    });

    // Propagate WINNER to next winners match/slot (if configured)
    if (match.nextMatchId && match.nextMatchPlayerSlot) {
      const existing = await prisma.matchParticipant.findFirst({
        where: { matchId: match.nextMatchId, slot: match.nextMatchPlayerSlot },
      });
      if (!existing) {
        await prisma.matchParticipant.create({
          data: {
            matchId: match.nextMatchId,
            slot: match.nextMatchPlayerSlot,
            userId: winnerP.userId ?? null,
            teamId: winnerP.teamId ?? null,
            isWinner: false,
          },
        });
      }
    }

    // Propagate LOSER into losers bracket if double elimination
    if (
      match.tournament?.format === "DOUBLE_ELIMINATION" &&
      match.bracket === "winners" &&
      loserP &&
      match.nextLoserMatchId &&
      match.nextLoserMatchPlayerSlot
    ) {
      const loserExisting = await prisma.matchParticipant.findFirst({
        where: { matchId: match.nextLoserMatchId, slot: match.nextLoserMatchPlayerSlot },
      });
      if (!loserExisting) {
        await prisma.matchParticipant.create({
          data: {
            matchId: match.nextLoserMatchId,
            slot: match.nextLoserMatchPlayerSlot,
            userId: loserP.userId ?? null,
            teamId: loserP.teamId ?? null,
            isWinner: false,
          },
        });
      }
    }

    return new Response("Match result saved (participant mode)", { status: 200 });
  }

  // Legacy SOLO flow (player1Id/player2Id and winnerId on Match)
  if (!winnerId) {
    return new Response("Missing winnerId", { status: 400 });
  }

  const player1Id = match.player1Id;
  const player2Id = match.player2Id;

  if (![player1Id, player2Id].includes(winnerId)) {
    return new Response("Winner must be one of the players in the match", { status: 400 });
  }

  const loserId = winnerId === player1Id ? player2Id : player1Id;

  // Set winner on the match
  await prisma.match.update({
    where: { id: matchId },
    data: { winnerId },
  });

  // Advance winner to next winners slot
  if (match.nextMatchId && match.nextMatchPlayerSlot) {
    if (match.nextMatchPlayerSlot === 1) {
      await prisma.match.update({
        where: { id: match.nextMatchId },
        data: { player1Id: winnerId },
      });
    } else {
      await prisma.match.update({
        where: { id: match.nextMatchId },
        data: { player2Id: winnerId },
      });
    }
  }

  // Send loser to losers bracket if double elimination
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
    if (match.nextLoserMatchPlayerSlot === 1) {
      await prisma.match.update({
        where: { id: match.nextLoserMatchId },
        data: { player1Id: loserId },
      });
    } else {
      await prisma.match.update({
        where: { id: match.nextLoserMatchId },
        data: { player2Id: loserId },
      });
    }
  }

  return new Response("Match result saved", { status: 200 });
}