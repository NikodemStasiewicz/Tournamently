

"use client";

import React from "react";
import Link from "next/link";

type TournamentItem = {
  id: string;
  name: string;
  format: string;
  startDate: string | null;
};

type JoinedTournamentItem = TournamentItem & {
  joinedAt?: string | null;
};

interface Props {
  created: TournamentItem[];
  joined: JoinedTournamentItem[];
}

function formatDate(iso: string | null) {
  if (!iso) return "Brak daty";
  try {
    const d = new Date(iso);
    return d.toLocaleString("pl-PL", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso;
  }
}

function friendlyFormat(fmt: string) {
  switch (fmt) {
    case "SINGLE_ELIMINATION":
      return "Pojedyncza eliminacja";
    case "DOUBLE_ELIMINATION":
      return "Podwójna eliminacja";
    default:
      return fmt;
  }
}

export default function TournamentsList({ created, joined }: Props) {
  return (
    <div className="space-y-10">
      {/* UTWORZONE TURNIEJE */}
      <section>
        <h3 className="text-2xl font-bold mb-4 text-purple-500 tracking-wide">
          🎯 Utworzone turnieje
        </h3>
        {created.length === 0 ? (
          <div className="text-gray-400 italic">Brak utworzonych turniejów</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {created.map((t) => (
              <div
                key={t.id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border border-purple-500/40 rounded-xl shadow-lg p-5 transition-all hover:scale-[1.02] hover:shadow-purple-500/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-bold text-white">{t.name}</div>
                    <div className="text-sm text-gray-400 mt-1">
                      {friendlyFormat(t.format)} · {formatDate(t.startDate)}
                    </div>
                  </div>
                  <Link
                    href={`/tournaments/${t.id}`}
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-1 rounded-lg text-sm font-semibold text-white shadow-md transition-colors"
                  >
                    Zobacz
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* DOŁĄCZONE TURNIEJE */}
      <section>
        <h3 className="text-2xl font-bold mb-4 text-blue-500 tracking-wide">
          🚀 Dołączone turnieje
        </h3>
        {joined.length === 0 ? (
          <div className="text-gray-400 italic">Brak dołączonych turniejów</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {joined.map((t) => (
              <div
                key={t.id}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border border-blue-500/40 rounded-xl shadow-lg p-5 transition-all hover:scale-[1.02] hover:shadow-blue-500/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-bold text-white">{t.name}</div>
                    <div className="text-sm text-gray-400 mt-1">
                      {friendlyFormat(t.format)} · {formatDate(t.startDate)}
                    </div>
                    {/* Informacja o dołączeniu została usunięta */}
                  </div>
                  <Link
                    href={`/tournaments/${t.id}`}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-lg text-sm font-semibold text-white shadow-md transition-colors"
                  >
                    Zobacz
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
