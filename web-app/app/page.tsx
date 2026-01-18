import { Suspense } from 'react';
import { getConflictingPortrayals } from '@/lib/db';
import SearchInput from '@/components/SearchInput';
import ConflictFeed from '@/components/ConflictFeed';
import AuthButtons from '@/components/AuthButtons';

export default async function Dashboard() {
  let conflicts: any[] = [];
  try {
    conflicts = await getConflictingPortrayals();
  } catch (error) {
    console.error('Failed to fetch conflicts:', error);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <header className="flex items-center justify-between mb-12">
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                ChronosGraph
              </h1>
              <p className="text-lg text-gray-400">
                Explore historical portrayals across media
              </p>
            </div>
            <AuthButtons />
          </header>

          {/* Search Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-center mb-4">Unified Search</h2>
            <Suspense fallback={<div className="h-14 bg-gray-800 rounded-lg animate-pulse" />}>
              <SearchInput />
            </Suspense>
          </div>

          {/* Conflict Feed and Pathfinding */}
          <Suspense fallback={<div className="h-96 bg-gray-800 rounded-lg animate-pulse" />}>
            <ConflictFeed conflicts={conflicts} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}