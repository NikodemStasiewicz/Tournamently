import {prisma} from "@/app//lib/prisma";

export async function getTournamentParticipants(tournamentId: string) {
  const participants = await prisma.tournamentParticipant.findMany({
    where: { tournamentId },
    include: { user: true },
  });

  // Zamieniamy null w name na "Anonim"
  return participants.map(p => ({
    id: p.user.id,
    name: p.user.username ?? "Anonim",
  }));
}