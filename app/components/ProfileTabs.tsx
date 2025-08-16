
// app/components/profile/ProfileTabs.tsx
"use client";

import { useState } from "react";
import TournamentsList from "./TournamentsList";
import ProfileForm from "./ProfileForm";

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
        {activeTab === "created" && <TournamentsList created={created} joined={[]} />}
        {activeTab === "joined" && <TournamentsList created={[]} joined={joined} />}
        {activeTab === "settings" && <ProfileForm user={user} />}
      </div>
    </div>
  );
}
