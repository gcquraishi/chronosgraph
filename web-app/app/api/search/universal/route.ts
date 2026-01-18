// file: web-app/app/api/search/universal/route.ts
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const session = await getSession();

    // Universal search across 5 categories
    const cypher = `
      // 1. Historical Figures
      MATCH (f:HistoricalFigure)
      WHERE toLower(f.name) CONTAINS toLower($q)
      RETURN {
        type: 'figure',
        id: f.canonical_id,
        label: f.name,
        meta: f.era,
        url: '/figure/' + f.canonical_id
      } as result
      LIMIT 3

      UNION

      // 2. Media Works (Non-Series)
      MATCH (m:MediaWork)
      WHERE toLower(m.title) CONTAINS toLower($q)
        AND NOT m.media_type IN ['BookSeries', 'FilmSeries', 'TVSeriesCollection', 'GameSeries', 'BoardGameSeries']
      RETURN {
        type: 'media',
        id: m.media_id,
        label: m.title,
        meta: m.media_type + ' (' + toString(m.release_year) + ')',
        url: '/media/' + m.media_id
      } as result
      LIMIT 3

      UNION

      // 3. Series
      MATCH (m:MediaWork)
      WHERE toLower(m.title) CONTAINS toLower($q)
        AND m.media_type IN ['BookSeries', 'FilmSeries', 'TVSeriesCollection', 'GameSeries', 'BoardGameSeries']
      RETURN {
        type: 'series',
        id: m.media_id,
        label: m.title,
        meta: m.media_type,
        url: '/media/' + m.media_id
      } as result
      LIMIT 3

      UNION

      // 4. Creators
      MATCH (m:MediaWork)
      WHERE toLower(m.creator) CONTAINS toLower($q)
      WITH DISTINCT m.creator as creator
      RETURN {
        type: 'creator',
        id: creator,
        label: creator,
        meta: 'Creator',
        url: '/contribute/creator?name=' + creator
      } as result
      LIMIT 3

      UNION

      // 5. Actors
      MATCH (f:HistoricalFigure)-[r:APPEARS_IN]->(m:MediaWork)
      WHERE r.actor_name IS NOT NULL AND toLower(r.actor_name) CONTAINS toLower($q)
      WITH DISTINCT r.actor_name as actor, collect(DISTINCT m.title)[0] as exampleMedia, collect(DISTINCT m.media_id)[0] as exampleMediaId
      RETURN {
        type: 'actor',
        id: actor,
        label: actor,
        meta: 'Actor in ' + exampleMedia,
        url: '/media/' + exampleMediaId
      } as result
      LIMIT 3
    `;

    const result = await session.run(cypher, { q: query });
    await session.close();

    const results = result.records.map(record => record.get('result'));

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Universal search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
