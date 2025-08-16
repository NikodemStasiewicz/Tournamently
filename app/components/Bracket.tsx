
"use client";
import React from "react";
import { BracketMatch, Player } from "../lib/types";

interface Props {
  matches: BracketMatch[];
}

// Funkcja do grupowania meczów wg rundy
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
      <div className="bg-gray-900 rounded-xl shadow-2xl p-6 mb-8">
        <h3 className="text-indigo-400 text-xl font-semibold mb-6 border-b border-indigo-600 pb-2">
          {sectionTitle}
        </h3>
        <div className="flex space-x-6 overflow-x-auto">
          {roundNumbers.map((roundNum) => (
            <div key={roundNum} className="flex flex-col space-y-6 min-w-[220px]">
              <h4 className="text-indigo-300 font-semibold text-center mb-4">
                Runda {roundNum}
              </h4>
              {rounds[roundNum].map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 px-4 sm:px-10">
      {winners.length > 0 && renderRounds("Górna drabinka", winners)}
      {losers.length > 0 && renderRounds("Dolna drabinka", losers)}
      {grandFinal.length > 0 && renderRounds("Wielki finał", grandFinal)}
    </div>
  );
}

function MatchCard({ match }: { match: BracketMatch }) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 flex flex-col gap-3 border-2 border-gray-700 hover:border-indigo-500 transition-colors shadow-lg relative">
      <PlayerWithButton player={match.player1} isWinner={match.winnerId === match.player1?.id} matchId={match.id} playerSlot={1} />
      <div className="text-gray-400 font-mono text-center text-sm select-none">vs</div>
      <PlayerWithButton player={match.player2} isWinner={match.winnerId === match.player2?.id} matchId={match.id} playerSlot={2} />
      {match.winnerId && (
        <div className="absolute -top-3 right-3 bg-indigo-600 text-white text-xs font-semibold rounded-full px-2 py-0.5 select-none shadow">
          Zwycięzca wybrany
        </div>
      )}
    </div>
  );
}

function PlayerWithButton({
  player,
  isWinner,
  matchId,
  playerSlot,
}: {
  player: Player | null;
  isWinner: boolean;
  matchId: string;
  playerSlot: number;
}) {
  if (!player) {
    return <span className="text-gray-600 italic">Brak gracza</span>;
  }

  const selectWinner = async () => {
    await fetch(`/api/matches/${matchId}/set-winner`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ winnerId: player.id }),
    });
    location.reload();
  };

  return (
    <div className="flex items-center justify-between">
      <div className={`flex items-center space-x-3 ${isWinner ? "text-indigo-300 font-semibold" : "text-gray-300"}`}>
        <div
          className={`w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center font-bold select-none ${
            isWinner ? "ring-2 ring-indigo-400" : ""
          }`}
        >
          {player.username[0].toUpperCase()}
        </div>
        <span>{player.name}</span>
      </div>

      {!isWinner && (
        <button
          onClick={selectWinner}
          className="text-green-400 text-xs hover:underline select-none"
          title={`Wybierz ${player.name} jako zwycięzcę`}
        >
          Wybierz zwycięzcę
        </button>
      )}
    </div>
  );
}
