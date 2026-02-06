'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import GraphExplorer from '@/components/GraphExplorer';
import LandingPathQuery from '@/components/LandingPathQuery';
import ReputationTimeline from '@/components/ReputationTimeline';
import VolatilityLeaderboard from '@/components/VolatilityLeaderboard';
import RivalrySpotlight from '@/components/RivalrySpotlight';
import ThemePicker from '@/components/ThemePicker';
import { PathVisualization } from '@/lib/types';
import { CRITICAL_ENTITIES } from '@/lib/constants/entities';
import { BarChart3, Map, Clock, ChevronDown } from 'lucide-react';

// CHR-6: Single Henry VIII node as landing page entry point
// Henry VIII chosen as starting node because:
// - Extremely well-known historical figure (immediately recognizable)
// - Rich and dramatic life story (six wives, English Reformation, etc.)
// - Extensive media portrayals (films, TV series, documentaries, books, plays)
// - Strong cultural recognition across demographics
// - Visually distinctive (iconic Tudor-era appearance)
const HENRY_VIII_CANONICAL_ID = CRITICAL_ENTITIES.HENRY_VIII;

interface PathNode {
  node_id: string;
  node_type: string;
  name: string;
}

interface PathRelationship {
  from_node: string;
  to_node: string;
  rel_type: string;
  context: string;
}

interface PathResult {
  start_node: string;
  end_node: string;
  path_length: number;
  nodes: PathNode[];
  relationships: PathRelationship[];
}

// Helper function to convert path result to PathVisualization format
function convertPathToVisualization(path: PathResult): PathVisualization {
  // Extract node IDs (use full node ID format: figure-Q12345 or media-Q67890)
  const pathIds = path.nodes.map(node => {
    const prefix = node.node_type === 'HistoricalFigure' ? 'figure-' : 'media-';
    return prefix + node.node_id;
  });

  // Create path links from consecutive nodes
  const pathLinks: { source: string; target: string }[] = [];
  for (let i = 0; i < pathIds.length - 1; i++) {
    pathLinks.push({
      source: pathIds[i],
      target: pathIds[i + 1],
    });
  }

  return { pathIds, pathLinks };
}

export default function LandingPage() {
  const [highlightedPath, setHighlightedPath] = useState<PathVisualization | undefined>(undefined);
  const [shouldExpandHenry, setShouldExpandHenry] = useState(false);

  // Single-node initial state for progressive disclosure onboarding
  // User sees only Henry VIII on first load, clicks to bloom connections
  const initialNodes = [{
    id: `figure-${HENRY_VIII_CANONICAL_ID}`,
    name: 'Henry VIII',
    type: 'figure' as const,
  }];

  const handlePathFound = (path: PathResult | null) => {
    if (path) {
      setHighlightedPath(convertPathToVisualization(path));
    } else {
      setHighlightedPath(undefined);
    }
  };

  const handleHenryNameClick = () => {
    setShouldExpandHenry(true);
  };

  const scrollToExplorer = () => {
    document.getElementById('graph-explorer')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Hero Section - Case File Header */}
      <div className="bg-white border-b-2 border-stone-300">
        <div className="container mx-auto px-4 py-6">
          <div className="text-[10px] font-black text-amber-700 uppercase tracking-[0.3em] mb-2 text-center">
            Historical Network Analysis // Archive_001
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-stone-900 tracking-tighter uppercase text-center">
            ChronosGraph
          </h1>
          <p className="text-center text-stone-600 mt-2 text-sm">
            Explore how history judges its figures through media portrayals
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* HERO: Featured Reputation Timeline (Henry VIII) */}
          <div className="mb-8">
            <div className="mb-4 text-center">
              <h2 className="text-2xl md:text-3xl font-black text-stone-900 uppercase tracking-tight mb-2">
                Watch How History Judges Its Figures
              </h2>
              <p className="text-sm text-stone-600 font-mono">
                Sentiment analysis across decades of media portrayals
              </p>
            </div>
            <ReputationTimeline canonicalId={HENRY_VIII_CANONICAL_ID} figureName="Henry VIII" />
            <div className="flex justify-center gap-4 mt-4">
              <Link
                href={`/figure/${HENRY_VIII_CANONICAL_ID}`}
                className="bg-amber-600 text-white px-6 py-3 font-black text-sm uppercase tracking-wider hover:bg-amber-700 transition-colors"
              >
                Explore Henry VIII
              </Link>
              <button
                onClick={scrollToExplorer}
                className="bg-stone-200 text-stone-900 px-6 py-3 font-black text-sm uppercase tracking-wider hover:bg-stone-300 transition-colors flex items-center gap-2"
              >
                <span>Pick Another Figure</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* TWO-COLUMN LAYOUT: Volatility Leaderboard + Rivalry Spotlight */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left: Volatility Leaderboard */}
            <div>
              <VolatilityLeaderboard />
            </div>

            {/* Right: Rivalry Spotlight */}
            <div>
              <RivalrySpotlight />
            </div>
          </div>

          {/* THEME PICKER: Cold-open discovery */}
          <div className="mb-8">
            <ThemePicker />
          </div>

          {/* Divider */}
          <div className="relative" id="graph-explorer">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t-2 border-stone-300"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-stone-100 px-6 py-2 border-2 border-stone-300">
                <h2 className="text-[10px] font-black text-stone-600 uppercase tracking-[0.3em]">
                  Interactive Graph Explorer
                </h2>
              </div>
            </div>
          </div>

          {/* PATH FINDER: Connect two figures */}
          <div className="mb-8">
            <LandingPathQuery onPathFound={handlePathFound} />
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t-2 border-stone-300"></div>
            </div>
            <div className="relative flex justify-center">
              <button
                onClick={handleHenryNameClick}
                className="group bg-stone-100 px-4 text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] hover:text-amber-600 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 rounded"
                aria-label="Expand Henry VIII connections in graph below"
              >
                Or explore starting from{' '}
                <span className="underline decoration-amber-600/30 group-hover:decoration-amber-600 transition-all duration-200">
                  Henry VIII
                </span>
              </button>
            </div>
          </div>

          {/* GRAPH EXPLORER: Single-Node Graph - Dossier Sheet */}
          <div className="bg-white border-t-4 border-amber-600 shadow-xl overflow-hidden">
            {/* Path Highlighting Indicator */}
            {highlightedPath && (
              <div className="bg-amber-50 border-b-2 border-amber-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-amber-900 font-mono">
                  <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse"></div>
                  <span className="font-bold uppercase tracking-wide">Path highlighted in graph below</span>
                  <span className="text-amber-700 font-black">({highlightedPath.pathIds.length} nodes)</span>
                </div>
                <button
                  onClick={() => setHighlightedPath(undefined)}
                  className="text-xs text-amber-700 hover:text-amber-900 font-black uppercase tracking-widest underline"
                >
                  Clear
                </button>
              </div>
            )}

            <Suspense fallback={
              <div className="flex items-center justify-center" style={{ minHeight: '600px' }}>
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                  <p className="text-stone-500 font-mono text-sm uppercase tracking-widest">Loading graph...</p>
                </div>
              </div>
            }>
              <GraphExplorer
                canonicalId={HENRY_VIII_CANONICAL_ID}
                nodes={initialNodes}
                links={[]}
                highlightedPath={highlightedPath}
                shouldExpandCenter={shouldExpandHenry}
              />
            </Suspense>
          </div>

          {/* Discovery Section (Below Fold) */}
          <div className="mt-8">
            <div className="bg-amber-600 text-white px-4 py-2 mb-0">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                <span>■</span> Discovery & Exploration
              </h2>
            </div>
            <div className="bg-stone-200 border-2 border-amber-600 border-t-0 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Temporal Coverage Explorer */}
                <Link
                  href="/explore/coverage"
                  className="block bg-white border-2 border-stone-300 hover:border-amber-600 transition-all p-6 group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-amber-50 border-2 border-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                      <BarChart3 className="w-6 h-6 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-black text-stone-900 uppercase tracking-tight group-hover:text-amber-700 transition-colors">
                      Historical Coverage
                    </h3>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Visualize ChronosGraph's temporal distribution across all historical periods. Explore coverage density, identify gaps, and discover content-rich eras.
                  </p>
                  <div className="mt-4 text-xs font-black text-amber-600 uppercase tracking-wider group-hover:text-amber-700">
                    Explore Timeline →
                  </div>
                </Link>

                {/* Search by Keywords */}
                <Link
                  href="/search"
                  className="block bg-white border-2 border-stone-300 hover:border-amber-600 transition-all p-6 group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-amber-50 border-2 border-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                      <Map className="w-6 h-6 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-black text-stone-900 uppercase tracking-tight group-hover:text-amber-700 transition-colors">
                      Search Figures
                    </h3>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Search for historical figures by name, era, or keyword. Discover connections and explore media portrayals.
                  </p>
                  <div className="mt-4 text-xs font-black text-amber-600 uppercase tracking-wider group-hover:text-amber-700">
                    Search Now →
                  </div>
                </Link>

                {/* Browse Network Graph */}
                <Link
                  href="/explore/graph"
                  className="block bg-white border-2 border-stone-300 hover:border-amber-600 transition-all p-6 group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-amber-50 border-2 border-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                      <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-black text-stone-900 uppercase tracking-tight group-hover:text-amber-700 transition-colors">
                      Interactive Network
                    </h3>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Explore the full network graph of historical figures and media works. Navigate complex relationships visually.
                  </p>
                  <div className="mt-4 text-xs font-black text-amber-600 uppercase tracking-wider group-hover:text-amber-700">
                    Explore Graph →
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
