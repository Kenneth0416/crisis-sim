'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { SCENARIOS } from '@/lib/game-data';
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';

const DOT_COLORS: Record<string, string> = {
  red: 'text-red-500',
  amber: 'text-amber-500',
  green: 'text-green-500',
  purple: 'text-purple-500',
  slate: 'text-slate-500',
  orange: 'text-orange-500',
  blue: 'text-blue-500',
};

export default function ScenarioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const scenarioId = parseInt(id);
  const scenario = SCENARIOS[scenarioId - 1];
  const router = useRouter();
  const { sessionId, setScenarioChoice, addEvent } = useGameStore();
  const [selectedAction, setSelectedAction] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');
  const enterTime = useRef(Date.now());

  const stepId = `s${scenarioId}` as 's1' | 's2' | 's3';

  useEffect(() => {
    if (!sessionId) { router.replace('/login'); return; }
    addEvent('page_enter', stepId, {});
    enterTime.current = Date.now();
    setSelectedAction(null);
    setConfirmed(false);
  }, [sessionId, router, addEvent, stepId]);

  if (!scenario) return <div className="p-8 text-center text-red-600">Scenario not found</div>;

  const handleConfirm = () => {
    if (selectedAction === null) { setError('Please select an action before confirming.'); return; }
    const action = scenario.actions.find((a) => a.id === selectedAction)!;
    const duration = Date.now() - enterTime.current;
    setScenarioChoice(scenarioId, selectedAction, action.scores);
    addEvent('action_select', stepId, {
      action_id: selectedAction,
      action_name: action.name,
      scores_delta: action.scores,
      duration_ms: duration,
    });
    setConfirmed(true);

    setTimeout(() => {
      if (scenarioId < 3) {
        router.push(`/scenario/${scenarioId + 1}`);
      } else {
        router.push('/comparison');
      }
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7f8]">
      <Header />
      <ProgressBar currentStep={stepId} />
      <main className="flex-1 flex flex-col items-center w-full px-4 md:px-10 py-8 max-w-[1440px] mx-auto">
        <div className="w-full max-w-5xl mb-8 space-y-4">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{scenario.title}</h1>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500" />
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-2">Situation Report</h3>
                <p className="text-slate-700 text-lg leading-relaxed">{scenario.description}</p>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full text-[#137fec] text-xs font-bold">
                <span className="material-symbols-outlined text-sm">flag</span>
                {scenario.subtitle}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-24">
          {scenario.actions.map((action) => {
            const isSelected = selectedAction === action.id;
            return (
              <label key={action.id} className="group relative flex flex-col h-full cursor-pointer">
                <input
                  className="peer sr-only"
                  name="decision"
                  type="radio"
                  value={action.id}
                  checked={isSelected}
                  onChange={() => { setSelectedAction(action.id); setError(''); }}
                  disabled={confirmed}
                />
                <div className={`flex flex-col h-full bg-white border rounded-xl p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${
                  isSelected ? 'ring-2 ring-[#137fec] border-[#137fec] bg-blue-50/30' : 'border-slate-200'
                } ${confirmed ? 'opacity-70 pointer-events-none' : ''}`}>
                  <div className="flex justify-end items-start mb-4">
                    <span className="material-symbols-outlined text-slate-400">{action.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight">{action.name}</h3>
                  <div className="space-y-4 flex-1">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Consequences</p>
                      <ul className="text-sm text-slate-600 space-y-1">
                        {action.consequences.map((c, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className={`${DOT_COLORS[action.consequenceColors[i]]} text-[10px] mt-1`}>●</span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Reaction</p>
                      <div className="flex items-center gap-2 text-sm text-slate-700 bg-slate-100 rounded px-2 py-1.5">
                        <span className="material-symbols-outlined text-base">{action.reactionIcon}</span>
                        <span>{action.reaction}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end">
                    <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-[#137fec] border-[#137fec]' : 'border-slate-300'
                    }`}>
                      {isSelected && <span className="material-symbols-outlined text-white text-[16px]">check</span>}
                    </div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 md:px-10">
          <div className="hidden md:flex items-center gap-2 text-slate-500 text-sm">
            <span className="material-symbols-outlined text-base">info</span>
            <span>{confirmed ? 'Decision confirmed! Moving to next phase...' : 'Select an action above to proceed.'}</span>
          </div>
          {error && <span className="text-red-600 text-sm">{error}</span>}
          <button
            className="w-full md:w-auto ml-auto flex items-center justify-center gap-2 rounded-lg h-12 px-8 bg-[#137fec] hover:bg-blue-600 text-white text-base font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleConfirm}
            disabled={confirmed || selectedAction === null}
          >
            <span>{confirmed ? 'Confirmed' : 'Confirm Decision'}</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
