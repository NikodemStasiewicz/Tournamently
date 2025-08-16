import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true, email: true, username: true, name: true,
      ownedTournaments: { select: { id: true, name: true, startDate: true, format: true } },
      tournaments: { select: { tournament: { select: { id: true, name: true, startDate: true } }, joinedAt: true } },
    },
  });

  return NextResponse.json({ user: dbUser });
}
