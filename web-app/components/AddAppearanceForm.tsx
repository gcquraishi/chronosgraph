// file: web-app/components/AddAppearanceForm.tsx
'use client';

import { useState, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface MediaSearchResult {
  media_id: string;
  title: string;
  year: number;
}

export default function AddAppearanceForm({ figureId }: { figureId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, startTransition] = useTransition();

  const [mediaQuery, setMediaQuery] = useState('');
  const [mediaResults, setMediaResults] = useState<MediaSearchResult[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaSearchResult | null>(null);

  const [sentiment, setSentiment] = useState('Complex');
  const [roleDescription, setRoleDescription] = useState('');
  const [isProtagonist, setIsProtagonist] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMediaSearch = async (query: string) => {
    setMediaQuery(query);
    setSelectedMedia(null);
    if (query.length < 2) {
      setMediaResults([]);
      return;
    }
    const response = await fetch(`/api/media/search?q=${query}`);
    const data = await response.json();
    setMediaResults(data.works || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!selectedMedia) {
        setError("Please search for and select a media work.");
        return;
    }

    startTransition(async () => {
        const response = await fetch('/api/contribution/appearance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                figureId,
                mediaId: selectedMedia.media_id,
                sentiment,
                roleDescription,
                isProtagonist,
            }),
        });

        if (response.ok) {
            // Refresh the page to show the new data
            router.refresh();
        } else {
            const data = await response.json();
            setError(data.error || "Failed to add appearance.");
        }
    });
  };

  if (!session) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg text-center text-gray-400">
        You must be signed in to contribute.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-gray-800 border border-gray-700 rounded-lg">
      <h3 className="text-xl font-semibold">Add Media Appearance</h3>
      <div>
        <label htmlFor="media-search" className="block text-sm font-medium text-gray-300">Search for Media Work</label>
        <input
          id="media-search"
          type="text"
          value={mediaQuery}
          onChange={(e) => handleMediaSearch(e.target.value)}
          className="mt-1 w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
          placeholder="e.g., The Tudors"
        />
        {mediaResults.length > 0 && !selectedMedia && (
            <ul className="bg-gray-900 border border-gray-600 rounded-md mt-1 max-h-60 overflow-y-auto">
                {mediaResults.map(work => (
                    <li key={work.media_id} onClick={() => { setSelectedMedia(work); setMediaQuery(work.title); setMediaResults([]); }}
                        className="px-3 py-2 hover:bg-blue-600 cursor-pointer">
                        {work.title} ({work.year})
                    </li>
                ))}
            </ul>
        )}
      </div>

      <div>
        <label htmlFor="sentiment" className="block text-sm font-medium text-gray-300">Sentiment</label>
        <select id="sentiment" value={sentiment} onChange={e => setSentiment(e.target.value)}
          className="mt-1 w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white">
            <option>Complex</option>
            <option>Heroic</option>
            <option>Villainous</option>
            <option>Neutral</option>
        </select>
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-300">Role Description</label>
        <textarea id="role" value={roleDescription} onChange={e => setRoleDescription(e.target.value)}
          className="mt-1 w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white"
          rows={3} placeholder="Describe the figure's role in this work..."/>
      </div>

      <div className="flex items-center">
        <input id="is-protagonist" type="checkbox" checked={isProtagonist} onChange={e => setIsProtagonist(e.target.checked)}
          className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-blue-600 focus:ring-blue-500"/>
        <label htmlFor="is-protagonist" className="ml-2 block text-sm text-gray-300">Is Protagonist</label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button type="submit" disabled={isSubmitting}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold rounded-lg transition-colors">
          {isSubmitting ? 'Submitting...' : 'Add Appearance'}
      </button>
    </form>
  );
}
