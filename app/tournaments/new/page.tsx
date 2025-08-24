"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type TournamentType = "SOLO_ONLY" | "TEAM_ONLY" | "MIXED";
type Format = "SINGLE_ELIMINATION" | "DOUBLE_ELIMINATION";

export default function CreateTournamentPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    game: "",
    startDate: "",
    endDate: "",
    registrationEnd: "",
    participantLimit: 8,
    format: "SINGLE_ELIMINATION" as Format,

    // Team tournament support
    tournamentType: "MIXED" as TournamentType,
    teamSize: "", // exact team size (exclusive with min/max)
    minTeamSize: "",
    maxTeamSize: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "participantLimit"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation for dates
    if (!form.startDate || !form.endDate) {
      alert("Uzupełnij daty rozpoczęcia i zakończenia.");
      return;
    }
    const sd = new Date(form.startDate);
    const ed = new Date(form.endDate);
    if (ed.getTime() < sd.getTime()) {
      alert("Data zakończenia nie może być wcześniejsza niż data rozpoczęcia.");
      return;
    }

    // Basic validation for team sizes when tournament allows teams
    if (form.tournamentType !== "SOLO_ONLY") {
      const hasExact = form.teamSize.trim() !== "";
      const hasRange = form.minTeamSize.trim() !== "" || form.maxTeamSize.trim() !== "";
      if (hasExact && hasRange) {
        alert("Użyj albo dokładnego teamSize, albo zakresu min/max – nie obu naraz.");
        return;
      }
      if (hasRange) {
        const min = form.minTeamSize.trim() ? Number(form.minTeamSize) : undefined;
        const max = form.maxTeamSize.trim() ? Number(form.maxTeamSize) : undefined;
        if (min !== undefined && (!Number.isInteger(min) || min < 1)) {
          alert("minTeamSize musi być dodatnią liczbą całkowitą.");
          return;
        }
        if (max !== undefined && (!Number.isInteger(max) || max < 1)) {
          alert("maxTeamSize musi być dodatnią liczbą całkowitą.");
          return;
        }
        if (min !== undefined && max !== undefined && min > max) {
          alert("minTeamSize nie może być większe niż maxTeamSize.");
          return;
        }
      }
      if (hasExact) {
        const ts = Number(form.teamSize);
        if (!Number.isInteger(ts) || ts < 1) {
          alert("teamSize musi być dodatnią liczbą całkowitą.");
          return;
        }
      }
    }

    // Build payload – let API perform final validation/normalization
    const payload: Record<string, unknown> = {
      name: form.name,
      game: form.game,
      startDate: form.startDate,
      endDate: form.endDate,
      registrationEnd: form.registrationEnd || undefined,
      participantLimit: form.participantLimit,
      format: form.format,
      tournamentType: form.tournamentType,
    };

    if (form.tournamentType !== "SOLO_ONLY") {
      if (form.teamSize.trim() !== "") {
        payload.teamSize = Number(form.teamSize);
      } else {
        if (form.minTeamSize.trim() !== "") payload.minTeamSize = Number(form.minTeamSize);
        if (form.maxTeamSize.trim() !== "") payload.maxTeamSize = Number(form.maxTeamSize);
      }
    }

    const res = await fetch("/api/tournaments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/tournaments");
    } else {
      const { error } = await res.json().catch(() => ({ error: "Błąd podczas tworzenia turnieju" }));
      alert(error || "Błąd podczas tworzenia turnieju");
    }
  };

  const allowsTeams = form.tournamentType !== "SOLO_ONLY";

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at top left, #0f2027, #203a43, #2c5364)",
        backgroundImage:
          "radial-gradient(circle at top left, #0f2027, #203a43, #2c5364), url('https://www.transparenttextures.com/patterns/cubes.png')",
        backgroundRepeat: "repeat",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-xl p-10 shadow-[0_0_20px_#4f46e5] border border-gray-700 transition-shadow duration-300 hover:shadow-[0_0_30px_#7c3aed]"
      >
        <h1 className="text-4xl font-extrabold text-center text-indigo-400 mb-10 tracking-wide">
          🎮 Nowy Turniej
        </h1>

        <FormField label="Nazwa turnieju">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="np. Letni Puchar 2025"
            className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200 hover:shadow-indigo-600"
          />
        </FormField>

        <FormField label="Gra">
          <input
            type="text"
            name="game"
            value={form.game}
            onChange={handleChange}
            required
            placeholder="np. Counter-Strike 2"
            className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200 hover:shadow-indigo-600"
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Data rozpoczęcia">
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200 hover:shadow-indigo-600"
            />
          </FormField>

          <FormField label="Data zakończenia">
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200 hover:shadow-indigo-600"
            />
          </FormField>
        </div>

        <FormField label="Deadline zapisów (opcjonalnie)">
          <input
            type="datetime-local"
            name="registrationEnd"
            value={form.registrationEnd}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200 hover:shadow-indigo-600"
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Limit uczestników">
            <input
              type="number"
              name="participantLimit"
              value={form.participantLimit}
              onChange={handleChange}
              required
              min={2}
              className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200 hover:shadow-indigo-600"
            />
          </FormField>

          <FormField label="Format turnieju">
            <select
              name="format"
              value={form.format}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200 hover:shadow-indigo-600"
            >
              <option value="SINGLE_ELIMINATION">Single Elimination</option>
              <option value="DOUBLE_ELIMINATION">Double Elimination</option>
            </select>
          </FormField>
        </div>

        <div className="mt-6 p-4 rounded-lg border border-gray-700 bg-gray-900/70">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Typ uczestników">
              <select
                name="tournamentType"
                value={form.tournamentType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200 hover:shadow-indigo-600"
              >
                <option value="SOLO_ONLY">Tylko gracze solo</option>
                <option value="TEAM_ONLY">Tylko zespoły</option>
                <option value="MIXED">Mieszany (solo + zespoły)</option>
              </select>
            </FormField>

            {allowsTeams ? (
              <div className="space-y-2">
                <div className="text-sm text-gray-300">
                  Zdefiniuj wymagany rozmiar zespołu (dokładny) albo zakres (min/max).
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="number"
                    name="teamSize"
                    value={form.teamSize}
                    onChange={handleChange}
                    placeholder="teamSize (dokładny)"
                    className="px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <input
                    type="number"
                    name="minTeamSize"
                    value={form.minTeamSize}
                    onChange={handleChange}
                    placeholder="minTeamSize"
                    className="px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <input
                    type="number"
                    name="maxTeamSize"
                    value={form.maxTeamSize}
                    onChange={handleChange}
                    placeholder="maxTeamSize"
                    className="px-4 py-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center text-sm text-gray-400">
                Turniej tylko dla graczy solo – ustawienia zespołów nie są wymagane.
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-[0_0_15px_#6366f1] transition-colors duration-200"
        >
          🚀 Stwórz turniej
        </button>
      </form>
    </main>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <label className="block mb-2 font-semibold text-indigo-400 tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}
