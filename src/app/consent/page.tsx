'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';

export default function ConsentPage() {
  const router = useRouter();
  const { sessionId, setConsent, addEvent } = useGameStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!sessionId) { router.replace('/login'); return; }
    addEvent('page_enter', 'consent', {});
  }, [sessionId, router, addEvent]);

  const handleContinue = () => {
    setConsent(checked);
    addEvent('consent_submit', 'consent', { consent: checked });
    router.push('/mini-game/1');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7f8]">
      <Header />
      <ProgressBar currentStep="consent" />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 sm:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#137fec]/10 rounded-lg text-[#137fec]">
                <span className="material-symbols-outlined text-2xl">info</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Research Data Notice</h2>
            </div>

            <div className="space-y-4 text-slate-600 leading-relaxed mb-8">
              <p>
                Welcome to the Crisis Management Simulation. Before you begin, please read the following information about data collection:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your <strong>gameplay decisions</strong> and <strong>timing metrics</strong> will be recorded during this session.</li>
                <li>All data is collected for <strong>academic research and teaching purposes only</strong>.</li>
                <li>Data will be <strong>anonymized and aggregated</strong> for comparative analysis.</li>
                <li>Your individual responses will not be shared publicly.</li>
              </ul>
            </div>

            <label className="flex items-start gap-3 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer group mb-8">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                className="mt-1 size-4 rounded border-slate-300 text-[#137fec] focus:ring-[#137fec] cursor-pointer"
              />
              <span className="text-sm font-medium text-slate-700 group-hover:text-[#137fec] transition-colors">
                I understand that my gameplay data will be used for research purposes.
              </span>
            </label>

            <button
              className="w-full flex justify-center items-center gap-2 rounded-lg bg-[#137fec] px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 transition-all active:scale-[0.98]"
              type="button"
              onClick={handleContinue}
            >
              Continue to Simulation
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
