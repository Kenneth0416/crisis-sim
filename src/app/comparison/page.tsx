'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import Header from '@/components/Header';
import ProgressBar from '@/components/ProgressBar';

interface RankData {
  cohort_n: number;
  rank_econ: number;
  rank_env: number;
  rank_leg: number;
  rank_res: number;
}

const DIM_CONFIG = [
  { key: 'economy' as const, label: 'Economy', icon: 'attach_money', color: 'blue', bgColor: 'bg-blue-50', textColor: 'text-[#137fec]', rankKey: 'rank_econ' as const },
  { key: 'environment' as const, label: 'Environment', icon: 'eco', color: 'green', bgColor: 'bg-green-50', textColor: 'text-green-600', rankKey: 'rank_env' as const },
  { key: 'legitimacy' as const, label: 'Legitimacy', icon: 'gavel', color: 'purple', bgColor: 'bg-purple-50', textColor: 'text-purple-600', rankKey: 'rank_leg' as const },
  { key: 'resilience' as const, label: 'Resilience', icon: 'shield', color: 'orange', bgColor: 'bg-orange-50', textColor: 'text-orange-600', rankKey: 'rank_res' as const },
];

export default function ComparisonPage() {
  const router = useRouter();
  const store = useGameStore();
  const { sessionId, scores } = store;
  const [ranks, setRanks] = useState<RankData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) { router.replace('/login'); return; }
    useGameStore.getState().addEvent('page_enter', 'board', {});

    const submitAndFetch = async () => {
      try {
        const snapshot = useGameStore.getState();
        // Save session first
        await fetch('/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: snapshot.sessionId,
            student_id: snapshot.studentId,
            name: snapshot.studentName,
            start_time: new Date(snapshot.startTime).toISOString(),
            end_time: new Date().toISOString(),
            total_duration_ms: snapshot.getElapsedMs(),
            status: 'completed',
            mg1_result_json: JSON.stringify(snapshot.mg1Result),
            mg2_result_json: JSON.stringify(snapshot.mg2Result),
            mg3_result_json: JSON.stringify(snapshot.mg3Result),
            mg4_result_json: JSON.stringify(snapshot.mg4Result),
            s1_choice: snapshot.scenarioChoices[1] ?? 0,
            s2_choice: snapshot.scenarioChoices[2] ?? 0,
            s3_choice: snapshot.scenarioChoices[3] ?? 0,
            econ_total: snapshot.scores.economy,
            env_total: snapshot.scores.environment,
            leg_total: snapshot.scores.legitimacy,
            res_total: snapshot.scores.resilience,
            events: snapshot.events,
          }),
        });

        // Fetch ranks
        const res = await fetch(`/api/comparison?session_id=${snapshot.sessionId}`);
        const data = await res.json();
        setRanks(data);
      } catch (err) {
        console.error('Failed to fetch comparison data:', err);
        setRanks({ cohort_n: 1, rank_econ: 1, rank_env: 1, rank_leg: 1, rank_res: 1 });
      } finally {
        setLoading(false);
      }
    };

    submitAndFetch();
  }, [sessionId, router]);

  const totalScore = scores.economy + scores.environment + scores.legitimacy + scores.resilience;

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7f8]">
      <Header />
      <ProgressBar currentStep="board" />
      <main className="flex-1 px-4 py-8 lg:px-10">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-slate-900">Outcome Comparison Board</h1>
              <p className="text-slate-500 font-medium mt-1">
                {loading ? 'Loading results...' : `${ranks?.cohort_n || 0} students completed`}
              </p>
            </div>
            <button
              onClick={() => router.push('/reflection')}
              className="bg-[#137fec] hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm flex items-center gap-2"
            >
              Continue to Reflection
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <p className="text-slate-500 font-medium mb-1">Total Score</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900">{totalScore}</span>
                <span className="text-lg font-medium text-slate-400">/ 400</span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <p className="text-slate-500 font-medium mb-1">Cohort Size</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900">{loading ? '...' : ranks?.cohort_n}</span>
                <span className="text-lg font-medium text-slate-400">students</span>
              </div>
            </div>
          </div>

          {/* Dimension Breakdown */}
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#137fec]">bar_chart_4_bars</span>
              Dimension Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {DIM_CONFIG.map((dim) => {
                const score = scores[dim.key];
                const rank = ranks ? ranks[dim.rankKey] : '...';
                return (
                  <div key={dim.key} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`${dim.bgColor} p-2 rounded-lg ${dim.textColor}`}>
                        <span className="material-symbols-outlined">{dim.icon}</span>
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Rank #{rank}
                      </span>
                    </div>
                    <h4 className="text-slate-900 font-bold text-lg">{dim.label}</h4>
                    <div className="flex items-end gap-2 mt-1 mb-6">
                      <span className="text-3xl font-black text-slate-900">{score}</span>
                      <span className="text-sm text-slate-400 mb-1">/100</span>
                    </div>
                    <div className="mt-auto space-y-1">
                      <div className="flex justify-between text-xs font-medium text-slate-500">
                        <span>Your Score</span>
                        <span>{score}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div className="bg-[#137fec] h-2.5 rounded-full transition-all" style={{ width: `${score}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
