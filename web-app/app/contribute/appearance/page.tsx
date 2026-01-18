'use client';

import { useState } from 'react';
import { Film, ChevronRight } from 'lucide-react';
import FigureSearchInput from '@/components/FigureSearchInput';
import AddAppearanceForm from '@/components/AddAppearanceForm';

export default function ContributeAppearancePage() {
  const [selectedFigureId, setSelectedFigureId] = useState<string | null>(null);
  const [selectedFigureName, setSelectedFigureName] = useState<string | null>(null);

  const handleFigureSelect = (canonicalId: string, name: string) => {
    setSelectedFigureId(canonicalId);
    setSelectedFigureName(name);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Film className="w-8 h-8 text-brand-accent" />
            <h1 className="text-3xl font-bold text-brand-primary">Add a Portrayal</h1>
          </div>
          <p className="text-brand-text/70">
            Add how a historical figure appears in a film, book, game, or TV series
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Step 1: Select Figure */}
          <div className="bg-white p-6 rounded-lg border border-brand-primary/20 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-semibold">
                1
              </div>
              <h2 className="text-lg font-semibold text-brand-primary">Select Figure</h2>
            </div>
            <p className="text-brand-text/70 text-sm mb-4">
              Search for a historical figure to add a portrayal for.
            </p>
            <FigureSearchInput
              onSelect={handleFigureSelect}
              placeholder="Search for historical figure..."
            />
            {selectedFigureName && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800 font-medium">
                  ✓ Selected: {selectedFigureName}
                </p>
              </div>
            )}
          </div>

          {/* Step 2: Add Portrayal */}
          <div className="bg-white p-6 rounded-lg border border-brand-primary/20 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                selectedFigureId
                  ? 'bg-brand-primary text-white'
                  : 'bg-brand-primary/20 text-brand-primary/50'
              }`}>
                2
              </div>
              <h2 className={`text-lg font-semibold ${
                selectedFigureId ? 'text-brand-primary' : 'text-brand-primary/50'
              }`}>
                Add Portrayal
              </h2>
            </div>
            <p className={`text-sm mb-4 ${
              selectedFigureId ? 'text-brand-text/70' : 'text-brand-text/40'
            }`}>
              {selectedFigureId
                ? 'Add how this figure appears in media'
                : 'Select a figure first to continue'}
            </p>

            {!selectedFigureId && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-center">
                <p className="text-sm text-blue-800">
                  👈 Choose a figure to continue
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Form - shown below on mobile, or after selection on desktop */}
        {selectedFigureId && (
          <div className="mt-8">
            <div className="bg-white p-6 rounded-lg border border-brand-primary/20 shadow-sm">
              <h2 className="text-2xl font-bold text-brand-primary mb-6">
                Add {selectedFigureName} to Media
              </h2>
              <AddAppearanceForm figureId={selectedFigureId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
