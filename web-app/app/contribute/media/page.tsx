'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Film, Plus, Loader2 } from 'lucide-react';

export default function ContributeMediaPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    mediaType: 'FILM',
    releaseYear: new Date().getFullYear(),
    creator: '',
    wikidataId: '',
    description: '',
    publisher: '',
    translator: '',
    channel: '',
    productionStudio: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'releaseYear' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!formData.title || !formData.releaseYear) {
        throw new Error('Title and release year are required');
      }

      const response = await fetch('/api/media/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create media');
      }

      // Success - redirect to media page
      router.push(`/media/${data.media_id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create media');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Film className="w-8 h-8 text-brand-accent" />
            <h1 className="text-3xl font-bold text-brand-primary">Add a Media Work</h1>
          </div>
          <p className="text-brand-text/70">
            Contribute a new film, book, game, or TV series to ChronosGraph
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-brand-primary/20 shadow-sm space-y-6">
          {error && (
            <div className="p-4 bg-brand-accent/10 border border-brand-accent/30 rounded-md text-brand-accent text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-brand-text mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Oppenheimer, The Crown, Red Dead Redemption"
              className="w-full bg-white border border-brand-primary/30 rounded-md py-2 px-3 text-brand-text placeholder-brand-text/40 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required
            />
          </div>

          {/* Media Type */}
          <div>
            <label className="block text-sm font-medium text-brand-text mb-2">
              Media Type *
            </label>
            <select
              name="mediaType"
              value={formData.mediaType}
              onChange={handleChange}
              className="w-full bg-white border border-brand-primary/30 rounded-md py-2 px-3 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
            >
              <option value="FILM">Film</option>
              <option value="TV_SERIES">TV Series</option>
              <option value="BOOK">Book</option>
              <option value="GAME">Video Game</option>
              <option value="GAME_SERIES">Game Series</option>
            </select>
          </div>

          {/* Release Year */}
          <div>
            <label className="block text-sm font-medium text-brand-text mb-2">
              Release Year *
            </label>
            <input
              type="number"
              name="releaseYear"
              value={formData.releaseYear}
              onChange={handleChange}
              min="1800"
              max={new Date().getFullYear()}
              className="w-full bg-white border border-brand-primary/30 rounded-md py-2 px-3 text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required
            />
          </div>

          {/* Creator */}
          <div>
            <label className="block text-sm font-medium text-brand-text mb-2">
              Creator / Director / Author
            </label>
            <input
              type="text"
              name="creator"
              value={formData.creator}
              onChange={handleChange}
              placeholder="e.g., Christopher Nolan, Peter Jackson, George R. R. Martin"
              className="w-full bg-white border border-brand-primary/30 rounded-md py-2 px-3 text-brand-text placeholder-brand-text/40 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          {/* Wikidata ID */}
          <div>
            <label className="block text-sm font-medium text-brand-text mb-2">
              Wikidata Q-ID
            </label>
            <input
              type="text"
              name="wikidataId"
              value={formData.wikidataId}
              onChange={handleChange}
              placeholder="e.g., Q1298971"
              className="w-full bg-white border border-brand-primary/30 rounded-md py-2 px-3 text-brand-text placeholder-brand-text/40 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
            <p className="text-xs text-brand-text/60 mt-1">
              Optional - helps link to external sources
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-brand-text mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the media work..."
              rows={4}
              className="w-full bg-white border border-brand-primary/30 rounded-md py-2 px-3 text-brand-text placeholder-brand-text/40 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          {/* Conditional Metadata Fields */}
          <div className="border-t border-brand-primary/20 pt-6">
            <h3 className="text-sm font-semibold text-brand-text mb-4">Additional Metadata</h3>

            {/* Book Fields */}
            {(formData.mediaType === 'BOOK' || formData.mediaType === 'GAME_SERIES') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-brand-text mb-2">
                    Publisher
                  </label>
                  <input
                    type="text"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleChange}
                    placeholder="e.g., Penguin Books, Harper Voyager"
                    className="w-full bg-white border border-brand-primary/30 rounded-md py-2 px-3 text-brand-text placeholder-brand-text/40 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-brand-text mb-2">
                    Translator
                  </label>
                  <input
                    type="text"
                    name="translator"
                    value={formData.translator}
                    onChange={handleChange}
                    placeholder="e.g., John Smith (translated from French)"
                    className="w-full bg-white border border-brand-primary/30 rounded-md py-2 px-3 text-brand-text placeholder-brand-text/40 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
              </>
            )}

            {/* TV Series Fields */}
            {formData.mediaType === 'TV_SERIES' && (
              <div>
                <label className="block text-sm font-medium text-brand-text mb-2">
                  Channel / Network
                </label>
                <input
                  type="text"
                  name="channel"
                  value={formData.channel}
                  onChange={handleChange}
                  placeholder="e.g., HBO, BBC, Netflix"
                  className="w-full bg-white border border-brand-primary/30 rounded-md py-2 px-3 text-brand-text placeholder-brand-text/40 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            )}

            {/* Film & Game Fields */}
            {(formData.mediaType === 'FILM' || formData.mediaType === 'GAME') && (
              <div>
                <label className="block text-sm font-medium text-brand-text mb-2">
                  Production Studio
                </label>
                <input
                  type="text"
                  name="productionStudio"
                  value={formData.productionStudio}
                  onChange={handleChange}
                  placeholder="e.g., Universal Pictures, Rockstar Games"
                  className="w-full bg-white border border-brand-primary/30 rounded-md py-2 px-3 text-brand-text placeholder-brand-text/40 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-brand-accent hover:bg-brand-accent/90 disabled:bg-brand-primary/30 text-white font-semibold py-3 rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Media Work
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary font-semibold rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
