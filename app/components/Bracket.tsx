

"use client";

import React from "react";
import { BracketMatch, Player } from "../lib/types";
import { ArcherContainer, ArcherElement } from "react-archer";
import { Trophy } from "lucide-react";

interface Props {
  matches: BracketMatch[];
}

function groupByRound(matches: BracketMatch[]) {
  const rounds: Record<number, BracketMatch[]> = {};
  matches.forEach((m) => {
    if (!rounds[m.round]) rounds[m.round] = [];
    rounds[m.round].push(m);
  });
  return rounds;
}

export default function Bracket({ matches }: Props) {
  const winners = matches.filter((m) => m.bracket === "winners");
  const losers = matches.filter((m) => m.bracket === "losers");
  const grandFinal = matches.filter((m) => m.bracket === "grandFinal");

  const renderRounds = (sectionTitle: string, matches: BracketMatch[]) => {
    const rounds = groupByRound(matches);
    const roundNumbers = Object.keys(rounds)
      .map(Number)
      .sort((a, b) => a - b);

    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 mb-8 border border-gray-700">
        <h3 className="text-pink-500 text-2xl font-bold mb-4 sm:mb-6 pb-2 border-b-2 border-pink-600 uppercase tracking-wider">
          {sectionTitle}
        </h3>
        <ArcherContainer
          strokeColor="#ec4899"
          strokeWidth={2}
          endMarker
          svgContainerStyle={{ zIndex: 9999, overflow: "visible", pointerEvents: "none" }}
          style={{ position: "relative", width: "100%", overflow: "visible" }}
        >
          <div className="flex space-x-4 sm:space-x-8 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-pink-600 scrollbar-track-gray-800">
            {roundNumbers.map((roundNum) => (
              <div
                key={roundNum}
                className="flex flex-col space-y-4 sm:space-y-6 min-w-[220px] sm:min-w-[240px] bg-gray-900/60 rounded-xl p-3 sm:p-4 border border-gray-700 shadow-inner"
              >
                <h4 className="text-pink-400 font-semibold text-center text-lg mb-1 sm:mb-2">
                  Runda {roundNum}
                </h4>
                {rounds[roundNum].map((match) => (
                  <ArcherElement
                    key={match.id}
                    id={`m-${match.id}`}
                    relations={[
                      ...(match.nextMatchId
                        ? [
                            {
                              targetId: `m-${match.nextMatchId}`,
                              targetAnchor: "left",
                              sourceAnchor: "right",
                              style: { strokeColor: "#22c55e", strokeWidth: 3 },
                            } as any,
                          ]
                        : []),
                      ...(match.nextLoserMatchId
                        ? [
                            {
                              targetId: `m-${match.nextLoserMatchId}`,
                              targetAnchor: "left",
                              sourceAnchor: "right",
                              style: { strokeColor: "#f59e0b", strokeWidth: 3, strokeDasharray: "6 4" },
                            } as any,
                          ]
                        : []),
                    ]}
                  >
                    <MatchCard match={match} />
                  </ArcherElement>
                ))}
              </div>
            ))}
          </div>
        </ArcherContainer>
      </div>
    );
  };

  return (
    <div className="space-y-10 px-4 sm:px-12">
      {winners.length > 0 && renderRounds("Górna Drabinka", winners)}
      {losers.length > 0 && renderRounds("Dolna Drabinka", losers)}
      {grandFinal.length > 0 && renderRounds("Wielki Finał", grandFinal)}
    </div>
  );
}

function MatchCard({ match }: { match: BracketMatch }) {
  const completed = Boolean(match.winnerId);
  const p1Winner = completed && match.player1?.id && match.winnerId === match.player1.id;
  const p2Winner = completed && match.player2?.id && match.winnerId === match.player2.id;

  return (
    <div className="bg-gray-800/80 rounded-xl p-3 sm:p-4 flex flex-col gap-2 sm:gap-4 border border-gray-700 hover:border-pink-500 hover:shadow-pink-500/30 transition-all duration-200 shadow-md relative z-10 group">
      <PlayerWithButton
        player={match.player1}
        isWinner={!!p1Winner}
        isLoser={completed && !!match.player1 && !p1Winner}
        matchId={match.id}
        playerSlot={1}
        bracket={match.bracket}
        isMatchCompleted={completed}
      />
      <div className="text-gray-500 font-mono text-center text-sm select-none">VS</div>
      <PlayerWithButton
        player={match.player2}
        isWinner={!!p2Winner}
        isLoser={completed && !!match.player2 && !p2Winner}
        matchId={match.id}
        playerSlot={2}
        bracket={match.bracket}
        isMatchCompleted={completed}
      />
      {completed && match.bracket === "grandFinal" && (
        <div className="absolute -top-3 right-3 bg-pink-600 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow-md">
          ✓ Zwycięzca
        </div>
      )}
    </div>
  );
}

function PlayerWithButton({
  player,
  isWinner,
  isLoser = false,
  matchId,
  playerSlot,
  bracket,
  isMatchCompleted,
}: {
  player: Player | null;
  isWinner: boolean;
  isLoser?: boolean;
  matchId: string;
  playerSlot: number;
  bracket: "winners" | "losers" | "grandFinal";
  isMatchCompleted: boolean;
}) {
  if (!player) return <span className="text-gray-600 italic text-center block">Brak gracza</span>;

  const selectWinner = async () => {
    const payload = player?.participantId ? { participantId: player.participantId } : { winnerId: player?.id };
    await fetch(`/api/matches/${matchId}/set-winner`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    location.reload();
  };

  const base = "flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 border w-full flex-wrap gap-2";
  const stateClass = isWinner
    ? "bg-emerald-700/80 border-emerald-500 text-white"
    : isLoser
    ? "bg-gray-700/70 border-gray-600 text-gray-400 opacity-70"
    : "bg-gray-700 text-gray-200 border-gray-600";
  const hover = isWinner ? "ring-2 ring-emerald-400/40" : "hover:border-pink-500";

  const showTrophy = isWinner && bracket === "grandFinal";

  const badge =
    isWinner && bracket !== "grandFinal"
      ? { color: "text-emerald-200", bg: "bg-emerald-600/30", label: "Wygrany" }
      : isLoser && isMatchCompleted
      ? { color: "text-gray-300", bg: "bg-gray-700/50", label: "Przegrany" }
      : null;

  return (
    <div className={`${base} ${stateClass} ${hover}`}>
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold select-none ${
            isWinner ? "bg-emerald-500" : isLoser ? "bg-gray-600" : "bg-pink-500"
          }`}
        >
          {player.username[0].toUpperCase()}
        </div>
        <div className="flex items-center gap-2 min-w-0 truncate">
          <span className={`font-semibold truncate ${isLoser ? "line-through opacity-75" : ""}`}>
            {player.name}
          </span>
          {showTrophy && <Trophy className="w-4 h-4 text-yellow-300 flex-shrink-0" />}
        </div>
      </div>
      <div className="flex-shrink-0 flex items-center gap-2">
        {badge ? (
          <span
            className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded ${badge.bg} ${badge.color} border border-white/10 whitespace-nowrap`}
          >
            {badge.label}
          </span>
        ) : !isMatchCompleted && !isWinner ? (
          <button
            onClick={selectWinner}
            className="text-[11px] text-pink-300 hover:text-pink-200 hover:underline transition-colors whitespace-nowrap"
            title={`Wybierz ${player.name} jako zwycięzcę`}
          >
            Wybierz
          </button>
        ) : null}
      </div>
    </div>
  );
}
