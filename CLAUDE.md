# Fictotum Co-CEO Guidelines
**Role:** Autonomous Data Architect & Historian.
**Strategy:** "Sonnet-First" ingestion for scale; "Opus-Review" for conflict resolution.
**Database:** Neo4j Aura (c78564a4). Use `canonical_id` for `:HistoricalFigure` nodes.
**Entity Resolution:** Wikidata Q-IDs are canonical for `:MediaWork` nodes.
**Permissions:** YOLO-lite. Autonomy granted for Git, Python, and WebSearch.
**Safety:** Never touch files outside of `/Documents/big-heavy/fictotum`.

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

## Provenance Tracking Protocol (CREATED_BY)
**Mandatory for all node creation** (Phase 2.1 - COMPLETE as of February 2, 2026)
**Status**: ✅ 100% provenance coverage (1,594 entity nodes tracked)

### Agent Schema
All contributions are attributed to an `:Agent` node:
```cypher
(:Agent {
  agent_id: STRING,        // "claude-sonnet-4.5" or "web-ui-generic"
  name: STRING,            // Display name
  type: STRING,            // "ai_agent" | "human_user"
  version: STRING,         // Model version (for AI agents)
  created_at: DATETIME,    // When agent was registered
  metadata: STRING         // JSON with additional info
})
```

### CREATED_BY Relationship
**REQUIRED**: Every new `HistoricalFigure`, `MediaWork`, or `FictionalCharacter` node MUST have a `CREATED_BY` relationship:

```cypher
(entity)-[:CREATED_BY {
  timestamp: DATETIME,     // When entity was created (REQUIRED)
  context: STRING,         // "bulk_ingestion" | "web_ui" | "api" | "migration" (REQUIRED)
  batch_id: STRING,        // Ingestion batch identifier
  method: STRING           // "wikidata_enriched" | "user_generated" | "manual"
}]->(agent:Agent)
```

### Implementation Pattern
When creating nodes in bulk ingestion scripts:
```cypher
// 1. Match or create Agent
MERGE (agent:Agent {agent_id: "claude-sonnet-4.5"})
ON CREATE SET
  agent.name = "Claude Code (Sonnet 4.5)",
  agent.type = "ai_agent",
  agent.version = "claude-sonnet-4-5-20250929",
  agent.created_at = datetime()

// 2. Create entity node
CREATE (f:HistoricalFigure { ... })

// 3. Create CREATED_BY relationship
CREATE (f)-[:CREATED_BY {
  timestamp: datetime(),
  context: "bulk_ingestion",
  batch_id: $batchId,
  method: "wikidata_enriched"
}]->(agent)
```

### Audit & Verification
- **Query provenance**: `GET /api/audit/node-provenance?entity_id={id}`
- **Statistics**: `POST /api/audit/node-provenance` (returns counts by agent, context, method)
- **Missing provenance**: `MATCH (n) WHERE NOT EXISTS((n)-[:CREATED_BY]->()) RETURN n`

### Migration
- **Backfill script**: `scripts/migration/backfill_created_by_provenance.py`
- **Dry-run mode**: `python3 scripts/migration/backfill_created_by_provenance.py --dry-run`
- **Production**: Remove `--dry-run` flag after CEO approval
- **Status**: ✅ Executed successfully (Feb 2, 2026) - 1,594 CREATED_BY relationships established

## Database Health Monitoring
**Infrastructure** (Sprint 3 - February 2026)

### Health Check Script
- **Tool**: `scripts/qa/neo4j_health_check.py`
- **Purpose**: Comprehensive database health monitoring and reporting
- **Usage**: `python3 scripts/qa/neo4j_health_check.py --report health_report.md`
- **Schedule**: Run weekly to monitor database growth and integrity

### Health Metrics Tracked
- Connection status verification
- Node and relationship counts by type
- Orphaned node detection (nodes with no relationships)
- CREATED_BY provenance coverage (should be 100%)
- Index health status (all should be ONLINE)
- Performance metrics and warnings

### Health Report Output
- Markdown format report with tables and metrics
- Warning detection for missing provenance, orphaned nodes
- Success criteria: 100% provenance coverage, no critical errors
- Saved to timestamped files for historical tracking

### Automation
- **Recommended**: Schedule weekly runs via cron or GitHub Actions
- **Alert thresholds**: Warn if provenance coverage < 100%, orphaned nodes > 5
- **Report archive**: Store in `docs/reports/health-checks/`

## Batch Import Infrastructure
**Data Ingestion at Scale** (CHR-40 - February 2026)

### Batch Import Tool
- **Primary tool**: `scripts/import/batch_import.py`
- **Purpose**: Bulk ingestion of historical figures and media works from JSON files
- **Features**:
  - JSON schema validation with detailed error messages
  - Duplicate detection using enhanced name similarity
  - Wikidata Q-ID validation via API
  - Automatic CREATED_BY agent attribution
  - Dry-run mode for safe preview
  - Batch transaction management (configurable batch size)
  - Progress reporting and detailed logging

### Usage Pattern
```bash
# 1. Validate JSON against schema
python3 scripts/import/validate_batch_json.py data/batch.json

# 2. Dry run to preview changes
python3 scripts/import/batch_import.py data/batch.json --dry-run

# 3. Execute import after review
python3 scripts/import/batch_import.py data/batch.json --execute
```

### JSON Schema
- **Location**: `data/batch_import_schema.json`
- **Examples**: `data/examples/batch_figures_only.json`, `batch_works_only.json`
- **Templates**: CSV templates available in `data/examples/`
- **Converter**: `scripts/import/csv_to_batch_json.py` for CSV → JSON conversion

### Safety Features
- Dry-run mode enabled by default (prevents accidents)
- Confirmation prompt for live execution
- Duplicate detection before insertion
- Transaction rollback on error
- Detailed import reports generated automatically

## Safety & Path Integrity
- **Permanent Storage Only:** Before creating or moving any files, verify the destination is a permanent project directory (Root, `/src`, etc.).
- **Cache Restriction:** NEVER write to or assume context from temporary or cache folders like `__pycache__`, `.venv`, or `dist`.