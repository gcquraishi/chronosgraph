'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BookMarked, Search, Loader2 } from 'lucide-react';

interface SeriesListItem {
  wikidata_id: string;
  title: string;
  media_type: string;
  creator?: string;
  work_count: number;
  character_count: number;
}

export default function SeriesBrowsePage() {
  const [series, setSeries] = useState<SeriesListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSeries, setFilteredSeries] = useState<SeriesListItem[]>([]);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await fetch('/api/series/browse');
        if (!response.ok) {
          throw new Error('Failed to fetch series');
        }
        const data = await response.json();
        setSeries(data);
        setFilteredSeries(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load series');
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, []);

  useEffect(() => {
    const filtered = series.filter(s =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.creator && s.creator.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredSeries(filtered);
  }, [searchQuery, series]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
          <span className="text-xl text-gray-400">Loading series...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <BookMarked className="w-8 h-8 text-blue-400" />
              <h1 className="text-4xl font-bold text-white">Browse Series</h1>
            </div>
            <p className="text-gray-400">
              Explore all book, TV, film, and game series in ChronosGraph
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by series name or creator..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-8">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Series Grid */}
          {filteredSeries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSeries.map((s) => (
                <Link
                  key={s.wikidata_id}
                  href={`/series/${s.wikidata_id}`}
                  className="group block bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-all"
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                      {s.title}
                    </h3>
                    {s.creator && (
                      <p className="text-sm text-gray-400 mt-1">by {s.creator}</p>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-400">
                      <span className="text-gray-300 font-medium">{s.media_type}</span> Series
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-700">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Works</p>
                      <p className="text-2xl font-bold text-blue-400">{s.work_count}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Characters</p>
                      <p className="text-2xl font-bold text-blue-400">{s.character_count}</p>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-blue-400 group-hover:translate-x-1 transition-transform">
                    View Series →
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookMarked className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-xl text-gray-400 mb-2">
                {searchQuery ? 'No series found matching your search' : 'No series available'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-blue-400 hover:text-blue-300 mt-4"
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {/* Summary */}
          {!error && series.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-700 text-center">
              <p className="text-gray-400">
                Showing {filteredSeries.length} of {series.length} series
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
