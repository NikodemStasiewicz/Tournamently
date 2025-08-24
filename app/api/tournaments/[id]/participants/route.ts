import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const tournamentId = params.id;

  try {
    // Uczestnik może być user ALBO team
    const participants = await prisma.tournamentParticipant.findMany({
      where: { tournamentId },
      include: { user: true, team: true },
    });

    // Zwróć listę obiektów z id i name (dla team użyj name teamu)
    const result = participants.map((p) => {
      if (p.team) {
        return { id: p.team.id, name: p.team.name };
      }
      const uname = p.user?.username ?? "Anonim";
      return { id: p.user?.id ?? "", name: uname };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Błąd pobierania uczestników" }, { status: 500 });
  }
}