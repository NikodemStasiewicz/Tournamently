import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const team = await prisma.team.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: { username: true, name: true }
        },
        members: {
          include: {
            user: {
              select: { username: true, name: true, email: true }
            }
          },
          orderBy: [
            { teamRole: 'desc' },
            { joinedAt: 'asc' }
          ]
        },
        joinRequests: {
          where: { status: 'PENDING' },
          include: {
            user: {
              select: { username: true, name: true }
            }
          }
        }
      }
    });

    if (!team) {
      return NextResponse.json({ error: 'Drużyna nie znaleziona' }, { status: 404 });
    }

    return NextResponse.json(team);
  } catch (error) {
    console.error('Błąd pobierania drużyny:', error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}