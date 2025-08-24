import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { createParticipantBracketInDb } from "@/app/lib/createBracketInDb";

// POST /api/tournaments/[id]/join-team
// Body: { teamId: string }
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tournamentId = params.id;
    const body = await request.json();
    const teamId = String(body?.teamId || "");

    if (!tournamentId || !teamId) {
      return NextResponse.json({ error: "Brak danych: tournamentId/teamId" }, { status: 400 });
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      select: {
        id: true,
        participantLimit: true,
        tournamentType: true,
        teamSize: true,
        minTeamSize: true,
        maxTeamSize: true,
        format: true,
      },
    });

    if (!tournament) {
      return NextResponse.json({ error: "Turniej nie istnieje" }, { status: 404 });
    }

    const type = tournament.tournamentType || "MIXED";
    if (type === "SOLO_ONLY") {
      return NextResponse.json({ error: "Ten turniej przyjmuje tylko graczy solo" }, { status: 400 });
    }

    // Sprawdź czy user ma uprawnienia w teamie (OWNER/CAPTAIN)
    const membership = await prisma.teamMember.findFirst({
      where: {
        teamId,
        userId: user.id,
      },
      select: { teamRole: true },
    });

    if (!membership || !["OWNER", "CAPTAIN"].includes(membership.teamRole as any)) {
      return NextResponse.json({ error: "Brak uprawnień do reprezentowania tego zespołu" }, { status: 403 });
    }

    // Sprawdź rozmiar zespołu vs wymagania turnieju
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { _count: { select: { members: true } } },
    });
    if (!team) {
      return NextResponse.json({ error: "Zespół nie istnieje" }, { status: 404 });
    }

    const size = team._count.members;
    if (typeof tournament.teamSize === "number") {
      if (size !== tournament.teamSize) {
        return NextResponse.json({ error: `Wymagany rozmiar zespołu: ${tournament.teamSize}` }, { status: 400 });
      }
    } else {
      if (typeof tournament.minTeamSize === "number" && size < tournament.minTeamSize) {
        return NextResponse.json({ error: `Minimalny rozmiar zespołu: ${tournament.minTeamSize}` }, { status: 400 });
      }
      if (typeof tournament.maxTeamSize === "number" && size > tournament.maxTeamSize) {
        return NextResponse.json({ error: `Maksymalny rozmiar zespołu: ${tournament.maxTeamSize}` }, { status: 400 });
      }
    }

    // Sprawdź, czy zespół nie jest już zapisany
    const existing = await prisma.tournamentParticipant.findFirst({
      where: { tournamentId, teamId },
    });
    if (existing) {
      return NextResponse.json({ error: "Ten zespół jest już zapisany na turniej" }, { status: 400 });
    }

    // Sprawdź dostępność miejsc
    const currentCount = await prisma.tournamentParticipant.count({ where: { tournamentId } });
    if (currentCount >= tournament.participantLimit) {
      return NextResponse.json({ error: "Turniej jest pełny" }, { status: 400 });
    }

    // Dodaj zespół jako uczestnika
    await prisma.tournamentParticipant.create({
      data: { tournamentId, teamId },
    });

    // Auto-generowanie drabinki po osiągnięciu limitu
    if (currentCount + 1 === tournament.participantLimit) {
      const participants = await prisma.tournamentParticipant.findMany({
        where: { tournamentId },
        select: { userId: true, teamId: true },
      });

      const entries = participants.map((p) => ({
        userId: p.userId ?? null,
        teamId: p.teamId ?? null,
      }));

      await createParticipantBracketInDb(tournamentId, entries, tournament.format);
    }

    return NextResponse.json({ message: "Zespół dołączył do turnieju." });
  } catch (error) {
    console.error("Błąd dołączania zespołu do turnieju:", error);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
