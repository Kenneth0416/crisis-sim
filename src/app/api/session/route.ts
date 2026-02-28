import { NextRequest, NextResponse } from 'next/server';
import { saveSession, getSessions, saveEvents, saveMiniGameEntry } from '@/lib/db';
import type { SessionRecord, MiniGameEntry } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const session: SessionRecord = {
      session_id: body.session_id,
      student_id: body.student_id,
      name: body.name,
      start_time: body.start_time,
      end_time: body.end_time,
      total_duration_ms: body.total_duration_ms,
      status: body.status ?? 'completed',
      mg1_result_json: body.mg1_result_json ?? '{}',
      mg2_result_json: body.mg2_result_json ?? '{}',
      mg3_result_json: body.mg3_result_json ?? '{}',
      mg4_result_json: body.mg4_result_json ?? '{}',
      s1_choice: body.s1_choice ?? 0,
      s2_choice: body.s2_choice ?? 0,
      s3_choice: body.s3_choice ?? 0,
      econ_total: body.econ_total ?? 50,
      env_total: body.env_total ?? 50,
      leg_total: body.leg_total ?? 50,
      res_total: body.res_total ?? 50,
      cohort_n_at_view: 0,
      rank_econ: 0,
      rank_env: 0,
      rank_leg: 0,
      rank_res: 0,
      ref_q1: 0,
      ref_q1_text: '',
      ref_q2: 0,
      ref_q2_text: '',
      ref_q3: 0,
      ref_q3_text: '',
      ref_q4: 0,
      ref_q4_text: '',
      ref_q5: 0,
      ref_q5_text: '',
      ref_q6: 0,
      ref_q6_text: '',
      ref_open_text: '',
    };

    await saveSession(session);

    // Also save events if provided
    if (body.events && Array.isArray(body.events)) {
      const events = body.events.map((e: Record<string, unknown>) => ({
        session_id: body.session_id,
        event_time: e.event_time as string,
        event_type: e.event_type as string,
        page_id: e.page_id as string,
        payload_json: JSON.stringify(e.payload_json),
        client_ms_since_start: e.client_ms_since_start as number,
      }));
      await saveEvents(body.session_id, events);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session save error:', error);
    return NextResponse.json({ error: 'Failed to save session' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const sessions = await getSessions();
    const existing = sessions.find((s) => s.session_id === body.session_id);
    if (!existing) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const updated: SessionRecord = {
      ...existing,
      ref_q1: body.ref_q1 ?? existing.ref_q1,
      ref_q1_text: body.ref_q1_text ?? existing.ref_q1_text,
      ref_q2: body.ref_q2 ?? existing.ref_q2,
      ref_q2_text: body.ref_q2_text ?? existing.ref_q2_text,
      ref_q3: body.ref_q3 ?? existing.ref_q3,
      ref_q3_text: body.ref_q3_text ?? existing.ref_q3_text,
      ref_q4: body.ref_q4 ?? existing.ref_q4,
      ref_q4_text: body.ref_q4_text ?? existing.ref_q4_text,
      ref_q5: body.ref_q5 ?? existing.ref_q5,
      ref_q5_text: body.ref_q5_text ?? existing.ref_q5_text,
      ref_q6: body.ref_q6 ?? existing.ref_q6,
      ref_q6_text: body.ref_q6_text ?? existing.ref_q6_text,
      ref_open_text: body.ref_open_text ?? existing.ref_open_text,
    };

    await saveSession(updated);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Session patch error:', error);
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const runId = body.run_id ?? body.session_id;
    const userId = body.user_id ?? body.student_id;
    const miniGameId = Number(body.mini_game_id);
    const scoreDelta = Number(body.score_delta ?? 0);
    const durationMs = Number(body.duration_ms ?? 0);
    const rawResult = typeof body.raw_result === 'string'
      ? body.raw_result
      : JSON.stringify(body.raw_result ?? {});

    if (!runId || !userId || !Number.isFinite(miniGameId)) {
      return NextResponse.json({ error: 'Missing run_id, user_id, or mini_game_id' }, { status: 400 });
    }

    const entry: MiniGameEntry = {
      run_id: runId,
      user_id: userId,
      mini_game_id: miniGameId,
      score_delta: Number.isFinite(scoreDelta) ? scoreDelta : 0,
      duration_ms: Number.isFinite(durationMs) ? durationMs : 0,
      raw_result: rawResult,
    };

    await saveMiniGameEntry(entry);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mini-game save error:', error);
    return NextResponse.json({ error: 'Failed to save mini-game result' }, { status: 500 });
  }
}
