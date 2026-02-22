'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/lib/store';
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';

export default function FinishPage() {
  const { sessionId, addEvent, getElapsedMs } = useGameStore();

  useEffect(() => {
    if (sessionId) {
      addEvent('finish', 'finish', { total_duration_ms: getElapsedMs() });

      // Final event flush
      const store = useGameStore.getState();
      fetch('/api/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: store.sessionId,
          events: store.events,
        }),
      }).catch(console.error);
    }
  }, [sessionId, addEvent, getElapsedMs]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7f8]">
      <Header />
      <ProgressBar currentStep="finish" />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 md:p-16 text-center flex flex-col items-center justify-center max-w-lg">
          <div className="rounded-full bg-green-100 p-4 mb-6 ring-8 ring-green-50">
            <span className="material-symbols-outlined text-5xl text-green-600">check_circle</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Simulation Complete</h2>
          <p className="text-slate-600 text-lg mb-8">
            Thank you! Your responses have been recorded. You have successfully completed the Corporate Crisis Management module.
          </p>
          <p className="text-sm text-slate-400">
            You may now close this window.
          </p>
        </div>
      </main>
    </div>
  );
}
