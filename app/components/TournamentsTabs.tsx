"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import JoinButton from "./JoinButton";
import { CalendarDaysIcon, TrophyIcon, UserIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

type TournamentType = "SOLO_ONLY" | "TEAM_ONLY" | "MIXED";
type FormatType = "SINGLE_ELIMINATION" | "DOUBLE_ELIMINATION";

export interface UITournamentItem {
  id: string;
  name: string;
  game: string;
  startDate: string | Date;
  endDate: string | Date;
  participantLimit: number;
  format: FormatType;
  tournamentType: TournamentType;
  ownerName: string;
  currentParticipants: number;
  isNew: boolean;
  userAlreadyJoined: boolean;
}

export default function TournamentsTabs({
  userId,
  tournaments,
}: {
  userId: string | null;
  tournaments: UITournamentItem[];
}) {
  const [active, setActive] = useState<"ALL" | "TEAM" | "SOLO" | "MIXED">("ALL");

  const filtered = useMemo(() => {
    switch (active) {
      case "TEAM":
        return tournaments.filter((t) => t.tournamentType === "TEAM_ONLY");
      case "SOLO":
        return tournaments.filter((t) => t.tournamentType === "SOLO_ONLY");
      case "MIXED":
        return tournaments.filter((t) => t.tournamentType === "MIXED");
      default:
        return tournaments;
    }
  }, [active, tournaments]);

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/50 border border-slate-700/50 rounded-xl p-2 w-fit mx-auto">
        <Tab label="Wszystkie" active={active === "ALL"} onClick={() => setActive("ALL")} />
        <Tab label="Drużynowe" active={active === "TEAM"} onClick={() => setActive("TEAM")} />
        <Tab label="Solo" active={active === "SOLO"} onClick={() => setActive("SOLO")} />
        <Tab label="Mieszane" active={active === "MIXED"} onClick={() => setActive("MIXED")} />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filtered.map((t) => {
          const filled = t.currentParticipants;
          const limit = t.participantLimit;
          const pct = Math.min(100, Math.round((filled / Math.max(1, limit)) * 100));
          const isHot = pct > 80;
          const isFilling = pct > 50 && pct <= 80;

          return (
            <div key={t.id} className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 h-full flex flex-col transition-all duration-300 group-hover:border-slate-600/70 group-hover:transform group-hover:-translate-y-1 group-hover:shadow-2xl">
                {/* Badges */}
                <div className="absolute -top-2 -right-2 flex gap-2">
                  {t.isNew && (
                    <span className="bg-cyan-600 text-white text-xs font-black px-3 py-1 rounded-full border border-cyan-400/50">
                      NEW
                    </span>
                  )}
                  {isHot && (
                    <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-black px-3 py-1 rounded-full border border-red-400/50">
                      HOT
                    </span>
                  )}
                  {isFilling && !isHot && (
                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black px-3 py-1 rounded-full border border-amber-400/50">
                      FILLING
                    </span>
                  )}
                </div>

                {/* Header */}
                <div className="mb-4 mt-2">
                  <h2 className="text-2xl font-black text-white mb-2 group-hover:text-cyan-300 transition-colors tracking-tight">
                    {t.name}
                  </h2>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-slate-200 font-bold text-sm uppercase tracking-wider bg-slate-900/50 px-3 py-1 rounded-full border border-slate-600/50">
                      {t.game}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full border border-slate-600/50 text-slate-300">
                      {typeLabel(t.tournamentType)}
                    </span>
                  </div>

                  {/* Slots */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400 font-bold uppercase tracking-wide">Slots</span>
                      <span className="text-slate-200 font-mono font-black bg-slate-900/50 px-2 py-0.5 rounded border border-slate-600/50">
                        {filled}/{limit}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden border border-slate-600/50 shadow-inner">
                      <div
                        className={`h-full transition-all duration-700 ${
                          isHot
                            ? "bg-gradient-to-r from-red-500 to-pink-500"
                            : isFilling
                            ? "bg-gradient-to-r from-amber-500 to-orange-500"
                            : "bg-gradient-to-r from-cyan-500 to-blue-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4 flex-grow">
                  <div className="flex items-start gap-3 text-slate-300 bg-slate-900/30 p-3 rounded-lg border border-slate-700/30">
                    <CalendarDaysIcon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-black uppercase tracking-wide text-slate-200">Start Date</div>
                      <div className="text-slate-400 font-mono">
                        {format(new Date(t.startDate), "d MMM yyyy", { locale: pl })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-slate-300 bg-slate-900/30 p-3 rounded-lg border border-slate-700/30">
                    <TrophyIcon className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-black uppercase tracking-wide text-slate-200">Format</div>
                      <div className="text-slate-400 font-semibold">
                        {t.format === "SINGLE_ELIMINATION" ? "Single Elimination" : "Double Elimination"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-slate-300 bg-slate-900/30 p-3 rounded-lg border border-slate-700/30">
                    <UserIcon className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm w-full">
                      <div className="font-black uppercase tracking-wide text-slate-200">Host</div>
                      <div className="text-slate-400 truncate font-semibold">{t.ownerName}</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-between gap-3">
                  <Link
                    href={`/tournaments/${t.id}`}
                    className="flex-1 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white text-center py-3 px-4 rounded-lg font-black text-sm uppercase tracking-wide transition-all duration-200 transform hover:scale-105 border border-slate-600 shadow-lg"
                  >
                    View Details
                  </Link>
                  <div className="flex-1">
                    {t.tournamentType === "TEAM_ONLY" ? (
                      <TeamJoinButton tournamentId={t.id} userId={userId} />
                    ) : (
                      <JoinButton
                        tournamentId={t.id}
                        userId={userId ?? undefined}
                        initialJoined={t.userAlreadyJoined}
                      />
                    )}
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 shadow-lg" />
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center mt-6 p-8 bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50">
          <div className="text-6xl mb-4">⚡</div>
          <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-2 uppercase tracking-wide">
            Brak turniejów w tej zakładce
          </h3>
          <p className="text-slate-400">Zmień zakładkę lub utwórz nowy turniej.</p>
        </div>
      )}
    </div>
  );
}

function TeamJoinButton({ tournamentId, userId }: { tournamentId: string; userId: string | null }) {
  const [loading, setLoading] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [error, setError] = useState("");
  const [ownerTeams, setOwnerTeams] = useState<{ id: string; name: string }[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");

  const loadOwnerTeams = async () => {
    setError("");
    const res = await fetch("/api/teams/my", { cache: "no-store" });
    if (!res.ok) {
      setError("Nie udało się pobrać drużyn.");
      return [] as { id: string; name: string }[];
    }
    const data = await res.json();
    const teams =
      (data as any[])
        ?.filter((m) => m.teamRole === "OWNER" && m.team?.id)
        ?.map((m) => ({ id: m.team.id as string, name: m.team.name as string })) ?? [];
    return teams;
  };

  const joinWithTeam = async (teamId: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/join-team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Błąd dołączania drużyny.");
      } else {
        location.reload();
      }
    } catch {
      setError("Błąd połączenia z serwerem.");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async () => {
    if (!userId) {
      setError("Musisz być zalogowany, aby dołączyć.");
      return;
    }
    setLoading(true);
    const teams = await loadOwnerTeams();
    setLoading(false);

    if (teams.length === 0) {
      setError("Nie jesteś właścicielem żadnej drużyny.");
      return;
    }
    if (teams.length === 1) {
      await joinWithTeam(teams[0].id);
      return;
    }
    setOwnerTeams(teams);
    setSelectedTeamId(teams[0].id);
    setSelecting(true);
  };

  if (selecting) {
    return (
      <div className="flex items-center gap-2">
        <select
          value={selectedTeamId}
          onChange={(e) => setSelectedTeamId(e.target.value)}
          className="flex-1 bg-slate-700 text-white px-2 py-2 rounded border border-slate-600"
        >
          {ownerTeams.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => joinWithTeam(selectedTeamId)}
          disabled={loading || !selectedTeamId}
          className="px-3 py-2 rounded bg-indigo-600 text-white font-semibold disabled:opacity-50"
        >
          {loading ? "Zapisywanie..." : "Zapisz drużynę"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={handleClick}
        disabled={loading}
        className="text-sm px-4 py-1 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {loading ? "Sprawdzanie..." : "Dołącz drużyną"}
      </button>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${
        active ? "bg-indigo-600 text-white" : "text-slate-300 hover:text-white hover:bg-slate-700"
      }`}
    >
      {label}
    </button>
  );
}

function typeLabel(t: TournamentType) {
  switch (t) {
    case "TEAM_ONLY":
      return "Drużynowy";
    case "SOLO_ONLY":
      return "Solo";
    case "MIXED":
      return "Mieszany";
    default:
      return t;
  }
}