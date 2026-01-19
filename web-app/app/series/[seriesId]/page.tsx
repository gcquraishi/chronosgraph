'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BookOpen, Film, Tv, Gamepad2, Users, Calendar, Zap, TrendingUp } from 'lucide-react';
import GraphExplorer from '@/components/GraphExplorer';
import { SeriesMetadata, GraphNode, GraphLink } from '@/lib/types';

export default function SeriesPage({
  params,
}: {
  params: Promise<{ seriesId: string }>;
}) {
  const [params_, setParams] = useState<{ seriesId: string } | null>(null);
  const [metadata, setMetadata] = useState<SeriesMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; links: GraphLink[] } | null>(null);

  useEffect(() => {
    (async () => {
      const p = await params;
      setParams(p);

      try {
        const response = await fetch(`/api/series/${p.seriesId}`);
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error('Failed to fetch series data');
        }

        const data = await response.json();
        setMetadata(data);

        // Build graph data from characters and relationships
        const nodes: GraphNode[] = [];
        const links: GraphLink[] = [];
        const nodeIds = new Set<string>();

        // Add series node
        const seriesId = `series-${data.series.wikidata_id}`;
        nodes.push({
          id: seriesId,
          name: data.series.title,
          type: 'media',
          sentiment: 'Complex',
        });
        nodeIds.add(seriesId);

        // Add character nodes and links
        data.characters.roster.forEach((char: any) => {
          const charId = `figure-${char.canonical_id}`;
          if (!nodeIds.has(charId)) {
            nodes.push({
              id: charId,
              name: char.name,
              type: 'figure',
            });
            nodeIds.add(charId);
          }

          links.push({
            source: charId,
            target: seriesId,
            sentiment: 'Complex',
          });
        });

        // Build figure-to-figure links based on shared works
        const charactersInWorks: Record<number, string[]> = {};
        data.characters.roster.forEach((char: any) => {
          char.works.forEach((workIdx: number) => {
            if (!charactersInWorks[workIdx]) {
              charactersInWorks[workIdx] = [];
            }
            charactersInWorks[workIdx].push(char.canonical_id);
          });
        });

        // Add links for characters appearing together
        const figureLinks = new Set<string>();
        Object.values(charactersInWorks).forEach((figs: string[]) => {
          for (let i = 0; i < figs.length; i++) {
            for (let j = i + 1; j < figs.length; j++) {
              const linkKey = [figs[i], figs[j]].sort().join('|');
              if (!figureLinks.has(linkKey)) {
                figureLinks.add(linkKey);
                links.push({
                  source: `figure-${figs[i]}`,
                  target: `figure-${figs[j]}`,
                  sentiment: 'Complex',
                });
              }
            }
          }
        });

        setGraphData({ nodes, links });
      } catch (err: any) {
        setError(err.message || 'Failed to load series');
      } finally {
        setLoading(false);
      }
    })();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-xl text-gray-400">Loading series...</div>
      </div>
    );
  }

  if (error || !metadata) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-500 mb-4">Error: {error || 'Series not found'}</div>
            <Link href="/" className="text-blue-400 hover:text-blue-300">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'FILM_SERIES':
      case 'FILM':
        return <Film className="w-10 h-10 text-blue-400" />;
      case 'TV_SERIES':
      case 'TV_SERIES_COLLECTION':
        return <Tv className="w-10 h-10 text-blue-400" />;
      case 'GAME_SERIES':
      case 'GAME':
        return <Gamepad2 className="w-10 h-10 text-blue-400" />;
      default:
        return <BookOpen className="w-10 h-10 text-blue-400" />;
    }
  };

  const [yearStart, yearEnd] = metadata.stats.yearRange;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="text-blue-400 hover:text-blue-300 mb-6 inline-block">
            ← Back to Dashboard
          </Link>

          {/* Series Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-8 mb-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center border-2 border-blue-500/30">
                  {getIcon(metadata.series.media_type)}
                </div>
              </div>
              <div className="flex-grow">
                <h1 className="text-4xl font-bold text-white mb-2">{metadata.series.title}</h1>
                <p className="text-lg text-gray-300 mb-2">
                  {metadata.series.media_type} Series • {metadata.works.length} works
                </p>
                {metadata.series.creator && (
                  <p className="text-gray-400">
                    Created by <span className="text-white">{metadata.series.creator}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Series Metadata Card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Character Count */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-400">Total Characters</span>
              </div>
              <p className="text-2xl font-bold text-white">{metadata.characters.total}</p>
            </div>

            {/* Year Range */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-400">Year Range</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {yearStart === yearEnd ? yearStart : `${yearStart}–${yearEnd}`}
              </p>
            </div>

            {/* Avg Characters per Work */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-400">Avg Chars/Work</span>
              </div>
              <p className="text-2xl font-bold text-white">{metadata.stats.avgCharactersPerWork.toFixed(1)}</p>
            </div>

            {/* Total Interactions */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-400">Unique Pairs</span>
              </div>
              <p className="text-2xl font-bold text-white">{metadata.stats.totalInteractions}</p>
            </div>
          </div>

          {/* Works Grid */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Works in this Series</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {metadata.works
                .sort((a: any, b: any) => {
                  // Sort by season, then sequence, then episode, then year
                  if (a.season_number && b.season_number) {
                    if (a.season_number !== b.season_number) return a.season_number - b.season_number;
                    if (a.episode_number && b.episode_number) return a.episode_number - b.episode_number;
                  }
                  if (a.sequence_number && b.sequence_number) return a.sequence_number - b.sequence_number;
                  return a.release_year - b.release_year;
                })
                .map((work: any, idx: number) => {
                  const charCountInWork = metadata.characters.roster.filter((c: any) =>
                    c.works.includes(idx)
                  ).length;

                  return (
                    <Link
                      key={work.media_id}
                      href={`/media/${work.media_id}`}
                      className="block p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-blue-500 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-medium text-white flex-grow truncate">{work.title}</h3>
                        {work.sequence_number && (
                          <span className="text-sm font-semibold text-blue-400 flex-shrink-0">#{work.sequence_number}</span>
                        )}
                        {work.season_number && work.episode_number && (
                          <span className="text-xs text-gray-500 flex-shrink-0">
                            S{work.season_number}E{work.episode_number}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center justify-between">
                        <span>{work.release_year}</span>
                        <span className="text-blue-400">{charCountInWork} characters</span>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>

          {/* Character Roster */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Character Roster</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {metadata.characters.roster.map((char: any) => (
                    <Link
                      key={char.canonical_id}
                      href={`/figure/${char.canonical_id}`}
                      className="block p-3 bg-gray-900 rounded-lg border border-gray-700 hover:border-blue-500 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{char.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{char.appearances} appearances</span>
                          <span className="text-xs text-blue-400">{char.works.length} works</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Character Appearance Matrix */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Appearance Matrix</h2>
              <div className="text-xs text-gray-400 mb-4">
                <p>Showing top {Math.min(10, metadata.characters.roster.length)} characters</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <tbody>
                    {metadata.characters.roster.slice(0, 10).map((char: any) => (
                      <tr key={char.canonical_id} className="border-b border-gray-700">
                        <td className="py-1 pr-2 text-gray-300 truncate max-w-[120px]">{char.name}</td>
                        <td className="py-1">
                          <div className="flex gap-0.5">
                            {Array.from({ length: Math.min(5, metadata.works.length) }).map((_, idx) => (
                              <div
                                key={idx}
                                className={`w-3 h-3 rounded-sm ${
                                  char.works.includes(idx) ? 'bg-blue-500' : 'bg-gray-700'
                                }`}
                                title={char.works.includes(idx) ? `In ${metadata.works[idx]?.title}` : 'Not in work'}
                              />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Network Graph */}
          {graphData && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Series Character Network</h2>
              <GraphExplorer nodes={graphData.nodes} links={graphData.links} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
