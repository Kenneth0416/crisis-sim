import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { getSessions, getEvents } from '@/lib/db';

export async function GET() {
  try {
    const sessions = await getSessions();
    const events = await getEvents();

    const wb = XLSX.utils.book_new();

    // Sheet A: Sessions
    const sessionsWs = XLSX.utils.json_to_sheet(sessions);
    XLSX.utils.book_append_sheet(wb, sessionsWs, 'sessions');

    // Sheet B: Events
    const eventsWs = XLSX.utils.json_to_sheet(events);
    XLSX.utils.book_append_sheet(wb, eventsWs, 'events');

    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buf, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="crisis-sim-data-${new Date().toISOString().slice(0, 10)}.xlsx"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
}
