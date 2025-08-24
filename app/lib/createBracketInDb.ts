
import { prisma } from "@/app/lib/prisma";
import { Format, BracketType } from "@prisma/client";

// Funkcja główna - wybiera odpowiedni  algorytm na podstawie formatu
export async function createBracketInDb(
  tournamentId: string,
  userIds: (string | null)[],
  format: Format
) {
  if (userIds.length < 2) throw new Error("Za mało uczestników.");

  // Wyczyść istniejące mecze
  await prisma.match.deleteMany({ where: { tournamentId } });

  switch (format) {
    case Format.SINGLE_ELIMINATION:
      return await createSingleEliminationBracket(tournamentId, userIds);
    case Format.DOUBLE_ELIMINATION:
      return await createDoubleEliminationBracket(tournamentId, userIds);
    default:
      throw new Error(`Nieobsługiwany format turnieju: ${format}`);
  }
}

// ============= SINGLE ELIMINATION =============
async function createSingleEliminationBracket(
  tournamentId: string,
  userIds: (string | null)[]
) {
  function nextPowerOfTwo(n: number): number {
    return Math.pow(2, Math.ceil(Math.log2(n)));
  }

  const targetCount = nextPowerOfTwo(userIds.length);
  const filledUserIds = [...userIds];
  while (filledUserIds.length < targetCount) filledUserIds.push(null);

  const shuffled = filledUserIds.sort(() => Math.random() - 0.5);

  const rounds: any[][] = [];
  let matchNumber = 1;

  // Pierwsza runda
  const round1: any[] = [];
  for (let i = 0; i < shuffled.length / 2; i++) {
    const match = await prisma.match.create({
      data: {
        tournamentId,
        round: 1,
        matchNumber: matchNumber++,
        bracket: BracketType.winners, 
        player1Id: shuffled[i * 2],
        player2Id: shuffled[i * 2 + 1],
      },
    });
    round1.push(match);
  }
  rounds.push(round1);

  // Kolejne rundy aż do finału
  while (rounds[rounds.length - 1].length > 1) {
    const prevRound = rounds[rounds.length - 1];
    const nextRound: any[] = [];
    
    for (let i = 0; i < prevRound.length / 2; i++) {
      const match = await prisma.match.create({
        data: {
          tournamentId,
          round: rounds.length + 1,
          matchNumber: matchNumber++,
          bracket: BracketType.winners,
        },
      });

      // Połącz zwycięzców z poprzedniej rundy
      await prisma.match.update({
        where: { id: prevRound[i * 2].id },
        data: { nextMatchId: match.id, nextMatchPlayerSlot: 1 },
      });
      await prisma.match.update({
        where: { id: prevRound[i * 2 + 1].id },
        data: { nextMatchId: match.id, nextMatchPlayerSlot: 2 },
      });

      nextRound.push(match);
    }
    rounds.push(nextRound);
  }

  console.log(`Single elimination: utworzono ${rounds.length} rund z łączną liczbą ${rounds.flat().length} meczów`);
}

// ============= DOUBLE ELIMINATION =============
async function createDoubleEliminationBracket(
  tournamentId: string,
  userIds: (string | null)[]
) {
  function nextPowerOfTwo(n: number): number {
    return Math.pow(2, Math.ceil(Math.log2(n)));
  }

  const targetCount = nextPowerOfTwo(userIds.length);
  const filledUserIds = [...userIds];
  while (filledUserIds.length < targetCount) filledUserIds.push(null);

  const shuffled = filledUserIds.sort(() => Math.random() - 0.5);

  // --- WINNERS BRACKET ---
  const winnersRounds: any[][] = [];
  let matchNumber = 1;

  // Runda 1 Winners
  const round1: any[] = [];
  for (let i = 0; i < shuffled.length / 2; i++) {
    const match = await prisma.match.create({
      data: {
        tournamentId,
        round: 1,
        matchNumber: matchNumber++,
        bracket: BracketType.winners,
        player1Id: shuffled[i * 2],
        player2Id: shuffled[i * 2 + 1],
      },
    });
    round1.push(match);
  }
  winnersRounds.push(round1);

  // Kolejne rundy winners
  while (winnersRounds[winnersRounds.length - 1].length > 1) {
    const prev = winnersRounds[winnersRounds.length - 1];
    const next: any[] = [];
    for (let i = 0; i < prev.length / 2; i++) {
      const match = await prisma.match.create({
        data: {
          tournamentId,
          round: winnersRounds.length + 1,
          matchNumber: matchNumber++,
          bracket: BracketType.winners,
        },
      });
      await prisma.match.update({
        where: { id: prev[i * 2].id },
        data: { nextMatchId: match.id, nextMatchPlayerSlot: 1 },
      });
      await prisma.match.update({
        where: { id: prev[i * 2 + 1].id },
        data: { nextMatchId: match.id, nextMatchPlayerSlot: 2 },
      });
      next.push(match);
    }
    winnersRounds.push(next);
  }

  // --- LOSERS BRACKET ---
  const losersRounds: any[][] = [];
  let loserMatchNumber = 1000;
  let losersRoundNumber = 1;

  // Pierwsza runda losers: przegrani z pierwszej rundy winners
  if (winnersRounds[0].length > 1) {
    const losersRound1: any[] = [];
    for (let i = 0; i < winnersRounds[0].length / 2; i++) {
      const match = await prisma.match.create({
        data: {
          tournamentId,
          round: losersRoundNumber,
          matchNumber: loserMatchNumber++,
          bracket: BracketType.losers,
        },
      });
      
      // Przegrani z meczów winners idą do losers
      await prisma.match.update({
        where: { id: winnersRounds[0][i * 2].id },
        data: { nextLoserMatchId: match.id, nextLoserMatchPlayerSlot: 1 },
      });
      await prisma.match.update({
        where: { id: winnersRounds[0][i * 2 + 1].id },
        data: { nextLoserMatchId: match.id, nextLoserMatchPlayerSlot: 2 },
      });
      
      losersRound1.push(match);
    }
    losersRounds.push(losersRound1);
    losersRoundNumber++;
  }

  // Kolejne rundy losers - naprzemiennie łączymy z winners i między sobą
  for (let winnersRoundIndex = 1; winnersRoundIndex < winnersRounds.length; winnersRoundIndex++) {
    const winnersRound = winnersRounds[winnersRoundIndex];
    
    // Sprawdzamy czy to ostatnia runda winners (finał)
    if (winnersRound.length === 1) break;
    
    // Poprzednia runda losers
    const prevLosersRound = losersRounds[losersRounds.length - 1];
    
    // Runda gdzie przegrani z winners grają z zwycięzcami z losers
    const mixedRound: any[] = [];
    const numMatches = winnersRound.length; // Tyle ile przegranych z winners
    
    for (let i = 0; i < numMatches; i++) {
      const match = await prisma.match.create({
        data: {
          tournamentId,
          round: losersRoundNumber,
          matchNumber: loserMatchNumber++,
          bracket: BracketType.losers,
        },
      });
      
      // Zwycięzca z poprzedniej rundy losers
      if (i < prevLosersRound.length) {
        await prisma.match.update({
          where: { id: prevLosersRound[i].id },
          data: { nextMatchId: match.id, nextMatchPlayerSlot: 1 },
        });
      }
      
      // Przegrany z bieżącej rundy winners
      await prisma.match.update({
        where: { id: winnersRound[i].id },
        data: { nextLoserMatchId: match.id, nextLoserMatchPlayerSlot: 2 },
      });
      
      mixedRound.push(match);
    }
    losersRounds.push(mixedRound);
    losersRoundNumber++;
    
    // Jeśli jest więcej niż jeden mecz, robimy kolejną rundę gdzie grają między sobą
    if (mixedRound.length > 1) {
      const consolidationRound: any[] = [];
      for (let i = 0; i < mixedRound.length / 2; i++) {
        const match = await prisma.match.create({
          data: {
            tournamentId,
            round: losersRoundNumber,
            matchNumber: loserMatchNumber++,
            bracket: BracketType.losers,
          },
        });
        
        await prisma.match.update({
          where: { id: mixedRound[i * 2].id },
          data: { nextMatchId: match.id, nextMatchPlayerSlot: 1 },
        });
        await prisma.match.update({
          where: { id: mixedRound[i * 2 + 1].id },
          data: { nextMatchId: match.id, nextMatchPlayerSlot: 2 },
        });
        
        consolidationRound.push(match);
      }
      losersRounds.push(consolidationRound);
      losersRoundNumber++;
    }
  }

  // Finał losers: zwycięzca z ostatniej rundy losers vs przegrany z finału winners
  const winnerFinal = winnersRounds[winnersRounds.length - 1][0];
  const lastLosersRound = losersRounds[losersRounds.length - 1];

  const losersFinal = await prisma.match.create({
    data: {
      tournamentId,
      round: losersRoundNumber,
      matchNumber: loserMatchNumber++,
      bracket: BracketType.losers,
    },
  });

  // Zwycięzca z ostatniej rundy losers
  await prisma.match.update({
    where: { id: lastLosersRound[0].id },
    data: { nextMatchId: losersFinal.id, nextMatchPlayerSlot: 1 },
  });
  
  // Przegrany z finału winners
  await prisma.match.update({
    where: { id: winnerFinal.id },
    data: { nextLoserMatchId: losersFinal.id, nextLoserMatchPlayerSlot: 2 },
  });

  // --- GRAND FINAL ---
  const grandFinal = await prisma.match.create({
    data: {
      tournamentId,
      round: Math.max(winnersRounds.length, losersRoundNumber) + 1,
      matchNumber: matchNumber,
      bracket: BracketType.grandFinal,
    },
  });

  // Zwycięzca z finału winners
  await prisma.match.update({
    where: { id: winnerFinal.id },
    data: { nextMatchId: grandFinal.id, nextMatchPlayerSlot: 1 },
  });
  
  // Zwycięzca z finału losers
  await prisma.match.update({
    where: { id: losersFinal.id },
    data: { nextMatchId: grandFinal.id, nextMatchPlayerSlot: 2 },
  });

  console.log(`Double elimination: utworzono ${winnersRounds.length} rund winners, ${losersRounds.length} rund losers + grand final`);
}
// ====== TEAM/MIXED PARTICIPANT-BASED BRACKET CREATION (MatchParticipant) ======
export type ParticipantEntry = { userId?: string | null; teamId?: string | null } | null;

/**
 * Create a bracket for participant entries (users or teams) using MatchParticipant.
 * - Clears existing matches for the tournament.
 * - Supports SINGLE_ELIMINATION and DOUBLE_ELIMINATION.
 * - Initial round fills slot 1/2 via MatchParticipant with userId or teamId. BYE is represented by null.
 * - Subsequent matches are created and linked via nextMatchId/nextLoserMatchId, participants will advance via set-winner.
 */
export async function createParticipantBracketInDb(
  tournamentId: string,
  entries: ParticipantEntry[],
  format: Format
) {
  if (entries.length < 2) throw new Error("Za mało uczestników.");

  // Clear existing matches
  await prisma.match.deleteMany({ where: { tournamentId } });

  switch (format) {
    case Format.SINGLE_ELIMINATION:
      return await createSingleEliminationParticipantBracket(tournamentId, entries);
    case Format.DOUBLE_ELIMINATION:
      return await createDoubleEliminationParticipantBracket(tournamentId, entries);
    default:
      throw new Error(`Nieobsługiwany format turnieju: ${format}`);
  }
}

function nextPowerOfTwo(n: number): number {
  return Math.pow(2, Math.ceil(Math.log2(n)));
}

async function createSingleEliminationParticipantBracket(
  tournamentId: string,
  baseEntries: ParticipantEntry[]
) {
  const targetCount = nextPowerOfTwo(baseEntries.length);
  const filled = [...baseEntries];
  while (filled.length < targetCount) filled.push(null);

  const shuffled = filled.sort(() => Math.random() - 0.5);

  const rounds: any[][] = [];
  let matchNumber = 1;

  // Round 1
  const round1: any[] = [];
  for (let i = 0; i < shuffled.length / 2; i++) {
    const e1 = shuffled[i * 2];
    const e2 = shuffled[i * 2 + 1];

    const match = await prisma.match.create({
      data: {
        tournamentId,
        round: 1,
        matchNumber: matchNumber++,
        bracket: BracketType.winners,
      },
    });

    // Add participants if present
    if (e1 && (e1.userId || e1.teamId)) {
      await prisma.matchParticipant.create({
        data: {
          matchId: match.id,
          slot: 1,
          userId: e1.userId ?? null,
          teamId: e1.teamId ?? null,
        },
      });
    }
    if (e2 && (e2.userId || e2.teamId)) {
      await prisma.matchParticipant.create({
        data: {
          matchId: match.id,
          slot: 2,
          userId: e2.userId ?? null,
          teamId: e2.teamId ?? null,
        },
      });
    }

    round1.push(match);
  }
  rounds.push(round1);

  // Subsequent rounds
  while (rounds[rounds.length - 1].length > 1) {
    const prevRound = rounds[rounds.length - 1];
    const nextRound: any[] = [];

    for (let i = 0; i < prevRound.length / 2; i++) {
      const match = await prisma.match.create({
        data: {
          tournamentId,
          round: rounds.length + 1,
          matchNumber: matchNumber++,
          bracket: BracketType.winners,
        },
      });

      await prisma.match.update({
        where: { id: prevRound[i * 2].id },
        data: { nextMatchId: match.id, nextMatchPlayerSlot: 1 },
      });
      await prisma.match.update({
        where: { id: prevRound[i * 2 + 1].id },
        data: { nextMatchId: match.id, nextMatchPlayerSlot: 2 },
      });

      nextRound.push(match);
    }
    rounds.push(nextRound);
  }

  console.log(
    `Single elimination (participants): utworzono ${rounds.length} rund, meczów: ${rounds.flat().length}`
  );
}

async function createDoubleEliminationParticipantBracket(
  tournamentId: string,
  baseEntries: ParticipantEntry[]
) {
  const targetCount = nextPowerOfTwo(baseEntries.length);
  const filled = [...baseEntries];
  while (filled.length < targetCount) filled.push(null);

  const shuffled = filled.sort(() => Math.random() - 0.5);

  // WINNERS
  const winnersRounds: any[][] = [];
  let matchNumber = 1;

  const round1: any[] = [];
  for (let i = 0; i < shuffled.length / 2; i++) {
    const e1 = shuffled[i * 2];
    const e2 = shuffled[i * 2 + 1];

    const match = await prisma.match.create({
      data: {
        tournamentId,
        round: 1,
        matchNumber: matchNumber++,
        bracket: BracketType.winners,
      },
    });

    if (e1 && (e1.userId || e1.teamId)) {
      await prisma.matchParticipant.create({
        data: {
          matchId: match.id,
          slot: 1,
          userId: e1.userId ?? null,
          teamId: e1.teamId ?? null,
        },
      });
    }
    if (e2 && (e2.userId || e2.teamId)) {
      await prisma.matchParticipant.create({
        data: {
          matchId: match.id,
          slot: 2,
          userId: e2.userId ?? null,
          teamId: e2.teamId ?? null,
        },
      });
    }

    round1.push(match);
  }
  winnersRounds.push(round1);

  while (winnersRounds[winnersRounds.length - 1].length > 1) {
    const prev = winnersRounds[winnersRounds.length - 1];
    const next: any[] = [];
    for (let i = 0; i < prev.length / 2; i++) {
      const match = await prisma.match.create({
        data: {
          tournamentId,
          round: winnersRounds.length + 1,
          matchNumber: matchNumber++,
          bracket: BracketType.winners,
        },
      });

      await prisma.match.update({
        where: { id: prev[i * 2].id },
        data: { nextMatchId: match.id, nextMatchPlayerSlot: 1 },
      });
      await prisma.match.update({
        where: { id: prev[i * 2 + 1].id },
        data: { nextMatchId: match.id, nextMatchPlayerSlot: 2 },
      });

      next.push(match);
    }
    winnersRounds.push(next);
  }

  // LOSERS
  const losersRounds: any[][] = [];
  let loserMatchNumber = 1000;
  let losersRoundNumber = 1;

  if (winnersRounds[0].length > 1) {
    const losersRound1: any[] = [];
    for (let i = 0; i < winnersRounds[0].length / 2; i++) {
      const match = await prisma.match.create({
        data: {
          tournamentId,
          round: losersRoundNumber,
          matchNumber: loserMatchNumber++,
          bracket: BracketType.losers,
        },
      });

      await prisma.match.update({
        where: { id: winnersRounds[0][i * 2].id },
        data: { nextLoserMatchId: match.id, nextLoserMatchPlayerSlot: 1 },
      });
      await prisma.match.update({
        where: { id: winnersRounds[0][i * 2 + 1].id },
        data: { nextLoserMatchId: match.id, nextLoserMatchPlayerSlot: 2 },
      });

      losersRound1.push(match);
    }
    losersRounds.push(losersRound1);
    losersRoundNumber++;
  }

  for (let winnersRoundIndex = 1; winnersRoundIndex < winnersRounds.length; winnersRoundIndex++) {
    const winnersRound = winnersRounds[winnersRoundIndex];

    if (winnersRound.length === 1) break;

    const prevLosersRound = losersRounds[losersRounds.length - 1];

    const mixedRound: any[] = [];
    const numMatches = winnersRound.length;

    for (let i = 0; i < numMatches; i++) {
      const match = await prisma.match.create({
        data: {
          tournamentId,
          round: losersRoundNumber,
          matchNumber: loserMatchNumber++,
          bracket: BracketType.losers,
        },
      });

      if (i < prevLosersRound.length) {
        await prisma.match.update({
          where: { id: prevLosersRound[i].id },
          data: { nextMatchId: match.id, nextMatchPlayerSlot: 1 },
        });
      }

      await prisma.match.update({
        where: { id: winnersRound[i].id },
        data: { nextLoserMatchId: match.id, nextLoserMatchPlayerSlot: 2 },
      });

      mixedRound.push(match);
    }
    losersRounds.push(mixedRound);
    losersRoundNumber++;

    if (mixedRound.length > 1) {
      const consolidationRound: any[] = [];
      for (let i = 0; i < mixedRound.length / 2; i++) {
        const match = await prisma.match.create({
          data: {
            tournamentId,
            round: losersRoundNumber,
            matchNumber: loserMatchNumber++,
            bracket: BracketType.losers,
          },
        });

        await prisma.match.update({
          where: { id: mixedRound[i * 2].id },
          data: { nextMatchId: match.id, nextMatchPlayerSlot: 1 },
        });
        await prisma.match.update({
          where: { id: mixedRound[i * 2 + 1].id },
          data: { nextMatchId: match.id, nextMatchPlayerSlot: 2 },
        });

        consolidationRound.push(match);
      }
      losersRounds.push(consolidationRound);
      losersRoundNumber++;
    }
  }

  const winnerFinal = winnersRounds[winnersRounds.length - 1][0];
  const lastLosersRound = losersRounds[losersRounds.length - 1];

  const losersFinal = await prisma.match.create({
    data: {
      tournamentId,
      round: losersRoundNumber,
      matchNumber: loserMatchNumber++,
      bracket: BracketType.losers,
    },
  });

  await prisma.match.update({
    where: { id: lastLosersRound[0].id },
    data: { nextMatchId: losersFinal.id, nextMatchPlayerSlot: 1 },
  });

  await prisma.match.update({
    where: { id: winnerFinal.id },
    data: { nextLoserMatchId: losersFinal.id, nextLoserMatchPlayerSlot: 2 },
  });

  const grandFinal = await prisma.match.create({
    data: {
      tournamentId,
      round: Math.max(winnersRounds.length, losersRoundNumber) + 1,
      matchNumber: matchNumber,
      bracket: BracketType.grandFinal,
    },
  });

  await prisma.match.update({
    where: { id: winnerFinal.id },
    data: { nextMatchId: grandFinal.id, nextMatchPlayerSlot: 1 },
  });

  await prisma.match.update({
    where: { id: losersFinal.id },
    data: { nextMatchId: grandFinal.id, nextMatchPlayerSlot: 2 },
  });

  console.log(
    `Double elimination (participants): winners=${winnersRounds.length}, losers=${losersRounds.length} + grand final`
  );
}