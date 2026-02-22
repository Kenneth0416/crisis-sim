'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';

export default function BriefingPage() {
  const router = useRouter();
  const { sessionId, addEvent } = useGameStore();

  useEffect(() => {
    if (!sessionId) { router.replace('/login'); return; }
    addEvent('page_enter', 'briefing', {});
  }, [sessionId, router, addEvent]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7f8]">
      <Header />
      <ProgressBar currentStep="briefing" />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-xl text-center space-y-8">
          <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Mini-Games Completed</h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              You have completed all four mini-games. In the next phase, you will face
              <strong className="text-slate-900"> three crisis scenarios </strong>
              where your decisions will directly impact the company across four dimensions:
              Economy, Environment, Legitimacy, and Resilience.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left">
            {[
              { icon: 'attach_money', label: 'Economy', color: 'blue' },
              { icon: 'eco', label: 'Environment', color: 'emerald' },
              { icon: 'gavel', label: 'Legitimacy', color: 'purple' },
              { icon: 'shield', label: 'Resilience', color: 'amber' },
            ].map((d) => (
              <div key={d.label} className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 px-3 py-2.5">
                <span className="material-symbols-outlined text-slate-500">{d.icon}</span>
                <span className="text-sm font-medium text-slate-700">{d.label}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push('/scenario/1')}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-[#137fec] text-white font-bold hover:bg-blue-600 shadow-sm transition-all"
          >
            Enter Scenario Phase
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </main>
    </div>
  );
}
