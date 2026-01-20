'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MapPin, Clock, Loader2, Search } from 'lucide-react';
import type { LocationWithStats, EraWithStats, DiscoveryBrowseResult } from '@/lib/types';

function formatYear(year: number): string {
  if (year < 0) {
    return `${Math.abs(year)} BCE`;
  }
  return `${year}`;
}

export default function BrowsePage() {
  const [data, setData] = useState<DiscoveryBrowseResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<{ locations: LocationWithStats[]; eras: EraWithStats[] } | null>(null);

  useEffect(() => {
    const fetchDiscoveryData = async () => {
      try {
        const response = await fetch('/api/browse/locations-and-eras');
        if (!response.ok) {
          throw new Error('Failed to fetch discovery data');
        }
        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchDiscoveryData();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || searchQuery.length < 2) return;

    setSearchLoading(true);
    try {
      const response = await fetch(`/api/browse/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const results = await response.json();
      setSearchResults(results);
    } catch (err: any) {
      console.error('Search error:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
          <span className="text-xl text-gray-400">Loading discovery data...</span>
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
            <h1 className="text-4xl font-bold text-white mb-3">Discover by Location & Era</h1>
            <p className="text-gray-400 text-lg">
              Explore creative works through the places they're set and the times they depict
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search locations or eras..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </form>

          {/* Error State */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-8">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Search Results */}
          {searchResults && (
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Search Results</h2>
                <button
                  onClick={clearSearch}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Clear Search
                </button>
              </div>

              {(searchResults.locations.length > 0 || searchResults.eras.length > 0) ? (
                <div className="space-y-8">
                  {searchResults.locations.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Locations</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {searchResults.locations.map((location) => (
                          <LocationCard key={location.location_id} location={location} />
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.eras.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-4">Eras</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {searchResults.eras.map((era) => (
                          <EraCard key={era.era_id} era={era} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No results found for "{searchQuery}"</p>
              )}
            </div>
          )}

          {!searchResults && data && (
            <>
              {/* Locations Section */}
              <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-blue-400" />
                      Featured Locations
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      {data.stats.total_locations} locations • Works set in {data.stats.most_works_location}
                    </p>
                  </div>
                  <Link href="/browse/locations" className="text-blue-400 hover:text-blue-300">
                    View All →
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.locations.slice(0, 6).map((location) => (
                    <LocationCard key={location.location_id} location={location} />
                  ))}
                </div>
              </div>

              {/* Eras Section */}
              <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                      <Clock className="w-6 h-6 text-purple-400" />
                      Featured Eras
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                      {data.stats.total_eras} eras • Most works set in {data.stats.most_works_era}
                    </p>
                  </div>
                  <Link href="/browse/eras" className="text-purple-400 hover:text-purple-300">
                    View All →
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.eras.slice(0, 6).map((era) => (
                    <EraCard key={era.era_id} era={era} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function LocationCard({ location }: { location: LocationWithStats }) {
  return (
    <Link
      href={`/browse/location/${location.location_id}`}
      className="group block bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-all"
    >
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <span className="text-xs text-gray-500 px-2 py-1 bg-gray-700 rounded">
            {location.location_type}
          </span>
        </div>
        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
          {location.name}
        </h3>
        {location.description && (
          <p className="text-sm text-gray-400 mt-2 line-clamp-2">{location.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-700">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Works</p>
          <p className="text-2xl font-bold text-blue-400">{location.work_count}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Figures</p>
          <p className="text-2xl font-bold text-blue-400">{location.figure_count}</p>
        </div>
      </div>

      <div className="mt-4 text-sm text-blue-400 group-hover:translate-x-1 transition-transform">
        Explore →
      </div>
    </Link>
  );
}

function EraCard({ era }: { era: EraWithStats }) {
  return (
    <Link
      href={`/browse/era/${era.era_id}`}
      className="group block bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-purple-500 transition-all"
    >
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <Clock className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <span className="text-xs text-gray-500 px-2 py-1 bg-gray-700 rounded">
            {era.era_type.replace('_', ' ')}
          </span>
        </div>
        <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
          {era.name}
        </h3>
        <p className="text-sm text-gray-400 mt-2">
          {formatYear(era.start_year)} – {formatYear(era.end_year)}
        </p>
      </div>

      {era.description && (
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{era.description}</p>
      )}

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-700">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Works</p>
          <p className="text-2xl font-bold text-purple-400">{era.work_count}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Figures</p>
          <p className="text-2xl font-bold text-purple-400">{era.figure_count}</p>
        </div>
      </div>

      <div className="mt-4 text-sm text-purple-400 group-hover:translate-x-1 transition-transform">
        Explore →
      </div>
    </Link>
  );
}
