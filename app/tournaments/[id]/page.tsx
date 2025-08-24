
import { prisma } from "@/app/lib/prisma";
import Bracket from "@/app/components/Bracket";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/app/lib/auth"; // funkcja do pobrania aktualnego usera

interface Params {
  params: {
    id: string;
  };
}

export default async function TournamentPage({ params }: Params) {
  const user = await getCurrentUser();

  const tournament = await prisma.tournament.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      ownerId: true,   // pobierz właściciela turnieju
      matches: {
        include: {
          player1: { select: { id: true, username: true, name: true } },
          player2: { select: { id: true, username: true, name: true } },
          participants: {
            include: {
              user: { select: { id: true, username: true, name: true } },
              team: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
  });

  if (!tournament) {
    notFound();
  }

  const matches = tournament.matches.map((match) => {
    // Prefer participant-based (teams/mixed) data if present
    const p1 = match.participants?.find((p: any) => p.slot === 1) ?? null;
    const p2 = match.participants?.find((p: any) => p.slot === 2) ?? null;

    const player1 = p1
      ? p1.team
        ? {
            id: p1.team.id,
            username: p1.team.name,
            name: p1.team.name,
            participantId: p1.id,
          }
        : p1.user
        ? {
            id: p1.user.id,
            username: p1.user.username,
            name: p1.user.name ?? p1.user.username,
            participantId: p1.id,
          }
        : null
      : match.player1
      ? {
          id: match.player1.id,
          username: match.player1.username,
          name: match.player1.name ?? match.player1.username,
        }
      : null;

    const player2 = p2
      ? p2.team
        ? {
            id: p2.team.id,
            username: p2.team.name,
            name: p2.team.name,
            participantId: p2.id,
          }
        : p2.user
        ? {
            id: p2.user.id,
            username: p2.user.username,
            name: p2.user.name ?? p2.user.username,
            participantId: p2.id,
          }
        : null
      : match.player2
      ? {
          id: match.player2.id,
          username: match.player2.username,
          name: match.player2.name ?? match.player2.username,
        }
      : null;

    // Compute winnerId for UI highlighting:
    // - If participant-based winner flag exists, use the underlying userId/teamId to match player.id
    // - Otherwise fallback to legacy match.winnerId (user id)
    let computedWinnerId: string | null = match.winnerId ?? null;
    const winnerParticipant = match.participants?.find((p: any) => p.isWinner);
    if (winnerParticipant) {
      computedWinnerId = (winnerParticipant.userId as string) ?? (winnerParticipant.teamId as string) ?? null;
    }

    return {
      id: match.id,
      round: match.round,
      matchNumber: match.matchNumber ?? 0,
      player1,
      player2,
      winnerId: computedWinnerId,
      nextMatchId: match.nextMatchId ?? null,
      nextMatchPlayerSlot: (match.nextMatchPlayerSlot ?? null) as 1 | 2 | null,
      bracket: match.bracket as "winners" | "losers" | "grandFinal",
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-2">
            Turniej: <span className="text-indigo-400">{tournament.name}</span>
          </h1>

          {/* Tutaj warunkowy link edycji turnieju */}
          {tournament.ownerId === user?.id && (
            <Link
              href={`/tournaments/${tournament.id}/edit`}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 inline-block mt-4"
            >
              Edytuj turniej
            </Link>
          )}
        </header>

        <section className="bg-gray-800 rounded-2xl shadow-lg p-6">
          <Bracket matches={matches} />
        </section>
      </div>
    </div>
  );
}
