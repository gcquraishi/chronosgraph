import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getMediaById, getMediaGraphData } from '@/lib/db';
import GraphExplorer from '@/components/GraphExplorer';
import { BookOpen, Film, Tv, Gamepad2, User } from 'lucide-react';

export default async function MediaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const media = await getMediaById(id);

  if (!media) {
    notFound();
  }

  const graphData = await getMediaGraphData(id);

  const getIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'FILM': return <Film className="w-10 h-10 text-blue-400" />;
      case 'TV_SERIES': return <Tv className="w-10 h-10 text-blue-400" />;
      case 'GAME': return <Gamepad2 className="w-10 h-10 text-blue-400" />;
      default: return <BookOpen className="w-10 h-10 text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="text-blue-400 hover:text-blue-300 mb-6 inline-block">
            ← Back to Dashboard
          </Link>

          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-8 mb-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center border-2 border-blue-500/30">
                  {getIcon(media.media_type)}
                </div>
              </div>
              <div className="flex-grow">
                <h1 className="text-4xl font-bold text-white mb-2">{media.title}</h1>
                <p className="text-lg text-gray-300 mb-2">
                  {media.media_type} {media.release_year ? `(${media.release_year})` : ''}
                </p>
                {media.creator && (
                  <p className="text-gray-400">Created by <span className="text-white">{media.creator}</span></p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
               <GraphExplorer nodes={graphData.nodes} links={graphData.links} />
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Historical Figures</h2>
              <div className="space-y-4">
                {media.portrayals.map((p: any) => (
                  <Link 
                    key={p.figure.canonical_id} 
                    href={`/figure/${p.figure.canonical_id}`}
                    className="block p-4 bg-gray-900 rounded-lg border border-transparent hover:border-blue-500 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">{p.figure.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        p.sentiment === 'Heroic' ? 'bg-green-500/20 text-green-400' :
                        p.sentiment === 'Villainous' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {p.sentiment}
                      </span>
                    </div>
                    {p.role && <p className="text-sm text-gray-400 italic">"{p.role}"</p>}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
