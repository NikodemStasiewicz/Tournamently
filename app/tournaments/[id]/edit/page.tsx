"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditTournamentPage() {
  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams() as { id?: string };

  useEffect(() => {
    if (!params?.id) return;
    fetch(`/api/tournaments/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setTournament(data);
        setLoading(false);
      });
  }, [params?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!params?.id) return;

    await fetch(`/api/tournaments/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tournament),
    });

    router.push(`/tournaments/${params.id}`);
  };

  if (loading) return <p className="text-center text-white mt-20">Ładowanie...</p>;
  if (!tournament) return <p className="text-center text-red-500 mt-20">Nie znaleziono turnieju</p>;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background:
          "radial-gradient(circle at top left, #0f2027, #203a43, #2c5364)",
        backgroundImage:
          "radial-gradient(circle at top left, #0f2027, #203a43, #2c5364), url('https://www.transparenttextures.com/patterns/cubes.png')",
        backgroundRepeat: "repeat",
      }}
    >
      <div className="max-w-lg w-full bg-gray-900 bg-opacity-90 rounded-xl shadow-[0_0_20px_#4f46e5] p-8 text-white">
        <h1 className="text-3xl font-extrabold mb-6 text-indigo-400 tracking-wide">
          Edytuj turniej
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            value={tournament.name}
            onChange={e => setTournament({ ...tournament, name: e.target.value })}
            placeholder="Nazwa turnieju"
            className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <input
            type="date"
            value={tournament.startDate?.slice(0, 10)}
            onChange={e => setTournament({ ...tournament, startDate: e.target.value })}
            className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <input
            type="date"
            value={tournament.endDate?.slice(0, 10)}
            onChange={e => setTournament({ ...tournament, endDate: e.target.value })}
            className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <input
            type="number"
            value={tournament.participantLimit}
            onChange={e => setTournament({ ...tournament, participantLimit: Number(e.target.value) })}
            placeholder="Limit uczestników"
            className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />

          <select
            value={tournament.format}
            onChange={e => setTournament({ ...tournament, format: e.target.value })}
            className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            <option value="SINGLE_ELIMINATION">Single Elimination</option>
            <option value="DOUBLE_ELIMINATION">Double Elimination</option>
          </select>

          <button
            type="submit"
            className="w-full py-3 rounded-md bg-indigo-600 hover:bg-indigo-700 transition text-white font-semibold shadow-[0_0_15px_#6366f1]"
          >
            Zapisz zmiany
          </button>
        </form>
      </div>
    </div>
  );
}
