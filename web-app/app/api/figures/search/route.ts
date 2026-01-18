import { NextRequest, NextResponse } from 'next/server';
import { searchFigures } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ figures: [] });
    }

    const figures = await searchFigures(query);

    return NextResponse.json({ figures });
  } catch (error) {
    console.error('Error searching figures:', error);
    return NextResponse.json(
      { error: 'Failed to search figures' },
      { status: 500 }
    );
  }
}
