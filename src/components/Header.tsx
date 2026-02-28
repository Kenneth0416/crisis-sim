'use client';

import { useGameStore } from '@/lib/store';

export default function Header() {
  const studentName = useGameStore((s) => s.studentName);
  const initials = studentName
    ? studentName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '';

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 bg-white px-6 py-3 lg:px-10 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <div className="size-8 text-[#137fec] flex items-center justify-center bg-[#137fec]/10 rounded-lg">
          <span className="material-symbols-outlined text-2xl">emergency_home</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {studentName && (
          <>
            <span className="text-sm font-medium text-slate-500 hidden sm:block">{studentName}</span>
            <div className="size-9 rounded-full bg-[#137fec]/10 flex items-center justify-center text-[#137fec] font-bold text-sm">
              {initials}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
