
"use client";
import React, { useEffect, useState } from "react";
import { BarChart3, TrendingUp, Trophy, Target, Award, Users, Zap } from "lucide-react";

type TournamentOption = { id: string; name: string };
type PlayerStat = {
  playerId: string;
  username: string;
  displayName: string;
  wins: number;
  losses: number;
  played: number;
  winRate: number;
};

type MonteCarloRow = {
  playerId: string;
  username: string;
  displayName: string;
  winProb: number;   // probability of becoming champion (%)
  finalProb: number; // probability of reaching final (%)
};

type ApiResponse = {
  players: PlayerStat[];
  predictedWinner: PlayerStat | null;
  predictedWinnerMonteCarlo?: PlayerStat | null;
  monteCarlo?: {
    runs: number;
    winProbabilities: MonteCarloRow[];
  };
  meta?: { matchesCount?: number; message?: string };
};

type ViewMode = 'overview' | 'detailed' | 'insights';

export default function PredictionClient({ tournaments }: { tournaments: TournamentOption[] }) {
  const [selected, setSelected] = useState<string | null>(tournaments[0]?.id ?? null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('overview');

  useEffect(() => {
    if (selected) fetchPrediction(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  async function fetchPrediction(tournamentId: string) {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(`/api/prediction?tournamentId=${encodeURIComponent(tournamentId)}&mcRuns=2000`);
      if (!res.ok) throw new Error("Failed to fetch prediction");
      const json: ApiResponse = await res.json();
      setData(json);
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  // Oblicz dodatkowe metryki po stronie klienta
  const enhancedPlayers = data?.players.map(player => ({
    ...player,
    efficiency: player.played > 0 ? (player.wins / player.played) : 0,
    experience: Math.min(player.played / 10, 1), // 0-1 scale
    consistency: player.played > 3 ? (1 - Math.abs(player.winRate - 50) / 50) : 0
  })) || [];

  const insights = {
    veteran: enhancedPlayers.find(p => p.played >= Math.max(5, Math.max(...enhancedPlayers.map(p => p.played)) * 0.7)),
    rookie: enhancedPlayers.find(p => p.played <= 3 && p.winRate >= 60),
    consistent: enhancedPlayers.find(p => p.consistency >= 0.8 && p.played >= 3),
    dominant: enhancedPlayers.find(p => p.winRate >= 80 && p.played >= 3)
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Główna predykcja + statystyki */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Predicted Winner */}
        <div className="bg-gradient-to-br from-yellow-900/30 to-amber-900/30 p-6 rounded-lg border border-yellow-700/30">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-bold text-yellow-100">Przewidywany zwycięzca</h3>
          </div>
          
          {data?.predictedWinner ? (
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-600 flex items-center justify-center text-white font-bold text-lg">
                  {data.predictedWinner.username[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-white font-bold text-lg">{data.predictedWinner.displayName}</div>
                  <div className="text-yellow-300 text-sm">@{data.predictedWinner.username}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{data.predictedWinner.winRate}%</div>
                  <div className="text-xs text-gray-400">Win Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{data.predictedWinner.played}</div>
                  <div className="text-xs text-gray-400">Mecze</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{data.predictedWinner.wins}</div>
                  <div className="text-xs text-gray-400">Wygrane</div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-900/20 rounded">
                <div className="text-xs text-yellow-300 mb-1">Przewaga nad 2. miejscem</div>
                <div className="text-sm text-white">
                  {enhancedPlayers[1] ? `+${(data.predictedWinner.winRate - enhancedPlayers[1].winRate).toFixed(1)}%` : 'Brak rywali'}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400">Brak danych do predykcji</div>
          )}
        </div>

        {/* Statystyki turnieju */}
        <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 p-6 rounded-lg border border-indigo-700/30">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            <h3 className="text-xl font-bold text-indigo-100">Statystyki turnieju</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Rozegrane mecze</span>
              <span className="text-white font-semibold">{data?.meta?.matchesCount || 0}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Aktywni gracze</span>
              <span className="text-white font-semibold">{enhancedPlayers.filter(p => p.played > 0).length}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Średni win rate</span>
              <span className="text-white font-semibold">
                {enhancedPlayers.length ? 
                  (enhancedPlayers.reduce((sum, p) => sum + p.winRate, 0) / enhancedPlayers.length).toFixed(1) + '%' 
                  : '0%'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Najwyższa passa</span>
              <span className="text-white font-semibold">{Math.max(...enhancedPlayers.map(p => p.wins), 0)} W</span>
            </div>

            <div className="mt-4 p-3 bg-indigo-900/20 rounded">
              <div className="text-xs text-indigo-300 mb-2">Poziom konkurencyjności</div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                {(() => {
                  const topWinRate = enhancedPlayers[0]?.winRate || 0;
                  const avgWinRate = enhancedPlayers.length ? 
                    enhancedPlayers.reduce((sum, p) => sum + p.winRate, 0) / enhancedPlayers.length : 0;
                  const competition = Math.max(0, 100 - (topWinRate - avgWinRate) * 2);
                  return (
                    <div 
                      className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
                      style={{width: `${competition}%`}}
                    />
                  );
                })()}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {enhancedPlayers[0]?.winRate - (enhancedPlayers[1]?.winRate || 0) < 20 ? 
                  'Bardzo konkurencyjny' : 'Jeden dominuje'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 5 graczy - kompaktowy widok */}
      <div className="bg-slate-800/60 p-6 rounded-lg border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Ranking graczy</h3>
        <div className="grid md:grid-cols-5 gap-4">
          {enhancedPlayers.slice(0, 5).map((p, idx) => (
            <div key={p.playerId} className="flex flex-col items-center p-2 bg-slate-900/40 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                {p.username[0].toUpperCase()}
              </div>
              <div className="text-sm text-white font-semibold mt-1">{p.displayName}</div>
              <div className="text-xs text-gray-400">WR: {p.winRate}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Monte Carlo - symulacje */}
      {data?.monteCarlo && data.monteCarlo.winProbabilities?.length ? (
        <div className="bg-slate-800/60 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-bold text-white">Symulacja Monte Carlo</h3>
            <span className="ml-auto text-xs text-gray-400">
              Próby: {data.monteCarlo.runs}
            </span>
          </div>

          {data.predictedWinnerMonteCarlo ? (
            <div className="flex items-center gap-4 p-3 mb-4 rounded bg-amber-900/20 border border-amber-700/30">
              <Target className="w-5 h-5 text-amber-300" />
              <div className="text-white">
                <div className="font-semibold">Faworyt MC:</div>
                <div className="text-sm text-amber-200">
                  {data.predictedWinnerMonteCarlo.displayName} (@{data.predictedWinnerMonteCarlo.username})
                </div>
              </div>
            </div>
          ) : null}

          <div className="space-y-3">
            {data.monteCarlo.winProbabilities.slice(0, 8).map((row) => (
              <div key={row.playerId}>
                <div className="flex justify-between text-xs text-gray-300 mb-1">
                  <span className="truncate">{row.displayName}</span>
                  <span className="text-amber-300 font-semibold">{row.winProb}%</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded">
                  <div
                    className="h-2 rounded bg-gradient-to-r from-amber-500 to-yellow-400"
                    style={{ width: `${row.winProb}%` }}
                  />
                </div>
                <div className="text-[10px] text-gray-500 mt-1">
                  Szansa na finał: <span className="text-gray-300">{row.finalProb}%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-[11px] text-gray-500 mt-4">
            Monte Carlo: pojedyncza eliminacja przybliżona, prawdopodobieństwa par wyznaczone z bieżących metryk (win rate, forma, passa).
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Selector turnieju */}
      <div className="flex items-center gap-3">
        <select
          value={selected ?? ""}
          onChange={e => setSelected(e.target.value)}
          className="bg-slate-900/40 text-white border border-gray-700 rounded p-2"
        >
          {tournaments.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        {loading && <span className="text-gray-400">Ładowanie predykcji...</span>}
        {error && <span className="text-red-400">{error}</span>}
      </div>

      {/* Widok danych */}
      {data && renderOverview()}
    </div>
  );
}
