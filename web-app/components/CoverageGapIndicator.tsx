'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

interface CoverageGapIndicatorProps {
  coverageGaps: string[]; // Array of period strings like "500-600"
  onGapClick?: (period: string) => void;
}

export default function CoverageGapIndicator({
  coverageGaps,
  onGapClick,
}: CoverageGapIndicatorProps) {
  if (coverageGaps.length === 0) {
    return (
      <div className="bg-green-50 border-2 border-green-600 p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">✓</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-black text-green-900 uppercase tracking-widest">
              Complete Coverage
            </h3>
            <p className="text-xs text-green-700 mt-1">
              All time periods have adequate representation (5+ works each)
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border-2 border-amber-600 p-6">
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0">
          <AlertTriangle className="w-8 h-8 text-amber-600" />
        </div>
        <div>
          <h3 className="text-sm font-black text-amber-900 uppercase tracking-widest mb-1">
            Under-Represented Periods
          </h3>
          <p className="text-xs text-amber-700">
            {coverageGaps.length} time period{coverageGaps.length !== 1 ? 's' : ''} with sparse coverage (&lt;5 works)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {coverageGaps.map((period) => (
          <button
            key={period}
            onClick={() => onGapClick?.(period)}
            className="bg-white border-2 border-amber-600 hover:bg-amber-100 transition-all p-3 text-center group"
          >
            <div className="text-xs font-black text-amber-900 uppercase tracking-wider mb-1">
              {period}
            </div>
            <div className="text-[10px] text-amber-700 uppercase tracking-widest group-hover:text-amber-900">
              Add Content →
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t-2 border-amber-300">
        <p className="text-xs text-amber-700 leading-relaxed">
          <span className="font-black uppercase tracking-wide">Action Required:</span>{' '}
          These periods need more historical works to improve database coverage. Click a period to explore existing content or contribute new entries.
        </p>
      </div>
    </div>
  );
}
