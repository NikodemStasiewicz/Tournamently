import { NextResponse,NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const me = await getCurrentUser();
    if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const admin = await prisma.user.findUnique({ where: { id: me.id }, select: { role: true } });
    if (admin?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const users = await prisma.user.count();
    const teams = await prisma.team.count();
    const tournaments = await prisma.tournament.findMany();
    const matches = await prisma.match.count();

    const tournamentTypes = tournaments.reduce((acc, t) => {
      acc[t.format] = (acc[t.format] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const stats = {
      users,
      teams,
      tournaments: tournaments.length,
      matches,
      tournamentTypes,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}