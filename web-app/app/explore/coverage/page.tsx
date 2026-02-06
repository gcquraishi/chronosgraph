'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Database, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import TemporalCoverageChart from '@/components/TemporalCoverageChart';
import CoverageGapIndicator from '@/components/CoverageGapIndicator';
import TemporalCoverageFilters from '@/components/TemporalCoverageFilters';
import PeriodDetailPanel from '@/components/PeriodDetailPanel';
import { TemporalCoverageData, TimeBucket } from '@/lib/types';

export default function CoveragePage() {
  const [data, setData] = useState<TemporalCoverageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    granularity: 'century' | 'decade' | 'year';
    mediaType?: string;
    showSeriesOnly?: boolean;
  }>({
    granularity: 'century',
  });

  useEffect(() => {
    fetchCoverageData();
  }, [filters]);

  const fetchCoverageData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        granularity: filters.granularity,
        ...(filters.mediaType && { mediaType: filters.mediaType }),
      });

      const response = await fetch(`/api/temporal-coverage?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch coverage data');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodClick = (bucket: TimeBucket) => {
    setSelectedPeriod(bucket.period);
  };

  const handleGapClick = (period: string) => {
    setSelectedPeriod(period);
  };

  const calculateCoveragePercentage = (): number => {
    if (!data || data.timeBuckets.length === 0) return 0;
    const adequateBuckets = data.timeBuckets.filter(b => b.workCount >= 5).length;
    return Math.round((adequateBuckets / data.timeBuckets.length) * 100);
  };

  return (
    <div className="min-h-screen bg-stone-100 text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Link */}
          <Link
            href="/"
            className="text-amber-600 hover:text-amber-700 mb-6 inline-block font-mono text-sm uppercase tracking-wide font-bold"
          >
            ← Back to Dashboard
          </Link>

          {/* Header - HISTORICAL COVERAGE ARCHIVE */}
          <div className="bg-white border-t-8 border-amber-600 shadow-2xl p-8 mb-8 relative overflow-hidden">
            {/* Classification Banner */}
            <div className="absolute top-0 left-0 right-0 bg-amber-600 text-white text-center py-1">
              <div className="text-[10px] font-black uppercase tracking-[0.4em]">
                HISTORICAL COVERAGE ARCHIVE
              </div>
            </div>

            <div className="mt-6">
              <div className="text-[10px] font-black text-amber-700 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                <Database className="w-3 h-3" />
                Temporal Distribution Analysis // Active Monitoring
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-stone-900 tracking-tighter uppercase mb-4 leading-none">
                Temporal Coverage Explorer
              </h1>
              <p className="text-lg text-stone-600 leading-relaxed max-w-3xl">
                Comprehensive visualization of Fictotum's historical coverage across all time periods, showing content density, media type distribution, and identification of under-represented eras.
              </p>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border-2 border-red-600 p-6 mb-8">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="font-black text-red-900 uppercase tracking-wide mb-1">
                    Error Loading Coverage Data
                  </h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <div className="inline-block w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-black text-stone-600 uppercase tracking-widest">
                  Analyzing Temporal Coverage...
                </p>
              </div>
            </div>
          )}

          {/* Main Content */}
          {data && !loading && (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-stone-100 border-2 border-stone-200 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-5 h-5 text-amber-600" />
                    <p className="text-[10px] font-black text-stone-600 uppercase tracking-widest">
                      Total Works
                    </p>
                  </div>
                  <p className="text-4xl font-black text-amber-600 font-mono">
                    {data.statistics.totalWorks}
                  </p>
                </div>

                <div className="bg-stone-100 border-2 border-stone-200 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-green-600" />
                    <p className="text-[10px] font-black text-stone-600 uppercase tracking-widest">
                      Total Figures
                    </p>
                  </div>
                  <p className="text-4xl font-black text-green-600 font-mono">
                    {data.statistics.totalFigures}
                  </p>
                </div>

                <div className="bg-stone-100 border-2 border-stone-200 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <p className="text-[10px] font-black text-stone-600 uppercase tracking-widest">
                      Date Range
                    </p>
                  </div>
                  <p className="text-lg font-black text-blue-600 font-mono">
                    {data.statistics.earliestYear < 0
                      ? `${Math.abs(data.statistics.earliestYear)} BCE`
                      : data.statistics.earliestYear}
                    {' - '}
                    {data.statistics.latestYear}
                  </p>
                </div>

                <div className="bg-stone-100 border-2 border-stone-200 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <p className="text-[10px] font-black text-stone-600 uppercase tracking-widest">
                      Coverage Quality
                    </p>
                  </div>
                  <p className="text-4xl font-black text-purple-600 font-mono">
                    {calculateCoveragePercentage()}%
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="mb-8">
                <TemporalCoverageFilters onFilterChange={setFilters} />
              </div>

              {/* Main Chart */}
              <div className="mb-8">
                <div className="bg-amber-600 text-white px-4 py-2 mb-0">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                    <span>■</span> Temporal Distribution
                  </h2>
                </div>
                <TemporalCoverageChart
                  timeBuckets={data.timeBuckets}
                  onPeriodClick={handlePeriodClick}
                />
              </div>

              {/* Coverage Gaps */}
              <div className="mb-8">
                <div className="bg-amber-600 text-white px-4 py-2 mb-0">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                    <span>■</span> Coverage Analysis
                  </h2>
                </div>
                <div className="border-2 border-amber-600 border-t-0 p-0">
                  <CoverageGapIndicator
                    coverageGaps={data.statistics.coverageGaps}
                    onGapClick={handleGapClick}
                  />
                </div>
              </div>

              {/* Period Detail Panel */}
              <PeriodDetailPanel
                period={selectedPeriod || ''}
                isOpen={selectedPeriod !== null}
                onClose={() => setSelectedPeriod(null)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
