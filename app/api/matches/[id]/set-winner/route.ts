// // app/api/matches/[id]/set-winner/route.ts
// import {prisma} from "@/app/lib/prisma";
// import { NextRequest } from "next/server";

// export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
//   const matchId = params.id;
//   const { winnerId } = await req.json();

//   const match = await prisma.match.findUnique({
//     where: { id: matchId },
//   });

//   if (!match || !winnerId) {
//     return new Response("Invalid match or winner", { status: 400 });
//   }

//   const player1Id = match.player1Id;
//   const player2Id = match.player2Id;

//   if (![player1Id, player2Id].includes(winnerId)) {
//     return new Response("Winner must be one of the players in the match", { status: 400 });
//   }

//   const loserId = winnerId === player1Id ? player2Id : player1Id;

//   // Zapisujemy zwycięzcę
//   await prisma.match.update({
//     where: { id: matchId },
//     data: {
//       winnerId,
//     },
//   });

//   // Jeśli jest nextMatch – przenosimy zwycięzcę
//   if (match.nextMatchId && match.nextMatchPlayerSlot) {
//     const field = match.nextMatchPlayerSlot === 1 ? "player1Id" : "player2Id";

//     await prisma.match.update({
//       where: { id: match.nextMatchId },
//       data: {
//         [field]: winnerId,
//       },
//     });
//   }

//   // TODO: jeśli turniej to DOUBLE_ELIMINATION – przenieś przegranego do meczu w dolnej drabince
//    const tournament = await prisma.tournament.findUnique({
//     where: { id: match.tournamentId },
//   });

//   if (tournament?.format === "DOUBLE_ELIMINATION" && match.bracket === "winners" && loserId) {
//     // Znajdź pierwszy dostępny mecz w dolnej drabince, który ma wolny slot
//     const loserMatch = await prisma.match.findFirst({
//       where: {
//         tournamentId: match.tournamentId,
//         bracket: "losers",
//         OR: [
//           { player1Id: null },
//           { player2Id: null },
//         ],
//       },
//       orderBy: { matchNumber: "asc" }, // ważne by trafić do najbliższego meczu
//     });

//     if (loserMatch) {
//       const field = loserMatch.player1Id === null ? "player1Id" : "player2Id";
//       await prisma.match.update({
//         where: { id: loserMatch.id },
//         data: {
//           [field]: loserId,
//         },
//       });
//     }
//   }

//   return new Response("Match result saved", { status: 200 });
// }
// import { prisma } from "@/app/lib/prisma";
// import { NextRequest } from "next/server";

// export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
//   const matchId = params.id;
//   const { winnerId } = await req.json();

//   const match = await prisma.match.findUnique({
//     where: { id: matchId },
//   });

//   if (!match || !winnerId) {
//     return new Response("Invalid match or winner", { status: 400 });
//   }

//   const player1Id = match.player1Id;
//   const player2Id = match.player2Id;

//   if (![player1Id, player2Id].includes(winnerId)) {
//     return new Response("Winner must be one of the players in the match", { status: 400 });
//   }

//   const loserId = winnerId === player1Id ? player2Id : player1Id;

//   // Zapisujemy zwycięzcę
//   await prisma.match.update({
//     where: { id: matchId },
//     data: {
//       winnerId,
//     },
//   });

//   // Przenosimy zwycięzcę do kolejnego meczu (jeśli istnieje)
//   if (match.nextMatchId && match.nextMatchPlayerSlot) {
//     const field = match.nextMatchPlayerSlot === 1 ? "player1Id" : "player2Id";
//     await prisma.match.update({
//       where: { id: match.nextMatchId },
//       data: {
//         [field]: winnerId,
//       },
//     });
//   }

//   // Obsługa przegranego w double elimination
//   const tournament = await prisma.tournament.findUnique({
//     where: { id: match.tournamentId },
//   });

//   if (
//     tournament?.format === "DOUBLE_ELIMINATION" &&
//     match.bracket === "winners" &&
//     loserId
//   ) {
//     // Znajdź mecz w dolnej drabince, do którego trzeba wrzucić przegranego
//     const loserMatch = await prisma.match.findFirst({
//       where: {
//         tournamentId: match.tournamentId,
//         bracket: "losers",
//         OR: [{ player1Id: null }, { player2Id: null }],
//       },
//       orderBy: { matchNumber: "asc" }, // najbliższy mecz
//     });

//     if (loserMatch) {
//       const field = loserMatch.player1Id === null ? "player1Id" : "player2Id";
//       await prisma.match.update({
//         where: { id: loserMatch.id },
//         data: {
//           [field]: loserId,
//         },
//       });
//     }
//   }

//   return new Response("Match result saved", { status: 200 });
// }

// import { prisma } from "@/app/lib/prisma";
// import { NextRequest } from "next/server";

// export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
//   const matchId = params.id;
//   const { winnerId } = await req.json();

//   const match = await prisma.match.findUnique({
//     where: { id: matchId },
//   });

//   if (!match || !winnerId) {
//     return new Response("Invalid match or winner", { status: 400 });
//   }

//   const player1Id = match.player1Id;
//   const player2Id = match.player2Id;

//   if (![player1Id, player2Id].includes(winnerId)) {
//     return new Response("Winner must be one of the players in the match", { status: 400 });
//   }

//   const loserId = winnerId === player1Id ? player2Id : player1Id;

//   // Zapisz zwycięzcę
//   await prisma.match.update({
//     where: { id: matchId },
//     data: {
//       winnerId,
//     },
//   });

//   // Przenieś zwycięzcę do kolejnego meczu (jeśli istnieje)
//   if (match.nextMatchId && match.nextMatchPlayerSlot) {
//     const winnerField = match.nextMatchPlayerSlot === 1 ? "player1Id" : "player2Id";
//     await prisma.match.update({
//       where: { id: match.nextMatchId },
//       data: {
//         [winnerField]: winnerId,
//       },
//     });
//   }

//   // Przenieś przegranego do dolnej drabinki (jeśli istnieje)
//   if (
//     match.bracket === "winners" &&
//     match.nextLoserMatchId &&
//     match.nextLoserMatchPlayerSlot &&
//     loserId
//   ) {
//     const loserField = match.nextLoserMatchPlayerSlot === 1 ? "player1Id" : "player2Id";
//     await prisma.match.update({
//       where: { id: match.nextLoserMatchId },
//       data: {
//         [loserField]: loserId,
//       },
//     });
//   }

//   return new Response("Match result saved", { status: 200 });
// }

// import { prisma } from "@/app/lib/prisma";
// import { NextRequest } from "next/server";

// export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
//   const matchId = params.id;
//   const { winnerId } = await req.json();

//   const match = await prisma.match.findUnique({
//     where: { id: matchId },
//   });

//   if (!match || !winnerId) {
//     return new Response("Invalid match or winner", { status: 400 });
//   }

//   const player1Id = match.player1Id;
//   const player2Id = match.player2Id;

//   if (![player1Id, player2Id].includes(winnerId)) {
//     return new Response("Winner must be one of the players in the match", { status: 400 });
//   }

//   const loserId = winnerId === player1Id ? player2Id : player1Id;

//   // Zapisz zwycięzcę
//   await prisma.match.update({
//     where: { id: matchId },
//     data: { winnerId },
//   });

//   // Przenieś zwycięzcę do kolejnego meczu
//   if (match.nextMatchId && match.nextMatchPlayerSlot) {
//     const field = match.nextMatchPlayerSlot === 1 ? "player1Id" : "player2Id";
//     await prisma.match.update({
//       where: { id: match.nextMatchId },
//       data: { [field]: winnerId },
//     });
//   }

//   // Przenieś przegranego do dolnej drabinki (jeśli dotyczy)
//   const tournament = await prisma.tournament.findUnique({
//     where: { id: match.tournamentId },
//   });

//   if (
//     tournament?.format === "DOUBLE_ELIMINATION" &&
//     match.bracket === "winners" &&
//     loserId &&
//     match.nextLoserMatchId &&
//     match.nextLoserMatchPlayerSlot
//   ) {
//     const loserField = match.nextLoserMatchPlayerSlot === 1 ? "player1Id" : "player2Id";
//     await prisma.match.update({
//       where: { id: match.nextLoserMatchId },
//       data: {
//         [loserField]: loserId,
//       },
//     });
//   }

//   return new Response("Match result saved", { status: 200 });
// }
// import { prisma } from "@/app/lib/prisma";
// import { NextRequest } from "next/server";

// export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
//   const matchId = params.id;
//   const { winnerId } = await req.json();

//   const match = await prisma.match.findUnique({
//     where: { id: matchId },
//   });

//   if (!match || !winnerId) {
//     return new Response("Invalid match or winner", { status: 400 });
//   }

//   const player1Id = match.player1Id;
//   const player2Id = match.player2Id;

//   if (![player1Id, player2Id].includes(winnerId)) {
//     return new Response("Winner must be one of the players in the match", { status: 400 });
//   }

//   const loserId = winnerId === player1Id ? player2Id : player1Id;

//   // Zapisz zwycięzcę w obecnym meczu
//   await prisma.match.update({
//     where: { id: matchId },
//     data: { winnerId },
//   });

//   // Przenieś zwycięzcę do kolejnego meczu (jeśli slot jest pusty)
//   if (match.nextMatchId && match.nextMatchPlayerSlot) {
//     const nextMatch = await prisma.match.findUnique({
//       where: { id: match.nextMatchId },
//     });

//     if (nextMatch) {
//       const slotField = match.nextMatchPlayerSlot === 1 ? "player1Id" : "player2Id";

//       // Jeśli slot jest pusty, dopiero wtedy wstawiamy zwycięzcę
//       if (!nextMatch[slotField]) {
//         await prisma.match.update({
//           where: { id: match.nextMatchId },
//           data: { [slotField]: winnerId },
//         });
//       }
//     }
//   }

//   // Przenieś przegranego do dolnej drabinki (jeśli dotyczy i slot jest pusty)
//   const tournament = await prisma.tournament.findUnique({
//     where: { id: match.tournamentId },
//   });

//   if (
//     tournament?.format === "DOUBLE_ELIMINATION" &&
//     match.bracket === "winners" &&
//     loserId &&
//     match.nextLoserMatchId &&
//     match.nextLoserMatchPlayerSlot
//   ) {
//     const nextLoserMatch = await prisma.match.findUnique({
//       where: { id: match.nextLoserMatchId },
//     });

//     if (nextLoserMatch) {
//       const loserSlotField = match.nextLoserMatchPlayerSlot === 1 ? "player1Id" : "player2Id";

//       // Jeśli slot jest pusty, dopiero wtedy wstawiamy przegranego
//       if (!nextLoserMatch[loserSlotField]) {
//         await prisma.match.update({
//           where: { id: match.nextLoserMatchId },
//           data: { [loserSlotField]: loserId },
//         });
//       }
//     }
//   }

//   return new Response("Match result saved", { status: 200 });
// }
import { prisma } from "@/app/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const matchId = params.id;
  const { winnerId } = await req.json();

  const match = await prisma.match.findUnique({
    where: { id: matchId },
  });

  if (!match || !winnerId) {
    return new Response("Invalid match or winner", { status: 400 });
  }

  const player1Id = match.player1Id;
  const player2Id = match.player2Id;

  if (![player1Id, player2Id].includes(winnerId)) {
    return new Response("Winner must be one of the players in the match", { status: 400 });
  }

  const loserId = winnerId === player1Id ? player2Id : player1Id;

  // Zapisz zwycięzcę w obecnym meczu
  await prisma.match.update({
    where: { id: matchId },
    data: { winnerId },
  });

  // Przenieś zwycięzcę do kolejnego meczu (jeśli slot jest pusty)
  if (match.nextMatchId && match.nextMatchPlayerSlot) {
    const nextMatch = await prisma.match.findUnique({
      where: { id: match.nextMatchId },
    });

    if (nextMatch) {
      const slotField = match.nextMatchPlayerSlot === 1 ? "player1Id" : "player2Id";
      if (!nextMatch[slotField]) {
        await prisma.match.update({
          where: { id: match.nextMatchId },
          data: { [slotField]: winnerId },
        });
      }
    }
  }

  // Przenieś przegranego do dolnej drabinki (jeśli dotyczy i slot jest pusty)
  const tournament = await prisma.tournament.findUnique({
    where: { id: match.tournamentId },
  });

  if (
    tournament?.format === "DOUBLE_ELIMINATION" &&
    match.bracket === "winners" &&
    loserId &&
    match.nextLoserMatchId &&
    match.nextLoserMatchPlayerSlot
  ) {
    const nextLoserMatch = await prisma.match.findUnique({
      where: { id: match.nextLoserMatchId },
    });

    if (nextLoserMatch) {
      const loserSlotField = match.nextLoserMatchPlayerSlot === 1 ? "player1Id" : "player2Id";
      if (!nextLoserMatch[loserSlotField]) {
        await prisma.match.update({
          where: { id: match.nextLoserMatchId },
          data: { [loserSlotField]: loserId },
        });
      }
    }
  }

  return new Response("Match result saved", { status: 200 });
}