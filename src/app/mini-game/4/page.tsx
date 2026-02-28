'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { DIMENSIONS } from '@/lib/game-data';
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';

const COLOR_MAP: Record<string, string> = {
  blue: 'bg-blue-50 text-[#137fec]',
  emerald: 'bg-emerald-50 text-emerald-600',
  purple: 'bg-purple-50 text-purple-600',
  amber: 'bg-amber-50 text-amber-600',
};

export default function MiniGame4Page() {
  const router = useRouter();
  const { sessionId, studentId, setMg4Result, addEvent } = useGameStore();
  const [ranking, setRanking] = useState<Record<string, number>>({});
  const [error, setError] = useState('');
  const enterTime = useRef(Date.now());

  useEffect(() => {
    if (!sessionId) { router.replace('/login'); return; }
    addEvent('page_enter', 'mg4', {});
    enterTime.current = Date.now();
  }, [sessionId, router, addEvent]);

  const setRank = (dimId: string, rank: number) => {
    setRanking((prev) => ({ ...prev, [dimId]: rank }));
    setError('');
  };

  const handleSubmit = async () => {
    const values = Object.values(ranking);
    if (values.length !== 4) { setError('Please assign a rank to all 4 dimensions.'); return; }
    const unique = new Set(values);
    if (unique.size !== 4) { setError('Each rank must be unique (1-4). No duplicates allowed.'); return; }
    const duration = Date.now() - enterTime.current;
    const result = { ranking };
    setMg4Result(result);
    addEvent('mg_submit', 'mg4', { ranking, duration_ms: duration });
    setError('');
    try {
      const response = await fetch('/api/session', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          run_id: sessionId,
          user_id: studentId,
          mini_game_id: 4,
          score_delta: 0,
          duration_ms: duration,
          raw_result: result,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to save mini-game result');
      }
    } catch (err) {
      console.error('Mini-game 4 save failed:', err);
      setError('Failed to save your result. Please try again.');
      return;
    }
    router.push('/briefing');
  };

  const usedRanks = new Set(Object.values(ranking));

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7f8]">
      <Header />
      <ProgressBar currentStep="mg4" />
      <main className="flex-1 flex flex-col items-center py-8 px-4 sm:px-10">
        <div className="w-full max-w-[1024px] flex flex-col gap-6">
          <div>
            <span className="text-sm font-semibold text-[#137fec] tracking-wide uppercase">Mini-Game 4</span>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">Impact Anticipation</h1>
            <p className="text-slate-600 text-lg mt-2 max-w-2xl">
              Rank the four corporate dimensions based on their vulnerability in this crisis.{' '}
              <strong className="text-slate-900">(1 = Most Vulnerable, 4 = Least Vulnerable)</strong>
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
              <span className="material-symbols-outlined text-lg">crisis_alert</span>
              <span className="font-bold uppercase tracking-wider text-xs text-red-600">Critical Event</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Scenario: Major Bridge Collapse</h3>
            <p className="text-slate-600 leading-relaxed">
              A catastrophic bridge collapse at a major port has caused significant structural damage, disrupted shipping operations, and raised serious safety and environmental concerns. International media is covering the event live, and multiple stakeholders are demanding immediate action.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DIMENSIONS.map((dim) => (
              <div key={dim.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-[#137fec]/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${COLOR_MAP[dim.color]}`}>
                    <span className="material-symbols-outlined text-3xl">{dim.icon}</span>
                  </div>
                  <div className="bg-slate-100 rounded-md px-2 py-1 text-xs font-mono text-slate-500">{dim.abbr}</div>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-1">{dim.label}</h4>
                <p className="text-xs text-slate-500 mb-4 leading-snug">{dim.description}</p>
                <select
                  className="w-full rounded-lg border-slate-300 bg-slate-50 text-slate-900 focus:border-[#137fec] focus:ring-[#137fec] text-sm py-2.5 font-medium cursor-pointer"
                  value={ranking[dim.id] || ''}
                  onChange={(e) => setRank(dim.id, Number(e.target.value))}
                >
                  <option value="" disabled>Select Rank</option>
                  {[1, 2, 3, 4].map((r) => (
                    <option key={r} value={r} disabled={usedRanks.has(r) && ranking[dim.id] !== r}>
                      {r}{r === 1 ? ' - Most Vulnerable' : r === 4 ? ' - Least Vulnerable' : ''}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 p-4 rounded-lg">
            <span className="material-symbols-outlined text-[#137fec] mt-0.5">info</span>
            <div>
              <p className="text-sm text-slate-900 font-medium">Ranking Requirement</p>
              <p className="text-sm text-slate-500">You must assign a unique rank (1-4) to each dimension. No duplicates allowed.</p>
            </div>
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

          <div className="flex justify-end gap-4 pt-4 border-t border-slate-200">
            <button onClick={handleSubmit} className="px-8 py-3 rounded-lg bg-[#137fec] text-white font-bold hover:bg-blue-600 shadow-sm flex items-center gap-2 transition-all">
              Continue to Scenarios
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
