'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { STAKEHOLDERS, STAKEHOLDER_INFO, CONCERNS } from '@/lib/game-data';
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';

export default function MiniGame1Page() {
  const router = useRouter();
  const { sessionId, studentId, setMg1Result, addEvent } = useGameStore();
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [error, setError] = useState('');
  const enterTime = useRef(Date.now());

  useEffect(() => {
    if (!sessionId) { router.replace('/login'); return; }
    addEvent('page_enter', 'mg1', {});
    enterTime.current = Date.now();
  }, [sessionId, router, addEvent]);

  const toggle = (stakeholder: string, concernId: string) => {
    setAnswers((prev) => {
      const current = prev[stakeholder] || [];
      if (current.includes(concernId)) {
        return { ...prev, [stakeholder]: current.filter((c) => c !== concernId) };
      }
      if (current.length >= 3) return prev;
      return { ...prev, [stakeholder]: [...current, concernId] };
    });
    setError('');
  };

  const handleSubmit = async () => {
    for (const s of STAKEHOLDERS) {
      if (!answers[s] || answers[s].length !== 3) {
        setError(`Please select exactly 3 concerns for each stakeholder.`);
        return;
      }
    }
    const duration = Date.now() - enterTime.current;
    const result = { answers };
    setMg1Result(result);
    addEvent('mg_submit', 'mg1', { answers, duration_ms: duration });
    setError('');
    try {
      const response = await fetch('/api/session', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          run_id: sessionId,
          user_id: studentId,
          mini_game_id: 1,
          score_delta: 0,
          duration_ms: duration,
          raw_result: result,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to save mini-game result');
      }
    } catch (err) {
      console.error('Mini-game 1 save failed:', err);
      setError('Failed to save your result. Please try again.');
      return;
    }
    router.push('/mini-game/2');
  };

  const allDone = STAKEHOLDERS.every((s) => (answers[s]?.length ?? 0) === 3);
  const doneCount = STAKEHOLDERS.filter((s) => (answers[s]?.length ?? 0) === 3).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7f8]">
      <Header />
      <ProgressBar currentStep="mg1" />
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <span className="text-sm font-semibold text-[#137fec] tracking-wide uppercase">Mini-Game 1</span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">Priority Ranking</h1>
          <p className="text-slate-600 max-w-3xl mt-2">
            Based on your understanding of each stakeholder, select the <strong className="text-slate-900">Top 3 concerns</strong> that you believe are most important to them at this stage.
          </p>

          {/* Concern options legend */}
          <div className="mt-5 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Concern Options</h2>
            <div className="space-y-2.5">
              {CONCERNS.map((c, i) => (
                <div key={c.id} className="flex gap-3 text-sm">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[#137fec]/10 text-[#137fec] flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <div>
                    <span className="font-medium text-slate-900">{c.label}</span>
                    <span className="text-slate-500 ml-1">— {c.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-slate-500">Progress:</span>
            <div className="flex gap-1">
              {STAKEHOLDERS.map((s) => (
                <div key={s} className={`h-2 w-10 rounded-full transition-colors ${(answers[s]?.length ?? 0) === 3 ? 'bg-[#137fec]' : 'bg-slate-200'}`} />
              ))}
            </div>
            <span className="text-slate-500">{doneCount}/{STAKEHOLDERS.length}</span>
          </div>
        </div>

        <div className="space-y-6">
          {STAKEHOLDERS.map((s) => {
            const info = STAKEHOLDER_INFO[s];
            const sel = answers[s] || [];
            const isDone = sel.length === 3;
            return (
              <div key={s} className={`bg-white rounded-xl shadow-sm border transition-colors ${isDone ? 'border-[#137fec]/30' : 'border-slate-200'}`}>
                <div className="flex items-center gap-3 p-5 border-b border-slate-100">
                  <div className={`size-10 rounded-full flex items-center justify-center ${isDone ? 'bg-[#137fec] text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <span className="material-symbols-outlined">{info.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{s}</h3>
                    <p className="text-sm text-slate-500">{info.primary}</p>
                  </div>
                  <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full ${isDone ? 'bg-[#137fec]/10 text-[#137fec]' : 'bg-slate-100 text-slate-500'}`}>
                    {sel.length}/3
                  </span>
                </div>
                <div className="p-5 grid grid-cols-1 gap-2">
                  {CONCERNS.map((c, i) => {
                    const isOn = sel.includes(c.id);
                    const disabled = !isOn && sel.length >= 3;
                    return (
                      <button
                        key={c.id}
                        onClick={() => toggle(s, c.id)}
                        disabled={disabled}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 text-sm font-medium text-left transition-all ${
                          isOn
                            ? 'border-[#137fec] bg-[#137fec]/5 text-[#137fec]'
                            : disabled
                              ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-[#137fec]/40'
                        }`}
                      >
                        <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${isOn ? 'bg-[#137fec] text-white' : 'bg-slate-200 text-slate-500'}`}>{isOn ? '✓' : i + 1}</span>
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!allDone}
            className={`px-8 py-3 rounded-lg font-bold shadow-sm flex items-center gap-2 transition-all ${
              allDone ? 'bg-[#137fec] text-white hover:bg-blue-600' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>Confirm Priorities</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </main>
    </div>
  );
}
