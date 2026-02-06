# Fictotum Critical Issues - Executive Summary
**Date:** February 3, 2026
**Overall Health:** B+ (85/100)
**Status:** Production-ready with immediate fixes required

---

## 🚨 CRITICAL ISSUES (Must Fix Before Beta)

### 1. Sentiment Taxonomy Chaos
**Impact:** HIGH - Breaks timeline visualizations and volatility scores

**Problem:**
- 140+ unique sentiment values in database
- Only 6 are properly mapped in APIs
- Hyphenated values (`villainous-desperate`, `romantic-tragic`, etc.) default to "complex"

**Example:**
Henry VIII's portrayal as "villainous-desperate" (1966) is plotted as "complex" (neutral), hiding his negative reputation shift.

**Fix:**
```typescript
// Update sentiment mapping to parse hyphens
if (sentiment.includes('heroic') || sentiment === 'positive') return 100;
if (sentiment.includes('villainous') || sentiment === 'negative') return 0;
return 50; // complex/neutral
```

**Timeline:** 3 days

---

### 2. 281 Orphaned Figures (29% of Database)
**Impact:** HIGH - Wasted storage, breaks visualizations

**Problem:**
281 HistoricalFigure nodes have ZERO portrayals. These will error when viewed.

**Query:**
```cypher
MATCH (f:HistoricalFigure)
WHERE NOT EXISTS((f)-[:APPEARS_IN]->())
RETURN COUNT(f) as orphan_count
// Result: 281
```

**Fix:** Delete or archive orphaned nodes.

**Timeline:** 1 day

---

### 3. Duplicate Marcus Didius Falco
**Impact:** MEDIUM - Data integrity violation

**Problem:**
- `marcus_didius_falco` (Q933355) - 19 portrayals
- `falco_marcus_didius` (Q1469475) - 15 portrayals
- Total: 34 portrayals split incorrectly

**Root Cause:** Q933355 is the fictional character, Q1469475 is the book series. Entity type confusion.

**Fix:** Determine if Falco is fictional character or historical figure, then merge.

**Timeline:** 2 days

---

### 4. 33 Non-Compliant Canonical IDs
**Impact:** MEDIUM - Breaks entity validation

**Problem:**
33 figures use bare slugs instead of proper format:
- `antinous` → should be `Q187523` or `PROV:antinous-{timestamp}`
- `caligula` → should be `Q1409`
- `domitian` → should be `Q1423`

**Fix:** Run migration to lookup Wikidata Q-IDs and update format.

**Timeline:** 1 day

---

### 5. Missing Provenance (29 Figures)
**Impact:** LOW - Audit trail incomplete

**Problem:**
29 figures from Feb 3, 2026 21:28:21Z batch import lack CREATED_BY relationships.

**Affected:** WWII figures (Chester Nimitz, Rudolf Hess, Wilhelm Keitel, etc.)

**Fix:**
```cypher
MATCH (f:HistoricalFigure)
WHERE NOT EXISTS((f)-[:CREATED_BY]->())
  AND f.created_at = datetime('2026-02-03T21:28:21Z')
// Run backfill script
```

**Timeline:** 1 hour

---

## ⚠️ HIGH PRIORITY ISSUES

### 6. Hyphenated Sentiments Not Parsed in Volatility Calculation
**Problem:** Volatility scores are inaccurate because `villainous-desperate` maps to 50 (neutral) instead of 0 (villainous).

**Fix:** Update Cypher CASE logic in `/api/figures/volatility` to use `CONTAINS` operator.

---

### 7. Rivalry API Returns Fictional Characters
**Problem:** Top rivalry is "Decimus Camillus Verus vs Lucius Petronius Longus" (Falco series characters), not real historical rivals.

**Fix:** Filter query to only include Wikidata Q-ID figures:
```cypher
WHERE f1.canonical_id STARTS WITH 'Q' AND f2.canonical_id STARTS WITH 'Q'
```

---

### 8. Wolf Hall Series Relationships Missing
**Problem:** Query for `Series {name: 'Wolf Hall Trilogy'}` returns empty. Books not linked to series.

**Fix:** Re-ingest Wolf Hall series with proper PART_OF relationships.

---

### 9. RivalrySpotlight Button Text Misleading
**Problem:** Button says "Explore This Rivalry" but goes to single figure page, not rivalry comparison.

**Fix:** Either change button text or create `/rivalry/{id1}/{id2}` route.

---

### 10. ReputationTimeline Not Mobile Responsive
**Problem:** SVG is fixed 800px width, overflows on mobile.

**Fix:** Make width dynamic based on viewport.

---

## 📊 Data Quality Metrics

| Metric | Status | Notes |
|--------|--------|-------|
| Provenance Coverage | 97% ✓ | 29 figures missing CREATED_BY |
| Wikidata Coverage | 93.91% ✓ | 74 MediaWorks missing wikidata_id |
| Canonical ID Compliance | 96.6% ⚠️ | 33 non-compliant IDs |
| Sentiment Coverage | 59% ⚠️ | 571/969 figures have sentiment data |
| Orphaned Figures | 29% 🚨 | 281 figures with zero portrayals |

---

## ✅ What's Working Well

1. **Neo4j Schema** - Well-designed with proper entity resolution
2. **API Architecture** - Clean route structure with error handling
3. **Performance** - All queries < 1 second
4. **TypeScript Safety** - No diagnostic errors found
5. **Component Design** - Evidence Locker aesthetic is compelling
6. **Provenance System** - CREATED_BY tracking at 97%+

---

## 🎯 Recommended Action Plan

### Week 1 (Critical Fixes)
- [ ] Day 1: Run provenance backfill for 29 figures
- [ ] Day 2-3: Expand sentiment mapping in all APIs/components
- [ ] Day 4: Update volatility Cypher query (hyphen parsing)
- [ ] Day 5: Filter rivalry query (exclude PROV: figures)
- [ ] Weekend: Delete/archive 281 orphaned figures

### Week 2 (High Priority)
- [ ] Migrate 33 non-compliant canonical_ids
- [ ] Resolve Marcus Falco duplicate
- [ ] Re-ingest Wolf Hall series
- [ ] Fix RivalrySpotlight button
- [ ] Make ReputationTimeline responsive

### Week 3 (Polish for Beta)
- [ ] Create sentiment normalization migration script
- [ ] Add error handling for zero-sentiment figures
- [ ] Run accessibility audit
- [ ] Add keyboard navigation
- [ ] Complete UI testing suite

---

## 📋 Testing Checklist (Still Needed)

**Requires Dev Server Access:**
- [ ] Test invalid canonical_id in URL
- [ ] Test empty search validation
- [ ] Test special character sanitization
- [ ] Test pathfinding between orphaned figures
- [ ] Profile component performance (React DevTools)
- [ ] Run axe DevTools accessibility audit
- [ ] Test mobile responsiveness on actual devices
- [ ] Verify keyboard navigation (Tab/Enter/Arrow keys)

---

## 💡 Long-Term Recommendations

1. **Shared Sentiment Parser** - Stop duplicating logic across codebase
2. **Monthly Health Checks** - Automate orphaned node detection
3. **Sentiment Taxonomy Enforcement** - Validate at ingestion time
4. **Integration Tests** - Test API routes with real Neo4j queries
5. **Storybook Setup** - Document components in isolation

---

## 📈 Health Score Breakdown

| Category | Score | Weight | Weighted |
|----------|-------|--------|----------|
| Database Schema | A (95) | 20% | 19 |
| Data Quality | B- (75) | 25% | 18.75 |
| API Design | A- (90) | 15% | 13.5 |
| Component Code | B+ (87) | 15% | 13.05 |
| Performance | A (95) | 10% | 9.5 |
| Accessibility | C (70) | 10% | 7 |
| Documentation | B (80) | 5% | 4 |

**Total: 84.8 / 100 → B+ (85/100)**

---

## 🔥 Bottom Line

**Fictotum is production-ready with caveats.** The application has excellent architecture and performance, but data quality issues (sentiment chaos, orphaned nodes, duplicates) must be addressed before public beta. Allocate 2-3 weeks for critical fixes, then launch with known limitations documented.

**Recommendation:** PROCEED TO BETA with immediate sprint to fix Priority 1 issues.

---

**Compiled By:** Dr. Helena Thornwood, Oxford Historical Accuracy Division
**Full Report:** See `STRESS_TEST_REPORT.md` for complete 200+ point analysis
