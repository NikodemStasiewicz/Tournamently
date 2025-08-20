import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getCurrentUser } from '@/app/lib/auth'; // funkcja do pobrania zalogowanego użytkownika
export async function PATCH(
  request: Request,
  { params }: { params: { requestId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }  const body = await request.json();
    const { status } = body; // 'ACCEPTED' lub 'DECLINED'

    const joinRequest = await prisma.teamJoinRequest.findUnique({
      where: { id: params.requestId },
      include: {
        team: {
          include: {
            members: {
              where: { userId: user.id }
            }
          }
        }
      }
    });

    if (!joinRequest) {
      return NextResponse.json({ error: 'Prośba nie znaleziona' }, { status: 404 });
    }

    // Sprawdź uprawnienia (owner lub captain)
    const userMembership = joinRequest.team.members[0];
    if (!userMembership || !['OWNER', 'CAPTAIN'].includes(userMembership.teamRole)) {
      return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 });
    }

    // Aktualizuj status prośby
    const updatedRequest = await prisma.teamJoinRequest.update({
      where: { id: params.requestId },
      data: { status }
    });

    // Jeśli zaakceptowano, dodaj do członków
    if (status === 'ACCEPTED') {
      await prisma.teamMember.create({
        data: {
          teamId: joinRequest.teamId,
          userId: joinRequest.userId,
          teamRole: 'MEMBER'
        }
      });
    }

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error('Błąd przetwarzania prośby:', error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}