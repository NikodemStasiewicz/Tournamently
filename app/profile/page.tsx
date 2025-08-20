

import React from "react";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { getCurrentUser } from "@/app/lib/auth";
import { notFound } from "next/navigation";
import ProfileTabs from "../components/ProfileTabs";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) notFound();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      ownedTournaments: {
        select: { id: true, name: true, startDate: true, format: true },
        orderBy: { createdAt: "desc" },
      },
          },
  });

  if (!dbUser) notFound();

  // Pobierz uczestnictwa użytkownika i następnie turnieje po ID
  const participations = await prisma.tournamentParticipant.findMany({
    where: { userId: user.id },
    select: { tournamentId: true },
  });

  const joinedTournamentIds = participations
    .map((p) => p.tournamentId)
    .filter((id): id is string => Boolean(id));

  const joinedTournaments = joinedTournamentIds.length
    ? await prisma.tournament.findMany({
        where: { id: { in: joinedTournamentIds } },
        select: { id: true, name: true, startDate: true, format: true },
      })
    : [];

  const tMap = new Map(joinedTournaments.map((t) => [t.id, t] as const));

  const created = (dbUser.ownedTournaments ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    format: t.format as string,
    startDate: t.startDate ? t.startDate.toISOString() : null,
  }));

  const joined = participations
    .map((p) => {
      const t = tMap.get(p.tournamentId);
      if (!t) return null;
      return {
        id: t.id,
        name: t.name,
        format: t.format as string,
        startDate: t.startDate ? t.startDate.toISOString() : null,
      };
    })
    .filter(Boolean) as {
      id: string;
      name: string;
      format: string;
      startDate: string | null;
      joinedAt: string | null;
    }[];

  return (
    <main className="min-h-screen p-6 relative text-white font-sans
      bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-[#0d0d0d] 
      overflow-hidden"
    >
      {/* dynamiczne neonowe pasy */}
      <div className="absolute inset-0 before:content-[''] after:content-[''] 
        before:absolute before:w-1/2 before:h-full before:bg-gradient-to-r before:from-purple-500 before:via-pink-500 before:to-transparent before:opacity-20 before:animate-[pulse_6s_linear_infinite]
        after:absolute after:right-0 after:w-1/2 after:h-full after:bg-gradient-to-l after:from-blue-500 after:via-indigo-500 after:to-transparent after:opacity-20 after:animate-[pulse_8s_linear_infinite]
      "></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Strzałka Wróć */}
        <Link href="/" className="flex items-center gap-2 mb-4 text-purple-400 hover:text-pink-500 transition-colors">
          <span className="inline-block transform rotate-180 text-2xl">➔</span>
          <span className="font-semibold text-lg">Wróć</span>
        </Link>

        <header className="bg-[#111111]/80 border border-[#333] p-6 rounded-xl shadow-2xl mb-6 flex flex-col gap-2 backdrop-blur-sm">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent tracking-wide animate-pulse">
            {dbUser.name || dbUser.username}
          </h1>
          <p className="text-sm text-gray-400">🎮 {dbUser.email}</p>
        </header>

        <ProfileTabs
          user={{
            id: dbUser.id,
            email: dbUser.email,
            username: dbUser.username,
            name: dbUser.name,
          }}
          created={created}
          joined={joined}
        />
      </div>
    </main>
  );
}
