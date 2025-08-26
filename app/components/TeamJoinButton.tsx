"use client";

import { useState } from "react";

export default function TeamJoinButton({ tournamentId, userId }: { tournamentId: string; userId: string | null }) {
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