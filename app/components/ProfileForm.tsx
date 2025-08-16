
// app/components/profile/ProfileForm.tsx
"use client";

import React, { useState } from "react";

type UserShort = {
  id: string;
  email: string;
  username?: string;
  name?: string | null;
};

export default function ProfileForm({ user }: { user: UserShort }) {
  const [email, setEmail] = useState(user.email);
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMsg, setPwMsg] = useState<string | null>(null);

  async function updateEmail(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/profile/updateEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      setMsg(res.ok ? "Email zaktualizowany" : json?.error || "Błąd");
    } catch {
      setMsg("Błąd sieci");
    } finally {
      setLoading(false);
    }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    setLoading(true);

    if (!oldPassword || !newPassword) {
      setPwMsg("Wypełnij oba pola");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/profile/updatePassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const json = await res.json();
      if (res.ok) {
        setPwMsg("Hasło zmienione pomyślnie");
        setOldPassword("");
        setNewPassword("");
      } else {
        setPwMsg(json?.error || "Błąd");
      }
    } catch {
      setPwMsg("Błąd sieci");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-gray-900 rounded-lg shadow-lg p-6 border-2 border-indigo-600">
      <h2 className="text-xl font-bold mb-4 text-indigo-400 tracking-wide">Konto Gracza</h2>

      <form onSubmit={updateEmail} className="space-y-3">
        <label className="block text-sm text-gray-300">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 w-full rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-indigo-500"
            required
          />
        </label>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded font-semibold transition"
          >
            Zapisz
          </button>
          {msg && <div className="text-sm text-gray-300">{msg}</div>}
        </div>
      </form>

      <hr className="my-6 border-gray-700" />

      <h3 className="text-lg font-semibold mb-3 text-indigo-400">Zmień hasło</h3>
      <form onSubmit={changePassword} className="space-y-3">
        <input
          type="password"
          placeholder="Obecne hasło"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="p-2 w-full rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-indigo-500"
        />
        <input
          type="password"
          placeholder="Nowe hasło"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="p-2 w-full rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-indigo-500"
        />

        <div className="flex items-center gap-3">
          <button
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded font-semibold transition"
          >
            Zmień hasło
          </button>
          {pwMsg && <div className="text-sm text-gray-300">{pwMsg}</div>}
        </div>
      </form>
    </section>
  );
}
