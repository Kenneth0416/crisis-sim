'use client';

const STEPS = [
  { id: 'login', label: 'Login' },
  { id: 'consent', label: 'Consent' },
  { id: 'mg1', label: 'Game 1' },
  { id: 'mg2', label: 'Game 2' },
  { id: 'mg3', label: 'Game 3' },
  { id: 'mg4', label: 'Game 4' },
  { id: 'briefing', label: 'Briefing' },
  { id: 's1', label: 'Scenario 1' },
  { id: 's2', label: 'Scenario 2' },
  { id: 's3', label: 'Scenario 3' },
  { id: 'board', label: 'Results' },
  { id: 'reflection', label: 'Reflect' },
  { id: 'finish', label: 'Done' },
];

export default function ProgressBar({ currentStep }: { currentStep: string }) {
  const currentIdx = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full bg-white border-b border-slate-200 px-4 py-3 overflow-x-auto">
      <div className="flex items-center gap-1 min-w-max mx-auto max-w-5xl">
        {STEPS.map((step, i) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
              i < currentIdx ? 'bg-green-100 text-green-700' :
              i === currentIdx ? 'bg-[#137fec] text-white' :
              'bg-slate-100 text-slate-400'
            }`}>
              {i < currentIdx ? (
                <span className="material-symbols-outlined text-sm">check</span>
              ) : (
                <span className="w-4 text-center">{i + 1}</span>
              )}
              <span className="hidden sm:inline">{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-4 h-px mx-0.5 ${i < currentIdx ? 'bg-green-300' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
