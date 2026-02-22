'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { INFO_SOURCES } from '@/lib/game-data';
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';

const COLOR_MAP: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  pink: 'bg-pink-50 text-pink-600',
  orange: 'bg-orange-50 text-orange-600',
  purple: 'bg-purple-50 text-purple-600',
};

export default function MiniGame3Page() {
  const router = useRouter();
  const { sessionId, setMg3Result, addEvent } = useGameStore();
  const [ranking, setRanking] = useState<Record<string, number>>({});
  const [error, setError] = useState('');
  const enterTime = useRef(Date.now());

  useEffect(() => {
    if (!sessionId) { router.replace('/login'); return; }
    addEvent('page_enter', 'mg3', {});
    enterTime.current = Date.now();
  }, [sessionId, router, addEvent]);

  const setRank = (sourceId: string, rank: number) => {
    setRanking((prev) => ({ ...prev, [sourceId]: rank }));
    setError('');
  };

  const handleSubmit = () => {
    const values = Object.values(ranking);
    if (values.length !== 5) { setError('Please assign a rank to all 5 sources.'); return; }
    const unique = new Set(values);
    if (unique.size !== 5) { setError('Each rank must be unique (1-5). No duplicates allowed.'); return; }
    const duration = Date.now() - enterTime.current;
    setMg3Result({ ranking });
    addEvent('mg_submit', 'mg3', { ranking, duration_ms: duration });
    router.push('/mini-game/4');
  };

  const usedRanks = new Set(Object.values(ranking));

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7f8]">
      <Header />
      <ProgressBar currentStep="mg3" />
      <main className="flex-grow flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col max-w-[1024px] w-full gap-8">
          <div>
            <span className="text-sm font-semibold text-[#137fec] tracking-wide uppercase">Mini-Game 3</span>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">Information Credibility Check</h1>
            <p className="text-slate-600 text-lg mt-2">
              Evaluate the reliability of the following information sources. Assign a rank from <strong>1 (Most Credible)</strong> to <strong>5 (Least Credible)</strong>.
            </p>
          </div>

          <div className="space-y-4">
            {INFO_SOURCES.map((source) => (
              <div key={source.id} className="group bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:border-[#137fec]/50 transition-all flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                <div className={`size-12 shrink-0 rounded-full flex items-center justify-center ${COLOR_MAP[source.color]}`}>
                  <span className="material-symbols-outlined text-2xl">{source.icon}</span>
                </div>
                <div className="flex-grow">
                  <h4 className="text-slate-900 font-bold text-base mb-1">{source.label}</h4>
                  <p className="text-slate-500 text-sm">{source.description}</p>
                </div>
                <div className="w-full sm:w-auto min-w-[140px]">
                  <select
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-[#137fec] focus:border-[#137fec] p-2.5 cursor-pointer font-medium"
                    value={ranking[source.id] || ''}
                    onChange={(e) => setRank(source.id, Number(e.target.value))}
                  >
                    <option value="" disabled>Select Rank</option>
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r} disabled={usedRanks.has(r) && ranking[source.id] !== r}>
                        {r}{r === 1 ? ' - Most Credible' : r === 5 ? ' - Least Credible' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-200">
            <button onClick={() => setRanking({})} className="px-6 py-3 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">Reset All</button>
            <button onClick={handleSubmit} className="flex items-center gap-2 px-8 py-3 rounded-lg bg-[#137fec] hover:bg-blue-600 text-white text-sm font-bold shadow-sm transition-all">
              <span>Submit Ranking</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
