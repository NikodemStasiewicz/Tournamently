"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      
      const callback = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('callbackUrl') : null;
      const target = callback && callback.startsWith('/') ? callback : '/';
      router.replace(target);
      router.refresh();
      return;
    } else {
      // Obsłuż błąd
      const data = await res.json();
      setError(data.error || "Coś poszło nie tak");
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-6">Zaloguj się</h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="adres@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">Hasło</label>
            <input
              id="password"
              type="password"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition duration-200"
          >
            Zaloguj się
          </button>
        </form>
        <p className="text-center text-sm text-slate-600 mt-6">
                  Nie masz konta?{" "}
                  <Link href="/register" className="text-indigo-600 hover:underline font-medium">
                    Zarejestruj się 
                  </Link>
                </p>
      </div>
    </div>
  );
}
   