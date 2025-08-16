
import { HiOutlineClipboardList, HiOutlineTrendingUp, HiOutlineUserGroup, HiOutlineCog } from "react-icons/hi";


const features = [
  {
    title: "Tworzenie turniejów",
    description: "Szybko twórz wydarzenia esportowe z pełną konfiguracją i zaawansowanymi opcjami.",
    icon: HiOutlineClipboardList,
    color: "cyan",
    gradient: "from-cyan-500 to-blue-500",
    glowColor: "cyan-500/30",
  },
  {
    title: "Drabinki i statystyki",
    description: "Obsługa różnych formatów: pojedynczy, podwójny, grupowy i ligowy z live tracking.",
    icon: HiOutlineTrendingUp,
    color: "purple",
    gradient: "from-purple-500 to-violet-500",
    glowColor: "purple-500/30",
  },
  {
    title: "Rejestracja zawodników",
    description: "Łatwy system rejestracji z weryfikacją i automatycznym matchmakingiem.",
    icon: HiOutlineUserGroup,
    color: "pink",
    gradient: "from-pink-500 to-rose-500",
    glowColor: "pink-500/30",
  },
  {
    title: "System predykcji",
    description: "AI-powered analityka z predykcjami wyników i szczegółowymi statystykami graczy.",
    icon: HiOutlineCog,
    color: "amber",
    gradient: "from-amber-500 to-orange-500",
    glowColor: "amber-500/30",
  },
];

export default function Features() {
  return (
    <section className="relative py-24 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        {/* Animated background orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-xl border border-cyan-500/20 rounded-full px-4 py-2 mb-6 shadow-lg">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-slate-300 text-sm font-bold uppercase tracking-wider">
              Zaawansowane funkcje
            </span>
          </div>
          
          <h3 className="text-4xl md:text-6xl font-black mb-6">
            <span className="text-white">FUNKCJE </span>
            <span className="text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text">
              APLIKACJI
            </span>
          </h3>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Profesjonalne narzędzia dla organizatorów turniejów esportowych
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map(({ title, description, icon: Icon, color, gradient, glowColor }, idx) => (
            <div
              key={idx}
              className="group relative"
            >
              {/* Card glow effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-2xl blur-sm opacity-0 group-hover:opacity-30 transition-all duration-500`}></div>
              
              <div className="relative bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 h-full flex flex-col transition-all duration-300 group-hover:border-slate-600/70 group-hover:transform group-hover:-translate-y-2 shadow-xl">
                
                {/* Icon container */}
                <div className="mb-6">
                  <div className={`relative w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg shadow-${glowColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={32} />
                    
                    {/* Icon glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300`}></div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <h4 className="text-xl font-black mb-4 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-purple-300 group-hover:bg-clip-text transition-all duration-300 uppercase tracking-wide">
                    {title}
                  </h4>
                  <p className="text-slate-400 group-hover:text-slate-300 leading-relaxed transition-colors duration-300">
                    {description}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div className={`mt-6 h-1 bg-gradient-to-r ${gradient} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 shadow-lg shadow-${glowColor}`}></div>
                
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyan-400/30 group-hover:border-cyan-400/60 rounded-tl-2xl transition-colors duration-300"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-pink-400/30 group-hover:border-pink-400/60 rounded-br-2xl transition-colors duration-300"></div>
                
                {/* Hover overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
            <div className="text-4xl">⚡</div>
            <div className="text-left">
              <h4 className="text-xl font-bold text-white mb-1">Gotowy na start?</h4>
              <p className="text-slate-400 text-sm">Stwórz swój pierwszy turniej już dziś</p>
            </div>
            <a
              href="/tournaments/new"
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black px-6 py-3 rounded-lg text-sm uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30"
            >
              Start
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}