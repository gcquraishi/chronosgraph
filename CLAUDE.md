# ChronosGraph Co-CEO Guidelines
**Role:** Autonomous Data Architect & Historian.
**Strategy:** "Sonnet-First" ingestion for scale; "Opus-Review" for conflict resolution.
**Database:** Neo4j Aura (c78564a4). Use `canonical_id` for `:HistoricalFigure` nodes.
**Entity Resolution:** Wikidata Q-IDs are canonical for `:MediaWork` nodes.
**Permissions:** YOLO-lite. Autonomy granted for Git, Python, and WebSearch.
**Safety:** Never touch files outside of `/Documents/chronosgraph`.

## MediaWork Ingestion Protocol
1. Search Wikidata for Q-ID before creating any `:MediaWork`
2. Query Neo4j via MCP: `MATCH (m:MediaWork {wikidata_id: $qid}) RETURN m`
3. If exists → link new portrayals to existing node
4. If not exists → create with `wikidata_id` property
5. Aliases only when scholarly source confirms alternate title

## HistoricalFigure Entity Resolution Protocol
**Wikidata-First Canonical Identifiers** (Priority 1 Enhancement - January 2026)

### Canonical ID Strategy
1. **Priority 1: Wikidata Q-ID** - Use Wikidata Q-ID as `canonical_id` when available
   - Example: `canonical_id: "Q517"` (Napoleon Bonaparte)
   - Ensures global uniqueness and alignment with external knowledge bases
2. **Priority 2: Provisional ID** - Generate timestamped ID when Q-ID unavailable
   - Format: `PROV:{slug}-{timestamp}`
   - Example: `canonical_id: "PROV:john-smith-1738462847293"`
   - Timestamp prevents collisions between figures with identical names

### Duplicate Prevention
- **Dual-Key Blocking**: Check both `wikidata_id` AND `canonical_id` before creating figures
- **Cypher Pattern**:
  ```cypher
  MATCH (f:HistoricalFigure)
  WHERE f.wikidata_id = $qid OR f.canonical_id = $canonical_id
  RETURN f
  ```
- **Rationale**: Prevents duplicates via Q-ID match (if provided) or canonical_id match

### Phonetic Name Matching
**Enhanced Similarity Scoring** (Priority 2 Enhancement - January 2026)

- **Algorithm**: Weighted combination of lexical (Levenshtein) + phonetic (Double Metaphone)
- **Weight Distribution**: 70% lexical, 30% phonetic
- **Use Cases**:
  - Catches spelling variations: "Steven" vs "Stephen"
  - Handles pronunciation equivalents: "Smyth" vs "Smith"
  - Supports non-English names better than Soundex
- **Implementation**: `enhancedNameSimilarity()` in `web-app/lib/wikidata.ts`
- **Thresholds**:
  - High confidence: ≥ 0.9 combined score
  - Medium confidence: 0.7 - 0.89 combined score
  - Low confidence: < 0.7 combined score

### Migration Path
- **Existing Figures**: Run `scripts/migration/prefix_provisional_canonical_ids.py --dry-run` to preview
- **Execution**: Run without `--dry-run` flag to prefix all slug-only IDs with `PROV:`
- **Idempotency**: Safe to run multiple times (skips already-prefixed IDs)
- **Backward Compatibility**: All existing `canonical_id` values remain valid (as substrings)

## Safety & Path Integrity
- **Permanent Storage Only:** Before creating or moving any files, verify the destination is a permanent project directory (Root, `/src`, etc.).
- **Cache Restriction:** NEVER write to or assume context from temporary or cache folders like `__pycache__`, `.venv`, or `dist`.