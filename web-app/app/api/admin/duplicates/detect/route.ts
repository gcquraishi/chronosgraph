// file: web-app/app/api/admin/duplicates/detect/route.ts
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';
import { enhancedNameSimilarity, getConfidenceLevel } from '@/lib/name-matching';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface DuplicatePair {
  figure1: {
    canonical_id: string;
    name: string;
    wikidata_id?: string;
    era?: string;
    appearance_count: number;
    created_by_agent?: string;
  };
  figure2: {
    canonical_id: string;
    name: string;
    wikidata_id?: string;
    era?: string;
    appearance_count: number;
    created_by_agent?: string;
  };
  similarity_score: number;
  lexical_score: number;
  phonetic_score: number;
  confidence: 'high' | 'medium' | 'low';
  relationship_overlap: number;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Configurable thresholds
  const minSimilarity = parseFloat(searchParams.get('min_similarity') || '0.75');
  const confidenceFilter = searchParams.get('confidence') as 'high' | 'medium' | 'low' | 'all' || 'all';
  const limit = parseInt(searchParams.get('limit') || '50');

  try {
    const session = await getSession();

    // Strategy: Fetch basic figure info only (no media_ids to avoid memory issues)
    // Relationship overlap will be calculated separately for detected duplicates
    const cypher = `
      MATCH (f:HistoricalFigure)
      OPTIONAL MATCH (f)-[:CREATED_BY]->(agent:Agent)
      OPTIONAL MATCH (f)-[:APPEARS_IN]->(m:MediaWork)
      WITH f, agent, count(DISTINCT m) as appearance_count
      RETURN {
        canonical_id: f.canonical_id,
        name: f.name,
        wikidata_id: f.wikidata_id,
        era: f.era,
        appearance_count: appearance_count,
        created_by_agent: agent.name
      } as figure
      ORDER BY f.canonical_id
    `;

    const result = await session.run(cypher);
    await session.close();

    // Extract all figures
    const figures = result.records.map(record => record.get('figure'));

    console.log(`[Duplicate Detection] Comparing ${figures.length} figures...`);

    // Compute pairwise similarity (in-app to avoid Neo4j memory limits)
    const pairs: DuplicatePair[] = [];

    for (let i = 0; i < figures.length; i++) {
      for (let j = i + 1; j < figures.length; j++) {
        const fig1 = figures[i];
        const fig2 = figures[j];

        // Quick filter: Skip if names are very different in length
        const lengthRatio = Math.min(fig1.name.length, fig2.name.length) /
                           Math.max(fig1.name.length, fig2.name.length);
        if (lengthRatio < 0.5) continue; // Names too different in length

        // Calculate similarity
        const similarity = enhancedNameSimilarity(fig1.name, fig2.name);

        // Early skip if below threshold
        if (similarity < minSimilarity) continue;

        const confidence = getConfidenceLevel(similarity);

        // Relationship overlap calculation deferred (would require separate query per pair)
        // For now, set to 0 - can be populated on-demand in the UI
        const overlap = 0;

        pairs.push({
          figure1: {
            canonical_id: fig1.canonical_id,
            name: fig1.name,
            wikidata_id: fig1.wikidata_id,
            era: fig1.era,
            appearance_count: fig1.appearance_count,
            created_by_agent: fig1.created_by_agent,
          },
          figure2: {
            canonical_id: fig2.canonical_id,
            name: fig2.name,
            wikidata_id: fig2.wikidata_id,
            era: fig2.era,
            appearance_count: fig2.appearance_count,
            created_by_agent: fig2.created_by_agent,
          },
          similarity_score: parseFloat(similarity.toFixed(3)),
          lexical_score: 0, // Not computed separately in this version
          phonetic_score: 0, // Not computed separately in this version
          confidence,
          relationship_overlap: overlap,
        });
      }
    }

    console.log(`[Duplicate Detection] Found ${pairs.length} potential duplicate pairs`);

    // Filter by confidence level if specified
    const confidenceFiltered = confidenceFilter === 'all'
      ? pairs
      : pairs.filter(pair => pair.confidence === confidenceFilter);

    // Sort by similarity score (highest first)
    const sorted = confidenceFiltered.sort((a, b) => b.similarity_score - a.similarity_score);

    // Apply limit
    const limited = sorted.slice(0, limit);

    // Group by confidence for stats
    const stats = {
      total: limited.length,
      high_confidence: limited.filter(p => p.confidence === 'high').length,
      medium_confidence: limited.filter(p => p.confidence === 'medium').length,
      low_confidence: limited.filter(p => p.confidence === 'low').length,
    };

    return NextResponse.json({
      duplicates: limited,
      stats,
      filters: {
        min_similarity: minSimilarity,
        confidence_filter: confidenceFilter,
        limit,
      },
    });

  } catch (error) {
    console.error('[Duplicate Detection Error]', error);
    return NextResponse.json(
      { error: 'Failed to detect duplicates' },
      { status: 500 }
    );
  }
}
