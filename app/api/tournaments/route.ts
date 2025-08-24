

import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";


export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
    }

    const { name, game, format, participantLimit, startDate, endDate, tournamentType, teamSize, minTeamSize, maxTeamSize, registrationEnd } = await req.json();

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

    // Walidacja typu turnieju i rozmiaru zespołu
    const allowedTypes = ["SOLO_ONLY", "TEAM_ONLY", "MIXED"] as const;
    const tType = (tournamentType && allowedTypes.includes(String(tournamentType) as any)) ? String(tournamentType) : "MIXED";

    const teamSizeNum = teamSize !== undefined && teamSize !== null && String(teamSize) !== ""
      ? Number(teamSize)
      : undefined;
    const minTeamSizeNum = minTeamSize !== undefined && minTeamSize !== null && String(minTeamSize) !== ""
      ? Number(minTeamSize)
      : undefined;
    const maxTeamSizeNum = maxTeamSize !== undefined && maxTeamSize !== null && String(maxTeamSize) !== ""
      ? Number(maxTeamSize)
      : undefined;

    if (teamSizeNum !== undefined) {
      if (!Number.isInteger(teamSizeNum) || teamSizeNum < 1) {
        return NextResponse.json({ error: "teamSize musi być dodatnią liczbą całkowitą" }, { status: 400 });
      }
      if (minTeamSizeNum !== undefined || maxTeamSizeNum !== undefined) {
        return NextResponse.json({ error: "Nie łącz teamSize z minTeamSize/maxTeamSize" }, { status: 400 });
      }
    } else {
      if (minTeamSizeNum !== undefined && (!Number.isInteger(minTeamSizeNum) || minTeamSizeNum < 1)) {
        return NextResponse.json({ error: "minTeamSize musi być dodatnią liczbą całkowitą" }, { status: 400 });
      }
      if (maxTeamSizeNum !== undefined && (!Number.isInteger(maxTeamSizeNum) || maxTeamSizeNum < 1)) {
        return NextResponse.json({ error: "maxTeamSize musi być dodatnią liczbą całkowitą" }, { status: 400 });
      }
      if (minTeamSizeNum !== undefined && maxTeamSizeNum !== undefined && minTeamSizeNum > maxTeamSizeNum) {
        return NextResponse.json({ error: "minTeamSize nie może być większe niż maxTeamSize" }, { status: 400 });
      }
    }

    const registrationEndDate = registrationEnd ? new Date(registrationEnd) : undefined;
    if (registrationEndDate && isNaN(registrationEndDate.getTime())) {
      return NextResponse.json({ error: "Nieprawidłowa data zakończenia rejestracji" }, { status: 400 });
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
        registrationEnd: registrationEndDate,
        tournamentType: tType,
        teamSize: teamSizeNum !== undefined ? teamSizeNum : null,
        minTeamSize: teamSizeNum === undefined ? (minTeamSizeNum ?? null) : null,
        maxTeamSize: teamSizeNum === undefined ? (maxTeamSizeNum ?? null) : null,
        ownerId: user.id, // <- poprawny MongoDB ObjectId
      },
    });
      
    return NextResponse.json({ success: true, tournament });
  } catch (error) {
    console.error("Błąd API tworzenia turnieju:", error);
    return NextResponse.json({ error: "Wewnętrzny błąd serwera" }, { status: 500 });
  }
}
