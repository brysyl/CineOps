import Link from 'next/link';
import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 font-sans selection:bg-amber-500/30">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          {/* Unified Custom Logo */}
          <svg className="w-8 h-8 shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="#121722" stroke="#262f3f" strokeWidth="1" />
            <path d="M 21 9 C 15 9 11 12 11 16 C 11 20 15 23 21 23" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M 16 16 H 24 M 21 13 L 24 16 L 21 19" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <div className="font-bold tracking-widest text-sm flex gap-1">
            <span>CINEOPS</span>
            <span className="text-amber-500">AI</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-xs text-gray-400 font-medium">
          <Link href="#" className="hover:text-gray-100 transition-colors">Signal coverage</Link>
          <Link href="#" className="hover:text-gray-100 transition-colors">How it works</Link>
          <Link href="#" className="hover:text-gray-100 transition-colors">Audit trail</Link>
        </div>

        <Link href="/dashboard" className="px-5 py-2.5 rounded-full border border-[#262f3f] bg-[#0b0e14] hover:bg-[#121722] text-xs font-semibold transition-colors flex items-center gap-2">
          Open control room <span>↗</span>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 md:px-8 pt-16 md:pt-20 pb-24 md:pb-32 flex flex-col xl:flex-row items-center gap-16 w-full">
        {/* Left Content */}
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/30 border border-emerald-900/50 text-[10px] font-bold text-emerald-400 tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            AUTONOMOUS SYSTEMS ONLINE
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
            Keep the <br /> frame <br /> <span className="text-amber-500">moving.</span>
          </h1>
          
          <p className="text-gray-400 text-sm md:text-base max-w-md leading-relaxed">
            CineOps AI turns noisy telemetry into decisive action for VFX render farms, LED volumes, and digital cinema pipelines. Diagnose. Remediate. Keep production on schedule.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Link href="/dashboard" className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10">
              Launch Studio Control Room <span>↗</span>
            </Link>
            {/* FIXED: Converted button to Link routing directly to diagnostics */}
            <Link href="/dashboard/diagnostics" className="w-full sm:w-auto px-8 py-3.5 rounded-lg border border-[#262f3f] bg-[#0b0e14] hover:bg-[#121722] text-sm font-semibold transition-colors flex items-center justify-center gap-2">
              <span className="text-emerald-500">▶</span> Watch agent reasoning
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 pt-6 text-[10px] font-bold tracking-wider text-gray-400 uppercase">
            <div className="flex items-center gap-2"><span className="text-emerald-500 text-sm">✓</span> GPU VRAM LEAKS</div>
            <div className="flex items-center gap-2"><span className="text-emerald-500 text-sm">✓</span> RENDER WORKER FAILURES</div>
            <div className="flex items-center gap-2"><span className="text-emerald-500 text-sm">✓</span> ASSET DEPENDENCY DRIFT</div>
            <div className="flex items-center gap-2"><span className="text-emerald-500 text-sm">✓</span> THERMAL THROTTLING</div>
          </div>
        </div>

        {/* Right Content / Dashboard Mockup */}
        <div className="flex-1 relative w-full max-w-lg lg:max-w-xl mx-auto">
          <div className="bg-[#0b0e14] border border-[#262f3f] rounded-2xl p-6 md:p-8 shadow-2xl relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-1">Live Studio Telemetry</p>
                <h3 className="text-sm font-bold text-gray-200">Virtual Production / Stage 03</h3>
              </div>
              <div className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> HEALTHY
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[#07090e] border border-[#262f3f] rounded-xl p-4">
                <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold mb-2">
                   <span className="text-amber-500">⚡</span> <span className="text-emerald-400">+4.2%</span>
                </div>
                <div className="text-xl font-bold">78.4%</div>
                <div className="text-[10px] text-gray-500 font-mono mt-1 uppercase">GPU CLUSTER</div>
              </div>
              <div className="bg-[#07090e] border border-[#262f3f] rounded-xl p-4">
                <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold mb-2">
                   <span className="text-emerald-500">🖧</span> <span className="text-emerald-400">97.5%</span>
                </div>
                <div className="text-xl font-bold">28 / 32</div>
                <div className="text-[10px] text-gray-500 font-mono mt-1 uppercase">ACTIVE NODES</div>
              </div>
              <div className="bg-[#07090e] border border-[#262f3f] rounded-xl p-4">
                <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold mb-2">
                   <span className="text-amber-500">⚠️</span> <span className="text-emerald-400">This week</span>
                </div>
                <div className="text-xl font-bold">1,284</div>
                <div className="text-[10px] text-gray-500 font-mono mt-1 uppercase">ALERT ACTIONS</div>
              </div>
              <div className="bg-[#07090e] border border-[#262f3f] rounded-xl p-4">
                <div className="flex justify-between items-center text-[10px] text-gray-500 font-bold mb-2">
                   <span className="text-emerald-500">💰</span> <span className="text-emerald-400">This month</span>
                </div>
                <div className="text-xl font-bold">$42.8k</div>
                <div className="text-[10px] text-gray-500 font-mono mt-1 uppercase">DOWNTIME SAVED</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400">Frame render throughput</span>
                <span className="text-[10px] font-bold text-emerald-400">+18.6%</span>
              </div>
              <div className="flex items-end gap-1.5 h-24">
                {[30, 45, 35, 50, 40, 60, 55, 70, 65, 80, 75, 90, 85, 100, 95, 85, 75, 80, 65, 50, 40].map((h, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-sm opacity-90 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }}></div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-gray-600 font-mono">
                <span>12:00</span>
                <span>14:00</span>
                <span>16:00</span>
                <span>NOW</span>
              </div>
            </div>
          </div>

          {/* Floating Intervention Pill */}
          <div className="absolute -bottom-5 -left-4 md:-left-8 z-20 bg-[#121722] border border-[#262f3f] rounded-lg p-3 shadow-2xl flex items-center gap-3">
            <span className="text-blue-400 text-lg">↪</span>
            <div>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">LAST INTERVENTION</p>
              <p className="text-xs font-bold text-gray-200">Node-04 remediated in 1.4s</p>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-[#0b0e14] border-t border-[#262f3f]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-20 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#121722] border border-[#262f3f] flex items-center justify-center text-amber-500 mb-4 text-lg">
              📊
            </div>
            <h4 className="text-sm font-bold text-gray-200 mb-2">See the signal</h4>
            <p className="text-xs text-gray-400 leading-relaxed pr-4">
              Unify Grafana metrics, Loki logs, and trace context into one operating picture.
            </p>
          </div>
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#121722] border border-[#262f3f] flex items-center justify-center text-amber-500 mb-4 text-lg">
              🧠
            </div>
            <h4 className="text-sm font-bold text-gray-200 mb-2">Think in context</h4>
            <p className="text-xs text-gray-400 leading-relaxed pr-4">
              Gemini Enterprise connects symptoms across workers, assets, engines, and stages.
            </p>
          </div>
          <div>
            <div className="w-10 h-10 rounded-lg bg-[#121722] border border-[#262f3f] flex items-center justify-center text-amber-500 mb-4 text-lg">
              🛡️
            </div>
            <h4 className="text-sm font-bold text-gray-200 mb-2">Act without waiting</h4>
            <p className="text-xs text-gray-400 leading-relaxed pr-4">
              Execute safe, auditable remediation routines before a missed frame becomes a missed day.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#07090e] max-w-7xl mx-auto px-6 md:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-500 font-mono">
        <div>© 2026 CineOps AI - Autonomous telemetry for modern production</div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Systems nominal
        </div>
      </footer>
    </div>
  );
}
