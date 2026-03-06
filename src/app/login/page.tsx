'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const initSession = useGameStore((s) => s.initSession);
  const addEvent = useGameStore((s) => s.addEvent);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Please enter your student name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your NTU email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    initSession(name.trim(), name.trim(), email.trim());
    addEvent('login_submit', 'login', { name: name.trim(), email: email.trim() });
    if (consent) {
      router.push('/consent');
    } else {
      router.push('/consent');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f7f8]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 bg-white px-6 py-4 lg:px-10">
        <div className="flex items-center gap-4">
          <div className="size-8 flex items-center justify-center text-[#137fec]">
            <span className="material-symbols-outlined text-3xl">emergency</span>
          </div>
          <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-tight">Crisis Sim</h2>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Column */}
          <div className="hidden lg:flex flex-col justify-between rounded-xl overflow-hidden bg-slate-900 relative min-h-[600px] shadow-xl">
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#137fec]/30 to-slate-900/90" />
            <div className="relative z-10 p-10 flex flex-col h-full justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#137fec] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#137fec]" />
                  </span>
                  Live Simulation Environment
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                  Master the Art of <br /> Crisis Management.
                </h1>
                <p className="text-lg text-slate-300 max-w-md">
                  Navigate complex corporate scenarios, make critical decisions under pressure, and compare your performance metrics against your classmates.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6 mt-12">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <span className="material-symbols-outlined text-[#137fec] mb-2 text-3xl">psychology</span>
                  <h3 className="text-white font-bold">Decision Making</h3>
                  <p className="text-slate-400 text-sm mt-1">Real-time consequence analysis based on your choices.</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <span className="material-symbols-outlined text-[#137fec] mb-2 text-3xl">analytics</span>
                  <h3 className="text-white font-bold">Performance Analytics</h3>
                  <p className="text-slate-400 text-sm mt-1">Detailed breakdown of leadership &amp; resolution skills.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-8 px-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center size-8 rounded-full bg-[#137fec] text-white text-sm font-bold">1</div>
                <span className="text-sm font-semibold text-slate-900">Login</span>
              </div>
              <div className="h-px w-8 bg-slate-300" />
              <div className="flex items-center gap-2 opacity-50">
                <div className="flex items-center justify-center size-8 rounded-full bg-slate-200 text-slate-500 text-sm font-bold">2</div>
                <span className="text-sm font-medium text-slate-500">Consent</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sm:p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome</h2>
                <p className="text-slate-500">Enter your details to begin the simulation.</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
              )}

              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">1. Student Name (as shown on Matric card)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-[20px]">person</span>
                      </div>
                      <input
                        className="block w-full pl-10 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-[#137fec] focus:ring-[#137fec] focus:outline-none sm:text-sm py-3"
                        id="name"
                        placeholder="e.g. Tan Kim Seng"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">2. Student's NTU email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-[20px]">mail</span>
                      </div>
                      <input
                        className="block w-full pl-10 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-[#137fec] focus:ring-[#137fec] focus:outline-none sm:text-sm py-3"
                        id="email"
                        placeholder="e.g. tan1234e@ntu.edu.sg"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    className="w-full flex justify-center items-center gap-2 rounded-lg bg-[#137fec] px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#137fec] transition-all active:scale-[0.98]"
                    type="button"
                    onClick={handleSubmit}
                  >
                    Start Simulation
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
