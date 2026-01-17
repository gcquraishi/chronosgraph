/**
 * ConflictFeed Integration Example
 *
 * This file demonstrates how to integrate the ConflictFeed component
 * into the landing page (app/page.tsx).
 */

import { Suspense } from 'react';
import { getConflictingPortrayals } from '@/lib/db';
import ConflictFeed from '@/components/ConflictFeed';

/**
 * Example 1: Add to existing landing page
 *
 * Update app/page.tsx to include ConflictFeed below the Featured Figures section:
 */

export default async function Dashboard() {
  // Fetch conflicts server-side
  const conflicts = await getConflictingPortrayals();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto"> {/* Increased max-width for wider layout */}

          {/* Existing Header and Search */}
          {/* ... existing code ... */}

          {/* NEW: Conflict Feed Section */}
          <div className="mt-16">
            <Suspense fallback={
              <div className="space-y-6">
                <div className="h-64 bg-gray-800 rounded-lg animate-pulse" />
                <div className="h-96 bg-gray-800 rounded-lg animate-pulse" />
              </div>
            }>
              <ConflictFeed conflicts={conflicts} />
            </Suspense>
          </div>

          {/* Existing Featured Figures can stay or be moved */}
          {/* ... existing code ... */}
        </div>
      </div>
    </div>
  );
}

/**
 * Example 2: Create dedicated conflicts page
 *
 * Create app/conflicts/page.tsx:
 */

async function ConflictsPage() {
  const conflicts = await getConflictingPortrayals();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
              Characterization Conflicts
            </h1>
            <p className="text-xl text-gray-400">
              Explore how the same historical figures are portrayed dramatically differently across media
            </p>
          </div>

          <ConflictFeed conflicts={conflicts} />
        </div>
      </div>
    </div>
  );
}

/**
 * Example 3: Client-side usage with API route
 *
 * If you need client-side fetching, create app/api/conflicts/route.ts:
 */

import { NextResponse } from 'next/server';
import { getConflictingPortrayals } from '@/lib/db';

export async function GET() {
  try {
    const conflicts = await getConflictingPortrayals();
    return NextResponse.json({ conflicts }, { status: 200 });
  } catch (error) {
    console.error('Conflicts API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conflicts' },
      { status: 500 }
    );
  }
}

/**
 * Then use in a client component:
 */

'use client';

import { useState, useEffect } from 'react';
import ConflictFeed from '@/components/ConflictFeed';

export default function ClientConflictPage() {
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/conflicts')
      .then(res => res.json())
      .then(data => {
        setConflicts(data.conflicts);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch conflicts:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading conflicts...</div>;
  }

  return <ConflictFeed conflicts={conflicts} />;
}

/**
 * Usage Notes:
 *
 * 1. Six Degrees Search:
 *    - Enter canonical_id values (e.g., "julius_caesar", "cleopatra_vii")
 *    - Path finding uses the /api/pathfinder endpoint
 *    - Results show visual path with relationship types
 *
 * 2. Collision Cards:
 *    - Automatically populated from conflict_flag=true portrayals
 *    - Side-by-side comparison of media portrayals
 *    - Click figure names to navigate to figure detail pages
 *
 * 3. Performance:
 *    - Server-side rendering recommended for SEO
 *    - Use Suspense boundaries for progressive loading
 *    - Consider pagination if conflicts exceed 20-30 items
 *
 * 4. Styling:
 *    - Follows "Lead Historian" persona (professional, data-dense)
 *    - Uses Tailwind CSS utilities
 *    - Dark theme (gray-800/900 backgrounds)
 *    - Responsive grid layouts (1-3 columns)
 */
