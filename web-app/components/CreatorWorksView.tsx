'use client';

import { useState, useEffect } from 'react';
import { X, Check, Plus, Loader2, AlertCircle, Film, User, ExternalLink } from 'lucide-react';
import type { CreatorWorksViewProps, CreatorWork, BulkAddResults } from '@/types/contribute';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CreatorWorksView({
  creatorQid,
  creatorName,
  creatorBirthYear,
  creatorDeathYear,
  onClose,
  onComplete
}: CreatorWorksViewProps) {

  // State management
  const [works, setWorks] = useState<CreatorWork[]>([]);
  const [selectedWorks, setSelectedWorks] = useState<Set<string>>(new Set());
  const [addCreatorAsFigure, setAddCreatorAsFigure] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{
    current: number;
    total: number;
    currentWorkTitle?: string;
  } | null>(null);
  const [results, setResults] = useState<BulkAddResults | null>(null);

  // ============================================================================
  // FETCH CREATOR WORKS ON MOUNT
  // ============================================================================

  useEffect(() => {
    async function loadWorks() {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch works from Wikidata via our API
        const response = await fetch(`/api/wikidata/by-creator?qid=${creatorQid}`);

        if (!response.ok) {
          throw new Error('Failed to fetch creator works from Wikidata');
        }

        const data = await response.json();
        const worksFromWikidata = data.works || [];

        // Check which works already exist in our database
        const worksWithStatus = await Promise.all(
          worksFromWikidata.map(async (work: any) => {
            try {
              // Check if work exists in our database
              const checkResponse = await fetch(`/api/media/check?qid=${work.qid}`);
              const checkData = await checkResponse.json();

              return {
                qid: work.qid,
                title: work.title,
                year: work.year,
                type: work.type,
                inDatabase: checkData.exists || false
              } as CreatorWork;
            } catch (error) {
              // If check fails, assume not in database
              return {
                qid: work.qid,
                title: work.title,
                year: work.year,
                type: work.type,
                inDatabase: false
              } as CreatorWork;
            }
          })
        );

        setWorks(worksWithStatus);

        // Auto-select works not already in database
        const newWorks = worksWithStatus
          .filter(w => !w.inDatabase)
          .map(w => w.qid);
        setSelectedWorks(new Set(newWorks));

      } catch (err) {
        console.error('Failed to load creator works:', err);
        setError(err instanceof Error ? err.message : 'Failed to load works');
      } finally {
        setIsLoading(false);
      }
    }

    loadWorks();
  }, [creatorQid]);

  // ============================================================================
  // BULK ADD LOGIC
  // ============================================================================

  async function handleBulkAdd() {
    if (selectedWorks.size === 0) {
      setError('Please select at least one work to add');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProgress({ current: 0, total: selectedWorks.size });

    const results: BulkAddResults = {
      totalAttempted: selectedWorks.size,
      succeeded: 0,
      failed: 0,
      errors: [],
      createdWorkIds: []
    };

    try {
      // Step 1: Add creator as figure if checkbox is selected
      let creatorCanonicalId: string | undefined;

      if (addCreatorAsFigure) {
        try {
          const figureResponse = await fetch('/api/figures/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: creatorName,
              birthYear: creatorBirthYear,
              deathYear: creatorDeathYear,
              wikidataId: creatorQid,
              historicity: 'historical',
              wikidata_verified: true,
              data_source: 'wikidata'
            })
          });

          if (figureResponse.ok) {
            const figureData = await figureResponse.json();
            creatorCanonicalId = figureData.canonical_id;
            results.createdCreatorId = creatorCanonicalId;
          } else if (figureResponse.status === 409) {
            // Creator already exists, get the canonical_id
            const figureData = await figureResponse.json();
            creatorCanonicalId = figureData.existingFigure?.canonical_id;
          } else {
            console.warn('Failed to create creator as figure, continuing with works');
          }
        } catch (err) {
          console.error('Error creating creator figure:', err);
          // Continue anyway - not critical
        }
      }

      // Step 2: Process each selected work
      const selectedWorksList = works.filter(w => selectedWorks.has(w.qid));
      let currentIndex = 0;

      for (const work of selectedWorksList) {
        currentIndex++;
        setProgress({
          current: currentIndex,
          total: selectedWorks.size,
          currentWorkTitle: work.title
        });

        try {
          // Enrich work data from Wikidata
          const enrichResponse = await fetch('/api/wikidata/enrich', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              entityType: 'work',
              wikidataId: work.qid
            })
          });

          let enrichedData: any = {};
          if (enrichResponse.ok) {
            const enrichData = await enrichResponse.json();
            enrichedData = enrichData.enrichedData || {};
          }

          // Suggest era tags
          const eraResponse = await fetch('/api/ai/suggest-eras', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              workTitle: work.title,
              settingYear: work.year
            })
          });

          let eraTags: any[] = [];
          if (eraResponse.ok) {
            const eraData = await eraResponse.json();
            eraTags = eraData.suggestedTags || [];
          }

          // Determine media type from Wikidata type
          const mediaType = mapWikidataTypeToMediaType(work.type);

          // Create the media work
          const createResponse = await fetch('/api/media/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: work.title,
              mediaType,
              releaseYear: work.year,
              creator: creatorCanonicalId || creatorName,
              wikidataId: work.qid,
              eraTags: eraTags.map((tag: any) => ({
                name: tag.name,
                confidence: tag.confidence,
                source: 'ai'
              })),
              wikidata_verified: true,
              data_source: 'wikidata'
            })
          });

          if (createResponse.ok) {
            const mediaData = await createResponse.json();
            results.succeeded++;
            results.createdWorkIds.push(mediaData.media?.media_id || work.qid);
          } else if (createResponse.status === 409) {
            // Work already exists - count as success
            results.succeeded++;
          } else {
            const errorData = await createResponse.json();
            results.failed++;
            results.errors.push({
              workTitle: work.title,
              error: errorData.error || 'Unknown error'
            });
          }

          // Small delay to avoid overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 500));

        } catch (err) {
          results.failed++;
          results.errors.push({
            workTitle: work.title,
            error: err instanceof Error ? err.message : 'Unknown error'
          });
        }
      }

      // Done
      setResults(results);

      if (onComplete) {
        onComplete(results);
      }

    } catch (err) {
      console.error('Bulk add error:', err);
      setError(err instanceof Error ? err.message : 'Failed to add works');
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  }

  // ============================================================================
  // UTILITY: MAP WIKIDATA TYPE TO MEDIA TYPE
  // ============================================================================

  function mapWikidataTypeToMediaType(wikidataType: string): string {
    const typeLower = wikidataType.toLowerCase();

    if (typeLower.includes('book') || typeLower.includes('novel') || typeLower.includes('literary')) {
      return 'BOOK';
    } else if (typeLower.includes('film') || typeLower.includes('movie')) {
      return 'FILM';
    } else if (typeLower.includes('series') || typeLower.includes('tv')) {
      return 'TV_SERIES';
    } else if (typeLower.includes('game')) {
      return 'GAME';
    } else if (typeLower.includes('play')) {
      return 'PLAY';
    } else if (typeLower.includes('comic') || typeLower.includes('graphic')) {
      return 'COMIC';
    }

    return 'BOOK'; // Default fallback
  }

  // ============================================================================
  // TOGGLE SELECTION
  // ============================================================================

  function toggleWork(qid: string) {
    const newSelection = new Set(selectedWorks);
    if (newSelection.has(qid)) {
      newSelection.delete(qid);
    } else {
      newSelection.add(qid);
    }
    setSelectedWorks(newSelection);
  }

  // ============================================================================
  // RENDER: LOADING STATE
  // ============================================================================

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-brand-accent" />
            <p className="text-lg text-brand-text">Loading works by {creatorName}...</p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER: PROCESSING STATE
  // ============================================================================

  if (isProcessing && progress) {
    const percentage = Math.round((progress.current / progress.total) * 100);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8">
          <h3 className="text-xl font-semibold text-brand-primary mb-4">
            Adding works...
          </h3>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div
                className="bg-brand-accent h-3 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-sm text-brand-text/70 text-center">
              {percentage}% ({progress.current} of {progress.total})
            </p>
          </div>

          {/* Current Work */}
          {progress.currentWorkTitle && (
            <div className="flex items-center gap-2 text-brand-text">
              <Loader2 className="w-4 h-4 animate-spin text-brand-accent" />
              <p className="text-sm">{progress.currentWorkTitle}</p>
            </div>
          )}

          {/* Cancel Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-brand-text/60 hover:text-brand-text transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER: RESULTS STATE
  // ============================================================================

  if (results) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-brand-primary">
              Bulk Add Complete
            </h3>
            <button
              onClick={onClose}
              className="text-brand-text/60 hover:text-brand-text transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success Summary */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-green-700 bg-green-50 p-4 rounded-lg">
              <Check className="w-5 h-5" />
              <p className="font-medium">
                {results.succeeded} of {results.totalAttempted} works added successfully
              </p>
            </div>

            {results.failed > 0 && (
              <div className="flex items-start gap-3 text-red-700 bg-red-50 p-4 rounded-lg">
                <AlertCircle className="w-5 h-5 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium mb-2">
                    {results.failed} works failed
                  </p>
                  <ul className="text-sm space-y-1">
                    {results.errors.slice(0, 5).map((err, idx) => (
                      <li key={idx}>
                        {err.workTitle}: {err.error}
                      </li>
                    ))}
                    {results.errors.length > 5 && (
                      <li className="text-red-600/70">
                        ...and {results.errors.length - 5} more
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {results.createdCreatorId && (
              <div className="flex items-center gap-3 text-blue-700 bg-blue-50 p-4 rounded-lg">
                <User className="w-5 h-5" />
                <p className="text-sm">
                  {creatorName} was added as a Historical Figure
                </p>
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER: MAIN WORKS VIEW
  // ============================================================================

  const availableWorks = works.filter(w => !w.inDatabase);
  const existingWorks = works.filter(w => w.inDatabase);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-primary/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold text-brand-primary">
                Works by {creatorName}
              </h2>
              <a
                href={`https://www.wikidata.org/wiki/${creatorQid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-accent hover:text-brand-accent/80 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <p className="text-sm text-brand-text/60">
              {creatorBirthYear && creatorDeathYear
                ? `${creatorBirthYear} - ${creatorDeathYear}`
                : creatorBirthYear
                  ? `b. ${creatorBirthYear}`
                  : 'Wikidata Q-ID: ' + creatorQid}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-brand-text/60 hover:text-brand-text transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Add Creator Checkbox */}
        <div className="px-6 pt-4">
          <label className="flex items-start gap-3 cursor-pointer p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-lg hover:bg-brand-primary/10 transition-colors">
            <input
              type="checkbox"
              checked={addCreatorAsFigure}
              onChange={(e) => setAddCreatorAsFigure(e.target.checked)}
              className="mt-1 w-4 h-4 text-brand-accent focus:ring-brand-accent border-brand-primary/30 rounded"
            />
            <div>
              <p className="font-medium text-brand-text">
                Also add {creatorName} as a Historical Figure
              </p>
              <p className="text-sm text-brand-text/60 mt-1">
                This will create a figure entry linked to all their works
              </p>
            </div>
          </label>
        </div>

        {/* Works List */}
        <div className="p-6 max-h-96 overflow-y-auto">

          {/* Available Works */}
          {availableWorks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-brand-text/70 uppercase tracking-wide mb-3">
                Available to Add ({availableWorks.length})
              </h3>
              <div className="space-y-2">
                {availableWorks.map((work) => (
                  <label
                    key={work.qid}
                    className="flex items-center gap-3 p-3 border border-brand-primary/20 rounded-lg hover:border-brand-accent hover:bg-brand-accent/5 transition-all cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedWorks.has(work.qid)}
                      onChange={() => toggleWork(work.qid)}
                      className="w-4 h-4 text-brand-accent focus:ring-brand-accent border-brand-primary/30 rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-brand-text">
                        {work.title}
                        {work.year && (
                          <span className="text-sm text-brand-text/60 ml-2">
                            ({work.year})
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-brand-text/50 mt-0.5">
                        {work.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-brand-accent text-xs px-2 py-1 bg-brand-accent/10 rounded">
                      <Plus className="w-3 h-3" />
                      Add
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Existing Works */}
          {existingWorks.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-brand-text/70 uppercase tracking-wide mb-3">
                Already in Database ({existingWorks.length})
              </h3>
              <div className="space-y-2">
                {existingWorks.map((work) => (
                  <div
                    key={work.qid}
                    className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg opacity-60"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-brand-text">
                        {work.title}
                        {work.year && (
                          <span className="text-sm text-brand-text/60 ml-2">
                            ({work.year})
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-brand-text/50 mt-0.5">
                        {work.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-green-700 text-xs px-2 py-1 bg-green-100 rounded">
                      <Check className="w-3 h-3" />
                      In DB
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {works.length === 0 && (
            <div className="text-center py-12">
              <Film className="w-12 h-12 text-brand-text/20 mx-auto mb-4" />
              <p className="text-brand-text/60">
                No works found for this creator on Wikidata
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-brand-primary/10 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-brand-text/60 hover:text-brand-text transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleBulkAdd}
            disabled={selectedWorks.size === 0 || isProcessing}
            className="px-6 py-2 bg-brand-accent text-white rounded-lg hover:bg-brand-accent/90 disabled:bg-brand-accent/30 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Selected ({selectedWorks.size} works)
          </button>
        </div>

      </div>
    </div>
  );
}
