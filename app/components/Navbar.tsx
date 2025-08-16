
import Link from "next/link";
import { getCurrentUser } from "@/app/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/95 border-b border-cyan-500/20 shadow-2xl supports-[backdrop-filter]:bg-slate-900/95">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo with gaming aesthetic */}
        <Link
          href="/"
          className="group flex items-center gap-2 text-2xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text hover:from-cyan-300 hover:to-pink-400 transition-all duration-300"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/30">
            <span className="text-slate-900 font-black text-sm">T</span>
          </div>
          <span className="tracking-tight drop-shadow-lg text-yellow-300">
            TOURNAMENTLY<span className="text-cyan-400">HUB</span>
          </span>
        </Link>

        {/* Menu with cyber styling */}
        <nav className="flex items-center gap-4">
          {/* Tournament link */}
          {user && (
            <Link
              href="/tournaments"
              className="relative group px-4 py-2 font-bold text-sm uppercase tracking-wide text-slate-300 hover:text-white transition-all duration-300"
            >
              <span className="relative z-10">Turnieje</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-cyan-500/30 group-hover:border-cyan-400/50"></div>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
            </Link>
          )}

          {user && (
            <Link
              href="/ranking"
              className="relative group px-4 py-2 font-bold text-sm uppercase tracking-wide text-slate-300 hover:text-white transition-all duration-300"
            >
              <span className="relative z-10">Ranking</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-cyan-500/30 group-hover:border-cyan-400/50"></div>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
            </Link>
          )}

           {user && (
            <Link
              href="/prediction"
              className="relative group px-4 py-2 font-bold text-sm uppercase tracking-wide text-slate-300 hover:text-white transition-all duration-300"
            >
              <span className="relative z-10">Predykcja</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-cyan-500/30 group-hover:border-cyan-400/50"></div>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
            </Link>
          )}

          {/* Create tournament button */}
          {user && (
            <Link
              href="/tournaments/new"
              className="relative group overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-6 py-2.5 rounded-lg font-black text-sm uppercase tracking-wide shadow-lg shadow-purple-500/30 hover:shadow-purple-400/40 transition-all duration-300 border border-purple-500/50 hover:border-purple-400/70"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Stwórz turniej
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            </Link>
          )}
          

          {/* Login for non-authenticated users */}
          {!user && (
            <Link
              href="/login"
              className="relative group px-4 py-2 font-bold text-sm uppercase tracking-wide text-slate-300 hover:text-white transition-all duration-300"
            >
              <span className="relative z-10">Zaloguj się</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-slate-600 group-hover:border-cyan-400/50"></div>
            </Link>
          )}

          {/* User menu for authenticated users */}
          {user && (
            <div className="flex items-center gap-3">
              {/* Profile avatar */}
              <Link
                href="/profile"
                title="Przejdź do profilu"
                className="group relative w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 text-white flex items-center justify-center font-black text-sm select-none hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 border-2 border-transparent hover:border-cyan-400/50 shadow-lg shadow-purple-500/30"
              >
                <span className="relative z-10">
                  {user.email?.[0].toUpperCase() ?? "U"}
                </span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              {/* Logout button wrapper */}
              <div className="relative">
                <LogoutButton />
              </div>
            </div>
          )}
        </nav>
      </div>
      
      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
    </header>
  );
}