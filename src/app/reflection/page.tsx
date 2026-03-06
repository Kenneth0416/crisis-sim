'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { REFLECTION_QUESTIONS, SCENARIOS } from '@/lib/game-data';
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';

export default function ReflectionPage() {
  const router = useRouter();
  const { sessionId, addEvent, scenarioChoices, scores } = useGameStore();
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [texts, setTexts] = useState<Record<number, string>>({});
  const [openText, setOpenText] = useState('');
  const [errorFields, setErrorFields] = useState<Set<string>>(new Set());
  const qRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!sessionId && process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') { router.replace('/login'); return; }
    addEvent('page_enter', 'reflection', {});
  }, [sessionId, router, addEvent]);

  const clearField = (key: string) => {
    setErrorFields((prev) => { const n = new Set(prev); n.delete(key); return n; });
  };

  const handleSubmit = async () => {
    const missing = new Set<string>();
    for (const q of REFLECTION_QUESTIONS) {
      if (!ratings[q.id]) missing.add(`rating-${q.id}`);
      if (!texts[q.id]?.trim()) missing.add(`text-${q.id}`);
    }
    if (!openText.trim()) missing.add('open-text');
    if (missing.size > 0) {
      setErrorFields(missing);
      const firstKey = Array.from(missing)[0];
      const el = qRefs.current[firstKey];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setErrorFields(new Set());
    addEvent('reflection_submit', 'reflection', { ratings, texts, open_text: openText });
    try {
      const store = useGameStore.getState();
      await fetch('/api/session', { method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: store.sessionId,
          ref_q1: ratings[1] || 0, ref_q1_text: texts[1] || '', ref_q2: ratings[2] || 0, ref_q2_text: texts[2] || '',
          ref_q3: ratings[3] || 0, ref_q3_text: texts[3] || '', ref_q4: ratings[4] || 0, ref_q4_text: texts[4] || '',
          ref_q5: ratings[5] || 0, ref_q5_text: texts[5] || '', ref_q6: ratings[6] || 0, ref_q6_text: texts[6] || '',
          ref_open_text: openText }) });
    } catch (err) { console.error('Failed to save reflection:', err); }
    router.push('/finish');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7f8]">
      <Header />
      <ProgressBar currentStep="reflection" />
      <main className="flex-grow p-6 lg:px-40 lg:py-12 flex justify-center">
        <div className="w-full max-w-3xl space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Final Reflection</h2>
            <p className="text-slate-500 max-w-xl mx-auto mt-2">Take a moment to analyze your performance and document key takeaways.</p>
            <p className="text-red-500 text-xs font-medium mt-1">* All fields are required</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#137fec]">summarize</span>Summary of Your Key Decisions
            </h3>
            <div className="space-y-3">
              {[1, 2, 3].map((sId) => {
                const choice = scenarioChoices[sId]; const scenario = SCENARIOS.find(s => s.id === sId);
                const action = scenario?.actions.find(a => a.id === choice);
                return scenario && action ? (
                  <div key={sId} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <span className="material-symbols-outlined text-[#137fec]">{action.icon}</span>
                    <div><span className="text-sm font-semibold text-slate-800">{scenario.title}:</span><span className="text-sm text-slate-600 ml-1">{action.name}</span></div>
                  </div>) : null;
              })}
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {(['economy', 'environment', 'legitimacy', 'resilience'] as const).map((dim) => (
                <div key={dim} className="text-center p-2 bg-slate-50 rounded-lg">
                  <div className="text-xs text-slate-500 capitalize">{dim}</div>
                  <div className="text-lg font-bold text-slate-900">{scores[dim]}</div>
                </div>))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 space-y-8">
              {REFLECTION_QUESTIONS.map((q) => {
                const ratingErr = errorFields.has(`rating-${q.id}`);
                const textErr = errorFields.has(`text-${q.id}`);
                return (
                  <div key={q.id} className="space-y-4">
                    <label className="block text-lg font-semibold text-slate-900">{q.id}. {q.question} <span className="text-red-500">*</span></label>
                    <p className="text-sm text-slate-500">Rate from 1 ({q.low}) to 9 ({q.high})</p>
                    <div ref={(el) => { qRefs.current[`rating-${q.id}`] = el; }}
                      className={`flex w-full p-1 rounded-lg transition-colors ${ratingErr ? 'bg-red-50 ring-2 ring-red-300' : 'bg-slate-50'}`}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((val) => (
                        <label key={val} className="flex-1 cursor-pointer group">
                          <input type="radio" name={`q${q.id}`} value={val} checked={ratings[q.id] === val}
                            onChange={() => { setRatings((p) => ({ ...p, [q.id]: val })); clearField(`rating-${q.id}`); }} className="peer sr-only" />
                          <div className="h-10 w-full flex items-center justify-center rounded text-sm font-medium text-slate-500 transition-all peer-checked:bg-white peer-checked:text-[#137fec] peer-checked:shadow-sm peer-checked:ring-1 peer-checked:ring-slate-200 group-hover:bg-slate-200 group-hover:text-slate-700">{val}</div>
                        </label>))}
                    </div>
                    {ratingErr && <p className="text-xs text-red-500">Please select a rating.</p>}
                    <div ref={(el) => { qRefs.current[`text-${q.id}`] = el; }}>
                      <textarea className={`w-full rounded-lg border bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-[#137fec] focus:ring-[#137fec] sm:text-sm p-3 transition-colors ${textErr ? 'border-red-300 ring-2 ring-red-300' : 'border-slate-200'}`}
                        placeholder="Explain your rating..." rows={2} value={texts[q.id] || ''}
                        onChange={(e) => { setTexts((p) => ({ ...p, [q.id]: e.target.value })); clearField(`text-${q.id}`); }} />
                      {textErr && <p className="text-xs text-red-500 mt-1">Please explain your rating.</p>}
                    </div>
                    {q.id < REFLECTION_QUESTIONS.length && <div className="h-px bg-slate-100 w-full" />}
                  </div>);
              })}
              <div className="h-px bg-slate-100 w-full" />
              <div className="space-y-4" ref={(el) => { qRefs.current['open-text'] = el; }}>
                <label className="block text-lg font-semibold text-slate-900">7. What suggestions do you have for improving this game? <span className="text-red-500">*</span></label>
                <textarea className={`w-full rounded-lg border bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-[#137fec] focus:ring-[#137fec] sm:text-sm p-3 transition-colors ${errorFields.has('open-text') ? 'border-red-300 ring-2 ring-red-300' : 'border-slate-200'}`}
                  placeholder="Share your suggestions here..." rows={4} value={openText}
                  onChange={(e) => { setOpenText(e.target.value); clearField('open-text'); }} />
                {errorFields.has('open-text') && <p className="text-xs text-red-500">Please share your suggestions.</p>}
              </div>
            </div>
            {errorFields.size > 0 && (
              <div className="px-6 pb-4 flex items-center gap-2 text-red-600 text-sm">
                <span className="material-symbols-outlined text-base">error</span>Please complete all required fields before submitting.
              </div>)}
            <div className="bg-slate-50 px-6 py-4 flex justify-end border-t border-slate-200">
              <button onClick={handleSubmit} className="inline-flex items-center justify-center rounded-lg bg-[#137fec] px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 transition-colors">Submit &amp; Finish</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
