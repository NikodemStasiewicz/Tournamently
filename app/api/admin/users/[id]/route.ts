import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const me = await getCurrentUser();
  if (!me) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const admin = await prisma.user.findUnique({ where: { id: me.id }, select: { role: true } });
  if (admin?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { role } = await req.json();
  const { id } = params;

  if (!["PLAYER", "ORGANIZER", "ADMIN"].includes(role)) {
    return NextResponse.json({ error: "Niepoprawna rola" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id },
    data: { role },
  });

  return NextResponse.json({ success: true });
}
