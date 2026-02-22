'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SessionRecord } from '@/lib/db';

interface AdminData {
  sessions: SessionRecord[];
  events: { session_id: string; event_type: string; page_id: string; client_ms_since_start: number }[];
}

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbReady, setDbReady] = useState(false);
  const [initMsg, setInitMsg] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin');
      if (res.ok) {
        setData(await res.json());
        setDbReady(true);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleInitDb = async () => {
    setInitMsg('Initializing...');
    const res = await fetch('/api/init-db');
    const json = await res.json();
    setInitMsg(json.success ? 'Tables created!' : json.error);
    if (json.success) { setDbReady(true); fetchData(); }
  };

  const handleDelete = async (sessionId: string) => {
    if (!confirm(`Delete session ${sessionId}?`)) return;
    await fetch('/api/admin', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: sessionId }),
    });
    fetchData();
  };

  return (
    <div className="min-h-screen bg-[#f6f7f8] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#137fec]">admin_panel_settings</span>
              Crisis Sim Admin
            </h1>
            <p className="text-sm text-slate-500 mt-1">Manage sessions and export data</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleInitDb}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm font-medium hover:bg-slate-800 flex items-center gap-1">
              <span className="material-symbols-outlined text-base">database</span>
              Init DB
            </button>
            <a href="/api/export" download
              className="px-4 py-2 bg-[#137fec] text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-1">
              <span className="material-symbols-outlined text-base">download</span>
              Export XLSX
            </a>
            <button onClick={fetchData}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-1">
              <span className="material-symbols-outlined text-base">refresh</span>
              Refresh
            </button>
          </div>
        </div>

        {initMsg && (
          <div className="mb-4 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">{initMsg}</div>
        )}

        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading...</div>
        ) : !dbReady ? (
          <div className="text-center py-20">
            <p className="text-slate-500 mb-4">Database not initialized. Click &quot;Init DB&quot; to create tables.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="text-sm text-slate-500">Total Sessions</div>
                <div className="text-3xl font-bold text-slate-900">{data?.sessions.length ?? 0}</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="text-sm text-slate-500">Total Events</div>
                <div className="text-3xl font-bold text-slate-900">{data?.events.length ?? 0}</div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="text-sm text-slate-500">Avg Total Score</div>
                <div className="text-3xl font-bold text-slate-900">
                  {data?.sessions.length
                    ? Math.round(data.sessions.reduce((a, s) => a + s.econ_total + s.env_total + s.leg_total + s.res_total, 0) / data.sessions.length)
                    : 0}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left px-4 py-3 font-semibold text-slate-600">Student</th>
                      <th className="text-left px-4 py-3 font-semibold text-slate-600">ID</th>
                      <th className="text-center px-4 py-3 font-semibold text-slate-600">Econ</th>
                      <th className="text-center px-4 py-3 font-semibold text-slate-600">Env</th>
                      <th className="text-center px-4 py-3 font-semibold text-slate-600">Leg</th>
                      <th className="text-center px-4 py-3 font-semibold text-slate-600">Res</th>
                      <th className="text-center px-4 py-3 font-semibold text-slate-600">Total</th>
                      <th className="text-center px-4 py-3 font-semibold text-slate-600">Status</th>
                      <th className="text-center px-4 py-3 font-semibold text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.sessions.map((s) => (
                      <tr key={s.session_id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium">{s.name}</td>
                        <td className="px-4 py-3 text-slate-500 font-mono text-xs">{s.student_id}</td>
                        <td className="text-center px-4 py-3">{s.econ_total}</td>
                        <td className="text-center px-4 py-3">{s.env_total}</td>
                        <td className="text-center px-4 py-3">{s.leg_total}</td>
                        <td className="text-center px-4 py-3">{s.res_total}</td>
                        <td className="text-center px-4 py-3 font-bold">{s.econ_total + s.env_total + s.leg_total + s.res_total}</td>
                        <td className="text-center px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            s.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>{s.status}</span>
                        </td>
                        <td className="text-center px-4 py-3">
                          <button onClick={() => handleDelete(s.session_id)}
                            className="text-red-500 hover:text-red-700">
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!data?.sessions.length) && (
                      <tr><td colSpan={9} className="text-center py-8 text-slate-400">No sessions yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
