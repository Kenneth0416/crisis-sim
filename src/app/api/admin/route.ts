import { getSessions, getEvents, deleteSession } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sessions = await getSessions();
    const events = await getEvents();
    return NextResponse.json({ sessions, events });
  } catch (error) {
    console.error('Admin data error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { session_id } = await request.json();
    if (!session_id) {
      return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
    }
    await deleteSession(session_id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete session' }, { status: 500 });
  }
}
