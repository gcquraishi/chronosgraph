/**
 * Sentiment Parser Test Cases
 * Run with: npx ts-node sentiment-parser.test.ts
 */

import { parseSentiment, getSentimentScore, getNormalizedSentiment } from './sentiment-parser';

console.log('=== Sentiment Parser Test Cases ===\n');

// Test Case 1: Simple sentiments
console.log('Test Case 1: Simple Sentiments');
console.log('--------------------------------');
const simple = ['heroic', 'villainous', 'complex', 'neutral', 'positive', 'negative'];
simple.forEach(s => {
  const result = parseSentiment(s);
  console.log(`"${s}" → ${result.normalized} (${result.numericScore}/100)`);
});

// Test Case 2: Hyphenated compounds (the problem cases)
console.log('\nTest Case 2: Hyphenated Compounds');
console.log('----------------------------------');
const hyphenated = [
  'villainous-desperate',
  'romantic-tragic',
  'complex-tyrannical',
  'heroic-sympathetic',
  'manipulative-cruel',
  'noble-courageous'
];
hyphenated.forEach(s => {
  const result = parseSentiment(s);
  console.log(`"${s}" → ${result.normalized} (${result.numericScore}/100)`);
});

// Test Case 3: Mixed sentiments (should be complex)
console.log('\nTest Case 3: Mixed Sentiments');
console.log('-----------------------------');
const mixed = ['heroic-villainous', 'sympathetic-cruel', 'noble-tyrannical'];
mixed.forEach(s => {
  const result = parseSentiment(s);
  console.log(`"${s}" → ${result.normalized} (${result.numericScore}/100)`);
});

// Test Case 4: Edge cases
console.log('\nTest Case 4: Edge Cases');
console.log('-----------------------');
const edge = [null, undefined, '', 'unknown', 'documentary', 'historical'];
edge.forEach(s => {
  const result = parseSentiment(s);
  console.log(`"${s}" → ${result.normalized} (${result.numericScore}/100)`);
});

// Test Case 5: Henry VIII actual sentiments
console.log('\nTest Case 5: Henry VIII Actual Sentiments');
console.log('-----------------------------------------');
const henryVIII = [
  'Complex',
  'villainous-desperate',
  'romantic-tragic',
  'Heroic',
  'Villainous'
];
henryVIII.forEach(s => {
  const result = parseSentiment(s);
  console.log(`"${s}" → ${result.normalized} (${result.numericScore}/100)`);
});

console.log('\n=== All Tests Complete ===');
