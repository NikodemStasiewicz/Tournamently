
import { Player, BracketMatch } from "./types";




// Przykład generowania rundy 1 (upper bracket)
export function generateDoubleEliminationBracket(players: Player[]): BracketMatch[] {
  if (!players || players.length === 0) {
    return [];
  }

  const matches: BracketMatch[] = [];
  let matchNumber = 1;

  // Górna drabinka (Round 1)
  for (let i = 0; i < players.length; i += 2) {
    matches.push({
      id: `match-${matchNumber}`,
      round: 1,
      matchNumber: matchNumber,
      player1: players[i],
      player2: players[i + 1] ?? null,
      winnerId: null,
      nextMatchId: null, // możesz później dodać logikę łączenia meczów
      nextMatchPlayerSlot: null,
      bracket: "winners",
    });

    matchNumber++;
  }

  // Tu możesz dodać tworzenie meczów dla "LOSERS" jeśli chcesz pełną logikę double elimination

  return matches;
}
