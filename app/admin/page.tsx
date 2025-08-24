

// app/admin/AdminPanel.tsx
"use client";

import { useEffect, useState } from "react";
import StatsSection from "../components/StatsSection";
import UsersTable from "../components/UsersTable";

export type Role = "PLAYER" | "ORGANIZER" | "ADMIN";

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
}

export interface Stats {
  users: number;
  teams: number;
  tournaments: number;
  matches: number;
}

export default function AdminPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeTab, setActiveTab] = useState<"stats" | "users">("stats");

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data.users);
    setLoading(false);
  };

  const fetchStats = async () => {
    const res = await fetch("/api/admin/stats");
    const data = await res.json();
    setStats(data);
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );

    fetchStats();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Panel Admina</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${activeTab === 'stats' ? 'bg-purple-600 border-purple-500' : 'bg-gray-800 border-gray-700 hover:bg-gray-700'}`}
            >
              Statystyki
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${activeTab === 'users' ? 'bg-purple-600 border-purple-500' : 'bg-gray-800 border-gray-700 hover:bg-gray-700'}`}
            >
              Użytkownicy
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'stats' && stats && (
            <section className="rounded-2xl border border-gray-800/60 bg-gray-900/50 backdrop-blur-sm p-6 shadow-xl">
              <StatsSection stats={stats} />
            </section>
          )}

          {activeTab === 'users' && (
            <section className="rounded-2xl border border-gray-800/60 bg-gray-900/50 backdrop-blur-sm p-6 shadow-xl">
              <UsersTable users={users} loading={loading} handleRoleChange={handleRoleChange} />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
