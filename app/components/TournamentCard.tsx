"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface TournamentCardProps {
  id: string;
  name: string;
  game: string;
  startDate: string;
  endDate: string;
  participantLimit: number;
  currentParticipants: number;
}

export default function TournamentCard({
  id,
  name,
  game,
  startDate,
  endDate,
  participantLimit,
  currentParticipants,
}: TournamentCardProps) {
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);
  const router = useRouter();

  const handleJoin = async () => {
    setLoading(true);
    const res = await fetch(`/api/tournaments/${id}/join`, {
      method: "POST",
    });

    if (res.ok) {
      setJoined(true);
      router.refresh(); // odświeża dane
    } else {
      const { error } = await res.json();
      alert(error || "Wystąpił błąd.");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700 space-y-2">
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300">{game}</p>
      <p className="text-sm text-gray-500">
        {new Date(startDate).toLocaleDateString()} -{" "}
        {new Date(endDate).toLocaleDateString()}
      </p>
      <p className="text-sm">
        Miejsca: {currentParticipants} / {participantLimit}
      </p>

      <button
        onClick={handleJoin}
        disabled={joined || loading || currentParticipants >= participantLimit}
        className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
      >
        {joined
          ? "Zapisano"
          : loading
          ? "Zapisywanie..."
          : "Zapisz się do turnieju"}
      </button>
    </div>
  );
}
