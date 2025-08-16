
import React from "react";

type UserRanking = {
  id: string;
  username: string;
  tournamentsPlayed: number;
  matchesPlayed: number;
  matchesWon: number;
  winRate: number;
};

interface RankingTableProps {
  data: UserRanking[];
}

export const RankingTable: React.FC<RankingTableProps> = ({ data }) => {
  return (
    <div className="relative overflow-x-auto rounded-3xl p-2 md:p-4 bg-slate-900/50 backdrop-blur-md border border-slate-700/50 shadow-2xl">
      <table className="min-w-full text-white table-auto">
        <thead className="bg-slate-800/80 backdrop-blur-sm">
          <tr>
            <th className="px-4 md:px-6 py-3 text-left font-bold text-sm md:text-base text-slate-300 uppercase tracking-wider rounded-tl-xl">
              #
            </th>
            <th className="px-4 md:px-6 py-3 text-left font-bold text-sm md:text-base text-slate-300 uppercase tracking-wider">
              Gracz
            </th>
            <th className="px-4 md:px-6 py-3 text-center font-bold text-sm md:text-base text-slate-300 uppercase tracking-wider hidden md:table-cell">
              Turnieje
            </th>
            <th className="px-4 md:px-6 py-3 text-center font-bold text-sm md:text-base text-slate-300 uppercase tracking-wider">
              Wygrane
            </th>
            <th className="px-4 md:px-6 py-3 text-center font-bold text-sm md:text-base text-slate-300 uppercase tracking-wider hidden sm:table-cell">
              Mecze
            </th>
            <th className="px-4 md:px-6 py-3 text-center font-bold text-sm md:text-base text-slate-300 uppercase tracking-wider rounded-tr-xl">
              Win Rate
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, idx) => {
            const isTop1 = idx === 0;
            const isTop2 = idx === 1;
            const isTop3 = idx === 2;
            const isTop = isTop1 || isTop2 || isTop3;

            const top1Gradient = "from-cyan-900/60 to-purple-900/60";
            const top2Gradient = "from-slate-700/60 to-slate-800/60";
            const top3Gradient = "from-slate-700/40 to-slate-800/40";
            
            const top3Bg = isTop1 ? top1Gradient : (isTop2 ? top2Gradient : (isTop3 ? top3Gradient : ""));

            return (
              <tr
                key={user.id}
                className={`group border-b border-slate-800/80 transition-all duration-300 hover:scale-[1.01] rounded-xl relative overflow-hidden ${isTop ? `bg-gradient-to-r ${top3Bg} shadow-inner` : "hover:bg-slate-700/50"}`}
              >
                <td className="px-4 md:px-6 py-4 font-black relative z-10 text-lg">
                  <span className={isTop ? "text-cyan-400" : "text-slate-400"}>{idx + 1}</span>
                </td>
                <td className="px-4 md:px-6 py-4 relative z-10">
                  <span className={`font-bold text-sm md:text-lg ${isTop ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400" : "text-white"}`}>
                    {user.username}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-4 text-center text-sm text-slate-400 hidden md:table-cell relative z-10">
                  {user.tournamentsPlayed}
                </td>
                <td className="px-4 md:px-6 py-4 text-center text-sm relative z-10">
                  <span className="text-green-400 font-bold">{user.matchesWon}</span>
                </td>
                <td className="px-4 md:px-6 py-4 text-center text-sm text-slate-400 hidden sm:table-cell relative z-10">
                  {user.matchesPlayed}
                </td>
                <td className="px-4 md:px-6 py-4 text-center text-sm relative z-10">
                  <span className="text-pink-400 font-black">{user.winRate}%</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
