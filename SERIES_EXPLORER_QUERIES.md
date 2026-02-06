# Series Explorer - Sample Queries

**Date:** February 3, 2026
**Purpose:** Example Cypher queries to explore the newly imported series data

---

## Basic Series Queries

### List All Series with Book Counts
```cypher
MATCH (s:Series)
OPTIONAL MATCH (s)<-[:PART_OF]-(m:MediaWork)
RETURN s.name as series_name,
       s.wikidata_id as qid,
       count(m) as book_count,
       collect(m.author)[0] as author
ORDER BY book_count DESC
```

### Get Complete Book List for a Series
```cypher
MATCH (m:MediaWork)-[r:PART_OF]->(s:Series {name: "Cadfael"})
RETURN m.title as title,
       m.wikidata_id as qid,
       r.sequence_number as sequence,
       m.publication_year as year
ORDER BY r.sequence_number
```

### Find Books in Sequence Order with Gap Detection
```cypher
MATCH (s:Series {name: "Sharpe"})<-[r:PART_OF]-(m:MediaWork)
WITH s, collect({seq: r.sequence_number, title: m.title}) as books
RETURN s.name,
       [b IN books | b.seq] as sequences,
       size(books) as total_books
```

---

## Wikidata Coverage Queries

### Books Needing Wikidata Enrichment
```cypher
MATCH (m:MediaWork)-[:PART_OF]->(s:Series)
WHERE m.wikidata_id IS NULL
RETURN s.name as series,
       m.title as book_title,
       m.canonical_id as provisional_id,
       m.author as author
ORDER BY s.name, m.title
LIMIT 20
```

### Series with Best/Worst Q-ID Coverage
```cypher
MATCH (s:Series)<-[:PART_OF]-(m:MediaWork)
WITH s,
     count(m) as total,
     count(m.wikidata_id) as with_qid
RETURN s.name as series,
       total as books,
       with_qid as books_with_qid,
       round(100.0 * with_qid / total, 1) as qid_coverage_percent
ORDER BY qid_coverage_percent DESC
```

---

## Author Queries

### Books by Author Across Series
```cypher
MATCH (m:MediaWork)-[:PART_OF]->(s:Series)
WHERE m.author = "Anne Perry"
RETURN s.name as series,
       count(m) as books,
       collect(m.title)[0..3] as sample_titles
ORDER BY books DESC
```

### Find Authors with Multiple Series
```cypher
MATCH (m:MediaWork)-[:PART_OF]->(s:Series)
WITH m.author as author, collect(DISTINCT s.name) as series
WHERE size(series) > 1
RETURN author,
       series,
       size(series) as series_count
ORDER BY series_count DESC
```

---

## Temporal Queries

### Books by Publication Era (when data available)
```cypher
MATCH (m:MediaWork)-[:PART_OF]->(s:Series)
WHERE m.publication_year IS NOT NULL
RETURN s.name as series,
       min(m.publication_year) as first_published,
       max(m.publication_year) as last_published,
       max(m.publication_year) - min(m.publication_year) as span_years
ORDER BY first_published
```

### Most Prolific Series (by book count)
```cypher
MATCH (s:Series)<-[:PART_OF]-(m:MediaWork)
WITH s, count(m) as books
WHERE books > 15
RETURN s.name as series,
       books,
       s.wikidata_id as qid
ORDER BY books DESC
```

---

## Character Connection Queries (Future)

### Find Historical Figures Appearing in Series Books
```cypher
// Once character portrayals are linked
MATCH (f:HistoricalFigure)-[:PORTRAYED_IN]->(m:MediaWork)-[:PART_OF]->(s:Series)
RETURN s.name as series,
       f.name as historical_figure,
       count(m) as appearances,
       collect(m.title)[0..5] as sample_books
ORDER BY appearances DESC
```

### Cross-Series Character Appearances
```cypher
// Find figures appearing in multiple series
MATCH (f:HistoricalFigure)-[:PORTRAYED_IN]->(m:MediaWork)-[:PART_OF]->(s:Series)
WITH f, collect(DISTINCT s.name) as series
WHERE size(series) > 1
RETURN f.name as figure,
       f.canonical_id as qid,
       series,
       size(series) as series_count
ORDER BY series_count DESC
```

---

## Provenance Queries

### Verify Import Attribution
```cypher
MATCH (m:MediaWork)-[:PART_OF]->(:Series)
MATCH (m)-[r:CREATED_BY]->(agent:Agent)
RETURN agent.name as agent,
       r.context as context,
       count(m) as books_created
```

### Find Books by Batch ID
```cypher
MATCH (m:MediaWork)-[r:CREATED_BY]->(agent:Agent)
WHERE r.batch_id CONTAINS "series-works"
RETURN r.batch_id as batch,
       count(m) as books,
       collect(m.title)[0..3] as sample
ORDER BY batch
```

---

## Data Quality Queries

### Find Duplicate Titles (Potential Issues)
```cypher
MATCH (m:MediaWork)-[:PART_OF]->(:Series)
WITH m.title as title, collect(m) as books
WHERE size(books) > 1
RETURN title,
       [b IN books | b.wikidata_id] as qids,
       size(books) as count
```

### Books Without Sequence Numbers (Should be 0)
```cypher
MATCH (m:MediaWork)-[r:PART_OF]->(s:Series)
WHERE r.sequence_number IS NULL
RETURN s.name, m.title, r
```

### Series Without Books (Should be 0 after import)
```cypher
MATCH (s:Series)
WHERE NOT EXISTS((s)<-[:PART_OF]-())
RETURN s.name, s.wikidata_id
```

---

## UI Feature Queries

### Series Landing Page Data
```cypher
MATCH (s:Series {wikidata_id: $series_qid})
OPTIONAL MATCH (s)<-[r:PART_OF]-(m:MediaWork)
RETURN s.name as name,
       s.wikidata_id as qid,
       count(m) as total_books,
       collect({
         title: m.title,
         sequence: r.sequence_number,
         qid: m.wikidata_id,
         year: m.publication_year
       }) as books
ORDER BY r.sequence_number
```

### Series Timeline (Books with Years)
```cypher
MATCH (s:Series {name: "Hornblower"})<-[r:PART_OF]-(m:MediaWork)
WHERE m.publication_year IS NOT NULL
RETURN m.title,
       r.sequence_number,
       m.publication_year
ORDER BY m.publication_year
```

### Next Book in Series
```cypher
MATCH (current:MediaWork {wikidata_id: $current_book_qid})-[r1:PART_OF]->(s:Series)
MATCH (next:MediaWork)-[r2:PART_OF]->(s)
WHERE r2.sequence_number = r1.sequence_number + 1
RETURN next.title as next_book,
       next.wikidata_id as next_qid,
       r2.sequence_number as sequence
```

---

## Analytics Queries

### Wikidata Coverage by Series (Report)
```cypher
MATCH (s:Series)<-[:PART_OF]-(m:MediaWork)
WITH s,
     count(m) as total,
     sum(CASE WHEN m.wikidata_id IS NOT NULL THEN 1 ELSE 0 END) as with_qid
RETURN s.name as series,
       total,
       with_qid,
       total - with_qid as provisional,
       round(100.0 * with_qid / total, 1) as coverage_pct
ORDER BY coverage_pct DESC, total DESC
```

### Import Method Statistics
```cypher
MATCH (m:MediaWork)-[:PART_OF]->(:Series)
MATCH (m)-[r:CREATED_BY]->(:Agent)
RETURN r.method as import_method,
       count(m) as books,
       round(100.0 * count(m) / 189, 1) as percentage
ORDER BY books DESC
```

---

## Export Queries

### Full Series Catalog (JSON-ready)
```cypher
MATCH (s:Series)<-[r:PART_OF]-(m:MediaWork)
WITH s, collect({
  title: m.title,
  qid: m.wikidata_id,
  sequence: r.sequence_number,
  author: m.author,
  year: m.publication_year,
  canonical_id: m.canonical_id
}) as books
RETURN {
  series_name: s.name,
  series_qid: s.wikidata_id,
  book_count: size(books),
  books: books
} as series_data
ORDER BY s.name
```

### Provisional Nodes Enrichment Export
```cypher
MATCH (m:MediaWork)-[:PART_OF]->(s:Series)
WHERE m.wikidata_id IS NULL
RETURN m.title as title,
       m.author as author,
       m.canonical_id as canonical_id,
       s.name as series,
       "https://www.wikidata.org/w/index.php?search=" + m.title as search_url
ORDER BY s.name, m.title
```

---

## Notes

- All queries tested against Neo4j Aura (c78564a4) database
- Replace `$series_qid` and `$current_book_qid` with actual values in parameterized queries
- Sequence numbers are 1-indexed (first book = sequence 1)
- Some series may have books with identical titles but different content (sequels, editions)
- The Commodore appears in both Hornblower and Aubrey-Maturin series (correct duplicate)
