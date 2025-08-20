
"use client";

import { PieChart, Pie, Cell, BarChart, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer } from "recharts";

interface Stats {
  users: number;
  teams: number;
  tournaments: number;
  matches: number;
  tournamentTypes?: Record<string, number>;
}

interface StatsSectionProps {
  stats: Stats;
}

export default function StatsSection({ stats }: StatsSectionProps) {
  const pieData = [
    { name: "Użytkownicy", value: stats.users },
    { name: "Drużyny", value: stats.teams },
    { name: "Turnieje", value: stats.tournaments },
    { name: "Mecze", value: stats.matches },
  ];

  const tournamentTypeData = Object.entries(stats.tournamentTypes || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["#a78bfa", "#34d399", "#fbbf24", "#f87171", "#60a5fa", "#fb923c"];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Użytkownicy', value: stats.users },
          { label: 'Drużyny', value: stats.teams },
          { label: 'Turnieje', value: stats.tournaments },
          { label: 'Mecze', value: stats.matches },
        ].map((kpi, idx) => (
          <div key={idx} className="rounded-xl bg-gray-900/60 border border-gray-800/60 p-4 shadow">
            <div className="text-sm text-gray-400">{kpi.label}</div>
            <div className="text-2xl font-bold text-white">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold mb-4 text-center">Proporcje platformy</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold mb-4 text-center">Statystyki w liczbach</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={pieData}>
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#a78bfa" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl shadow-lg md:col-span-2">
          <h3 className="text-lg font-bold mb-4 text-center">Typy turniejów</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={tournamentTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {tournamentTypeData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
