
"use client"
import { ResponsiveBar } from "@nivo/bar";

const data = [
  { month: "Styczeń", użytkownicy: 300, turnieje: 45 },
  { month: "Luty", użytkownicy: 450, turnieje: 60 },
  { month: "Marzec", użytkownicy: 500, turnieje: 75 },
  { month: "Kwiecień", użytkownicy: 600, turnieje: 90 },
  { month: "Maj", użytkownicy: 700, turnieje: 100 },
];

export default function Statistics() {
  const chartTheme = {
    background: "transparent",
    axis: {
      domain: {
        line: {
          stroke: "rgba(148, 163, 184, 0.2)",
        },
      },
      legend: {
        text: {
          fill: "rgb(148, 163, 184)",
          fontSize: 14,
          fontWeight: 700,
          textTransform: "uppercase",
        },
      },
      ticks: {
        line: {
          stroke: "rgba(148, 163, 184, 0.2)",
          strokeWidth: 1,
        },
        text: {
          fill: "rgb(148, 163, 184)",
          fontSize: 12,
        },
      },
    },
    grid: {
      line: {
        stroke: "rgba(148, 163, 184, 0.08)",
        strokeWidth: 1,
        strokeDasharray: "4 4",
      },
    },
    labels: {
      text: {
        fill: "#ffffff",
        fontWeight: 700,
        fontSize: 14,
      },
    },
    legends: {
      text: {
        fill: "rgb(148, 163, 184)",
        fontSize: 12,
      },
    },
    tooltip: {
      container: {
        background: "rgba(23, 23, 33, 0.8)",
        color: "#ffffff",
        fontSize: 12,
        borderRadius: "8px",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(147, 51, 234, 0.2)",
      },
    },
  };

  return (
    <section className="relative py-24 px-6 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        {/* Animated background elements */}
        <div className="absolute top-40 left-16 w-64 h-64 bg-purple-500/8 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-500/6 rounded-full blur-3xl animate-pulse delay-1500"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(147,51,234,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(147,51,234,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Scanning effect */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent animate-pulse"></div>
          <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-pulse delay-1000"></div>
        </div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-slate-800/70 backdrop-blur-xl border border-purple-500/20 rounded-full px-4 py-2 mb-6 shadow-lg">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="text-slate-300 text-sm font-bold uppercase tracking-wider">
              Wzrost platformy
            </span>
          </div>
          
          <h3 className="text-4xl md:text-6xl font-black mb-6">
            <span className="text-white">STATYSTYKI </span>
            <span className="text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text">
              SERWISU
            </span>
          </h3>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Śledź rozwój naszej społeczności esportowej w czasie rzeczywistym
          </p>
        </div>
        {/* Chart container */}
        <div className="relative">
          {/* Chart background with cyberpunk styling */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
            {/* Chart header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-black text-white uppercase tracking-wide">Analytics Dashboard</h4>
                  <p className="text-slate-400 text-sm">Miesięczny wzrost aktywności</p>
                </div>
              </div>
              
              {/* Legend */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full shadow-lg shadow-purple-500/50"></div>
                  <span className="text-slate-300 font-medium">Użytkownicy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full shadow-lg shadow-cyan-500/50"></div>
                  <span className="text-slate-300 font-medium">Turnieje</span>
                </div>
              </div>
            </div>
            {/* Chart */}
            <div className="h-[400px]">
              <ResponsiveBar
                data={data}
                keys={["użytkownicy", "turnieje"]}
                indexBy="month"
                margin={{ top: 10, right: 0, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                theme={chartTheme}
                colors={({ id, data }) => {
                  return id === "użytkownicy" 
                    ? "url(#gradient-purple-cyan)" 
                    : "url(#gradient-cyan-pink)";
                }}
                defs={[
                  {
                    id: "gradient-purple-cyan",
                    type: "linearGradient",
                    colors: [
                      { offset: 0, color: "#a855f7" },
                      { offset: 100, color: "#22d3ee" },
                    ],
                  },
                  {
                    id: "gradient-cyan-pink",
                    type: "linearGradient",
                    colors: [
                      { offset: 0, color: "#22d3ee" },
                      { offset: 100, color: "#ec4899" },
                    ],
                  },
                ]}
                fill={[
                  {
                    match: { id: "użytkownicy" },
                    id: "gradient-purple-cyan",
                  },
                  {
                    match: { id: "turnieje" },
                    id: "gradient-cyan-pink",
                  },
                ]}
                borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Miesiąc",
                  legendPosition: "middle",
                  legendOffset: 32,
                  truncateTickAt: 0,
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "Wartość",
                  legendPosition: "middle",
                  legendOffset: -40,
                  truncateTickAt: 0,
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                animate={true}
                motionConfig="wobbly"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
