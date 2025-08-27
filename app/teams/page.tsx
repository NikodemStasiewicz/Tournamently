
'use client';

import { Suspense } from 'react';
import TeamsManagement from '../components/Team';

export default function TeamsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" 
           style={{
             backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
             backgroundSize: '40px 40px'
           }}>
      </div>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <Suspense fallback={<TeamsLoadingSkeleton />}>
          <TeamsManagement />
        </Suspense>
      </main>
    </div>
  );
}

// Enhanced esports loading skeleton component
function TeamsLoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header skeleton with esports styling */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg blur animate-pulse opacity-50"></div>
          </div>
          <div className="space-y-2">
            <div className="w-80 h-8 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg animate-pulse"></div>
            <div className="w-48 h-4 bg-slate-700/50 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="relative">
          <div className="w-40 h-12 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl blur animate-pulse opacity-30"></div>
        </div>
      </div>

      {/* Enhanced tabs skeleton */}
      <div className="flex space-x-2 mb-8 bg-slate-800/50 backdrop-blur-sm p-2 rounded-2xl w-fit border border-slate-700/50">
        <div className="w-36 h-12 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl animate-pulse border border-cyan-500/30"></div>
        <div className="w-36 h-12 bg-slate-700/30 rounded-xl animate-pulse"></div>
        <div className="w-36 h-12 bg-slate-700/30 rounded-xl animate-pulse"></div>
      </div>

      {/* Enhanced search skeleton */}
      <div className="mb-8 relative">
        <div className="w-full h-14 bg-slate-800/50 backdrop-blur-sm rounded-2xl animate-pulse border border-slate-700/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-pulse"></div>
        </div>
      </div>

      {/* Enhanced cards skeleton with esports styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="group relative">
            {/* Card glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
            
            <div className="relative bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300">
              {/* Team header */}
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-3">
                  <div className="w-40 h-7 bg-gradient-to-r from-cyan-400/30 to-purple-400/30 rounded-lg animate-pulse"></div>
                  <div className="flex gap-2">
                    <div className="w-16 h-5 bg-green-500/20 rounded-full animate-pulse"></div>
                    <div className="w-12 h-5 bg-slate-600/50 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="w-8 h-8 bg-slate-700/50 rounded-full animate-pulse"></div>
              </div>
              
              {/* Team description */}
              <div className="space-y-3 mb-6">
                <div className="w-full h-4 bg-slate-700/40 rounded animate-pulse"></div>
                <div className="w-4/5 h-4 bg-slate-700/40 rounded animate-pulse"></div>
                <div className="w-3/5 h-4 bg-slate-700/40 rounded animate-pulse"></div>
              </div>

              {/* Stats section */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-cyan-500/30 rounded animate-pulse"></div>
                  <div className="w-24 h-4 bg-slate-700/40 rounded animate-pulse"></div>
                </div>
                <div className="w-20 h-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full animate-pulse"></div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <div className="flex-1 h-10 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-xl animate-pulse border border-cyan-500/20"></div>
                <div className="w-24 h-10 bg-slate-700/30 rounded-xl animate-pulse"></div>
                <div className="w-10 h-10 bg-slate-700/30 rounded-xl animate-pulse"></div>
              </div>

              {/* Pulse indicator */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading text with esports styling */}
      <div className="text-center mt-12">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50">
          <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="w-32 h-5 bg-gradient-to-r from-cyan-400/50 to-purple-400/50 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}