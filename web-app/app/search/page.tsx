import { Suspense } from 'react';
import Link from 'next/link';
import { searchFigures } from '@/lib/db';
import SearchInput from '@/components/SearchInput';
import HistoricityBadge from '@/components/HistoricityBadge';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || '';
  const results = query ? await searchFigures(query) : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back to Dashboard */}
          <Link href="/" className="text-blue-400 hover:text-blue-300 mb-6 inline-block">
            ← Back to Dashboard
          </Link>

          {/* Search */}
          <div className="mb-8">
            <Suspense fallback={<div className="h-14 bg-gray-800 rounded-lg animate-pulse" />}>
              <SearchInput />
            </Suspense>
          </div>

          {/* Results */}
          {query && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Search results for &quot;{query}&quot; ({results.length})
              </h2>

              {results.length > 0 ? (
                <div className="space-y-3">
                  {results.map((figure) => (
                    <Link
                      key={figure.canonical_id}
                      href={`/figure/${figure.canonical_id}`}
                      className="block p-4 bg-gray-800 border border-gray-700 rounded-lg hover:border-blue-500 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{figure.name}</h3>
                          {figure.era && (
                            <p className="text-sm text-gray-400">{figure.era}</p>
                          )}
                        </div>
                        <HistoricityBadge status={figure.historicity_status} isFictional={figure.is_fictional} />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <p>No figures found matching &quot;{query}&quot;</p>
                  <p className="text-sm mt-2">Try a different search term</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
