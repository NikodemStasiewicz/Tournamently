
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTournamentPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    game: "",
    startDate: "",
    endDate: "",
    participantLimit: 8,
    format: "SINGLE_ELIMINATION",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/tournaments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/tournaments");
    } else {
      alert("Błąd podczas tworzenia turnieju");
    }
  };

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
        className="w-full max-w-2xl bg-gray-900 bg-opacity-90 backdrop-blur-md rounded-xl p-10
          shadow-[0_0_20px_#4f46e5] border border-gray-700
          transition-shadow duration-300 hover:shadow-[0_0_30px_#7c3aed]"
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
            className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700
              text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition-shadow duration-200 hover:shadow-indigo-600"
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
            className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700
              text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition-shadow duration-200 hover:shadow-indigo-600"
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
              className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700
                text-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                transition-shadow duration-200 hover:shadow-indigo-600"
            />
          </FormField>

          <FormField label="Data zakończenia">
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700
                text-white placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                transition-shadow duration-200 hover:shadow-indigo-600"
            />
          </FormField>
        </div>

        <FormField label="Limit uczestników">
          <input
            type="number"
            name="participantLimit"
            value={form.participantLimit}
            onChange={handleChange}
            required
            min={2}
            className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700
              text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition-shadow duration-200 hover:shadow-indigo-600"
          />
        </FormField>

        <FormField label="Format turnieju">
          <select
            name="format"
            value={form.format}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-700
              text-white
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              transition-shadow duration-200 hover:shadow-indigo-600"
          >
            <option value="SINGLE_ELIMINATION">Single Elimination</option>
            <option value="DOUBLE_ELIMINATION">Double Elimination</option>
          </select>
        </FormField>

        <button
          type="submit"
          className="w-full py-3 mt-6 bg-indigo-600 hover:bg-indigo-700
            text-white font-semibold rounded-md shadow-[0_0_15px_#6366f1]
            transition-colors duration-200"
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
