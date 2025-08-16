// app/prediction/page.tsx
import { prisma } from "@/app/lib/prisma";
import PredictionClient from "../components/PredictionClient";
import Link from "next/link";

export default async function Page() {
  // Pobieramy listę dostępnych turniejów (id + name)
  const tournaments = await prisma.tournament.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true },
    take: 50,
  });

  const opts = tournaments.map((t) => ({ id: t.id, name: t.name }));

  return (
    <main className="min-h-screen relative py-24 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold">Predykcja zwycięzcy / Analiza rozgrywek</h1>
            <p className="text-sm text-gray-400 mt-1">Prosty ranking graczy oparty o historię meczów.</p>
          </div>
          <Link href="/tournaments" className="text-indigo-300 hover:underline">Powrót do turniejów</Link>
        </header>

        <section className="bg-gradient-to-b from-slate-800/60 to-slate-900/60 p-6 rounded-lg border border-gray-800 shadow-lg">
          <PredictionClient tournaments={opts} />
        </section>
      </div>
    </main>
  );
}
