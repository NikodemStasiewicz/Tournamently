
export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      {/* Animated background */}
      <div className="absolute inset-0">
        {/* Main background image with overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-purple-900/70 to-slate-800/80 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1587095951604-b9d924a3fda0?w=1920&auto=format&fit=crop&q=80&ixlib=rb-4.1.0"
          alt="Esportowa arena"
          className="w-full h-full object-cover"
        />
        
        {/* Animated elements */}
        <div className="absolute inset-0 z-20">
          {/* Floating particles */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-1000 opacity-40"></div>
          <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping delay-2000 opacity-50"></div>
          
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          {/* Scanning lines */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400/60 to-transparent animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-30 text-center px-6 py-12 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-slate-800/50 backdrop-blur-xl border border-cyan-500/30 rounded-full px-4 py-2 mb-8 shadow-lg shadow-cyan-500/20">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-slate-300 text-sm font-bold uppercase tracking-wider">
            Platforma #1 w Polsce
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
          <span className="block text-white drop-shadow-2xl">ZARZĄDZAJ</span>
          <span className="block text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text animate-pulse">
            TURNIEJAMI
          </span>
          <span className="block text-white drop-shadow-2xl">Z ŁATWOŚCIĄ</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl mb-12 text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed">
          Twórz i organizuj profesjonalne turnieje <span className="text-cyan-400 font-bold">esportowe</span> i <span className="text-purple-400 font-bold">sportowe</span>.
          <br className="hidden md:block" />
          Wszystko w jednym miejscu, w kilka minut.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
          {/* Primary CTA */}
          <a
            href="/tournaments/new"
            className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black px-8 py-4 rounded-xl text-lg uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-purple-500/30 hover:shadow-purple-400/50 border border-cyan-400/30 hover:border-cyan-300/50"
          >
            <span className="relative z-10 flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Rozpocznij teraz
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
          </a>

          {/* Secondary CTA */}
          <a
            href="/tournaments"
            className="group relative bg-slate-800/50 backdrop-blur-xl hover:bg-slate-700/50 text-white font-bold px-8 py-4 rounded-xl text-lg uppercase tracking-wide transition-all duration-300 border border-slate-600/50 hover:border-slate-500/70 shadow-xl"
          >
            <span className="relative z-10 flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Przeglądaj turnieje
            </span>
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center p-6 bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/30 shadow-xl">
            <div className="text-3xl font-black text-cyan-400 mb-2">1000+</div>
            <div className="text-slate-300 font-medium uppercase tracking-wide text-sm">Turniejów</div>
          </div>
          <div className="text-center p-6 bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/30 shadow-xl">
            <div className="text-3xl font-black text-purple-400 mb-2">50K+</div>
            <div className="text-slate-300 font-medium uppercase tracking-wide text-sm">Graczy</div>
          </div>
          <div className="text-center p-6 bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-slate-700/30 shadow-xl">
            <div className="text-3xl font-black text-pink-400 mb-2">24/7</div>
            <div className="text-slate-300 font-medium uppercase tracking-wide text-sm">Wsparcie</div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-900 to-transparent z-20"></div>
      
      {/* Animated border */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 shadow-lg"></div>
    </section>
  );
}