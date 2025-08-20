

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

    // Walidacja dat: koniec nie może być przed startem, obie daty muszą być poprawne
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return NextResponse.json({ error: "Nieprawidłowe daty rozpoczęcia lub zakończenia" }, { status: 400 });
    }
    if (endDateObj < startDateObj) {
      return NextResponse.json({ error: "Data zakończenia nie może być wcześniejsza niż data rozpoczęcia" }, { status: 400 });
    }

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
