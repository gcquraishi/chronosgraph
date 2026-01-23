'use client';

import { Check, Globe, User, Film, Calendar, MapPin, Sparkles, Users } from 'lucide-react';
import type {
  WikidataMatch,
  WikidataMatchCardProps
} from '@/types/contribute';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function WikidataMatchCard({
  match,
  variant = 'default',
  onSelect,
  onAddFigure,
  onBrowseWorks,
  disabled = false
}: WikidataMatchCardProps) {

  const { qid, label, description, confidence, enrichedData } = match;

  // ============================================================================
  // CONFIDENCE BADGE STYLING
  // ============================================================================

  const getConfidenceBadge = () => {
    if (!confidence) return null;

    const styles = {
      high: 'bg-green-100 text-green-800 border-green-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      low: 'bg-red-100 text-red-800 border-red-300'
    };

    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${styles[confidence]}`}>
        {confidence} confidence
      </span>
    );
  };

  // ============================================================================
  // ENRICHED DATA PREVIEW
  // ============================================================================

  const renderEnrichedPreview = () => {
    if (!enrichedData) return null;

    const previews = [];

    // Birth/Death years for figures
    if (enrichedData.birth_year || enrichedData.death_year) {
      previews.push(
        <span key="lifespan" className="flex items-center gap-1 text-xs text-brand-text/70">
          <Calendar className="w-3 h-3" />
          Birth: {enrichedData.birth_year || '?'}, Death: {enrichedData.death_year || '?'}
        </span>
      );
    }

    // Release year for works
    if (enrichedData.release_year) {
      previews.push(
        <span key="release" className="flex items-center gap-1 text-xs text-brand-text/70">
          <Calendar className="w-3 h-3" />
          Released: {enrichedData.release_year}
        </span>
      );
    }

    // Locations
    if (enrichedData.locations && enrichedData.locations.length > 0) {
      const locationCount = enrichedData.locations.length;
      const firstLocation = enrichedData.locations[0];
      previews.push(
        <span key="locations" className="flex items-center gap-1 text-xs text-brand-text/70">
          <MapPin className="w-3 h-3" />
          {locationCount === 1
            ? `Location: ${firstLocation.name}`
            : `${locationCount} locations`}
        </span>
      );
    }

    // Eras
    if (enrichedData.eras && enrichedData.eras.length > 0) {
      const eraCount = enrichedData.eras.length;
      const topEra = enrichedData.eras[0];
      previews.push(
        <span key="eras" className="flex items-center gap-1 text-xs text-brand-text/70">
          <Sparkles className="w-3 h-3" />
          Era: {topEra.name}
          {eraCount > 1 && ` (+${eraCount - 1} more)`}
        </span>
      );
    }

    // Works count for creators
    if (enrichedData.isCreator && enrichedData.worksCount) {
      previews.push(
        <span key="works" className="flex items-center gap-1 text-xs text-brand-text/70">
          <Film className="w-3 h-3" />
          {enrichedData.worksCount} works
        </span>
      );
    }

    if (previews.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-3 mt-2 pt-2 border-t border-brand-primary/10">
        {previews.map((preview, idx) => (
          <div key={idx}>{preview}</div>
        ))}
      </div>
    );
  };

  // ============================================================================
  // RENDER: DEFAULT VARIANT (Single "Add This" button)
  // ============================================================================

  const renderDefaultVariant = () => (
    <button
      onClick={onSelect}
      disabled={disabled}
      className="w-full p-4 bg-white border border-brand-primary/20 rounded-lg hover:border-brand-accent hover:shadow-md transition-all duration-200 text-left group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-brand-primary/20 disabled:hover:shadow-none"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          {/* Q-ID Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-brand-accent/10 text-brand-accent rounded text-xs font-mono font-medium">
              {qid}
            </span>
            {getConfidenceBadge()}
          </div>

          {/* Label (Title/Name) */}
          <p className="font-semibold text-lg text-brand-text group-hover:text-brand-accent transition-colors">
            {label}
          </p>

          {/* Description */}
          {description && (
            <p className="text-sm text-brand-text/70 mt-1">
              {description}
            </p>
          )}

          {/* Enriched Data Preview */}
          {renderEnrichedPreview()}
        </div>

        {/* Add Button */}
        <div className="flex-shrink-0">
          <div className="px-4 py-2 bg-brand-accent text-white rounded-md font-medium text-sm group-hover:bg-brand-accent/90 transition-colors shadow-sm">
            Add This
          </div>
        </div>
      </div>
    </button>
  );

  // ============================================================================
  // RENDER: CREATOR VARIANT (Dual buttons)
  // ============================================================================

  const renderCreatorVariant = () => (
    <div className="p-4 bg-white border-2 border-brand-accent/30 rounded-lg shadow-sm hover:border-brand-accent hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {/* Q-ID Badge with Creator Indicator */}
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-brand-accent/10 text-brand-accent rounded text-xs font-mono font-medium">
              {qid}
            </span>
            <span className="px-2 py-0.5 bg-purple-100 text-purple-800 border border-purple-300 rounded text-xs font-medium flex items-center gap-1">
              <Users className="w-3 h-3" />
              Creator
            </span>
            {getConfidenceBadge()}
          </div>

          {/* Label (Name) */}
          <p className="font-semibold text-lg text-brand-text">
            {label}
          </p>

          {/* Description */}
          {description && (
            <p className="text-sm text-brand-text/70 mt-1">
              {description}
            </p>
          )}

          {/* Enriched Data Preview */}
          {renderEnrichedPreview()}
        </div>
      </div>

      {/* Dual Action Buttons */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={onAddFigure}
          disabled={disabled}
          className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-md font-medium text-sm hover:bg-brand-primary/90 disabled:bg-brand-primary/30 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <User className="w-4 h-4" />
          Add as Figure
        </button>
        <button
          onClick={onBrowseWorks}
          disabled={disabled}
          className="flex-1 px-4 py-2 bg-brand-accent text-white rounded-md font-medium text-sm hover:bg-brand-accent/90 disabled:bg-brand-accent/30 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <Film className="w-4 h-4" />
          Browse Works
        </button>
      </div>
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return variant === 'creator' ? renderCreatorVariant() : renderDefaultVariant();
}
