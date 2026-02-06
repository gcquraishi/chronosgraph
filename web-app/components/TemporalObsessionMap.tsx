import React from 'react';
import { MapPin } from 'lucide-react';

interface TemporalObsessionMapProps {
  creatorName: string;
}

/**
 * Temporal Obsession Map
 *
 * Identifies recurring historical periods a creator gravitates toward:
 * - Most frequently depicted eras
 * - Temporal range (earliest to latest settings)
 * - Era diversity score
 * - Signature historical periods
 *
 * Reveals creator's historiographical interests and specializations.
 */
export default function TemporalObsessionMap({
  creatorName
}: TemporalObsessionMapProps) {
  return (
    <div className="bg-stone-100 border-2 border-stone-200 p-6">
      <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest mb-4 flex items-center gap-2">
        <span className="text-amber-600">■</span> Temporal Obsession Map
      </h2>

      <div className="bg-white border-2 border-stone-300 p-8 text-center">
        <MapPin className="w-12 h-12 text-amber-600 mx-auto mb-4 opacity-30" />

        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-2">
          Historical Focus Analysis
        </div>

        <div className="text-xl font-bold text-stone-700 font-mono mb-6">
          MAPPING ERAS
        </div>

        <div className="border-t-2 border-stone-200 pt-4 mt-4">
          <p className="text-xs text-stone-500 leading-relaxed">
            Identifies recurring historical periods and temporal patterns in
            {creatorName}&apos;s body of work.
          </p>
        </div>
      </div>
    </div>
  );
}
