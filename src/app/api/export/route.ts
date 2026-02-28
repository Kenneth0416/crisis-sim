import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { getSessions, getEvents, getMiniGameEntries } from '@/lib/db';

const SESSION_COLUMNS = [
  { key: 'name', header: 'Nickname' },
  { key: 'status', header: 'Status' },
  { key: 's1_choice', header: 'Scenario 1 Choice' },
  { key: 's2_choice', header: 'Scenario 2 Choice' },
  { key: 's3_choice', header: 'Scenario 3 Choice' },
  { key: 'econ_total', header: 'Economy Score' },
  { key: 'env_total', header: 'Environment Score' },
  { key: 'leg_total', header: 'Legitimacy Score' },
  { key: 'res_total', header: 'Resilience Score' },
  { key: 'rank_econ', header: 'Economy Rank' },
  { key: 'rank_env', header: 'Environment Rank' },
  { key: 'rank_leg', header: 'Legitimacy Rank' },
  { key: 'rank_res', header: 'Resilience Rank' },
  { key: 'cohort_n_at_view', header: 'Cohort Size' },
  { key: 'ref_q1', header: 'Reflection Q1 Rating' },
  { key: 'ref_q1_text', header: 'Reflection Q1 Text' },
  { key: 'ref_q2', header: 'Reflection Q2 Rating' },
  { key: 'ref_q2_text', header: 'Reflection Q2 Text' },
  { key: 'ref_q3', header: 'Reflection Q3 Rating' },
  { key: 'ref_q3_text', header: 'Reflection Q3 Text' },
  { key: 'ref_q4', header: 'Reflection Q4 Rating' },
  { key: 'ref_q4_text', header: 'Reflection Q4 Text' },
  { key: 'ref_q5', header: 'Reflection Q5 Rating' },
  { key: 'ref_q5_text', header: 'Reflection Q5 Text' },
  { key: 'ref_q6', header: 'Reflection Q6 Rating' },
  { key: 'ref_q6_text', header: 'Reflection Q6 Text' },
  { key: 'ref_open_text', header: 'Reflection Open Text' },
  { key: 'mg1_result_json', header: 'MG1 Result' },
  { key: 'mg2_result_json', header: 'MG2 Result' },
  { key: 'mg3_result_json', header: 'MG3 Result' },
  { key: 'mg4_result_json', header: 'MG4 Result' },
  { key: 'session_id', header: 'Session ID' },
  { key: 'start_time', header: 'Start Time' },
  { key: 'end_time', header: 'End Time' },
  { key: 'total_duration_ms', header: 'Duration (ms)' },
  { key: 'created_at', header: 'Created At' },
];

export async function GET() {
  try {
    const sessions = await getSessions();
    const events = await getEvents();
    const miniGameEntries = await getMiniGameEntries();
    const wb = XLSX.utils.book_new();

    // Sessions sheet with ordered columns
    const headers = SESSION_COLUMNS.map(c => c.header);
    const rows = sessions.map(s => SESSION_COLUMNS.map(c => (s as unknown as Record<string, unknown>)[c.key] ?? ''));
    const sessionsWs = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    XLSX.utils.book_append_sheet(wb, sessionsWs, 'Sessions');

    // Events sheet
    const eventsWs = XLSX.utils.json_to_sheet(events);
    XLSX.utils.book_append_sheet(wb, eventsWs, 'Events');

    // Mini-game entries sheet
    const miniGameWs = XLSX.utils.json_to_sheet(miniGameEntries);
    XLSX.utils.book_append_sheet(wb, miniGameWs, 'MiniGameEntries');

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
