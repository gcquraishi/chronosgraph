'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import FigureSearchInput from '@/components/FigureSearchInput';

interface PathNode {
  node_id: string;
  node_type: string;
  name: string;
}

interface PathLink {
  from_node: string;
  to_node: string;
  rel_type: string;
  context: string;
}

interface HistoriographicPath {
  start_node: string;
  end_node: string;
  path_length: number;
  nodes: PathNode[];
  relationships: PathLink[];
}

export default function PathfinderPage() {
  const [startId, setStartId] = useState('');
  const [startName, setStartName] = useState('');
  const [endId, setEndId] = useState('');
  const [endName, setEndName] = useState('');
  const [path, setPath] = useState<HistoriographicPath | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearchPath = () => {
    if (!startId.trim() || !endId.trim()) {
      setError('Please select both start and end figures');
      return;
    }

    if (startId === endId) {
      setError('Start and end figures must be different');
      return;
    }

    setError(null);
    setPath(null);

    startTransition(async () => {
      try {
        const response = await fetch('/api/pathfinder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            startId,
            endId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to find path');
        }

        if (!data.path) {
          setError('No connection found between these figures');
          return;
        }

        setPath(data.path);
      } catch (err: any) {
        setError(err.message || 'Failed to find path');
      }
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-primary mb-2">
            Six Degrees of Separation
          </h1>
          <p className="text-brand-text/70">
            Find the shortest path connecting two historical figures through their media portrayals
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white p-6 rounded-lg border border-brand-primary/20 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Start Figure */}
            <div>
              <label className="block text-sm font-medium text-brand-text mb-2">
                Start Figure
              </label>
              <FigureSearchInput
                onSelect={(id, name) => {
                  setStartId(id);
                  setStartName(name);
                  setPath(null);
                }}
                placeholder="Search first figure..."
              />
              {startName && (
                <p className="text-sm text-green-700 mt-2">✓ {startName}</p>
              )}
            </div>

            {/* End Figure */}
            <div>
              <label className="block text-sm font-medium text-brand-text mb-2">
                End Figure
              </label>
              <FigureSearchInput
                onSelect={(id, name) => {
                  setEndId(id);
                  setEndName(name);
                  setPath(null);
                }}
                placeholder="Search second figure..."
              />
              {endName && (
                <p className="text-sm text-green-700 mt-2">✓ {endName}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-brand-accent/10 border border-brand-accent/30 rounded-md text-brand-accent text-sm flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleSearchPath}
            disabled={isPending || !startId || !endId}
            className="w-full bg-brand-accent hover:bg-brand-accent/90 disabled:bg-brand-primary/30 text-white font-semibold py-3 rounded-md flex items-center justify-center gap-2 transition-colors"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Finding Path...
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4" />
                Find Connection
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {path && (
          <div className="bg-white p-6 rounded-lg border border-brand-primary/20 shadow-sm">
            <h2 className="text-2xl font-bold text-brand-primary mb-6">
              Connection Found!
              <span className="text-brand-accent ml-2">
                {path.path_length} {path.path_length === 1 ? 'degree' : 'degrees'}
              </span>
            </h2>

            <div className="space-y-4">
              {path.nodes.map((node, idx) => (
                <div key={node.node_id}>
                  {/* Node */}
                  <div className="flex items-center gap-3">
                    <div className={`px-4 py-2 rounded-lg font-medium ${
                      node.node_type === 'HistoricalFigure'
                        ? 'bg-brand-primary/10 text-brand-primary'
                        : 'bg-brand-accent/10 text-brand-accent'
                    }`}>
                      {node.name}
                      <span className="text-xs opacity-60 ml-2">({node.node_type})</span>
                    </div>
                  </div>

                  {/* Arrow to next node */}
                  {idx < path.nodes.length - 1 && (
                    <div className="flex items-center justify-center py-2">
                      <div className="text-brand-text/50">↓</div>
                    </div>
                  )}

                  {/* Relationship */}
                  {idx < path.relationships.length && (
                    <div className="ml-6 mb-4 p-3 bg-brand-bg rounded border-l-2 border-brand-primary/30 text-sm">
                      <span className="font-medium text-brand-text">
                        {path.relationships[idx].rel_type}
                      </span>
                      <div className="text-brand-text/70 mt-1">
                        {path.relationships[idx].context}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* View Details Links */}
            <div className="mt-8 pt-6 border-t border-brand-primary/20">
              <p className="text-sm font-medium text-brand-text mb-3">View Details:</p>
              <div className="flex flex-wrap gap-2">
                {path.nodes
                  .filter(n => n.node_type === 'HistoricalFigure')
                  .map(figure => (
                    <Link
                      key={figure.node_id}
                      href={`/figure/${figure.node_id}`}
                      className="px-4 py-2 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary rounded-md text-sm font-medium transition-colors"
                    >
                      {figure.name}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        {!path && (
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 How it works:</strong> Select two historical figures, and the pathfinder will find
              the shortest chain of connections through shared media portrayals. For example: Lincoln appeared
              in film A, actress B played in film A and film C where she portrayed Cleopatra.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
