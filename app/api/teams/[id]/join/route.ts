import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getCurrentUser } from '@/app/lib/auth'; // funkcja do pobrania zalogowanego użytkownika

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const teamId = params.id;
    const body = await request.json();
    const { message } = body;
    
   const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: true
      }
    });

    if (!team) {
      return NextResponse.json({ error: 'Drużyna nie znaleziona' }, { status: 404 });
    }

    // Sprawdź czy user już jest członkiem
    const isMember = team.members.some(member => member.userId === user.id);
    if (isMember) {
      return NextResponse.json({ error: 'Jesteś już członkiem tej drużyny' }, { status: 400 });
    }

    // Sprawdź limit członków
    if (team.members.length >= team.maxMembers) {
      return NextResponse.json({ error: 'Drużyna jest pełna' }, { status: 400 });
    }

    if (team.requireApproval) {
      // Utwórz prośbę o dołączenie
      const joinRequest = await prisma.teamJoinRequest.create({
        data: {
          teamId,
          userId: user.id,
          message,
          status: 'PENDING'
        }
      });

      return NextResponse.json({ 
        message: 'Prośba wysłana, czekaj na akceptację', 
        request: joinRequest 
      });
    } else {
      // Automatyczne dołączenie
      const teamMember = await prisma.teamMember.create({
        data: {
          teamId,
          userId: user.id
        }
      });

      return NextResponse.json({ 
        message: 'Dołączyłeś do drużyny!', 
        member: teamMember 
      });
    }
  } catch (error) {
    console.error('Błąd dołączania do drużyny:', error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
    // Pobierz drużynę wraz z członkami
    
