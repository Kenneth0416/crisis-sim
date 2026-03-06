import { NextRequest, NextResponse } from 'next/server';
import { computeRanks, saveSession, getSessions } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('session_id');
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }

    const ranks = await computeRanks(sessionId);

    // Update session with rank snapshot
    const sessions = await getSessions();
    const session = sessions.find((s) => s.session_id === sessionId);
    if (session) {
      session.cohort_n_at_view = ranks.cohort_n;
      session.rank_econ = ranks.rank_econ;
      session.rank_env = ranks.rank_env;
      session.rank_leg = ranks.rank_leg;
      session.rank_res = ranks.rank_res;
      await saveSession(session);
    }

    return NextResponse.json(ranks);
  } catch (error) {
    console.error('Comparison error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      error: 'Failed to compute ranks',
      details: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
