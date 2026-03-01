'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { TENSION_STATEMENTS, STAKEHOLDERS } from '@/lib/game-data';
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';

const STAKEHOLDER_META = [
  { name: 'Engineers', icon: 'engineering', desc: 'Operational efficiency & safety' },
  { name: 'Environmental Agency', icon: 'water_drop', desc: 'Sustainability standards' },
  { name: 'Government', icon: 'gavel', desc: 'Compliance & laws' },
  { name: 'Customers', icon: 'shopping_cart', desc: 'Service & cost' },
];

export default function MiniGame2Page() {
  const router = useRouter();
  const { sessionId, studentId, setMg2Result, addEvent } = useGameStore();
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [error, setError] = useState('');
  const enterTime = useRef(Date.now());

  useEffect(() => {
    if (!sessionId && process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') { router.replace('/login'); return; }
    addEvent('page_enter', 'mg2', {});
    enterTime.current = Date.now();
  }, [sessionId, router, addEvent]);

  const toggleStakeholder = (qId: number, stakeholder: string) => {
    setAnswers((prev) => {
      const current = prev[qId] || [];
      if (current.includes(stakeholder)) {
        return { ...prev, [qId]: current.filter((s) => s !== stakeholder) };
      }
      if (current.length >= 2) return prev;
      return { ...prev, [qId]: [...current, stakeholder] };
    });
    setError('');
  };

  const handleSubmit = async () => {
    for (const stmt of TENSION_STATEMENTS) {
      if (!answers[stmt.id] || answers[stmt.id].length !== 2) {
        setError(`Please select exactly 2 stakeholders for each statement.`);
        return;
      }
    }
    const duration = Date.now() - enterTime.current;
    const result = { answers };
    setMg2Result(result);
    addEvent('mg_submit', 'mg2', { answers, duration_ms: duration });
    setError('');
    try {
      const response = await fetch('/api/session', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          run_id: sessionId,
          user_id: studentId,
          mini_game_id: 2,
          score_delta: 0,
          duration_ms: duration,
          raw_result: result,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to save mini-game result');
      }
    } catch (err) {
      console.error('Mini-game 2 save failed:', err);
      // Continue even if save fails - for demo/screenshot purposes
    }
    router.push('/mini-game/3');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7f8]">
      <Header />
      <ProgressBar currentStep="mg2" />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <span className="text-sm font-semibold text-[#137fec] tracking-wide uppercase">Mini-Game 2</span>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mt-1 mb-3">Tension Identification</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            For each statement, identify the <span className="text-[#137fec] font-bold">two</span> stakeholders whose interests are most opposed.
          </p>
        </div>

        <div className="space-y-8">
          {TENSION_STATEMENTS.map((stmt) => {
            const selected = answers[stmt.id] || [];
            return (
              <div key={stmt.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mb-2">
                    <span className="material-symbols-outlined text-lg">format_quote</span>
                    Statement {stmt.id}: {stmt.title}
                  </div>
                  <p className="text-lg font-medium text-slate-800 leading-relaxed">{stmt.statement}</p>
                  <div className="mt-3 flex items-start gap-2 text-sm text-blue-700 bg-blue-50 p-3 rounded-lg">
                    <span className="material-symbols-outlined text-sm mt-0.5">lightbulb</span>
                    <span>{stmt.hint}</span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-slate-500 mb-4">Select 2 conflicting stakeholders ({selected.length}/2)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {STAKEHOLDER_META.map((sh) => {
                      const isSelected = selected.includes(sh.name);
                      return (
                        <button
                          key={sh.name}
                          onClick={() => toggleStakeholder(stmt.id, sh.name)}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${
                            isSelected
                              ? 'border-[#137fec] bg-blue-50 shadow-sm'
                              : 'border-slate-200 bg-white hover:border-[#137fec]/40'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`size-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-[#137fec] text-white' : 'bg-slate-100 text-slate-500'}`}>
                              <span className="material-symbols-outlined">{sh.icon}</span>
                            </div>
                            <div>
                              <span className="font-bold text-slate-800 block">{sh.name}</span>
                              <span className="text-xs text-slate-500">{sh.desc}</span>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="size-6 rounded-full bg-[#137fec] flex items-center justify-center">
                              <span className="material-symbols-outlined text-white text-sm">check</span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

        <div className="mt-8 flex justify-end">
          <button onClick={handleSubmit} className="px-8 py-3 rounded-lg bg-[#137fec] text-white font-bold hover:bg-blue-600 shadow-sm flex items-center gap-2 transition-all">
            <span>Confirm Selection</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </main>
    </div>
  );
}
