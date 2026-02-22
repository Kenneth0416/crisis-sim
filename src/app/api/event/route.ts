import { NextRequest, NextResponse } from 'next/server';
import { saveEvents } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id, events } = body;

    if (!session_id || !events) {
      return NextResponse.json({ error: 'Missing session_id or events' }, { status: 400 });
    }

    const formatted = events.map((e: Record<string, unknown>) => ({
      session_id,
      event_time: e.event_time as string,
      event_type: e.event_type as string,
      page_id: e.page_id as string,
      payload_json: typeof e.payload_json === 'string' ? e.payload_json : JSON.stringify(e.payload_json),
      client_ms_since_start: e.client_ms_since_start as number,
    }));

    await saveEvents(session_id, formatted);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Event save error:', error);
    return NextResponse.json({ error: 'Failed to save events' }, { status: 500 });
  }
}
