'use client';

import { Suspense } from 'react';
import TeamsManagement from '../components/Team';

export default function TeamsPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <Suspense fallback={<TeamsLoadingSkeleton />}>
          <TeamsManagement />
        </Suspense>
      </main>
    </div>
  );
}

// Loading skeleton component
function TeamsLoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-700 rounded animate-pulse"></div>
          <div className="w-64 h-8 bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="w-32 h-10 bg-gray-700 rounded animate-pulse"></div>
      </div>

      {/* Tabs skeleton */}
      <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg w-fit">
        <div className="w-32 h-10 bg-gray-700 rounded animate-pulse"></div>
        <div className="w-32 h-10 bg-gray-700 rounded animate-pulse"></div>
      </div>

      {/* Search skeleton */}
      <div className="mb-6">
        <div className="w-full h-12 bg-gray-800 rounded-lg animate-pulse"></div>
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="w-32 h-6 bg-gray-700 rounded animate-pulse"></div>
              <div className="w-16 h-5 bg-gray-700 rounded animate-pulse"></div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="w-full h-4 bg-gray-700 rounded animate-pulse"></div>
              <div className="w-3/4 h-4 bg-gray-700 rounded animate-pulse"></div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-4 bg-gray-700 rounded animate-pulse"></div>
              <div className="w-20 h-4 bg-gray-700 rounded animate-pulse"></div>
            </div>

            <div className="flex gap-2">
              <div className="flex-1 h-8 bg-gray-700 rounded animate-pulse"></div>
              <div className="w-20 h-8 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
