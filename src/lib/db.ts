import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export interface SessionRecord {
  session_id: string;
  student_id: string;
  name: string;
  start_time: string;
  end_time: string;
  total_duration_ms: number;
  status: string;
  mg1_result_json: string;
  mg2_result_json: string;
  mg3_result_json: string;
  mg4_result_json: string;
  s1_choice: number;
  s2_choice: number;
  s3_choice: number;
  econ_total: number;
  env_total: number;
  leg_total: number;
  res_total: number;
  cohort_n_at_view: number;
  rank_econ: number;
  rank_env: number;
  rank_leg: number;
  rank_res: number;
  ref_q1: number;
  ref_q1_text: string;
  ref_q2: number;
  ref_q2_text: string;
  ref_q3: number;
  ref_q3_text: string;
  ref_q4: number;
  ref_q4_text: string;
  ref_q5: number;
  ref_q5_text: string;
  ref_q6: number;
  ref_q6_text: string;
  ref_open_text: string;
}

export interface EventRecord {
  session_id: string;
  event_time: string;
  event_type: string;
  page_id: string;
  payload_json: string;
  client_ms_since_start: number;
}

export interface MiniGameEntry {
  run_id: string;
  user_id: string;
  mini_game_id: number;
  score_delta: number;
  duration_ms: number;
  raw_result: string;
}

export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      session_id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      name TEXT NOT NULL,
      start_time TIMESTAMPTZ,
      end_time TIMESTAMPTZ,
      total_duration_ms INTEGER DEFAULT 0,
      status TEXT DEFAULT 'in_progress',
      mg1_result_json TEXT DEFAULT '{}',
      mg2_result_json TEXT DEFAULT '{}',
      mg3_result_json TEXT DEFAULT '{}',
      mg4_result_json TEXT DEFAULT '{}',
      s1_choice INTEGER DEFAULT 0,
      s2_choice INTEGER DEFAULT 0,
      s3_choice INTEGER DEFAULT 0,
      econ_total INTEGER DEFAULT 50,
      env_total INTEGER DEFAULT 50,
      leg_total INTEGER DEFAULT 50,
      res_total INTEGER DEFAULT 50,
      cohort_n_at_view INTEGER DEFAULT 0,
      rank_econ INTEGER DEFAULT 0,
      rank_env INTEGER DEFAULT 0,
      rank_leg INTEGER DEFAULT 0,
      rank_res INTEGER DEFAULT 0,
      ref_q1 INTEGER DEFAULT 0,
      ref_q1_text TEXT DEFAULT '',
      ref_q2 INTEGER DEFAULT 0,
      ref_q2_text TEXT DEFAULT '',
      ref_q3 INTEGER DEFAULT 0,
      ref_q3_text TEXT DEFAULT '',
      ref_q4 INTEGER DEFAULT 0,
      ref_q4_text TEXT DEFAULT '',
      ref_q5 INTEGER DEFAULT 0,
      ref_q5_text TEXT DEFAULT '',
      ref_q6 INTEGER DEFAULT 0,
      ref_q6_text TEXT DEFAULT '',
      ref_open_text TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      session_id TEXT NOT NULL REFERENCES sessions(session_id),
      event_time TIMESTAMPTZ,
      event_type TEXT NOT NULL,
      page_id TEXT NOT NULL,
      payload_json TEXT DEFAULT '{}',
      client_ms_since_start INTEGER DEFAULT 0
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS mini_game_entries (
      id SERIAL PRIMARY KEY,
      run_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      mini_game_id INTEGER NOT NULL,
      score_delta INTEGER DEFAULT 0,
      duration_ms INTEGER DEFAULT 0,
      raw_result TEXT DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE (run_id, mini_game_id)
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_events_session ON events(session_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_mini_game_entries_run ON mini_game_entries(run_id)`;
  // Migration: add columns for ref_q4-q6 if they don't exist
  await sql`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS ref_q4 INTEGER DEFAULT 0`;
  await sql`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS ref_q4_text TEXT DEFAULT ''`;
  await sql`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS ref_q5 INTEGER DEFAULT 0`;
  await sql`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS ref_q5_text TEXT DEFAULT ''`;
  await sql`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS ref_q6 INTEGER DEFAULT 0`;
  await sql`ALTER TABLE sessions ADD COLUMN IF NOT EXISTS ref_q6_text TEXT DEFAULT ''`;
}

export async function getSessions(): Promise<SessionRecord[]> {
  const rows = await sql`SELECT * FROM sessions ORDER BY created_at DESC`;
  return rows as unknown as SessionRecord[];
}

export async function saveSession(session: SessionRecord) {
  await sql`
    INSERT INTO sessions (
      session_id, student_id, name, start_time, end_time,
      total_duration_ms, status,
      mg1_result_json, mg2_result_json, mg3_result_json, mg4_result_json,
      s1_choice, s2_choice, s3_choice,
      econ_total, env_total, leg_total, res_total,
      cohort_n_at_view, rank_econ, rank_env, rank_leg, rank_res,
      ref_q1, ref_q1_text, ref_q2, ref_q2_text, ref_q3, ref_q3_text,
      ref_q4, ref_q4_text, ref_q5, ref_q5_text, ref_q6, ref_q6_text, ref_open_text
    ) VALUES (
      ${session.session_id}, ${session.student_id}, ${session.name},
      ${session.start_time}, ${session.end_time},
      ${session.total_duration_ms}, ${session.status},
      ${session.mg1_result_json}, ${session.mg2_result_json},
      ${session.mg3_result_json}, ${session.mg4_result_json},
      ${session.s1_choice}, ${session.s2_choice}, ${session.s3_choice},
      ${session.econ_total}, ${session.env_total},
      ${session.leg_total}, ${session.res_total},
      ${session.cohort_n_at_view}, ${session.rank_econ},
      ${session.rank_env}, ${session.rank_leg}, ${session.rank_res},
      ${session.ref_q1}, ${session.ref_q1_text},
      ${session.ref_q2}, ${session.ref_q2_text},
      ${session.ref_q3}, ${session.ref_q3_text},
      ${session.ref_q4}, ${session.ref_q4_text},
      ${session.ref_q5}, ${session.ref_q5_text},
      ${session.ref_q6}, ${session.ref_q6_text}, ${session.ref_open_text}
    )
    ON CONFLICT (session_id) DO UPDATE SET
      student_id = EXCLUDED.student_id,
      name = EXCLUDED.name,
      start_time = EXCLUDED.start_time,
      end_time = EXCLUDED.end_time,
      total_duration_ms = EXCLUDED.total_duration_ms,
      status = EXCLUDED.status,
      mg1_result_json = EXCLUDED.mg1_result_json,
      mg2_result_json = EXCLUDED.mg2_result_json,
      mg3_result_json = EXCLUDED.mg3_result_json,
      mg4_result_json = EXCLUDED.mg4_result_json,
      s1_choice = EXCLUDED.s1_choice,
      s2_choice = EXCLUDED.s2_choice,
      s3_choice = EXCLUDED.s3_choice,
      econ_total = EXCLUDED.econ_total,
      env_total = EXCLUDED.env_total,
      leg_total = EXCLUDED.leg_total,
      res_total = EXCLUDED.res_total,
      cohort_n_at_view = EXCLUDED.cohort_n_at_view,
      rank_econ = EXCLUDED.rank_econ,
      rank_env = EXCLUDED.rank_env,
      rank_leg = EXCLUDED.rank_leg,
      rank_res = EXCLUDED.rank_res,
      ref_q1 = EXCLUDED.ref_q1,
      ref_q1_text = EXCLUDED.ref_q1_text,
      ref_q2 = EXCLUDED.ref_q2,
      ref_q2_text = EXCLUDED.ref_q2_text,
      ref_q3 = EXCLUDED.ref_q3,
      ref_q3_text = EXCLUDED.ref_q3_text,
      ref_q4 = EXCLUDED.ref_q4,
      ref_q4_text = EXCLUDED.ref_q4_text,
      ref_q5 = EXCLUDED.ref_q5,
      ref_q5_text = EXCLUDED.ref_q5_text,
      ref_q6 = EXCLUDED.ref_q6,
      ref_q6_text = EXCLUDED.ref_q6_text,
      ref_open_text = EXCLUDED.ref_open_text
  `;
}

export async function getEvents(): Promise<EventRecord[]> {
  const rows = await sql`SELECT * FROM events ORDER BY client_ms_since_start ASC`;
  return rows as unknown as EventRecord[];
}

export async function saveEvents(sessionId: string, events: EventRecord[]) {
  await sql`DELETE FROM events WHERE session_id = ${sessionId}`;
  for (const e of events) {
    await sql`
      INSERT INTO events (session_id, event_time, event_type, page_id, payload_json, client_ms_since_start)
      VALUES (${e.session_id}, ${e.event_time}, ${e.event_type}, ${e.page_id}, ${e.payload_json}, ${e.client_ms_since_start})
    `;
  }
}

export async function saveMiniGameEntry(entry: MiniGameEntry) {
  await sql`
    INSERT INTO mini_game_entries (
      run_id, user_id, mini_game_id, score_delta, duration_ms, raw_result
    ) VALUES (
      ${entry.run_id}, ${entry.user_id}, ${entry.mini_game_id},
      ${entry.score_delta}, ${entry.duration_ms}, ${entry.raw_result}
    )
    ON CONFLICT (run_id, mini_game_id) DO UPDATE SET
      user_id = EXCLUDED.user_id,
      score_delta = EXCLUDED.score_delta,
      duration_ms = EXCLUDED.duration_ms,
      raw_result = EXCLUDED.raw_result,
      updated_at = NOW()
  `;
}

export async function getCompletedSessions(): Promise<SessionRecord[]> {
  const rows = await sql`SELECT * FROM sessions WHERE status = 'completed' ORDER BY created_at DESC`;
  return rows as unknown as SessionRecord[];
}

export async function computeRanks(sessionId: string) {
  const rows = await sql`
    SELECT session_id, econ_total, env_total, leg_total, res_total
    FROM sessions WHERE status = 'completed' OR session_id = ${sessionId}
  `;
  const completed = rows as unknown as Pick<SessionRecord, 'session_id' | 'econ_total' | 'env_total' | 'leg_total' | 'res_total'>[];
  const current = completed.find(s => s.session_id === sessionId);
  if (!current) return { cohort_n: 0, rank_econ: 0, rank_env: 0, rank_leg: 0, rank_res: 0 };

  const rankIn = (field: 'econ_total' | 'env_total' | 'leg_total' | 'res_total') => {
    const sorted = [...completed].sort((a, b) => b[field] - a[field]);
    return sorted.findIndex(s => s.session_id === sessionId) + 1;
  };

  return {
    cohort_n: completed.length,
    rank_econ: rankIn('econ_total'),
    rank_env: rankIn('env_total'),
    rank_leg: rankIn('leg_total'),
    rank_res: rankIn('res_total'),
  };
}

export async function deleteSession(sessionId: string) {
  await sql`DELETE FROM events WHERE session_id = ${sessionId}`;
  await sql`DELETE FROM mini_game_entries WHERE run_id = ${sessionId}`;
  await sql`DELETE FROM sessions WHERE session_id = ${sessionId}`;
}

export async function getMiniGameEntries(): Promise<MiniGameEntry[]> {
  const rows = await sql`SELECT * FROM mini_game_entries ORDER BY created_at DESC`;
  return rows as unknown as MiniGameEntry[];
}
