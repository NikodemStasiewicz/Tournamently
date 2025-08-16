export interface Player {
  id?: string;
  username: string;
  name: string | null;  // tutaj przechowujemy wyświetlaną nazwę (np. username lub "Anonim")
}

// export interface BracketMatch {
//   id: string;
//   round: number;
//   matchNumber: number | null;
//   player1: Player | null;
//   player2: Player | null;
//   winnerId: string | null;
//   nextMatchId: string | null;
//   nextMatchPlayerSlot: 1 | 2 | null;
//   bracket: "winners" | "losers"; // ← dodaj to pole!
// }
export interface BracketMatch {
  id: string;
  round: number;
  matchNumber: number | null;
  player1: Player | null;
  player2: Player | null;
  winnerId: string | null;
  nextMatchId: string | null;
  nextMatchPlayerSlot: 1 | 2 | null;
  bracket: "winners" | "losers" | "grandFinal"; //dodałem final
}