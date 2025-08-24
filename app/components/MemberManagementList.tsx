"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type TeamRole = "OWNER" | "CAPTAIN" | "MEMBER";

type Member = {
  id: string;
  userId: string;
  teamRole: TeamRole;
  user: { username?: string | null; name?: string | null; email?: string | null };
};

interface Props {
  teamId: string;
  currentUserId: string;
  members: Member[];
}

export default function MemberManagementList({ teamId, currentUserId, members: initial }: Props) {
  const [members, setMembers] = useState<Member[]>(initial || []);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleRoleChange = async (memberId: string, nextRole: TeamRole) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;
    if (member.teamRole === "OWNER") return;
    if (nextRole === member.teamRole) return;

    setLoadingId(memberId);
    try {
      const res = await fetch(`/api/teams/${teamId}/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamRole: nextRole }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.error || "Nie udało się zmienić roli");
        return;
      }
      setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, teamRole: nextRole } : m)));
      router.refresh();
    } catch (e) {
      alert("Błąd sieci");
    } finally {
      setLoadingId(null);
    }
  };

  const handleRemove = async (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;
    if (member.teamRole === "OWNER") return;
    if (!confirm(`Usunąć ${member.user?.name || member.user?.username || "użytkownika"} z drużyny?`)) return;

    setLoadingId(memberId);
    try {
      const res = await fetch(`/api/teams/${teamId}/members/${memberId}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        alert((data as any)?.error || "Nie udało się usunąć członka");
        return;
      }
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      router.refresh();
    } catch (e) {
      alert("Błąd sieci");
    } finally {
      setLoadingId(null);
    }
  };

  if (!members || members.length === 0) {
    return <div className="text-sm text-gray-300">Brak członków.</div>;
  }

  return (
    <ul className="divide-y divide-gray-700">
      {members.map((m) => (
        <li key={m.id} className="py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="font-medium truncate">{m.user?.name || m.user?.username || "Użytkownik"}</div>
            <div className="text-xs text-gray-400 truncate">{m.user?.username}</div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                m.teamRole === "OWNER"
                  ? "bg-yellow-900 text-yellow-300"
                  : m.teamRole === "CAPTAIN"
                  ? "bg-purple-900 text-purple-200"
                  : "bg-gray-700 text-gray-200"
              }`}
            >
              {m.teamRole === "OWNER" ? "Właściciel" : m.teamRole === "CAPTAIN" ? "Kapitan" : "Członek"}
            </span>
            {m.teamRole !== "OWNER" && (
              <select
                value={m.teamRole}
                onChange={(e) => handleRoleChange(m.id, e.target.value as TeamRole)}
                disabled={loadingId === m.id}
                className="bg-gray-700 text-white text-xs px-2 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                title="Zmień rolę"
              >
                <option value="CAPTAIN">Kapitan</option>
                <option value="MEMBER">Członek</option>
              </select>
            )}
            {m.teamRole !== "OWNER" && m.userId !== currentUserId && (
              <button
                onClick={() => handleRemove(m.id)}
                disabled={loadingId === m.id}
                className="px-3 py-1 rounded-lg bg-red-900 text-red-200 hover:bg-red-800 disabled:opacity-50 text-xs"
                title="Usuń z drużyny"
              >
                Usuń
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
