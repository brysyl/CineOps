import React from 'react';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#080a0f] text-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0b0e14] border-r border-[#262f3f] flex flex-col shrink-0">
        {/* Header / Logo Section */}
        <div className="p-6 border-b border-[#262f3f] flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0b0e14] border border-[#262f3f] flex items-center justify-center text-amber-500 shadow-sm shrink-0">
            <svg className="w-6 h-6" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 11H18C14.134 11 11 14.134 11 18V22C11 25.866 14.134 29 18 29H24" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M23 20H30M27 16L31 20L27 24" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-amber-500 text-base">CineOps AI</h1>
            <p className="text-[10px] text-gray-400 tracking-widest uppercase">Autonomous Control Room</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-4 py-6 flex-1 space-y-6">
          <div>
            <p className="px-3 text-[10px] font-semibold tracking-wider text-gray-500 uppercase mb-2">Operations</p>
            <nav className="space-y-1">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-[#1a2233] hover:text-amber-400 transition-colors"
              >
                <span>Studio Control Room</span>
              </Link>
              <Link
                href="/dashboard/diagnostics"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-amber-400 bg-[#1a2233] border border-amber-500/20 shadow-sm transition-colors"
              >
                <span>Gemini Agent & Diagnostics</span>
              </Link>
              <Link
                href="/dashboard/topology"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-[#1a2233] hover:text-amber-400 transition-colors"
              >
                <span>3D Cluster Topology</span>
              </Link>
              <Link
                href="/dashboard/history"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-[#1a2233] hover:text-amber-400 transition-colors"
              >
                <span>Incident History</span>
              </Link>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#080a0f] p-8">
        {children}
      </main>
    </div>
  );
}
