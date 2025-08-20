import { prisma } from "./prisma";

export async function getUserRanking(game?: string) {
  const users = await prisma.user.findMany({
    include: {
      matchesAsWinner: {
        select: { tournamentId: true },
        where: game ? { tournament: { game } } : undefined,
      },
      matchesAsPlayer1: {
        select: { tournamentId: true },
        where: game ? { tournament: { game } } : undefined,
      },
      matchesAsPlayer2: {
        select: { tournamentId: true },
        where: game ? { tournament: { game } } : undefined,
      },
    },
  });

  const ranking = users.map(user => {
    const allTournaments = [
      ...user.matchesAsPlayer1.map(m => m.tournamentId),
      ...user.matchesAsPlayer2.map(m => m.tournamentId),
    ];
    const uniqueTournaments = Array.from(new Set(allTournaments));

    const matchesPlayed = user.matchesAsPlayer1.length + user.matchesAsPlayer2.length;
    const matchesWon = user.matchesAsWinner.length;
    const winRate = matchesPlayed > 0 ? (matchesWon / matchesPlayed) * 100 : 0;

    return {
      id: user.id,
      username: user.username,
      tournamentsPlayed: uniqueTournaments.length,
      matchesPlayed,
      matchesWon,
      winRate: Math.round(winRate),
    };
  });

  return ranking.sort((a, b) => b.winRate - a.winRate);
}