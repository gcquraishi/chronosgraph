# Performance Optimization Plan (Phase 4.3)
**Date:** February 2, 2026
**Goal:** Optimize ChronosGraph for 1,000+ entity scale
**Current State:** 772 figures, ~708 media works

---

## Current Performance Issues

### 1. Duplicate Detection Bottleneck
**Problem:** Scans all 772 figures in-app, O(n²) comparison
**Current:** ~44 seconds to detect duplicates
**Impact:** Admin operations slow, blocks other work

**Root Causes:**
- In-app pairwise comparison (772 × 771 / 2 = 297,756 comparisons)
- Neo4j memory limits forced in-app processing
- No caching of similarity scores
- Phonetic encoding recomputed every time

### 2. Figure/Media Lookup Performance
**Problem:** No caching for frequently accessed entities
**Current:** Every request hits Neo4j
**Impact:** Slow page loads for popular figures (Caesar, Napoleon, etc.)

### 3. Database Query Patterns
**Problem:** Unknown if indexes are optimal
**Status:** 34 indexes exist, health unknown
**Impact:** Potential slow queries on relationship traversal

---

## Session 4.3.1: Duplicate Detection Optimization (1-2 hours)

### Strategy: Incremental Detection
Instead of scanning all pairs, only check new figures against existing ones.

**Approach:**
1. **Candidate Pre-filtering:** Only compare figures with similar first letters
2. **Batch Processing:** Process in chunks of 100 figures
3. **Score Caching:** Cache computed similarity scores
4. **Early Termination:** Skip pairs below 0.70 threshold early

**Implementation:**
```typescript
// Optimize duplicate detection with pre-filtering
function detectDuplicatesOptimized(figures: Figure[], threshold: number) {
  // Group by first letter for quick filtering
  const grouped = groupByFirstLetter(figures);

  const pairs = [];
  for (const [letter, group] of Object.entries(grouped)) {
    // Only compare within same letter group (huge reduction)
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const similarity = enhancedNameSimilarity(group[i].name, group[j].name);
        if (similarity >= threshold) {
          pairs.push({ ...});
        }
      }
    }
  }

  return pairs;
}
```

**Expected Impact:**
- Reduce comparisons from 297k → ~30k (10x improvement)
- Processing time: 44s → ~5s (estimated)

---

## Session 4.3.2: Query Result Caching (2 hours)

### Strategy: In-Memory LRU Cache for Hot Entities

**High-Traffic Endpoints to Cache:**
1. `/api/figures/[id]` - Figure detail lookups
2. `/api/media/[id]` - Media work lookups
3. `/api/search/universal` - Search results
4. `/api/audit/duplicates` - Duplicate detection results

**Implementation:**
```typescript
// lib/cache.ts
import { LRUCache } from 'lru-cache';

const figureCache = new LRUCache<string, FigureData>({
  max: 500, // Cache top 500 figures
  ttl: 1000 * 60 * 15, // 15 minute TTL
  updateAgeOnGet: true,
});

// Middleware
export function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  const cached = figureCache.get(key);
  if (cached) return Promise.resolve(cached as T);

  return fetcher().then(result => {
    figureCache.set(key, result, { ttl });
    return result;
  });
}
```

**Usage:**
```typescript
// app/api/figures/[id]/route.ts
export async function GET(req, { params }) {
  return withCache(`figure:${params.id}`, async () => {
    const session = await getSession();
    const result = await session.run(query, { id: params.id });
    return result.records[0];
  });
}
```

**Expected Impact:**
- Cache hit ratio: ~60-70% for popular figures
- Response time for cached: 1-2ms vs 50-100ms
- Reduced Neo4j load

---

## Session 4.3.3: Database Index Optimization (1 hour)

### Strategy: Audit & Optimize Indexes

**Tasks:**
1. **Index Health Check:** Verify all 34 indexes are ONLINE
2. **Query Profiling:** Use PROFILE on slow queries
3. **Missing Indexes:** Identify patterns needing indexes
4. **Composite Indexes:** Create multi-property indexes if beneficial

**Audit Script:**
```python
# scripts/qa/index_audit.py
def audit_indexes(session):
    # Check index status
    result = session.run("SHOW INDEXES")

    for record in result:
        index_name = record['name']
        state = record['state']
        properties = record['labelsOrTypes'] + record['properties']

        if state != 'ONLINE':
            print(f'⚠️ Index {index_name} is {state}')
        else:
            print(f'✓ {index_name}: {properties}')
```

**Common Slow Queries to Profile:**
- Figure name lookups: `MATCH (f:HistoricalFigure) WHERE f.name CONTAINS $query`
- Relationship traversal: `MATCH (f)-[:APPEARS_IN]->(m) RETURN f, m`
- Duplicate detection: Large cartesian products

**Expected Impact:**
- Identify 2-3 missing indexes
- Query time improvements: 20-50% on complex queries

---

## Session 4.3.4: API Response Time Profiling (1 hour)

### Strategy: Identify & Fix Slow Endpoints

**Tools:**
- Next.js built-in performance monitoring
- Manual timing with `console.time()`
- Neo4j query profiling with PROFILE

**High-Priority Endpoints:**
1. `/api/search/universal` - Currently used frequently
2. `/api/audit/duplicates` - Currently 44s (needs Session 4.3.1)
3. `/api/figures/[id]` - Core user journey
4. `/figure/[id]/page.tsx` - Full page load

**Profiling Template:**
```typescript
export async function GET(request: NextRequest) {
  const startTime = performance.now();

  try {
    // ... existing logic ...
    const dbTime = performance.now() - startTime;
    console.log(`[PERF] /api/endpoint: ${dbTime.toFixed(2)}ms`);

    return NextResponse.json(data);
  } catch (error) {
    const errorTime = performance.now() - startTime;
    console.error(`[PERF ERROR] /api/endpoint: ${errorTime.toFixed(2)}ms`);
    throw error;
  }
}
```

**Expected Findings:**
- 2-3 endpoints taking >200ms
- Opportunities for parallel queries
- N+1 query patterns

---

## Success Metrics

**Target Performance (After Optimization):**
- [ ] Duplicate detection: <5 seconds (down from 44s)
- [ ] Figure detail page load: <200ms (cached)
- [ ] Search results: <150ms
- [ ] Cache hit rate: >60% for popular entities
- [ ] All indexes ONLINE and optimal

**Database Scale Readiness:**
- [ ] Performance acceptable at 1,000 figures
- [ ] Performance acceptable at 2,000 figures
- [ ] Clear path to 10k+ figures identified

---

## Execution Order

1. **Session 4.3.1** - Duplicate detection optimization (biggest bottleneck)
2. **Session 4.3.2** - Query result caching (most user impact)
3. **Session 4.3.3** - Index audit (data-driven optimization)
4. **Session 4.3.4** - API profiling (identify remaining issues)

**Estimated Total Time:** 5-6 hours
**Expected Overall Impact:** 5-10x performance improvement

---

## Future Optimizations (Phase 4.4+)

1. **Vector Search:** Semantic similarity for figures (not just name-based)
2. **Read Replicas:** Separate read/write Neo4j instances
3. **CDN Caching:** Static figure pages cached at edge
4. **GraphQL Batching:** Reduce N+1 queries in UI
5. **Materialized Views:** Pre-compute expensive aggregations

---

**Ready to Begin:** Session 4.3.1 - Duplicate Detection Optimization
