import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    let username: string = (body?.username ?? '').trim();
    let email: string = (body?.email ?? '').trim().toLowerCase();
    const password: string = body?.password ?? '';

    // Walidacja podstawowa
    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Brakuje danych' }, { status: 400 });
    }

    // Walidacja nazwy użytkownika
    if (username.length < 3 || username.length > 30 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json({ error: 'Nazwa użytkownika musi mieć 3-30 znaków i może zawierać litery, cyfry i _' }, { status: 400 });
    }

    // Walidacja emaila
    const emailRegex = /^([^\s@]+)@([^\s@]+)\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Nieprawidłowy adres email' }, { status: 400 });
    }

    // Walidacja hasła
    if (
      password.length < 8 ||
      !/[a-z]/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      return NextResponse.json({ error: 'Hasło musi mieć min. 8 znaków i zawierać małą, wielką literę i cyfrę' }, { status: 400 });
    }

    
    const existingByEmail = await prisma.user.findUnique({ where: { email } });
    if (existingByEmail) {
      return NextResponse.json({ error: 'Użytkownik z takim mailem już istnieje' }, { status: 400 });
    }

    
    const existingByUsername = await prisma.user.findFirst({ where: { username } });
    if (existingByUsername) {
      return NextResponse.json({ error: 'Nazwa użytkownika jest zajęta' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Nieprawidłowe dane wejściowe' }, { status: 400 });
  }
  
}
