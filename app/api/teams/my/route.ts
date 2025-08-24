import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getCurrentUser } from '@/app/lib/auth'; // funkcja do pobrania zalogowanego użytkownika
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userTeams = await prisma.teamMember.findMany({
      where: { userId: user.id },
      include: {
        team: {
          include: {
            owner: {
              select: { username: true, name: true }
            },
            joinRequests: {
              where: { status: 'PENDING' },
              select: { id: true }
            },
            _count: {
              select: { members: true }
            }
            
          }
        }
      }
    });

    return NextResponse.json(userTeams);
  } catch (error) {
    console.error('Błąd pobierania moich drużyn:', error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
