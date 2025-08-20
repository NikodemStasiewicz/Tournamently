"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Walidacja klienta (pomocnicza, źródłem prawdy jest API)
    if (!/^[-a-zA-Z0-9_]{3,30}$/.test(username)) {
      setError("Nazwa użytkownika: 3-30 znaków, tylko litery/cyfry/_.");
      return;
    }
    if (!/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(email)) {
      setError("Nieprawidłowy adres email.");
      return;
    }
    if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Hasło min. 8 znaków i zawiera małą, wielką literę i cyfrę.");
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.error || "Coś poszło nie tak");
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-6">Zarejestruj się</h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
              Nazwa użytkownika
            </label>
            <input
              id="username"
              type="text"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="np. gracz123"
              required
              minLength={3}
              maxLength={30}
              pattern="[-a-zA-Z0-9_]+"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="adres@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              Hasło
            </label>
            <input
              id="password"
              type="password"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
            />
            <p className="text-xs text-slate-500 mt-1">Min. 8 znaków, w tym mała, wielka litera i cyfra.</p>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition duration-200"
          >
            Zarejestruj się
          </button>
        </form>

        {error && (
          <p className="mt-4 text-center text-sm text-red-600">{error}</p>
        )}

        <p className="text-center text-sm text-slate-600 mt-6">
          Masz już konto?{" "}
          <Link href="/login" className="text-indigo-600 hover:underline font-medium">
            Zaloguj się
          </Link>
        </p>
      </div>
    </div>
  );
}