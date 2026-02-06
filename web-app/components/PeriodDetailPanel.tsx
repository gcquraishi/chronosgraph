'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, BookOpen, User, TrendingUp } from 'lucide-react';
import { PeriodDetail } from '@/lib/types';

interface PeriodDetailPanelProps {
  period: string; // Format: "1400-1500"
  isOpen: boolean;
  onClose: () => void;
}

export default function PeriodDetailPanel({
  period,
  isOpen,
  onClose,
}: PeriodDetailPanelProps) {
  const [data, setData] = useState<PeriodDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && period) {
      fetchPeriodDetails();
    }
  }, [isOpen, period]);

  const fetchPeriodDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/temporal-coverage/${period}`);
      if (!response.ok) {
        throw new Error('Failed to fetch period details');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full md:w-2/3 lg:w-1/2 bg-stone-100 shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="bg-amber-600 text-white p-6 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-black uppercase tracking-tight">
              Period Analysis
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-amber-700 transition-colors rounded"
              aria-label="Close panel"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="text-sm font-mono tracking-wider">
            Temporal Range: {period}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-black text-stone-600 uppercase tracking-widest">
                  Loading Period Data...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-600 p-4 mb-6">
              <p className="text-sm font-bold text-red-900">Error: {error}</p>
            </div>
          )}

          {data && !loading && (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white border-2 border-stone-300 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-5 h-5 text-amber-600" />
                    <p className="text-[10px] font-black text-stone-600 uppercase tracking-widest">
                      Total Works
                    </p>
                  </div>
                  <p className="text-3xl font-black text-amber-600">
                    {data.statistics.workCount}
                  </p>
                </div>

                <div className="bg-white border-2 border-stone-300 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-green-600" />
                    <p className="text-[10px] font-black text-stone-600 uppercase tracking-widest">
                      Historical Figures
                    </p>
                  </div>
                  <p className="text-3xl font-black text-green-600">
                    {data.statistics.figureCount}
                  </p>
                </div>
              </div>

              {/* Media Type Breakdown */}
              {Object.keys(data.statistics.mediaTypeBreakdown).length > 0 && (
                <div className="bg-stone-200 border-2 border-stone-300 p-4 mb-6">
                  <h3 className="text-sm font-black text-stone-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    Media Type Distribution
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(data.statistics.mediaTypeBreakdown).map(([type, count]) => (
                      <div key={type} className="bg-white border border-stone-300 p-2 flex justify-between items-center">
                        <span className="text-xs font-bold text-stone-700 uppercase">
                          {type}
                        </span>
                        <span className="text-lg font-black text-amber-600">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Creators */}
              {data.statistics.topCreators.length > 0 && (
                <div className="bg-blue-50 border-2 border-blue-300 p-4 mb-6">
                  <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-3">
                    Top Creators in Period
                  </h3>
                  <div className="space-y-2">
                    {data.statistics.topCreators.map((creator) => (
                      <div key={creator.name} className="bg-white border border-blue-300 p-2 flex justify-between items-center">
                        <span className="text-sm font-bold text-stone-900">
                          {creator.name}
                        </span>
                        <span className="text-xs font-black text-blue-600 uppercase tracking-wider">
                          {creator.workCount} work{creator.workCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Works List */}
              <div className="mb-6">
                <h3 className="text-sm font-black text-stone-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  Works from this Period ({data.works.length})
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {data.works.map((work) => (
                    <Link
                      key={work.media_id}
                      href={`/media/${work.media_id}`}
                      className="block bg-white border-2 border-stone-300 hover:border-amber-600 transition-all p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-grow min-w-0">
                          <p className="font-bold text-stone-900 uppercase text-sm leading-tight truncate">
                            {work.title}
                          </p>
                          <p className="text-xs text-stone-500 font-mono mt-1">
                            {work.release_year} • {work.media_type}
                          </p>
                          {work.creator && (
                            <p className="text-xs text-stone-600 mt-1">
                              by {work.creator}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Figures List */}
              {data.figures.length > 0 && (
                <div>
                  <h3 className="text-sm font-black text-stone-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <User className="w-4 h-4 text-green-600" />
                    Historical Figures ({data.figures.length})
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {data.figures.map((figure) => (
                      <Link
                        key={figure.canonical_id}
                        href={`/figure/${figure.canonical_id}`}
                        className="block bg-white border-2 border-stone-300 hover:border-green-600 transition-all p-3"
                      >
                        <p className="font-bold text-stone-900 uppercase text-sm">
                          {figure.name}
                        </p>
                        {figure.era && (
                          <p className="text-xs text-stone-500 font-mono mt-1">
                            {figure.era}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
