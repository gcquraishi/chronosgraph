'use client';

import React, { useMemo } from 'react';
import { GraphNode } from '@/lib/types';
import TimelineSmudge from './TimelineSmudge';
import TimelineAxisRenderer from './TimelineAxisRenderer';

interface ImpressionisticTimelineProps {
  explorationPath: string[];
  nodes: GraphNode[];
  onNodeClick: (nodeId: string) => void;
  centerNodeId: string | null;
}

interface TimelineData {
  id: string;
  name: string;
  type: 'figure' | 'media';
  startYear?: number;
  endYear?: number;
  precision?: 'exact' | 'decade' | 'era' | 'unknown';
}

export default function ImpressionisticTimeline({
  explorationPath,
  nodes,
  onNodeClick,
  centerNodeId
}: ImpressionisticTimelineProps) {
  // Extract temporal data from nodes in path
  const timelineData = useMemo(() => {
    const pathNodes = explorationPath
      .map(id => nodes.find(n => n.id === id))
      .filter(Boolean) as GraphNode[];

    return pathNodes
      .map(node => extractTemporalInfo(node))
      .filter(data => data !== null) as TimelineData[];
  }, [explorationPath, nodes]);

  // Calculate timeline bounds (min/max years)
  const { minYear, maxYear } = useMemo(() => {
    const years = timelineData
      .flatMap(d => [d.startYear, d.endYear])
      .filter((y): y is number => y !== undefined);

    if (years.length === 0) {
      return { minYear: 1800, maxYear: 2000 }; // Default range
    }

    const min = Math.min(...years);
    const max = Math.max(...years);
    const padding = (max - min) * 0.1 || 50; // 10% padding or 50 years minimum

    return {
      minYear: Math.floor(min - padding),
      maxYear: Math.ceil(max + padding)
    };
  }, [timelineData]);

  if (timelineData.length === 0) {
    return (
      <div className="w-full h-[120px] bg-stone-50 border-t-2 border-stone-300 flex items-center justify-center">
        <p className="text-sm text-stone-500 font-mono">
          No temporal data available for current path
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-[120px] bg-stone-50 border-t-2 border-stone-300 relative overflow-hidden">
      {/* Year axis */}
      <TimelineAxisRenderer minYear={minYear} maxYear={maxYear} />

      {/* Smudges layer */}
      <svg className="absolute inset-0 w-full h-full">
        {timelineData.map((data, idx) => (
          <TimelineSmudge
            key={data.id}
            data={data}
            minYear={minYear}
            maxYear={maxYear}
            isActive={data.id === centerNodeId}
            zIndex={idx}
            onClick={() => onNodeClick(data.id)}
          />
        ))}
      </svg>
    </div>
  );
}

// Helper to extract temporal info from GraphNode
function extractTemporalInfo(node: GraphNode): TimelineData | null {
  const temporal = node.temporal;

  if (!temporal) {
    // No temporal metadata
    return {
      id: node.id,
      name: node.name,
      type: node.type,
      precision: 'unknown'
    };
  }

  if (node.type === 'figure') {
    // Historical figure
    if (temporal.birth_year || temporal.death_year) {
      return {
        id: node.id,
        name: node.name,
        type: 'figure',
        startYear: temporal.birth_year,
        endYear: temporal.death_year,
        precision: temporal.precision || 'exact'
      };
    }
  } else if (node.type === 'media') {
    // Media work
    if (temporal.release_year) {
      return {
        id: node.id,
        name: node.name,
        type: 'media',
        startYear: temporal.release_year,
        precision: temporal.precision || 'exact'
      };
    }
  }

  // Has temporal metadata but no usable years
  return {
    id: node.id,
    name: node.name,
    type: node.type,
    precision: 'unknown'
  };
}
