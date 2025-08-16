
"use client";

import { useState } from "react";

export default function JoinButton({
  tournamentId,
  userId,
  initialJoined = false,
}: {
  tournamentId: string;
  userId?: string | null;
  initialJoined?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(initialJoined);
  const [error, setError] = useState("");

  const handleJoin = async () => {
    if (!userId) {
      setError("Musisz być zalogowany, aby dołączyć.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        setJoined(true);
      } else {
        const data = await res.json();
        setError(data.error || "Coś poszło nie tak.");
      }
    } catch {
      setError("Błąd połączenia z serwerem.");
    } finally {
      setLoading(false);
    }
  };

  if (joined) {
    return (
      <button
        className="text-sm px-4 py-1 rounded bg-green-100 text-green-800 font-semibold"
        disabled
      >
        Dołączono
      </button>
    );
  }

  return (
    <div className="flex flex-col items-end">
      <button
        onClick={handleJoin}
        className="text-sm px-4 py-1 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
        disabled={loading}
      >
        {loading ? "Dołączanie..." : "Dołącz"}
      </button>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
