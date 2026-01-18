import { Suspense } from 'react';
import Image from 'next/image';
import { getConflictingPortrayals } from '@/lib/db';
import SearchInput from '@/components/SearchInput';
import ConflictFeed from '@/components/ConflictFeed';

export default async function Dashboard() {
  let conflicts: any[] = [];
  try {
    conflicts = await getConflictingPortrayals();
  } catch (error) {
    console.error('Failed to fetch conflicts:', error);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section with Graph Visualization */}
      <div className="bg-white border-b border-brand-primary/20 shadow-sm py-8 mb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-brand-primary mb-3">
                Six Degrees of Historical Separation
              </h1>
              <p className="text-lg text-brand-text/70">
                Connect any two historical figures through media portrayals and collaborative works
              </p>
            </div>

            {/* Featured Example: Kevin Bacon to Francis Bacon */}
            <div className="bg-brand-bg rounded-lg border border-brand-primary/20 p-6 shadow-sm">
              <p className="text-sm font-semibold text-brand-accent mb-4 text-center">
                FEATURED EXAMPLE: See how Kevin Bacon connects to Francis Bacon in just 4 degrees
              </p>
              <div className="relative w-full h-auto">
                <svg
                  viewBox="0 0 1200 600"
                  className="w-full h-auto"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Background */}
                  <rect width="1200" height="600" fill="#F5F5F5" />

                  {/* Title */}
                  <text
                    x="600"
                    y="35"
                    fontSize="28"
                    fontWeight="bold"
                    textAnchor="middle"
                    fill="#5D7A8A"
                  >
                    Four Degrees of Separation: Kevin Bacon to Francis Bacon
                  </text>

                  {/* SVG Defs for styling */}
                  <defs>
                    <style>{`
                      .actor-node { fill: #3b82f6; stroke: #2563eb; stroke-width: 2; }
                      .media-node { fill: #22c55e; stroke: #16a34a; stroke-width: 2; }
                      .historical-node { fill: #f97316; stroke: #ea580c; stroke-width: 2; }
                      .node-label { font-size: 12; font-weight: bold; fill: white; text-anchor: middle; }
                      .connection-line { stroke: #9ca3af; stroke-width: 2; fill: none; marker-end: url(#arrowhead); }
                      .media-label { font-size: 11; fill: #5D7A8A; text-anchor: middle; font-style: italic; }
                      .degree-label { font-size: 10; fill: #9ca3af; font-weight: bold; }
                    `}</style>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="10"
                      refX="9"
                      refY="3"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3, 0 6" fill="#9ca3af" />
                    </marker>
                  </defs>

                  {/* Degree 0: Kevin Bacon */}
                  <g>
                    <circle className="actor-node" cx="100" cy="300" r="45" />
                    <text className="node-label" x="100" y="295">
                      Kevin
                    </text>
                    <text className="node-label" x="100" y="310">
                      Bacon
                    </text>
                    <text className="degree-label" x="100" y="355">
                      DEGREE 0
                    </text>
                  </g>

                  {/* Connection 1: JFK Film */}
                  <line
                    className="connection-line"
                    x1="145"
                    y1="300"
                    x2="235"
                    y2="300"
                  />
                  <rect x="185" y="285" width="55" height="30" fill="white" stroke="#9ca3af" strokeWidth="1" rx="3" />
                  <text className="media-label" x="212.5" y="300">
                    JFK
                  </text>
                  <text className="media-label" x="212.5" y="313">
                    (1991)
                  </text>

                  {/* Degree 1: Jack Lemmon */}
                  <g>
                    <circle className="actor-node" cx="300" cy="300" r="45" />
                    <text className="node-label" x="300" y="295">
                      Jack
                    </text>
                    <text className="node-label" x="300" y="310">
                      Lemmon
                    </text>
                    <text className="degree-label" x="300" y="355">
                      DEGREE 1
                    </text>
                  </g>

                  {/* Connection 2: Hamlet Film */}
                  <line
                    className="connection-line"
                    x1="345"
                    y1="300"
                    x2="435"
                    y2="300"
                  />
                  <rect x="380" y="285" width="55" height="30" fill="white" stroke="#9ca3af" strokeWidth="1" rx="3" />
                  <text className="media-label" x="407.5" y="300">
                    Hamlet
                  </text>
                  <text className="media-label" x="407.5" y="313">
                    (1996)
                  </text>

                  {/* Degree 2: Derek Jacobi */}
                  <g>
                    <circle className="actor-node" cx="500" cy="300" r="45" />
                    <text className="node-label" x="500" y="295">
                      Derek
                    </text>
                    <text className="node-label" x="500" y="310">
                      Jacobi
                    </text>
                    <text className="degree-label" x="500" y="355">
                      DEGREE 2
                    </text>
                  </g>

                  {/* Connection 3: Love Is the Devil */}
                  <line
                    className="connection-line"
                    x1="545"
                    y1="300"
                    x2="635"
                    y2="300"
                  />
                  <rect x="570" y="285" width="70" height="30" fill="white" stroke="#9ca3af" strokeWidth="1" rx="3" />
                  <text className="media-label" x="605" y="300">
                    Love Is the
                  </text>
                  <text className="media-label" x="605" y="313">
                    Devil (1998)
                  </text>

                  {/* Degree 3: Francis Bacon (Painter) */}
                  <g>
                    <circle className="historical-node" cx="700" cy="300" r="45" />
                    <text className="node-label" x="700" y="295">
                      Francis
                    </text>
                    <text className="node-label" x="700" y="310">
                      Bacon
                    </text>
                    <text className="degree-label" x="700" y="355">
                      DEGREE 3
                    </text>
                  </g>

                  {/* Bottom Info Box */}
                  <rect
                    x="50"
                    y="420"
                    width="1100"
                    height="150"
                    fill="white"
                    stroke="#5D7A8A"
                    strokeWidth="2"
                    rx="8"
                  />

                  {/* Info text */}
                  <text
                    x="600"
                    y="450"
                    fontSize="16"
                    fontWeight="bold"
                    textAnchor="middle"
                    fill="#5D7A8A"
                  >
                    Connection Path Summary
                  </text>

                  <text x="70" y="480" fontSize="12" fill="#37474F">
                    • Kevin Bacon appeared in JFK (1991) as Willie O'Keefe alongside Jack Lemmon
                  </text>

                  <text x="70" y="505" fontSize="12" fill="#37474F">
                    • Jack Lemmon appeared in Kenneth Branagh's Hamlet (1996) as Marcellus, alongside Derek Jacobi
                  </text>

                  <text x="70" y="530" fontSize="12" fill="#37474F">
                    • Derek Jacobi portrayed Francis Bacon in &quot;Love Is the Devil&quot; (1998), a biographical film
                  </text>

                  <text
                    x="70"
                    y="555"
                    fontSize="11"
                    fill="#C6470F"
                    fontWeight="bold"
                  >
                    Total Degrees: 4 | Media Works: 3 | Historical Subject: Francis Bacon (Painter, 1909-1992)
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-primary mb-3">
              Explore Historical Portrayals Across Media
            </h2>
            <p className="text-lg text-brand-text/70">
              Discover how historical figures are depicted in film, television, books, and games
            </p>
          </div>

          {/* Search Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-center mb-4">Universal Search</h3>
            <Suspense fallback={<div className="h-14 bg-white/50 border border-brand-primary/20 rounded-lg animate-pulse" />}>
              <SearchInput />
            </Suspense>
          </div>

          {/* Conflict Feed and Pathfinding */}
          <Suspense fallback={<div className="h-96 bg-white/50 border border-brand-primary/20 rounded-lg animate-pulse" />}>
            <ConflictFeed conflicts={conflicts} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
