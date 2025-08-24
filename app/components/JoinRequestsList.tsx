"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type JoinRequest = {
  id: string;
  message?: string | null;
  user: { username?: string | null; name?: string | null };
};

interface JoinRequestsListProps {
  requests: JoinRequest[];
}

export default function JoinRequestsList({ requests: initial }: JoinRequestsListProps) {
  const [requests, setRequests] = useState<JoinRequest[]>(initial || []);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleAction = async (id: string, status: "ACCEPTED" | "DECLINED") => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/teams/join-request/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.error || "Nie udało się zaktualizować prośby");
      } else {
        setRequests((prev) => prev.filter((r) => r.id !== id));
        router.refresh();
      }
    } catch (e) {
      alert("Błąd sieci");
    } finally {
      setLoadingId(null);
    }
  };

  if (!requests || requests.length === 0) {
    return <div className="text-sm text-gray-300">Brak oczekujących próśb.</div>;
  }

  return (
    <ul className="divide-y divide-gray-700">
      {requests.map((req) => (
        <li key={req.id} className="py-3 flex items-center justify-between">
          <div>
            <div className="font-medium">{req.user?.name || req.user?.username || "Użytkownik"}</div>
            {req.message ? (
              <div className="text-xs text-gray-400 mt-1">"{req.message}"</div>
            ) : null}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleAction(req.id, "DECLINED")}
              disabled={loadingId === req.id}
              className="px-3 py-1 rounded-lg bg-red-900 text-red-200 hover:bg-red-800 disabled:opacity-50"
              title="Odrzuć"
            >
              Odrzuć
            </button>
            <button
              onClick={() => handleAction(req.id, "ACCEPTED")}
              disabled={loadingId === req.id}
              className="px-3 py-1 rounded-lg bg-green-900 text-green-200 hover:bg-green-800 disabled:opacity-50"
              title="Akceptuj"
            >
              Akceptuj
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
