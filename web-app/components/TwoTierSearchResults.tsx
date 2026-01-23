'use client';

import { Database, Globe, PlusCircle, ArrowRight, ExternalLink, Info } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import WikidataMatchCard from './WikidataMatchCard';
import type {
  SearchResult,
  WikidataMatch,
  TwoTierSearchResultsProps
} from '@/types/contribute';

// ============================================================================
// CHR-17: CLIENT-SIDE DEDUPLICATION UTILITY (Defense in Depth)
// ============================================================================

/**
 * Filters out Wikidata results that already exist in database results
 * This is a client-side safety net in case API filtering somehow missed duplicates
 */
function deduplicateResults(
  wikidataResults: WikidataMatch[],
  dbResults: SearchResult[]
): { filtered: WikidataMatch[]; count: number } {
  if (dbResults.length === 0 || wikidataResults.length === 0) {
    return { filtered: wikidataResults, count: 0 };
  }

  // Extract Q-IDs from database results (if they have wikidata_id)
  const dbQids = new Set(
    dbResults
      .map(result => result.metadata?.wikidata_id)
      .filter(Boolean)
  );

  // Filter out Wikidata matches that already exist in DB
  const filtered = wikidataResults.filter(match => !dbQids.has(match.qid));
  const count = wikidataResults.length - filtered.length;

  return { filtered, count };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function TwoTierSearchResults({
  dbResults,
  wikidataResults,
  searchQuery,
  onSelectExisting,
  onSelectWikidata,
  onSelectUserGenerated,
  onAddAsFigure,
  onBrowseWorks,
  isEnriching = false
}: TwoTierSearchResultsProps) {

  // CHR-17: Prioritize database results - only show Wikidata if user opts in or no DB results
  const [showWikidataResults, setShowWikidataResults] = useState(false);

  // Auto-show Wikidata results if there are no database results
  const shouldShowWikidata = dbResults.length === 0 || showWikidataResults;

  // CHR-17: Client-side deduplication (defense in depth) - only applies when showing Wikidata
  const { filtered: dedupedWikidataResults, count: clientFilteredCount } = useMemo(
    () => deduplicateResults(wikidataResults, dbResults),
    [wikidataResults, dbResults]
  );

  // Reset Wikidata toggle when search results change (new search query)
  useEffect(() => {
    setShowWikidataResults(false);
  }, [searchQuery]);

  const hasResults = dbResults.length > 0 || dedupedWikidataResults.length > 0;

  // ============================================================================
  // RENDER: SECTION 1 - ALREADY IN CHRONOSGRAPH
  // ============================================================================

  const renderDatabaseResults = () => {
    if (dbResults.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-brand-primary" />
          <h3 className="text-lg font-semibold text-brand-primary">
            Already in ChronosGraph
          </h3>
        </div>
        <div className="space-y-2">
          {dbResults.map((result) => (
            <button
              key={result.id}
              onClick={() => onSelectExisting(result)}
              className="w-full p-4 bg-white border border-brand-primary/20 rounded-lg hover:border-brand-accent hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-brand-text group-hover:text-brand-accent transition-colors">
                    {result.name}
                  </p>
                  {result.description && (
                    <p className="text-sm text-brand-text/60 mt-1">
                      {result.description}
                    </p>
                  )}
                  {result.year && (
                    <p className="text-xs text-brand-text/50 mt-1">
                      {result.year}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="capitalize text-brand-primary px-2 py-1 bg-brand-primary/10 rounded">
                    {result.type}
                  </span>
                  <ArrowRight className="w-4 h-4 text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // ============================================================================
  // RENDER: SECTION 1.5 - WIKIDATA TOGGLE (CHR-17 UX IMPROVEMENT)
  // ============================================================================

  const renderWikidataToggle = () => {
    // Only show toggle if:
    // 1. We have database results (prioritizing existing data)
    // 2. We have Wikidata results available
    // 3. User hasn't already opted to show Wikidata
    if (dbResults.length === 0 || dedupedWikidataResults.length === 0 || showWikidataResults) {
      return null;
    }

    return (
      <div className="pt-4">
        <button
          onClick={() => setShowWikidataResults(true)}
          className="w-full p-4 bg-brand-accent/5 border-2 border-dashed border-brand-accent/30 rounded-lg hover:border-brand-accent hover:bg-brand-accent/10 transition-all duration-200 text-left group"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-brand-accent flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-brand-text group-hover:text-brand-accent transition-colors">
                Not finding what you're looking for?
              </p>
              <p className="text-sm text-brand-text/60 mt-1">
                Search Wikidata for {dedupedWikidataResults.length} more option{dedupedWikidataResults.length !== 1 ? 's' : ''}
              </p>
            </div>
            <ExternalLink className="w-4 h-4 text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </button>
      </div>
    );
  };

  // ============================================================================
  // RENDER: SECTION 2 - ADD FROM WIKIDATA
  // ============================================================================

  const renderWikidataResults = () => {
    // CHR-17: Only show Wikidata results if user opts in or no DB results exist
    if (!shouldShowWikidata || dedupedWikidataResults.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-brand-accent" />
          <h3 className="text-lg font-semibold text-brand-primary">
            Add from Wikidata
          </h3>
        </div>

        {isEnriching && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-blue-800">
              Loading AI suggestions for locations and eras...
            </p>
          </div>
        )}

        <div className="space-y-2">
          {dedupedWikidataResults.map((match) => {
            const isCreator = match.enrichedData?.isCreator;

            return (
              <WikidataMatchCard
                key={match.qid}
                match={match}
                variant={isCreator ? 'creator' : 'default'}
                onSelect={() => onSelectWikidata(match)}
                // Bug fix CHR-19: Removed onAddFigure for creators - they should only show "Browse Works"
                onAddFigure={!isCreator && onAddAsFigure ? () => onAddAsFigure(match) : undefined}
                onBrowseWorks={isCreator && onBrowseWorks ? () => onBrowseWorks(match) : undefined}
                disabled={isEnriching}
              />
            );
          })}
        </div>
      </div>
    );
  };

  // ============================================================================
  // RENDER: SECTION 3 - NOT FOUND? CREATE MANUALLY
  // ============================================================================

  const renderManualCreation = () => (
    <div className="pt-4 border-t border-brand-primary/10">
      <button
        onClick={onSelectUserGenerated}
        className="w-full p-4 bg-brand-primary/5 border-2 border-dashed border-brand-primary/30 rounded-lg hover:border-brand-accent hover:bg-brand-accent/5 transition-all duration-200 text-left group"
      >
        <div className="flex items-center gap-3">
          <PlusCircle className="w-5 h-5 text-brand-accent flex-shrink-0" />
          <div>
            <p className="font-medium text-brand-text group-hover:text-brand-accent transition-colors">
              Not found anywhere?
            </p>
            <p className="text-sm text-brand-text/60 mt-1">
              Create a new entry without Wikidata enrichment
            </p>
          </div>
        </div>
      </button>
    </div>
  );

  // ============================================================================
  // RENDER: EMPTY STATE
  // ============================================================================

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <Database className="w-12 h-12 text-brand-text/20 mx-auto mb-4" />
      <p className="text-brand-text/60 mb-4">
        No results found for "{searchQuery}"
      </p>
      <button
        onClick={onSelectUserGenerated}
        className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors inline-flex items-center gap-2 shadow-sm"
      >
        <PlusCircle className="w-4 h-4" />
        Add Manually
      </button>
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  if (!hasResults) {
    return renderEmptyState();
  }

  return (
    <div className="space-y-6">
      {renderDatabaseResults()}
      {renderWikidataToggle()}
      {renderWikidataResults()}
      {renderManualCreation()}
    </div>
  );
}
