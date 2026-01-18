import { Suspense } from 'react';
import { getConflictingPortrayals } from '@/lib/db';
import SearchInput from '@/components/SearchInput';
import ConflictFeed from '@/components/ConflictFeed';

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
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-brand-primary mb-3">
              Explore Historical Portrayals Across Media
            </h1>
            <p className="text-lg text-brand-text/70">
              Discover how historical figures are depicted in film, television, books, and games
            </p>
          </div>

          {/* Search Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-center mb-4">Universal Search</h2>
            <Suspense fallback={<div className="h-14 bg-white/50 border border-brand-primary/20 rounded-lg animate-pulse" />}>
              <SearchInput />
            </Suspense>
          </div>

          {/* Conflict Feed and Pathfinding */}
          <Suspense fallback={<div className="h-96 bg-white/50 border border-brand-primary/20 rounded-lg animate-pulse" />}>
            <ConflictFeed conflicts={conflicts} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
