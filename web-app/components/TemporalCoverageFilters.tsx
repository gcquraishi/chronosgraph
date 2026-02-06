'use client';

import { useState } from 'react';
import { Filter } from 'lucide-react';

interface TemporalCoverageFiltersProps {
  onFilterChange: (filters: {
    granularity: 'century' | 'decade' | 'year';
    mediaType?: string;
    showSeriesOnly?: boolean;
  }) => void;
}

export default function TemporalCoverageFilters({
  onFilterChange,
}: TemporalCoverageFiltersProps) {
  const [granularity, setGranularity] = useState<'century' | 'decade' | 'year'>('century');
  const [mediaType, setMediaType] = useState<string>('all');
  const [showSeriesOnly, setShowSeriesOnly] = useState(false);

  const handleGranularityChange = (value: 'century' | 'decade' | 'year') => {
    setGranularity(value);
    onFilterChange({
      granularity: value,
      mediaType: mediaType === 'all' ? undefined : mediaType,
      showSeriesOnly,
    });
  };

  const handleMediaTypeChange = (value: string) => {
    setMediaType(value);
    onFilterChange({
      granularity,
      mediaType: value === 'all' ? undefined : value,
      showSeriesOnly,
    });
  };

  const handleSeriesToggle = (checked: boolean) => {
    setShowSeriesOnly(checked);
    onFilterChange({
      granularity,
      mediaType: mediaType === 'all' ? undefined : mediaType,
      showSeriesOnly: checked,
    });
  };

  return (
    <div className="bg-stone-100 border-2 border-stone-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-amber-600" />
        <h3 className="text-sm font-black text-stone-900 uppercase tracking-widest">
          Coverage Filters
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Granularity Selector */}
        <div>
          <label className="block text-[10px] font-black text-stone-600 uppercase tracking-widest mb-2">
            Time Granularity
          </label>
          <div className="flex gap-2">
            {(['century', 'decade', 'year'] as const).map((option) => (
              <button
                key={option}
                onClick={() => handleGranularityChange(option)}
                className={`flex-1 px-3 py-2 text-xs font-black uppercase tracking-wider border-2 transition-all ${
                  granularity === option
                    ? 'bg-amber-600 border-amber-600 text-white'
                    : 'bg-white border-stone-300 text-stone-700 hover:border-amber-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Media Type Filter */}
        <div>
          <label
            htmlFor="mediaType"
            className="block text-[10px] font-black text-stone-600 uppercase tracking-widest mb-2"
          >
            Media Type
          </label>
          <select
            id="mediaType"
            value={mediaType}
            onChange={(e) => handleMediaTypeChange(e.target.value)}
            className="w-full px-3 py-2 text-xs font-bold uppercase tracking-wide border-2 border-stone-300 bg-white text-stone-900 focus:border-amber-600 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="Book">Books Only</option>
            <option value="Film">Films Only</option>
            <option value="Game">Games Only</option>
            <option value="TV">TV Series Only</option>
          </select>
        </div>

        {/* Series Toggle */}
        <div>
          <label className="block text-[10px] font-black text-stone-600 uppercase tracking-widest mb-2">
            Content Type
          </label>
          <label className="flex items-center gap-3 cursor-pointer bg-white border-2 border-stone-300 hover:border-amber-600 transition-all px-3 py-2">
            <input
              type="checkbox"
              checked={showSeriesOnly}
              onChange={(e) => handleSeriesToggle(e.target.checked)}
              className="w-4 h-4 text-amber-600 border-stone-300 focus:ring-amber-500"
            />
            <span className="text-xs font-black uppercase tracking-wider text-stone-700">
              Series Only
            </span>
          </label>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(mediaType !== 'all' || showSeriesOnly) && (
        <div className="mt-4 pt-4 border-t-2 border-stone-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black text-stone-600 uppercase tracking-widest">
              Active:
            </span>
            {mediaType !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 bg-amber-600 text-white text-[10px] font-black uppercase tracking-wider">
                {mediaType}
              </span>
            )}
            {showSeriesOnly && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider">
                Series Only
              </span>
            )}
            <button
              onClick={() => {
                setMediaType('all');
                setShowSeriesOnly(false);
                onFilterChange({ granularity, mediaType: undefined, showSeriesOnly: false });
              }}
              className="text-[10px] text-amber-600 hover:text-amber-700 font-black uppercase tracking-wider underline"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
