
import React from "react";
import { getUserRanking } from "../lib/ranking";
import { RankingTable } from "../components/RankingTable";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export default async function RankingPage() {
  const ranking = await getUserRanking();

  return (
    <main className="relative min-h-screen py-24 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        {/* Animated background orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-slate-300 hover:text-white font-bold text-sm uppercase tracking-wide transition-colors mb-12 group"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Wróć do strony głównej
        </Link>

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-xl border border-cyan-500/20 rounded-full px-4 py-2 mb-6 shadow-lg">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-slate-300 text-sm font-bold uppercase tracking-wider">
              Liga esportowa
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="text-white">GLOBALNY </span>
            <span className="text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text">
              RANKING GRACZY
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Sprawdź, kto dominuje na scenie i awansuj w rankingu
          </p>
        </div>

        <RankingTable data={ranking} />
      </div>
    </main>
  );
}