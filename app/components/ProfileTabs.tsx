
// app/components/profile/ProfileTabs.tsx
"use client";

import { useState } from "react";
import ProfileForm from "./ProfileForm";
import Link from "next/link";

interface Props {
  user: { id: string; email: string; username: string; name?: string | null };
  created: { id: string; name: string; format: string; startDate: string | null }[];
  joined: { id: string; name: string; format: string; startDate: string | null; joinedAt?: string | null }[];
}

export default function ProfileTabs({ user, created, joined }: Props) {
  const [activeTab, setActiveTab] = useState<"created" | "joined" | "settings">("created");

  const tabClass = (isActive: boolean) =>
    `flex-1 p-3 text-center font-bold tracking-wider uppercase transition ${
      isActive ? "border-b-2 border-indigo-500 text-indigo-400" : "text-gray-400 hover:text-indigo-300"
    }`;

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg border-2 border-indigo-600">
      <div className="border-b border-gray-700 flex">
        <button onClick={() => setActiveTab("created")} className={tabClass(activeTab === "created")}>
          Utworzone
        </button>
        <button onClick={() => setActiveTab("joined")} className={tabClass(activeTab === "joined")}>
          Dołączone
        </button>
        <button onClick={() => setActiveTab("settings")} className={tabClass(activeTab === "settings")}>
          Ustawienia
        </button>
      </div>

      <div className="p-6">
        {activeTab === "created" && (
          <section>
            <h3 className="text-2xl font-bold mb-4 text-purple-500 tracking-wide">🎯 Utworzone turnieje</h3>
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
                          {t.format === "SINGLE_ELIMINATION" ? "Pojedyncza eliminacja" : t.format === "DOUBLE_ELIMINATION" ? "Podwójna eliminacja" : t.format}
                          {" · "}
                          {t.startDate ? new Date(t.startDate).toLocaleString("pl-PL", { dateStyle: "medium", timeStyle: "short" }) : "Brak daty"}
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
        )}

        {activeTab === "joined" && (
          <section>
            <h3 className="text-2xl font-bold mb-4 text-blue-500 tracking-wide">🚀 Dołączone turnieje</h3>
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
                          {t.format === "SINGLE_ELIMINATION" ? "Pojedyncza eliminacja" : t.format === "DOUBLE_ELIMINATION" ? "Podwójna eliminacja" : t.format}
                          {" · "}
                          {t.startDate ? new Date(t.startDate).toLocaleString("pl-PL", { dateStyle: "medium", timeStyle: "short" }) : "Brak daty"}
                        </div>
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
        )}

        {activeTab === "settings" && <ProfileForm user={user} />}
      </div>
    </div>
  );
}
