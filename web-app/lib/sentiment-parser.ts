/**
 * Shared sentiment parsing utility for Fictotum
 * Handles hyphenated compound sentiments like "villainous-desperate"
 *
 * Problem: 140+ unique sentiment values exist in the database, but only 6 are mapped.
 * Hyphenated values like `villainous-desperate`, `romantic-tragic`, `complex-tyrannical`
 * all default to "complex", hiding actual reputation shifts.
 */

export type NormalizedSentiment = 'positive' | 'negative' | 'complex' | 'neutral';

export interface SentimentScore {
  normalized: NormalizedSentiment;
  numericScore: number; // 0-100 scale (0=villainous, 50=complex, 100=heroic)
  original: string;
}

/**
 * Parse any sentiment string into a normalized form
 * Handles: heroic, villainous, positive, negative, complex, neutral
 * Plus hyphenated compounds: villainous-desperate, romantic-tragic, etc.
 */
export function parseSentiment(sentiment: string | null | undefined): SentimentScore {
  if (!sentiment) {
    return { normalized: 'neutral', numericScore: 50, original: 'unknown' };
  }

  const lower = sentiment.toLowerCase().trim();

  // Check for positive/heroic indicators
  const positiveTerms = ['heroic', 'positive', 'sympathetic', 'admirable', 'noble', 'courageous'];
  const negativeTerms = ['villainous', 'negative', 'antagonist', 'tyrannical', 'cruel', 'evil', 'manipulative', 'desperate'];
  const neutralTerms = ['neutral', 'historical', 'documentary'];
  const complexTerms = ['complex', 'ambiguous', 'tragic', 'romantic', 'nuanced'];

  // For hyphenated sentiments, check if ANY term matches
  const hasPositive = positiveTerms.some(term => lower.includes(term));
  const hasNegative = negativeTerms.some(term => lower.includes(term));
  const hasNeutral = neutralTerms.some(term => lower === term);
  const hasComplex = complexTerms.some(term => lower.includes(term));

  // Scoring logic:
  // - Pure positive/heroic = 85
  // - Pure negative/villainous = 15
  // - Mixed (both positive and negative) = 50 (complex)
  // - Complex/tragic/romantic = 50
  // - Neutral = 50

  if (hasPositive && !hasNegative) {
    return { normalized: 'positive', numericScore: 85, original: sentiment };
  }

  if (hasNegative && !hasPositive) {
    return { normalized: 'negative', numericScore: 15, original: sentiment };
  }

  if (hasPositive && hasNegative) {
    // Mixed sentiment like "heroic-villainous" - very complex
    return { normalized: 'complex', numericScore: 50, original: sentiment };
  }

  if (hasNeutral) {
    return { normalized: 'neutral', numericScore: 50, original: sentiment };
  }

  if (hasComplex) {
    return { normalized: 'complex', numericScore: 50, original: sentiment };
  }

  // Default to complex for unmapped values
  return { normalized: 'complex', numericScore: 50, original: sentiment };
}

/**
 * Get numeric score for charting (0-100 scale)
 * Used by ReputationTimeline and VolatilityLeaderboard
 */
export function getSentimentScore(sentiment: string | null | undefined): number {
  return parseSentiment(sentiment).numericScore;
}

/**
 * Get normalized sentiment category
 * Used by API responses and component logic
 */
export function getNormalizedSentiment(sentiment: string | null | undefined): NormalizedSentiment {
  return parseSentiment(sentiment).normalized;
}

/**
 * Check if sentiment leans positive (for comparisons)
 */
export function isPositiveSentiment(sentiment: string | null | undefined): boolean {
  const { normalized } = parseSentiment(sentiment);
  return normalized === 'positive';
}

/**
 * Check if sentiment leans negative (for comparisons)
 */
export function isNegativeSentiment(sentiment: string | null | undefined): boolean {
  const { normalized } = parseSentiment(sentiment);
  return normalized === 'negative';
}
