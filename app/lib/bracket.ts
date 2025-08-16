
// import { v4 as uuidv4 } from "uuid";

// export type Match = {
//   id: string;
//   player1: string | null;
//   player2: string | null;
//   winnerId?: string | null;
//   round: number;
//   bracketType: "WINNERS" | "LOSERS" | "GRAND_FINAL";
//   sourceMatch1Id?: string;
//   sourceMatch2Id?: string;
// };

// // SINGLE ELIMINATION
// export function generateSingleEliminationBracket(participants: string[]): Match[][] {
//   const rounds: Match[][] = [];
//   let currentRoundPlayers: Array<string | null> = [...participants];
//   let round = 1;

//   while (currentRoundPlayers.length > 1) {
//     const roundMatches: Match[] = [];

//     for (let i = 0; i < currentRoundPlayers.length; i += 2) {
//       roundMatches.push({
//         id: uuidv4(),
//         player1: currentRoundPlayers[i],
//         player2: currentRoundPlayers[i + 1] ?? null,
//         round,
//         bracketType: "WINNERS",
//       });
//     }

//     rounds.push(roundMatches);
//     currentRoundPlayers = roundMatches.map(() => null); // placeholdery
//     round++;
//   }

//   return rounds;
// }

// // DOUBLE ELIMINATION
// export function generateDoubleEliminationBracket(participants: string[]): Match[][] {
//   const winnerBracket = generateSingleEliminationBracket(participants).map((round) =>
//     round.map((match) => ({
//       ...match,
//       bracketType: "WINNERS" as const,
//     }))
//   );

//   const losersBracket: Match[][] = [];
//   const totalWinnerRounds = winnerBracket.length;

//   // Generuj rundy loser's bracket (jest ich totalWinnerRounds - 1)
//   for (let i = 0; i < totalWinnerRounds - 1; i++) {
//     const matchCount = Math.pow(2, totalWinnerRounds - i - 2); // połowa poprzedniej rundy
//     const roundMatches: Match[] = [];

//     for (let j = 0; j < matchCount; j++) {
//       roundMatches.push({
//         id: uuidv4(),
//         player1: null,
//         player2: null,
//         round: i + 1,
//         bracketType: "LOSERS",
//       });
//     }

//     losersBracket.push(roundMatches);
//   }

//   // GRAND FINAL
//   const grandFinal: Match[] = [
//     {
//       id: uuidv4(),
//       player1: null,
//       player2: null,
//       round: 1,
//       bracketType: "GRAND_FINAL",
//     },
//   ];

//   return [...winnerBracket, ...losersBracket, grandFinal];
// }
// import { v4 as uuidv4 } from "uuid";

// export type Match = {
//   id: string;
//   player1: string | null;
//   player2: string | null;
//   winnerId?: string | null;
//   round: number;
//   bracketType: "WINNERS" | "LOSERS" | "GRAND_FINAL";
  
// };

// // SINGLE ELIMINATION
// export function generateSingleEliminationBracket(participants: string[]): Match[][] {
//   const rounds: Match[][] = [];
//   let currentRoundPlayers: Array<string | null> = [...participants];
//   let round = 1;

//   while (currentRoundPlayers.length > 1) {
//     const roundMatches: Match[] = [];

//     for (let i = 0; i < currentRoundPlayers.length; i += 2) {
//       roundMatches.push({
//         id: uuidv4(),
//         player1: currentRoundPlayers[i],
//         player2: currentRoundPlayers[i + 1] ?? null,
//         round,
//         bracketType: "WINNERS",
//       });
//     }

//     rounds.push(roundMatches);
//     currentRoundPlayers = roundMatches.map(() => null);
//     round++;
//   }

//   return rounds;
// }

// // DOUBLE ELIMINATION
// export function generateDoubleEliminationBracket(participants: string[]): Match[][] {
//   const winnersRounds: Match[][] = [];
//   const losersRounds: Match[][] = [];
//   const numParticipants = participants.length;
//   let currentPlayers: (string | null)[] = [...participants];

//   // Generate Winner's Bracket
//   let round = 1;
//   while (currentPlayers.length > 1) {
//     const matches: Match[] = [];
//     for (let i = 0; i < currentPlayers.length; i += 2) {
//       matches.push({
//         id: uuidv4(),
//         player1: currentPlayers[i],
//         player2: currentPlayers[i + 1] ?? null,
//         round,
//         bracketType: "WINNERS",
//       });
//     }

//     winnersRounds.push(matches);
//     currentPlayers = matches.map(() => null);
//     round++;
//   }

//   // Generate Loser's Bracket
//   let loserRound = 1;
//   let loserMatchesCount = Math.floor(numParticipants / 2) - 1;

//   for (let i = 0; i < winnersRounds.length - 1; i++) {
//     const roundMatches: Match[] = [];
//     for (let j = 0; j < loserMatchesCount; j++) {
//       roundMatches.push({
//         id: uuidv4(),
//         player1: null,
//         player2: null,
//         round: loserRound,
//         bracketType: "LOSERS",
//       });
//     }
//     loserMatchesCount = Math.ceil(loserMatchesCount / 2);
//     losersRounds.push(roundMatches);
//     loserRound++;
//   }

//   // Generate Grand Final
//   const grandFinal: Match[] = [
//     {
//       id: uuidv4(),
//       player1: null,
//       player2: null,
//       round: 1,
//       bracketType: "GRAND_FINAL",
//     },
//   ];

//   return [...winnersRounds, ...losersRounds, grandFinal];
// }
// import { v4 as uuidv4 } from "uuid";

// export type Match = {
//   id: string;
//   player1: string | null;
//   player2: string | null;
//   winnerId?: string | null;
//   round: number;
//   bracketType: "WINNERS" | "LOSERS" | "GRAND_FINAL";
//   nextMatchId?: string | null;
//   nextMatchPlayerSlot?: 1 | 2 | null;
// };

// export function generateSingleEliminationBracket(participants: string[]): Match[][] {
//   const rounds: Match[][] = [];
//   let currentRoundPlayers: Array<string | null> = [...participants];
//   let round = 1;

//   while (currentRoundPlayers.length > 1) {
//     const roundMatches: Match[] = [];

//     for (let i = 0; i < currentRoundPlayers.length; i += 2) {
//       roundMatches.push({
//         id: uuidv4(),
//         player1: currentRoundPlayers[i],
//         player2: currentRoundPlayers[i + 1] ?? null,
//         round,
//         bracketType: "WINNERS",
//         nextMatchId: null,
//         nextMatchPlayerSlot: null,
//       });
//     }

//     if (round > 1) {
//       const prevRound = rounds[round - 2];
//       for (let i = 0; i < prevRound.length; i++) {
//         const next = roundMatches[Math.floor(i / 2)];
//         prevRound[i].nextMatchId = next.id;
//         prevRound[i].nextMatchPlayerSlot = (i % 2) + 1 as 1 | 2;
//       }
//     }

//     rounds.push(roundMatches);
//     currentRoundPlayers = roundMatches.map(() => null);
//     round++;
//   }

//   return rounds;
// }

// export function generateDoubleEliminationBracket(participants: string[]): Match[][] {
//   const winners = generateSingleEliminationBracket(participants);
//   const losers: Match[][] = [];
//   const grandFinal: Match[] = [];

//   const totalWinnersRounds = winners.length;
//   const numLosersRounds = totalWinnersRounds - 1 + 1;

//   // Losers
//   let matchCount = Math.floor(participants.length / 2);
//   for (let i = 0; i < numLosersRounds; i++) {
//     const roundMatches: Match[] = [];
//     const matchesInRound = Math.ceil(matchCount / 2);

//     for (let j = 0; j < matchesInRound; j++) {
//       roundMatches.push({
//         id: uuidv4(),
//         player1: null,
//         player2: null,
//         round: i + 1,
//         bracketType: "LOSERS",
//         nextMatchId: null,
//         nextMatchPlayerSlot: null,
//       });
//     }

//     losers.push(roundMatches);
//     matchCount = matchesInRound;
//   }

//   // GRAND FINAL
//   grandFinal.push({
//     id: uuidv4(),
//     player1: null,
//     player2: null,
//     round: 1,
//     bracketType: "GRAND_FINAL",
//   });

//   return [...winners, ...losers, grandFinal];
// }
// import { v4 as uuidv4 } from "uuid";

// export type Match = {
//   id: string;
//   player1: string | null;
//   player2: string | null;
//   winnerId?: string | null;
//   round: number;
//   matchIndex: number;
//   bracketType: "WINNERS" | "LOSERS" | "GRAND_FINAL";
//   nextMatchId?: string | null;
//   nextMatchPlayerSlot?: 1 | 2 | null;
// };


// export function generateSingleEliminationBracket(participants: string[]): Match[][] {
//   const rounds: Match[][] = [];
//   let currentRoundPlayers: Array<string | null> = [...participants];
//   let round = 1;

//   while (currentRoundPlayers.length > 1) {
//     const roundMatches: Match[] = [];

//     for (let i = 0; i < currentRoundPlayers.length; i += 2) {
//       roundMatches.push({
//         id: uuidv4(),
//         player1: currentRoundPlayers[i],
//         player2: currentRoundPlayers[i + 1] ?? null,
//         round,
//         matchIndex: i / 2,
//         bracketType: "WINNERS",
//         nextMatchId: null,
//         nextMatchPlayerSlot: null,
//       });
//     }

//     if (round > 1) {
//       const prevRound = rounds[round - 2];
//       for (let i = 0; i < prevRound.length; i++) {
//         const next = roundMatches[Math.floor(i / 2)];
//         prevRound[i].nextMatchId = next.id;
//         prevRound[i].nextMatchPlayerSlot = ((i % 2) + 1) as 1 | 2;
//       }
//     }

//     rounds.push(roundMatches);
//     currentRoundPlayers = roundMatches.map(() => null);
//     round++;
//   }

//   return rounds;
// }

// export function generateDoubleEliminationBracket(participants: string[]): Match[][] {
//   const winners = generateSingleEliminationBracket(participants);
//   const losers: Match[][] = [];
//   const grandFinal: Match[] = [];

//   const totalWinnersRounds = winners.length;
//   const numLosersRounds = totalWinnersRounds;

//   // Losers bracket
//   let matchCount = Math.floor(participants.length / 2);
//   for (let i = 0; i < numLosersRounds; i++) {
//     const roundMatches: Match[] = [];
//     const matchesInRound = Math.ceil(matchCount / 2);

//     for (let j = 0; j < matchesInRound; j++) {
//       roundMatches.push({
//         id: uuidv4(),
//         player1: null,
//         player2: null,
//         round: i + 1,
//         matchIndex: j,
//         bracketType: "LOSERS",
//         nextMatchId: null,
//         nextMatchPlayerSlot: null,
//       });
//     }

//     losers.push(roundMatches);
//     matchCount = matchesInRound;
//   }

//   // Grand Final
//   grandFinal.push({
//     id: uuidv4(),
//     player1: null,
//     player2: null,
//     round: 1,
//     matchIndex: 0,
//     bracketType: "GRAND_FINAL",
//   });

//   return [...winners, ...losers, grandFinal];
// }
// import { v4 as uuidv4 } from "uuid";
// import type { Match as PrismaMatch, BracketType } from "@prisma/client";

// // Typ meczów używany w generatorze
// export type Match = {
//   id: string;
//   player1: string | null;
//   player2: string | null;
//   winnerId?: string | null;
//   round: number;
//   bracketType: BracketType;
//   nextMatchId?: string | null;
//   nextMatchPlayerSlot?: 1 | 2 | null;
// };

// /**
//  * Generowanie drabinki single elimination
//  */
// export function generateSingleEliminationBracket(participants: string[]): Match[][] {
//   const rounds: Match[][] = [];
//   let currentRoundPlayers: Array<string | null> = [...participants];
//   let round = 1;

//   while (currentRoundPlayers.length > 1) {
//     const roundMatches: Match[] = [];

//     for (let i = 0; i < currentRoundPlayers.length; i += 2) {
//       roundMatches.push({
//         id: uuidv4(),
//         player1: currentRoundPlayers[i],
//         player2: currentRoundPlayers[i + 1] ?? null,
//         round,
//         bracketType: "WINNERS",
//         nextMatchId: null,
//         nextMatchPlayerSlot: null,
//       });
//     }

//     // Ustawianie powiązań do następnych meczów
//     if (round > 1) {
//       const prevRound = rounds[round - 2];
//       for (let i = 0; i < prevRound.length; i++) {
//         const next = roundMatches[Math.floor(i / 2)];
//         prevRound[i].nextMatchId = next.id;
//         prevRound[i].nextMatchPlayerSlot = (i % 2) + 1 as 1 | 2;
//       }
//     }

//     rounds.push(roundMatches);
//     currentRoundPlayers = roundMatches.map(() => null);
//     round++;
//   }

//   return rounds;
// }

// /**
//  * Generowanie drabinki double elimination (prosty szkielet)
//  */
// export function generateDoubleEliminationBracket(participants: string[]): Match[][] {
//   const winners = generateSingleEliminationBracket(participants);
//   const losers: Match[][] = [];
//   const grandFinal: Match[] = [];

//   const totalWinnersRounds = winners.length;
//   const numLosersRounds = totalWinnersRounds;

//   let matchCount = Math.floor(participants.length / 2);
//   for (let i = 0; i < numLosersRounds; i++) {
//     const roundMatches: Match[] = [];
//     const matchesInRound = Math.ceil(matchCount / 2);

//     for (let j = 0; j < matchesInRound; j++) {
//       roundMatches.push({
//         id: uuidv4(),
//         player1: null,
//         player2: null,
//         round: i + 1,
//         bracketType: "LOSERS",
//         nextMatchId: null,
//         nextMatchPlayerSlot: null,
//       });
//     }

//     losers.push(roundMatches);
//     matchCount = matchesInRound;
//   }

//   grandFinal.push({
//     id: uuidv4(),
//     player1: null,
//     player2: null,
//     round: 1,
//     bracketType: "GRAND_FINAL",
//   });

//   return [...winners, ...losers, grandFinal];
// }

// /**
//  * Grupowanie meczów z bazy danych do rund
//  */
// export function groupMatchesIntoRounds(matches: PrismaMatch[]): PrismaMatch[][] {
//   const byBracket = matches.reduce<Record<string, PrismaMatch[]>>((acc, match) => {
//     const key = match.bracketType;
//     if (!acc[key]) acc[key] = [];
//     acc[key].push(match);
//     return acc;
//   }, {});

//   const groupAndSort = (group: PrismaMatch[] = []): PrismaMatch[][] => {
//     const rounds: Record<number, PrismaMatch[]> = {};
//     group.forEach((match) => {
//       if (!rounds[match.round]) rounds[match.round] = [];
//       rounds[match.round].push(match);
//     });

//     return Object.entries(rounds)
//       .sort(([a], [b]) => Number(a) - Number(b))
//       .map(([_, matches]) => matches);
//   };

//   const winnerRounds = groupAndSort(byBracket["WINNERS"]);
//   const loserRounds = groupAndSort(byBracket["LOSERS"]);
//   const grandFinalRounds = groupAndSort(byBracket["GRAND_FINAL"]);

//   return [...winnerRounds, ...loserRounds, ...grandFinalRounds];
// }

// import { v4 as uuidv4 } from "uuid";

// export type Match = {
//   id: string;
//   player1: string | null;
//   player2: string | null;
//   winnerId?: string | null;
//   round: number;
//   bracketType: "WINNERS" | "LOSERS" | "GRAND_FINAL";
//   nextMatchId?: string | null;
//   nextMatchPlayerSlot?: 1 | 2 | null;
// };

// export function generateSingleEliminationBracket(participants: string[]): Match[][] {
//   const rounds: Match[][] = [];
//   let currentRoundPlayers: Array<string | null> = [...participants];
//   let round = 1;

//   while (currentRoundPlayers.length > 1) {
//     const roundMatches: Match[] = [];

//     for (let i = 0; i < currentRoundPlayers.length; i += 2) {
//       roundMatches.push({
//         id: uuidv4(),
//         player1: currentRoundPlayers[i],
//         player2: currentRoundPlayers[i + 1] ?? null,
//         round,
//         bracketType: "WINNERS",
//         nextMatchId: null,
//         nextMatchPlayerSlot: null,
//       });
//     }

//     if (round > 1) {
//       const prevRound = rounds[round - 2];
//       for (let i = 0; i < prevRound.length; i++) {
//         const next = roundMatches[Math.floor(i / 2)];
//         prevRound[i].nextMatchId = next.id;
//         prevRound[i].nextMatchPlayerSlot = (i % 2) + 1 as 1 | 2;
//       }
//     }

//     rounds.push(roundMatches);
//     currentRoundPlayers = roundMatches.map(() => null);
//     round++;
//   }

//   return rounds;
// }

// export function generateDoubleEliminationBracket(participants: string[]): Match[][] {
//   const winners = generateSingleEliminationBracket(participants);
//   const losers: Match[][] = [];
//   const grandFinal: Match[] = [];

//   const totalWinnersRounds = winners.length;
//   const numLosersRounds = totalWinnersRounds;

//   let matchCount = Math.floor(participants.length / 2);
//   for (let i = 0; i < numLosersRounds; i++) {
//     const roundMatches: Match[] = [];
//     const matchesInRound = Math.ceil(matchCount / 2);

//     for (let j = 0; j < matchesInRound; j++) {
//       roundMatches.push({
//         id: uuidv4(),
//         player1: null,
//         player2: null,
//         round: i + 1,
//         bracketType: "LOSERS",
//         nextMatchId: null,
//         nextMatchPlayerSlot: null,
//       });
//     }

//     losers.push(roundMatches);
//     matchCount = matchesInRound;
//   }

//   grandFinal.push({
//     id: uuidv4(),
//     player1: null,
//     player2: null,
//     round: 1,
//     bracketType: "GRAND_FINAL",
//   });

//   return [...winners, ...losers, grandFinal];
// }

// export function groupMatchesIntoRounds(matches: Match[]) {
//   const winnersRounds: Match[][] = [];
//   const losersRounds: Match[][] = [];
//   const grandFinalRound: Match[] = [];

//   matches.forEach((match) => {
//     if (match.bracketType === "WINNERS") {
//       if (!winnersRounds[match.round - 1]) winnersRounds[match.round - 1] = [];
//       winnersRounds[match.round - 1].push(match);
//     } else if (match.bracketType === "LOSERS") {
//       if (!losersRounds[match.round - 1]) losersRounds[match.round - 1] = [];
//       losersRounds[match.round - 1].push(match);
//     } else if (match.bracketType === "GRAND_FINAL") {
//       grandFinalRound.push(match);
//     }
//   });

//   return { winnersRounds, losersRounds, grandFinalRound };
// }
// import { v4 as uuidv4 } from "uuid";

// // Typ pasujący do modelu z Prisma
// export type Match = {
//   id: string;
//   tournamentId: string;
//   round: number;
//   bracketType: "WINNERS" | "LOSERS" | "GRAND_FINAL";
//   player1: string | null;
//   player2: string | null;
//   winnerId: string | null;
//   nextMatchId: string | null;
//   nextMatchPlayerSlot: 1 | 2 | null;
// };

// // Grupuje mecze na rundy do wyświetlenia w Bracket.tsx
// export function groupMatchesIntoRounds(matches: Match[]) {
//   const winnersRounds: Match[][] = [];
//   const losersRounds: Match[][] = [];
//   const grandFinalRound: Match[] = [];

//   for (const match of matches) {
//     if (match.bracketType === "WINNERS") {
//       if (!winnersRounds[match.round - 1]) {
//         winnersRounds[match.round - 1] = [];
//       }
//       winnersRounds[match.round - 1].push(match);
//     } else if (match.bracketType === "LOSERS") {
//       if (!losersRounds[match.round - 1]) {
//         losersRounds[match.round - 1] = [];
//       }
//       losersRounds[match.round - 1].push(match);
//     } else if (match.bracketType === "GRAND_FINAL") {
//       grandFinalRound.push(match);
//     }
//   }

//   return { winnersRounds, losersRounds, grandFinalRound };
// }

// // Tworzy drabinkę pojedynczej eliminacji
// export function generateSingleEliminationBracket(participants: string[], tournamentId: string): Match[] {
//   const matches: Match[] = [];
//   let round = 1;
//   let currentRoundPlayers: Array<string | null> = [...participants];

//   while (currentRoundPlayers.length > 1) {
//     const roundMatches: Match[] = [];

//     for (let i = 0; i < currentRoundPlayers.length; i += 2) {
//       const match: Match = {
//         id: uuidv4(),
//         tournamentId,
//         round,
//         bracketType: "WINNERS",
//         player1: currentRoundPlayers[i],
//         player2: currentRoundPlayers[i + 1] ?? null,
//         winnerId: null,
//         nextMatchId: null,
//         nextMatchPlayerSlot: null,
//       };
//       roundMatches.push(match);
//     }

//     // Łączenie meczów z poprzedniej rundy z kolejną
//     if (round > 1) {
//       const prevRound = matches.filter((m) => m.round === round - 1 && m.bracketType === "WINNERS");
//       for (let i = 0; i < prevRound.length; i++) {
//         const next = roundMatches[Math.floor(i / 2)];
//         prevRound[i].nextMatchId = next.id;
//         prevRound[i].nextMatchPlayerSlot = ((i % 2) + 1) as 1 | 2;
//       }
//     }

//     matches.push(...roundMatches);
//     currentRoundPlayers = roundMatches.map(() => null);
//     round++;
//   }

//   return matches;
// }

// // Tworzy drabinkę podwójnej eliminacji
// export function generateDoubleEliminationBracket(participants: string[], tournamentId: string): Match[] {
//   const winners = generateSingleEliminationBracket(participants, tournamentId);
//   const losers: Match[] = [];
//   const grandFinal: Match[] = [];

//   const winnersRoundsCount = Math.max(...winners.map((m) => m.round));
//   const numLosersRounds = winnersRoundsCount;

//   let matchCount = Math.floor(participants.length / 2);
//   for (let i = 0; i < numLosersRounds; i++) {
//     const matchesInRound = Math.ceil(matchCount / 2);
//     for (let j = 0; j < matchesInRound; j++) {
//       losers.push({
//         id: uuidv4(),
//         tournamentId,
//         round: i + 1,
//         bracketType: "LOSERS",
//         player1: null,
//         player2: null,
//         winnerId: null,
//         nextMatchId: null,
//         nextMatchPlayerSlot: null,
//       });
//     }
//     matchCount = matchesInRound;
//   }

//   grandFinal.push({
//     id: uuidv4(),
//     tournamentId,
//     round: 1,
//     bracketType: "GRAND_FINAL",
//     player1: null,
//     player2: null,
//     winnerId: null,
//     nextMatchId: null,
//     nextMatchPlayerSlot: null,
//   });

//   return [...winners, ...losers, ...grandFinal];
// }

// export interface Player {
//   id: string;
//   name: string;
// }

// export interface Match {
//   id: string;
//   player1: Player | null;
//   player2: Player | null;
// }

// export function createFirstRoundMatches(players: Player[]): Match[] {
//   const matches: Match[] = [];
//   for (let i = 0; i < players.length; i += 2) {
//     matches.push({
//       id: `match-${i / 2 + 1}`,
//       player1: players[i] ?? null,
//       player2: players[i + 1] ?? null,
//     });
//   }
//   return matches;
// }
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
