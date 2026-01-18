// file: web-app/app/api/media/search/route.ts
import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/neo4j';
import { isInt } from 'neo4j-driver';

function toNumber(value: any): number {
  if (isInt(value)) {
    return value.toNumber();
  }
  return Number(value);
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ works: [] });
    }

    const session = await getSession();
    const result = await session.run(
      `MATCH (m:MediaWork)
       WHERE toLower(m.title) CONTAINS toLower($query)
       RETURN m.media_id AS media_id, m.title AS title, m.release_year AS year
       LIMIT 10`,
      { query }
    );

    const works = result.records.map((record) => ({
      media_id: record.get('media_id'),
      title: record.get('title'),
      year: toNumber(record.get('year')),
    }));

    return NextResponse.json({ works });
  } catch (error) {
    console.error('Media search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
