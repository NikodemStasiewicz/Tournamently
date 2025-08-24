import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getCurrentUser } from '@/app/lib/auth';

// PATCH /api/teams/[id]/members/[memberId] - zmiana roli (tylko OWNER)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; memberId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { teamRole } = body as { teamRole?: 'OWNER' | 'CAPTAIN' | 'MEMBER' };

    if (!teamRole || !['CAPTAIN', 'MEMBER'].includes(teamRole)) {
      return NextResponse.json({ error: 'Nieprawidłowa rola. Dozwolone: CAPTAIN, MEMBER' }, { status: 400 });
    }

    const team = await prisma.team.findUnique({
      where: { id: params.id },
      select: { ownerId: true }
    });

    if (!team) {
      return NextResponse.json({ error: 'Drużyna nie znaleziona' }, { status: 404 });
    }

    if (team.ownerId !== user.id) {
      return NextResponse.json({ error: 'Brak uprawnień (właściciel tylko)' }, { status: 403 });
    }

    const membership = await prisma.teamMember.findUnique({
      where: { id: params.memberId }
    });

    if (!membership || membership.teamId !== params.id) {
      return NextResponse.json({ error: 'Członek nie znaleziony w tej drużynie' }, { status: 404 });
    }

    if (membership.teamRole === 'OWNER') {
      return NextResponse.json({ error: 'Nie można zmieniać roli właściciela' }, { status: 400 });
    }

    const updated = await prisma.teamMember.update({
      where: { id: membership.id },
      data: { teamRole }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Błąd zmiany roli członka:', error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}

// DELETE /api/teams/[id]/members/[memberId] - usunięcie członka (tylko OWNER)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; memberId: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const team = await prisma.team.findUnique({
      where: { id: params.id },
      select: { ownerId: true }
    });

    if (!team) {
      return NextResponse.json({ error: 'Drużyna nie znalezona' }, { status: 404 });
    }

    if (team.ownerId !== user.id) {
      return NextResponse.json({ error: 'Brak uprawnień (właściciel tylko)' }, { status: 403 });
    }

    const membership = await prisma.teamMember.findUnique({
      where: { id: params.memberId }
    });

    if (!membership || membership.teamId !== params.id) {
      return NextResponse.json({ error: 'Członek nie znaleziony w tej drużynie' }, { status: 404 });
    }

    if (membership.teamRole === 'OWNER') {
      return NextResponse.json({ error: 'Nie można usunąć właściciela' }, { status: 400 });
    }

    if (membership.userId === user.id) {
      return NextResponse.json({ error: 'Właściciel nie może usunąć samego siebie' }, { status: 400 });
    }

    await prisma.teamMember.delete({ where: { id: membership.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Błąd usuwania członka:', error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
