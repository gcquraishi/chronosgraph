'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { GraphNode, GraphLink } from '@/lib/types';

const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
});

interface GraphExplorerProps {
  canonicalId?: string;
  nodes?: GraphNode[];
  links?: GraphLink[];
}

interface ExtendedGraphLink extends GraphLink {
  featured?: boolean;
}

const SENTIMENT_COLORS = {
  Heroic: '#22c55e',
  Villainous: '#ef4444',
  Complex: '#eab308',
};

// Bacon node colors - distinctive styling
const BACON_COLOR = '#dc2626'; // Red for Bacon nodes
const BACON_SIZE = 1.5; // Scale multiplier for Bacon nodes

// Helper function to check if a node is a Bacon
const isBaconNode = (nodeId: string): boolean => {
  return nodeId.includes('bacon');
};

export default function GraphExplorer({ canonicalId, nodes: initialNodes, links: initialLinks }: GraphExplorerProps) {
  const router = useRouter();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [nodes, setNodes] = useState<GraphNode[]>(initialNodes || []);
  const [links, setLinks] = useState<ExtendedGraphLink[]>(initialLinks || []);
  const [isLoading, setIsLoading] = useState(!initialNodes && !initialLinks);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [showAllEdges, setShowAllEdges] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch graph data on mount if not provided
  useEffect(() => {
    if (initialNodes && initialLinks) {
      setNodes(initialNodes);
      setLinks(initialLinks);
      setIsLoading(false);
      return;
    }

    if (!canonicalId) {
      setError('No canonical ID or graph data provided');
      setIsLoading(false);
      return;
    }

    const fetchGraphData = async () => {
      setIsLoading(true);
      setError(null);

      startTransition(async () => {
        try {
          const response = await fetch(`/api/graph/${canonicalId}`);

          if (!response.ok) {
            throw new Error('Failed to fetch graph data');
          }

          const data = await response.json();
          setNodes(data.nodes || []);
          setLinks(data.links || []);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred');
          setNodes([]);
          setLinks([]);
        } finally {
          setIsLoading(false);
        }
      });
    };

    fetchGraphData();
  }, [canonicalId, initialNodes, initialLinks]);

  // Handle responsive dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = Math.max(600, window.innerHeight - 400);
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Filter links based on featured path and expanded nodes
  const visibleLinks = links.filter((link: any) => {
    // Always show featured links
    if (link.featured === true) return true;

    // Show non-featured links if all edges are shown
    if (showAllEdges) return true;

    // Show links connected to expanded nodes
    const source = link.source ? String(link.source) : '';
    const target = link.target ? String(link.target) : '';
    if (expandedNodes.has(source) || expandedNodes.has(target)) {
      return true;
    }

    return false;
  });

  // Handle node click
  const handleNodeClick = (node: any) => {
    // Expand/collapse non-figure nodes to show their connections
    if (!node.id.startsWith('figure-') && !node.id.startsWith('actor-')) {
      setExpandedNodes((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(node.id)) {
          newSet.delete(node.id);
        } else {
          newSet.add(node.id);
        }
        return newSet;
      });
    } else if (node.type === 'figure' && typeof node.id === 'string' && node.id.startsWith('figure-')) {
      // Navigate to figure page
      const id = node.id.replace('figure-', '');
      router.push(`/figure/${id}`);
    } else if (node.type === 'media' && typeof node.id === 'string' && node.id.startsWith('media-')) {
      // Navigate to media page
      const id = node.id.replace('media-', '');
      router.push(`/media/${id}`);
    }
  };

  // Loading skeleton
  if (isLoading || isPending) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Graph Explorer</h2>
        <div className="mb-4 flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-300 animate-pulse"></div>
            <span className="text-gray-500">Loading...</span>
          </div>
        </div>
        <div className="bg-white rounded-lg overflow-hidden" style={{ height: dimensions.height }}>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-400">Loading graph data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Graph Explorer</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (nodes.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Graph Explorer</h2>
        <p className="text-gray-500 text-center py-8">No graph data available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Minimal Controls Overlay */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={() => setShowAllEdges(!showAllEdges)}
          className={`px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all ${
            showAllEdges
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
          title={showAllEdges ? 'Hide non-path connections' : 'Show all connections'}
        >
          {showAllEdges ? 'Hide Extra' : 'Show All'}
        </button>
      </div>

      {/* Inline Legend - Bottom Left */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 shadow-lg p-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: BACON_COLOR }}></div>
            <span className="text-gray-800 font-semibold">The Bacons</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3b82f6' }}></div>
            <span className="text-gray-700">Historical Figure</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22c55e' }}></div>
            <span className="text-gray-700">Heroic Media</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#eab308' }}></div>
            <span className="text-gray-700">Complex Media</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-500 italic">
          Drag to pan • Scroll to zoom • Click nodes
        </div>
      </div>

      {/* Full-Bleed Graph */}
      <div ref={containerRef} className="bg-gray-50 overflow-hidden cursor-grab active:cursor-grabbing" style={{ minHeight: dimensions.height }}>
        <ForceGraph2D
          graphData={{ nodes, links: visibleLinks }}
          width={dimensions.width}
          height={dimensions.height}
          nodeLabel="name"
          nodeColor={(node: any) => {
            if (isBaconNode(node.id)) return BACON_COLOR;
            if (node.type === 'figure') return '#3b82f6';
            return SENTIMENT_COLORS[node.sentiment as keyof typeof SENTIMENT_COLORS] || '#9ca3af';
          }}
          nodeRelSize={7}
          linkColor={() => '#d1d5db'}
          linkWidth={1.5}
          backgroundColor="#f9fafb"
          onNodeClick={handleNodeClick}
          nodeCanvasObject={(node: any, ctx, globalScale) => {
            try {
              const label = node?.name || '';
              if (!label || !ctx || !node.x || typeof node.y !== 'number') return;

              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';

              // Determine node size
              const baseSize = isBaconNode(node.id) ? 8 : 6;
              const nodeSize = expandedNodes.has(node.id) ? baseSize * 1.3 : baseSize;

              // Draw node with glow effect for Bacon nodes
              if (isBaconNode(node.id)) {
                // Glow effect
                ctx.fillStyle = BACON_COLOR;
                ctx.globalAlpha = 0.2;
                ctx.beginPath();
                ctx.arc(node.x, node.y, nodeSize * 2, 0, 2 * Math.PI, false);
                ctx.fill();

                // Main node
                ctx.globalAlpha = 1;
                ctx.fillStyle = BACON_COLOR;
                ctx.beginPath();
                ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
                ctx.fill();

                // Border
                ctx.strokeStyle = '#7f1d1d';
                ctx.lineWidth = 2 / globalScale;
                ctx.stroke();
              } else {
                // Regular nodes
                const color = node.type === 'figure' ? '#3b82f6' : (SENTIMENT_COLORS[node.sentiment as keyof typeof SENTIMENT_COLORS] || '#9ca3af');
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
                ctx.fill();
              }

              // Draw label
              ctx.globalAlpha = 1;
              ctx.fillStyle = '#1f2937';
              ctx.font = `bold ${fontSize}px Sans-Serif`;
              ctx.fillText(label, node.x, node.y + nodeSize + 12);
            } catch (e) {
              // Silently fail if canvas rendering has issues
              console.warn('Canvas rendering error:', e);
            }
          }}
        />
      </div>
    </div>
  );
}
