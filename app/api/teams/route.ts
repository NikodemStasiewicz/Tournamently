import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '@/app/lib/auth';

const prisma = new PrismaClient();

// GET /api/teams - Lista publicznych drużyn
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where = {
      isPublic: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } }
        ]
      })
    };

    const [teams, total] = await Promise.all([
      prisma.team.findMany({
        where,
        skip,
        take: limit,
        include: {
          owner: {
            select: { username: true, name: true }
          },
          members: {
            include: {
              user: {
                select: { username: true, name: true }
              }
            }
          },
          _count: {
            select: { members: true, joinRequests: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.team.count({ where })
    ]);

    return NextResponse.json({
      teams,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Błąd pobierania drużyn:', error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}

// POST /api/teams - Tworzenie nowej drużyny (obsługa JSON lub multipart/form-data z plikiem avatar)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';

    let name = '' as string;
    let description = '' as string;
    let maxMembers = 5 as number;
    let requireApproval = false as boolean;
    let isPublic = true as boolean;
    let avatarUrl: string | undefined = undefined;

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      name = String(form.get('name') || '').trim();
      description = String(form.get('description') || '');
      maxMembers = parseInt(String(form.get('maxMembers') || '5'), 10);
      requireApproval = String(form.get('requireApproval') || 'false') === 'true';
      isPublic = String(form.get('isPublic') || 'true') === 'true';

      const file = form.get('avatar') as File | null;
      if (file && typeof file === 'object' && 'arrayBuffer' in file) {
        const mime = (file as any).type || '';
        const allowed = ['image/png','image/jpeg','image/jpg','image/webp','image/svg+xml'];
        if (!allowed.includes(mime)) {
          return NextResponse.json({ error: 'Nieobsługiwany typ pliku' }, { status: 400 });
        }
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        if (buffer.length > 5 * 1024 * 1024) {
          return NextResponse.json({ error: 'Plik za duży (max 5MB)' }, { status: 400 });
        }
        const crypto = await import('crypto');
        const ext = mime === 'image/png' ? 'png' : mime === 'image/jpeg' || mime === 'image/jpg' ? 'jpg' : mime === 'image/webp' ? 'webp' : mime === 'image/svg+xml' ? 'svg' : 'bin';
        const { join } = await import('path');
        const { writeFile, mkdir } = await import('fs/promises');
        const fileName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${ext}`;
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'teams');
        await mkdir(uploadDir, { recursive: true });
        await writeFile(join(uploadDir, fileName), buffer);
        avatarUrl = `/uploads/teams/${fileName}`;
      }
    } else {
      const body = await request.json();
      name = String(body.name || '').trim();
      description = String(body.description || '');
      maxMembers = parseInt(String(body.maxMembers ?? '5'), 10);
      requireApproval = Boolean(body.requireApproval);
      isPublic = Boolean(body.isPublic);
      avatarUrl = body.avatar ?? undefined; // opcjonalny URL avatara
    }

    if (!name) {
      return NextResponse.json({ error: 'Nazwa drużyny jest wymagana' }, { status: 400 });
    }

    // Sprawdź czy nazwa jest dostępna
    const existingTeam = await prisma.team.findUnique({ where: { name } });
    if (existingTeam) {
      return NextResponse.json({ error: 'Nazwa drużyny już istnieje' }, { status: 400 });
    }

    // Stwórz drużynę
    const team = await prisma.team.create({
      data: {
        name,
        description,
        avatar: avatarUrl,
        maxMembers,
        requireApproval,
        isPublic,
        ownerId: user.id,
      },
    });

    // Dodaj twórcę jako właściciela do członków
    await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: user.id,
        teamRole: 'OWNER',
      },
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error('Błąd tworzenia drużyny:', error);
    return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 });
  }
}
