// import { NextResponse } from "next/server";
// import { prisma } from "@/app/lib/prisma";
// import { getCurrentUser } from "@/app/lib/auth";

// export async function POST(req: Request) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return NextResponse.json({ error: "Nieautoryzowany" }, { status: 401 });
//   }

//   const {  name, game, startDate, endDate, participantLimit, format  } = await req.json();

//   if (!name || !game) {
//     return NextResponse.json({ error: "Brakuje danych" }, { status: 400 });
//   }

//   const created = await prisma.tournament.create({
//     data: {
//       name,
//       game,
//       startDate: new Date(startDate),
//       endDate: new Date(endDate),
//       participantLimit: parseInt(participantLimit),
//     format,
//       owner: { connect: { email: user.email } },
//     },
//   });

//   return NextResponse.json({ success: true, tournament: created });
// }
// import { NextResponse } from "next/server";
// import { prisma } from "@/app/lib/prisma";
// import { getCurrentUser } from "@/app/lib/auth";
// import { createBracketInDb } from "@/app/lib/create-bracket-in-db";

// export async function POST(req: Request) {
//   const user = await getCurrentUser();
//   if (!user) {
//     return NextResponse.json({ error: "Nieautoryzowany" }, { status: 401 });
//   }

//   const { name, game, startDate, endDate, participantLimit, format } = await req.json();

//   if (!name || !game) {
//     return NextResponse.json({ error: "Brakuje danych" }, { status: 400 });
//   }

//   const created = await prisma.tournament.create({
//     data: {
//       name,
//       game,
//       startDate: new Date(startDate),
//       endDate: new Date(endDate),
//       participantLimit: parseInt(participantLimit),
//       format,
//       owner: { connect: { email: user.email } },
//     },
//   });

//   // Zapisz pustą drabinkę (uczestnicy będą dołączać później)
//   await createBracketInDb(created.id, [], format);

//   return NextResponse.json({ success: true, tournament: created });
// }
// import type { NextApiRequest, NextApiResponse } from "next";
// import { generateDoubleEliminationBracket } from "@/app/lib/bracket";
// import { prisma } from "@/app/lib/prisma" // zakładam, że masz prisma client

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") {
//     return res.status(405).end();
//   }

//   try {
//     const { name, participants } = req.body; // participants to array of user IDs or names

//     if (!name || !participants || !Array.isArray(participants)) {
//       return res.status(400).json({ error: "Niepoprawne dane" });
//     }

//     // Tworzymy turniej
//     const tournament = await prisma.tournament.create({
//   data: {
//     name,
//     format: "DOUBLE_ELIMINATION",
//     participantLimit: participants.length,
//     startDate: new Date(),   // albo z requestu
//     endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // np. +7 dni
//     game: "TwójGame",        // musisz podać (string)
//     ownerId: "id-właściciela", // podaj id właściciela (np. z sesji lub innego źródła)
//   },
// });

//     // Generujemy drabinkę
//     const bracketMatches = generateDoubleEliminationBracket(participants);

//     // Zapisujemy mecze w bazie (przykład, musisz dostosować do swojego modelu)
//     for (const match of bracketMatches) {
//       await prisma.match.create({
//   data: {
//     id: match.id,
//     round: match.round,
//     matchNumber: match.matchNumber,  // <--- musisz mieć to w generateDoubleEliminationBracket lub wygenerować
//     player1Id: match.player1 ?? null,
//     player2Id: match.player2 ?? null,
//     winnerId: match.winner ?? null,
//     bracket: match.bracket,
//     tournamentId: tournament.id,
//     nextMatchId: match.nextMatchId ?? null,
//     nextMatchPlayerSlot: match.nextMatchPlayerSlot ?? null,
//   },
// })};

//     res.status(201).json({ tournamentId: tournament.id });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Wewnętrzny błąd serwera" });
//   }
// }
// import { prisma } from "@/app/lib/prisma";
// import { generateDoubleEliminationBracket } from "@/app/lib/bracket";
// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   try {
//     const data = await request.json();

//     console.log("Otrzymane dane w API /tournaments:", data);

//     const { name, participants } = data;

//     if (!name || !participants || !Array.isArray(participants)) {
//       return NextResponse.json({ error: "Niepoprawne dane" }, { status: 400 });
//     }

//     // Przykładowo, hardkodujemy ownerId — w realnym projekcie pobierz z sesji/auth
//     const ownerId = "id-właściciela";

//     const tournament = await prisma.tournament.create({
//       data: {
//         name,
//         format: "DOUBLE_ELIMINATION", // lub "SINGLE_ELIMINATION"
//         participantLimit: participants.length,
//         startDate: new Date(),
//         endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//         game: "TwójGame",
//         ownerId,
//       },
//     });

//     const bracketMatches = generateDoubleEliminationBracket(participants);

//     for (const match of bracketMatches) {
//       await prisma.match.create({
//         data: {
//           id: match.id,
//           round: match.round,
//           matchNumber: match.matchNumber ?? 0,
//           player1Id: match.player1?.id ?? null,
//           player2Id: match.player2?.id ?? null,
//           winnerId: null,
//           bracket: match.bracket,
//           tournamentId: tournament.id,
//           nextMatchId: match.nextMatchId ?? null,
//           nextMatchPlayerSlot: match.nextMatchPlayerSlot ?? null,
//         },
//       });
//     }

//     return NextResponse.json({ tournamentId: tournament.id }, { status: 201 });
//   } catch (error) {
//     console.error("Błąd w API /tournaments:", error);
//     return NextResponse.json({ error: "Wewnętrzny błąd serwera" }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";


export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
    }

    const { name, game, format, participantLimit, startDate, endDate } = await req.json();

    // Konwersje
    const participantLimitNum = Number(participantLimit);
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    // Tworzenie turnieju z ownerId z ciasteczka JWT
    const tournament = await prisma.tournament.create({
      data: {
        name,
        game,
        format,
        participantLimit: participantLimitNum,
        startDate: startDateObj,
        endDate: endDateObj,
        ownerId: user.id, // <- poprawny MongoDB ObjectId
      },
    });
      
    return NextResponse.json({ success: true, tournament });
  } catch (error) {
    console.error("Błąd API tworzenia turnieju:", error);
    return NextResponse.json({ error: "Wewnętrzny błąd serwera" }, { status: 500 });
  }
}
