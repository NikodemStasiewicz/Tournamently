

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

          {/* Tournament grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {tournaments.map((tournament, index) => {
              const filled = tournament.participants.length;
              const limit = tournament.participantLimit;
              const fillPercentage = (filled / limit) * 100;

              const userAlreadyJoined = tournament.participants.some(
                (p) => p.userId === user?.id
              );

              // Status indicators
              const isHot = fillPercentage > 80;
              const isNew = index < 3;
              const isFilling = fillPercentage > 50 && fillPercentage <= 80;

              return (
                <div
                  key={tournament.id}
                  className="group relative"
                >
                  {/* Card glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  <div className="relative bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 h-full flex flex-col transition-all duration-300 group-hover:border-slate-600/70 group-hover:transform group-hover:-translate-y-1 group-hover:shadow-2xl">
                    
                    {/* Corner accent */}
                    <div className="absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 border-cyan-400/50 rounded-tl-2xl"></div>
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 border-pink-400/50 rounded-br-2xl"></div>
                    
                    {/* Status badges */}
                    <div className="absolute -top-2 -right-2 flex gap-2">
                      {isNew && (
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg border border-cyan-400/50">
                          <BoltIcon className="w-3 h-3" />
                          NEW
                        </div>
                      )}
                      {isHot && (
                        <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-lg animate-pulse border border-red-400/50">
                          <FireIcon className="w-3 h-3" />
                          HOT
                        </div>
                      )}
                      {isFilling && !isHot && (
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg border border-amber-400/50">
                          FILLING
                        </div>
                      )}
                    </div>

                    {/* Tournament header */}
                    <div className="mb-4 mt-2">
                      <h2 className="text-2xl font-black text-white mb-2 group-hover:text-cyan-300 transition-colors tracking-tight">
                        {tournament.name}
                      </h2>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-600/50">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                          <SparklesIcon className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-200 font-bold text-sm uppercase tracking-wider">
                            {tournament.game}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar for slots */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-slate-400 font-bold uppercase tracking-wide">Slots</span>
                          <span className="text-slate-200 font-mono font-black bg-slate-900/50 px-2 py-0.5 rounded border border-slate-600/50">
                            {filled}/{limit}
                          </span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden border border-slate-600/50 shadow-inner">
                          <div 
                            className={`h-full transition-all duration-700 shadow-lg ${
                              isHot ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-red-500/50' :
                              isFilling ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/50' :
                              'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-cyan-500/50'
                            }`}
                            style={{ width: `${fillPercentage}%` }}
                          >
                            <div className="w-full h-full bg-gradient-to-r from-white/20 to-transparent"></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tournament details */}
                    <div className="space-y-4 flex-grow">
                      <div className="flex items-start gap-3 text-slate-300 bg-slate-900/30 p-3 rounded-lg border border-slate-700/30">
                        <CalendarDaysIcon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <div className="font-black uppercase tracking-wide text-slate-200">Start Date</div>
                          <div className="text-slate-400 font-mono">
                            {format(new Date(tournament.startDate), "d MMM yyyy", { locale: pl })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 text-slate-300 bg-slate-900/30 p-3 rounded-lg border border-slate-700/30">
                        <TrophyIcon className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <div className="font-black uppercase tracking-wide text-slate-200">Format</div>
                          <div className="text-slate-400 font-semibold">
                            {tournament.format === "SINGLE_ELIMINATION" ? "Single Elimination" : "Double Elimination"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 text-slate-300 bg-slate-900/30 p-3 rounded-lg border border-slate-700/30">
                        <UserIcon className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm w-full">
                          <div className="font-black uppercase tracking-wide text-slate-200">Host</div>
                          <div className="text-slate-400 truncate font-semibold">
                            {tournament.owner?.username ?? tournament.owner?.email ?? "Unknown"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-6 flex items-center justify-between gap-3">
                      <Link
                        href={`/tournaments/${tournament.id}`}
                        className="flex-1 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white text-center py-3 px-4 rounded-lg font-black text-sm uppercase tracking-wide transition-all duration-200 transform hover:scale-105 border border-slate-600 shadow-lg"
                      >
                        View Details
                      </Link>
                      <div className="flex-1">
                        <JoinButton
                          tournamentId={tournament.id}
                          userId={user?.id}
                          initialJoined={userAlreadyJoined}
                        />
                      </div>
                    </div>

                    {/* Hover effect line */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 shadow-lg"></div>
                  </div>
                </div>
              );
            })}
          </div>

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