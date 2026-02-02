// file: web-app/app/api/audit/duplicates/route.ts
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';
import { isInt } from 'neo4j-driver';
import { doubleMetaphone } from 'double-metaphone';

function toNumber(value: any): number {
  if (isInt(value)) {
    return value.toNumber();
  }
  return Number(value);
}

/**
 * Levenshtein distance algorithm
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Calculate similarity ratio between two strings (0-1)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Calculate phonetic similarity between two strings using Double Metaphone
 * Returns 1.0 for primary phonetic match, 0.5 for secondary match, 0.0 for no match
 */
function calculatePhoneticSimilarity(str1: string, str2: string): number {
  if (!str1 || !str2) return 0.0;

  const tokens1 = str1.toLowerCase().trim().split(/\s+/).filter(t => t.length > 0);
  const tokens2 = str2.toLowerCase().trim().split(/\s+/).filter(t => t.length > 0);

  if (tokens1.length === 0 || tokens2.length === 0) return 0.0;

  const phonetics1 = tokens1.map(token => doubleMetaphone(token));
  const phonetics2 = tokens2.map(token => doubleMetaphone(token));

  let bestMatch = 0.0;

  for (const [primary1, secondary1] of phonetics1) {
    for (const [primary2, secondary2] of phonetics2) {
      if (primary1 && primary2 && primary1 === primary2) {
        bestMatch = Math.max(bestMatch, 1.0);
      } else if (
        (primary1 && secondary2 && primary1 === secondary2) ||
        (secondary1 && primary2 && secondary1 === primary2) ||
        (secondary1 && secondary2 && secondary1 === secondary2)
      ) {
        bestMatch = Math.max(bestMatch, 0.5);
      }
    }
  }

  return bestMatch;
}

/**
 * Enhanced name similarity combining lexical (Levenshtein) and phonetic (Double Metaphone) matching
 * Weight distribution: 70% lexical, 30% phonetic
 */
function enhancedNameSimilarity(name1: string, name2: string): {
  combined: number;
  lexical: number;
  phonetic: number;
} {
  const lexical = calculateSimilarity(name1, name2);
  const phonetic = calculatePhoneticSimilarity(name1, name2);
  const combined = (lexical * 0.7) + (phonetic * 0.3);

  return { combined, lexical, phonetic };
}

/**
 * Determine confidence level based on combined similarity score
 */
function getConfidenceLevel(score: number): 'high' | 'medium' | 'low' {
  if (score >= 0.9) return 'high';
  if (score >= 0.7) return 'medium';
  return 'low';
}

interface DuplicatePair {
  figure1: {
    canonical_id: string;
    name: string;
    wikidata_id: string | null;
    birth_year: number | null;
    death_year: number | null;
    era: string | null;
    portrayals_count: number;
  };
  figure2: {
    canonical_id: string;
    name: string;
    wikidata_id: string | null;
    birth_year: number | null;
    death_year: number | null;
    era: string | null;
    portrayals_count: number;
  };
  similarity: {
    combined: number;
    lexical: number;
    phonetic: number;
    confidence: 'high' | 'medium' | 'low';
  };
  year_match: boolean;
}

/**
 * GET /api/audit/duplicates
 *
 * Detect potential duplicate HistoricalFigure nodes using enhanced name similarity.
 *
 * Query Parameters:
 * - threshold: Minimum similarity score to return (default: 0.7, range: 0.0-1.0)
 * - limit: Maximum number of duplicate pairs to return (default: 50, max: 500)
 * - min_confidence: Minimum confidence level ('high', 'medium', 'low', default: 'medium')
 *
 * Returns array of duplicate pairs with similarity breakdown and metadata.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters with validation
    const thresholdParam = searchParams.get('threshold');
    const threshold = thresholdParam
      ? Math.max(0.0, Math.min(1.0, parseFloat(thresholdParam)))
      : 0.7;

    const limitParam = searchParams.get('limit');
    const limit = limitParam
      ? Math.min(parseInt(limitParam), 500)
      : 50;

    const minConfidence = searchParams.get('min_confidence') || 'medium';
    if (!['high', 'medium', 'low'].includes(minConfidence)) {
      return NextResponse.json(
        { error: 'Invalid min_confidence. Must be high, medium, or low.' },
        { status: 400 }
      );
    }

    // Fetch all HistoricalFigure nodes from database (exclude soft-deleted)
    const dbSession = await getSession();

    const query = `
      MATCH (f:HistoricalFigure)
      WHERE NOT f:Deleted
      OPTIONAL MATCH (f)-[:APPEARS_IN]->(:MediaWork)
      WITH f, count(*) AS portrayals_count
      RETURN
        f.canonical_id AS canonical_id,
        f.name AS name,
        f.wikidata_id AS wikidata_id,
        f.birth_year AS birth_year,
        f.death_year AS death_year,
        f.era AS era,
        portrayals_count
      ORDER BY f.name
    `;

    const result = await dbSession.run(query);

    // Fetch dismissed pairs to filter out
    const dismissedQuery = `
      MATCH (f1:HistoricalFigure)-[:NOT_DUPLICATE]->(f2:HistoricalFigure)
      RETURN f1.canonical_id AS id1, f2.canonical_id AS id2
    `;

    const dismissedResult = await dbSession.run(dismissedQuery);
    await dbSession.close();

    const dismissedPairs = new Set<string>();
    dismissedResult.records.forEach(record => {
      const id1 = record.get('id1');
      const id2 = record.get('id2');
      const pairKey = [id1, id2].sort().join('|');
      dismissedPairs.add(pairKey);
    });

    const figures = result.records.map(record => ({
      canonical_id: record.get('canonical_id'),
      name: record.get('name'),
      wikidata_id: record.get('wikidata_id'),
      birth_year: record.get('birth_year') ? toNumber(record.get('birth_year')) : null,
      death_year: record.get('death_year') ? toNumber(record.get('death_year')) : null,
      era: record.get('era'),
      portrayals_count: toNumber(record.get('portrayals_count')),
    }));

    // Compare all pairs to find duplicates
    const duplicatePairs: DuplicatePair[] = [];
    const processedPairs = new Set<string>();

    for (let i = 0; i < figures.length; i++) {
      for (let j = i + 1; j < figures.length; j++) {
        const fig1 = figures[i];
        const fig2 = figures[j];

        // Skip if same canonical_id (shouldn't happen but defensive)
        if (fig1.canonical_id === fig2.canonical_id) continue;

        // Skip if both have Wikidata IDs and they're different (not duplicates)
        if (
          fig1.wikidata_id &&
          fig2.wikidata_id &&
          fig1.wikidata_id.startsWith('Q') &&
          fig2.wikidata_id.startsWith('Q') &&
          fig1.wikidata_id !== fig2.wikidata_id
        ) {
          continue;
        }

        // Create pair key to avoid duplicates
        const pairKey = [fig1.canonical_id, fig2.canonical_id].sort().join('|');
        if (processedPairs.has(pairKey)) continue;
        processedPairs.add(pairKey);

        // Skip if this pair has been dismissed
        if (dismissedPairs.has(pairKey)) continue;

        // Calculate enhanced similarity
        const similarity = enhancedNameSimilarity(fig1.name, fig2.name);

        // Skip if below threshold
        if (similarity.combined < threshold) continue;

        // Determine confidence level
        const confidence = getConfidenceLevel(similarity.combined);

        // Filter by minimum confidence
        const confidenceLevels = { high: 3, medium: 2, low: 1 };
        if (confidenceLevels[confidence] < confidenceLevels[minConfidence as keyof typeof confidenceLevels]) {
          continue;
        }

        // Check for year match (within 5 years tolerance)
        let yearMatch = false;
        if (fig1.birth_year && fig2.birth_year) {
          yearMatch = Math.abs(fig1.birth_year - fig2.birth_year) <= 5;
        } else if (fig1.death_year && fig2.death_year) {
          yearMatch = Math.abs(fig1.death_year - fig2.death_year) <= 5;
        }

        duplicatePairs.push({
          figure1: fig1,
          figure2: fig2,
          similarity: {
            combined: similarity.combined,
            lexical: similarity.lexical,
            phonetic: similarity.phonetic,
            confidence,
          },
          year_match: yearMatch,
        });
      }
    }

    // Sort by similarity score (highest first)
    duplicatePairs.sort((a, b) => b.similarity.combined - a.similarity.combined);

    // Limit results
    const limitedPairs = duplicatePairs.slice(0, limit);

    return NextResponse.json({
      count: limitedPairs.length,
      total_scanned: figures.length,
      threshold,
      min_confidence: minConfidence,
      duplicates: limitedPairs,
    });
  } catch (error) {
    console.error('Duplicate detection error:', error);
    return NextResponse.json(
      { error: 'Failed to detect duplicates' },
      { status: 500 }
    );
  }
}
