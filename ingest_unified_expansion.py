"""
ChronosGraph: Unified Ingestion Engine (v2.0)
Updated to support Fictional Anchors and Historical Figures.
"""

import os
import json
import sys
from datetime import datetime
from dotenv import load_dotenv
from neo4j import GraphDatabase
from schema import SCHEMA_CONSTRAINTS

class UnifiedChronosIngestor:
    def __init__(self, uri, user, pwd):
        if uri.startswith("neo4j+s://"):
            uri = uri.replace("neo4j+s://", "neo4j+ssc://")
        self.driver = GraphDatabase.driver(uri, auth=(user, pwd))

    def close(self):
        self.driver.close()

    def setup_schema(self):
        with self.driver.session() as session:
            for statement in SCHEMA_CONSTRAINTS.strip().split(';'):
                if statement.strip():
                    session.run(statement)
        print("✅ Schema constraints verified.")

    def ingest_json_expansion(self, file_path):
        with open(file_path, 'r') as f:
            expansion_data = json.load(f)

        with self.driver.session() as session:
            for entry in expansion_data:
                # 1. Ingest MediaWork
                media = entry['media_work']
                session.run("""
                    MERGE (m:MediaWork {wikidata_id: $qid})
                    SET m.media_id = $mid, m.title = $title, m.media_type = $type,
                        m.release_year = $year, m.creator = $creator,
                        m.creator_wikidata_id = $c_qid
                """, qid=media['wikidata_id'], mid=media['media_id'], 
                     title=media['title'], type=media['media_type'],
                     year=media['release_year'], creator=media['creator'],
                     c_qid=media.get('creator_wikidata_id'))

                # 2. Ingest HistoricalFigures (including Fictional Anchors)
                for fig in entry.get('historical_figures', []):
                    session.run("""
                        MERGE (f:HistoricalFigure {canonical_id: $fid})
                        SET f.wikidata_id = $qid, f.name = $name,
                            f.is_fictional = $is_fic, f.birth_year = $birth,
                            f.death_year = $death, f.title = $title, f.era = $era
                    """, fid=fig['canonical_id'], qid=fig.get('wikidata_id'),
                         name=fig['name'], is_fic=fig.get('is_fictional', False),
                         birth=fig.get('birth_year'), death=fig.get('death_year'),
                         title=fig.get('title'), era=fig.get('era'))

                # 3. Ingest Portrayal Relationships
                for p in entry['portrayals']:
                    session.run("""
                        MATCH (f:HistoricalFigure {canonical_id: $fid})
                        MATCH (m:MediaWork {wikidata_id: $qid})
                        MERGE (f)-[r:APPEARS_IN]->(m)
                        SET r.sentiment = $sent, r.role_description = $role,
                            r.is_protagonist = $is_proto, r.conflict_flag = $c_flag,
                            r.conflict_notes = $c_notes
                    """, fid=p['figure_id'], qid=media['wikidata_id'],
                         sent=p['sentiment'], role=p['role_description'],
                         is_proto=p['is_protagonist'], c_flag=p.get('conflict_flag', False),
                         c_notes=p.get('conflict_notes'))

        print(f"🚀 Ingestion of {file_path} complete.")

def main():
    load_dotenv()
    uri, user, pwd = os.getenv("NEO4J_URI"), os.getenv("NEO4J_USERNAME", "neo4j"), os.getenv("NEO4J_PASSWORD")
    
    ingestor = UnifiedChronosIngestor(uri, user, pwd)
    try:
        ingestor.setup_schema()
        ingestor.ingest_json_expansion("literary_expansion.json")
    finally:
        ingestor.close()

if __name__ == "__main__":
    main()