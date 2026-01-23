'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Info, Loader2, AlertCircle, Plus } from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Location {
  location_id: string;
  name: string;
  modern_name?: string;
  time_period?: string;
  wikidata_id?: string;
  location_type?: string;
}

interface LocationPickerProps {
  onSelect: (locationId: string) => void;
  onCancel: () => void;
  excludeIds?: string[];
  onSuggestLocation?: (suggestion: {
    name: string;
    wikidataId?: string;
    notes?: string;
  }) => void;
}

interface LocationSuggestion {
  name: string;
  wikidataId: string;
  notes: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function LocationPicker({
  onSelect,
  onCancel,
  excludeIds = [],
  onSuggestLocation
}: LocationPickerProps) {

  const [locations, setLocations] = useState<Location[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Suggestion modal state
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [suggestion, setSuggestion] = useState<LocationSuggestion>({
    name: '',
    wikidataId: '',
    notes: ''
  });
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const suggestNameInputRef = useRef<HTMLInputElement>(null);

  // ============================================================================
  // FETCH LOCATIONS
  // ============================================================================

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use universal search endpoint to fetch locations
      const response = await fetch('/api/search/universal?q=&type=location&limit=500');

      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }

      const data = await response.json();
      const locationResults = data.results || [];

      // Transform search results to Location objects
      const transformedLocations: Location[] = locationResults.map((result: any) => ({
        location_id: result.id,
        name: result.name,
        modern_name: result.metadata?.modern_name,
        time_period: result.metadata?.time_period,
        wikidata_id: result.metadata?.wikidata_id,
        location_type: result.metadata?.location_type
      }));

      setLocations(transformedLocations);
      setFilteredLocations(transformedLocations.filter(l => !excludeIds.includes(l.location_id)));
    } catch (err) {
      console.error('Failed to fetch locations:', err);
      setError('Failed to load locations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // SEARCH FILTERING
  // ============================================================================

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredLocations(locations.filter(l => !excludeIds.includes(l.location_id)));
      setSelectedIndex(0);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = locations.filter(location => {
      if (excludeIds.includes(location.location_id)) return false;

      const nameMatch = location.name.toLowerCase().includes(query);
      const modernNameMatch = location.modern_name?.toLowerCase().includes(query);
      const typeMatch = location.location_type?.toLowerCase().includes(query);

      return nameMatch || modernNameMatch || typeMatch;
    });

    setFilteredLocations(filtered);
    setSelectedIndex(0);
  }, [searchQuery, locations, excludeIds]);

  // ============================================================================
  // KEYBOARD NAVIGATION
  // ============================================================================

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredLocations.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredLocations[selectedIndex]) {
          onSelect(filteredLocations[selectedIndex].location_id);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredLocations, onSelect, onCancel]);

  // Auto-scroll selected item into view
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  // Auto-focus search input
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Auto-focus suggestion modal name input when modal opens
  useEffect(() => {
    if (showSuggestModal) {
      suggestNameInputRef.current?.focus();
    }
  }, [showSuggestModal]);

  // ============================================================================
  // SUGGESTION MODAL HANDLERS
  // ============================================================================

  const handleOpenSuggestModal = () => {
    // Pre-fill suggestion name with current search query if available
    setSuggestion({
      name: searchQuery || '',
      wikidataId: '',
      notes: ''
    });
    setSuggestionError(null);
    setShowSuggestModal(true);
  };

  const handleCloseSuggestModal = () => {
    setShowSuggestModal(false);
    setSuggestion({ name: '', wikidataId: '', notes: '' });
    setSuggestionError(null);
  };

  const handleSubmitSuggestion = () => {
    setSuggestionError(null);

    // Client-side validation
    if (!suggestion.name.trim()) {
      setSuggestionError('Location name is required');
      return;
    }

    if (suggestion.name.trim().length < 2) {
      setSuggestionError('Location name must be at least 2 characters');
      return;
    }

    if (suggestion.name.trim().length > 100) {
      setSuggestionError('Location name must be less than 100 characters');
      return;
    }

    // Validate Wikidata Q-ID format if provided
    if (suggestion.wikidataId.trim() && !suggestion.wikidataId.trim().match(/^Q\d+$/)) {
      setSuggestionError('Wikidata ID must be in format Q12345 (uppercase Q followed by numbers)');
      return;
    }

    // Call parent handler if provided
    if (onSuggestLocation) {
      onSuggestLocation({
        name: suggestion.name.trim(),
        wikidataId: suggestion.wikidataId.trim() || undefined,
        notes: suggestion.notes.trim() || undefined
      });
    }

    // Close modal and reset form
    handleCloseSuggestModal();
  };

  // ============================================================================
  // RENDER: SUGGESTION MODAL
  // ============================================================================

  const renderSuggestionModal = () => {
    if (!showSuggestModal) return null;

    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-brand-primary/20">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-brand-primary">Suggest New Location</h4>
              <button
                onClick={handleCloseSuggestModal}
                className="p-1 hover:bg-brand-primary/10 rounded transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-brand-text" />
              </button>
            </div>
            <p className="text-xs text-brand-text/60 mt-1">
              Can't find the location you're looking for? Suggest it and we'll validate it.
            </p>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-4 space-y-4">
            {suggestionError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{suggestionError}</p>
              </div>
            )}

            {/* Location Name */}
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">
                Location Name <span className="text-red-500">*</span>
              </label>
              <input
                ref={suggestNameInputRef}
                type="text"
                value={suggestion.name}
                onChange={(e) => setSuggestion(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Paris, Narnia, Atlantis"
                className="w-full px-3 py-2 bg-white border border-brand-primary/30 rounded-md text-brand-text placeholder-brand-text/40 focus:outline-none focus:ring-2 focus:ring-brand-accent"
                maxLength={100}
              />
              <p className="text-xs text-brand-text/50 mt-1">
                {suggestion.name.length}/100 characters
              </p>
            </div>

            {/* Wikidata Q-ID (Optional) */}
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">
                Wikidata Q-ID (Optional)
              </label>
              <input
                type="text"
                value={suggestion.wikidataId}
                onChange={(e) => setSuggestion(prev => ({ ...prev, wikidataId: e.target.value }))}
                placeholder="e.g., Q90 (Paris)"
                className="w-full px-3 py-2 bg-white border border-brand-primary/30 rounded-md text-brand-text placeholder-brand-text/40 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              />
              <p className="text-xs text-brand-text/50 mt-1">
                If you know the Wikidata identifier for this location, you can provide it here
              </p>
            </div>

            {/* Notes (Optional) */}
            <div>
              <label className="block text-sm font-medium text-brand-text mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={suggestion.notes}
                onChange={(e) => setSuggestion(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional context about this location..."
                rows={2}
                className="w-full px-3 py-2 bg-white border border-brand-primary/30 rounded-md text-brand-text placeholder-brand-text/40 focus:outline-none focus:ring-2 focus:ring-brand-accent resize-none"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-brand-primary/20 bg-brand-primary/5 flex gap-3">
            <button
              onClick={handleCloseSuggestModal}
              className="flex-1 px-4 py-2 bg-white border border-brand-primary/30 text-brand-text rounded-md text-sm font-medium hover:bg-brand-primary/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitSuggestion}
              className="flex-1 px-4 py-2 bg-brand-accent hover:bg-brand-accent/90 text-white rounded-md text-sm font-medium transition-colors"
            >
              Suggest Location
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // RENDER: LOCATION TYPE BADGE
  // ============================================================================

  const renderTypeBadge = (type?: string) => {
    if (!type) return null;

    const typeStyles: Record<string, string> = {
      city: 'bg-blue-100 text-blue-800 border-blue-300',
      country: 'bg-green-100 text-green-800 border-green-300',
      region: 'bg-purple-100 text-purple-800 border-purple-300',
      building: 'bg-orange-100 text-orange-800 border-orange-300',
      landmark: 'bg-pink-100 text-pink-800 border-pink-300',
      fictional: 'bg-gray-100 text-gray-800 border-gray-300'
    };

    const style = typeStyles[type.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300';

    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${style}`}>
        {type}
      </span>
    );
  };

  // ============================================================================
  // RENDER: LOCATION ITEM
  // ============================================================================

  const renderLocationItem = (location: Location, index: number) => {
    const isSelected = index === selectedIndex;

    return (
      <button
        key={location.location_id}
        data-index={index}
        onClick={() => onSelect(location.location_id)}
        onMouseEnter={() => setSelectedIndex(index)}
        className={`w-full px-4 py-3 text-left border-b border-brand-primary/10 hover:bg-brand-primary/10 transition-colors ${
          isSelected ? 'bg-brand-primary/10' : 'bg-white'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-primary flex-shrink-0" />
              <p className="font-medium text-brand-text">{location.name}</p>
            </div>

            {location.modern_name && location.modern_name !== location.name && (
              <p className="text-xs text-brand-text/60 mt-1 ml-6">
                Modern: {location.modern_name}
              </p>
            )}

            {location.time_period && (
              <p className="text-xs text-brand-text/50 mt-1 ml-6">
                Period: {location.time_period}
              </p>
            )}
          </div>

          {renderTypeBadge(location.location_type)}
        </div>
      </button>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-brand-primary/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-brand-primary">Add Location</h3>
            <button
              onClick={onCancel}
              className="p-1 hover:bg-brand-primary/10 rounded transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-brand-text" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-text/40" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search locations by name or type..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-brand-primary/30 rounded-md text-brand-text placeholder-brand-text/40 focus:outline-none focus:ring-2 focus:ring-brand-accent"
            />
          </div>

          {/* Admin-only info notice */}
          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-md flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800">
              Only existing locations can be selected. New locations must be created by admins to ensure data quality.
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-brand-primary animate-spin mx-auto mb-2" />
              <p className="text-sm text-brand-text/60">Loading locations...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex-1 flex items-center justify-center py-12 px-6">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-sm text-red-800 mb-3">{error}</p>
              <button
                onClick={fetchLocations}
                className="px-4 py-2 bg-brand-accent hover:bg-brand-accent/90 text-white rounded-md text-sm font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Location List */}
        {!loading && !error && (
          <div ref={listRef} className="flex-1 overflow-y-auto">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((location, index) => renderLocationItem(location, index))
            ) : (
              <div className="text-center py-12 px-6">
                <MapPin className="w-12 h-12 text-brand-text/20 mx-auto mb-4" />
                <p className="text-brand-text/60">
                  {searchQuery
                    ? `No locations found matching "${searchQuery}"`
                    : 'No locations available'}
                </p>
              </div>
            )}

            {/* Suggest Location Button */}
            {onSuggestLocation && (
              <div className="p-4 border-t border-brand-primary/20">
                <button
                  onClick={handleOpenSuggestModal}
                  className="w-full px-4 py-3 bg-brand-primary/5 hover:bg-brand-primary/10 border border-brand-primary/20 rounded-lg text-brand-text transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Can't find your location? Suggest a new one</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 border-t border-brand-primary/20 bg-brand-primary/5">
          <p className="text-xs text-brand-text/60 text-center">
            Use arrow keys to navigate, Enter to select, Escape to close
          </p>
        </div>

        {/* Suggestion Modal (rendered on top when active) */}
        {renderSuggestionModal()}
      </div>
    </div>
  );
}
