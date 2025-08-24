

import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import JoinButton from "../components/JoinButton";
import Link from "next/link";
import {
  CalendarDaysIcon,
  UserIcon,
  SparklesIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import TournamentsTabs from "../components/TournamentsTabs";

export default async function TournamentsPage() {
  const user = await getCurrentUser();

  const tournaments = await prisma.tournament.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      owner: true,
      participants: {
        select: { userId: true },
      },
    },
  });

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        
        {/* Scanning lines effect */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400/50 to-transparent animate-pulse delay-1000"></div>
        </div>
      </div>

      <div className="relative z-10 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with gaming aesthetic */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-4">
              <TrophyIcon className="w-8 h-8 text-cyan-400" />
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
                ARENA TURNIEJÓW
              </h1>
              <TrophyIcon className="w-8 h-8 text-pink-400" />
            </div>
            <p className="text-slate-300 text-lg font-medium tracking-wider uppercase">
              DOŁĄCZ DO WALKI • ZDOBĄDŹ CHWAŁĘ • ZOSTAŃ LEGENDĄ
            </p>
            
            {/* Stats bar */}
            <div className="flex justify-center gap-8 mt-8 p-4 bg-black/20 backdrop-blur-sm rounded-2xl border border-slate-700/50 inline-flex">
              <div className="text-center">
                <div className="text-2xl font-black text-cyan-400 font-mono">{tournaments.length}</div>
                <div className="text-slate-400 text-xs uppercase tracking-widest font-bold">Aktywne turnieje</div>
              </div>
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-slate-600 to-transparent"></div>
              <div className="text-center">
                <div className="text-2xl font-black text-purple-400 font-mono">
                  {tournaments.reduce((acc, t) => acc + t.participants.length, 0)}
                </div>
                <div className="text-slate-400 text-xs uppercase tracking-widest font-bold">Gracze online</div>
              </div>
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-slate-600 to-transparent"></div>
              <div className="text-center">
                <div className="text-2xl font-black text-pink-400 font-mono">24/7</div>
                <div className="text-slate-400 text-xs uppercase tracking-widest font-bold">Dostępność</div>
              </div>
            </div>
          </div>

          {/* Tournament tabs by type */}
          <TournamentsTabs
            userId={user?.id ?? null}
            tournaments={tournaments.map((t, index) => ({
              id: t.id,
              name: t.name,
              game: t.game,
              startDate: t.startDate as any,
              endDate: t.endDate as any,
              participantLimit: t.participantLimit,
              format: t.format,
              tournamentType: t.tournamentType as "SOLO_ONLY" | "TEAM_ONLY" | "MIXED",
              ownerName: t.owner?.username ?? t.owner?.email ?? "Unknown",
              currentParticipants: t.participants.length,
              isNew: index < 3,
              userAlreadyJoined: t.participants.some((p: any) => p.userId === user?.id),
            }))}
          />

          {/* Bottom CTA */}
          {tournaments.length === 0 && (
            <div className="text-center mt-20 p-12 bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50">
              <div className="text-8xl mb-6 filter drop-shadow-lg">⚡</div>
              <h3 className="text-3xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-4 uppercase tracking-wide">
                No Active Tournaments
              </h3>
              <p className="text-slate-400 text-lg font-medium">
                Check back soon or create your own tournament to get the action started!
              </p>
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-3xl">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 shadow-lg"></div>
    </main>
  );
}