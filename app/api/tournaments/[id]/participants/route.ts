import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";



export async function GET(request: Request, { params }: { params: { id: string } }) {
  const tournamentId = params.id;

  try {
    // Pobierz uczestników przypisanych do turnieju
    const participants = await prisma.tournamentParticipant.findMany({
      where: { tournamentId },
      include: { user: true },
    });

    // Zwróć listę użytkowników (id i name)
    const users = participants.map(p => ({
      id: p.user.id,
      name: p.user.username,
    }));

    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Błąd pobierania uczestników" }, { status: 500 });
  }
}