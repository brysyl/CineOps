'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Studio Control Room', href: '/dashboard' },
    { name: 'Gemini Agent & Diagnostics', href: '/dashboard/diagnostics' },
    { name: '3D Cluster Topology', href: '/dashboard/topology' },
    { name: 'Incident History', href: '/dashboard/history' },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-gray-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0b0e14] border-r border-[#262f3f] p-6 flex flex-col shrink-0">
        <div className="flex flex-col h-full space-y-8">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            {/* Unified Custom Logo SVG */}
            <svg className="w-9 h-9 shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#121722" stroke="#262f3f" strokeWidth="1" />
              <path d="M 21 9 C 15 9 11 12 11 16 C 11 20 15 23 21 23" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 16 16 H 24 M 21 13 L 24 16 L 21 19" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <div>
              <h1 className="text-sm font-bold text-gray-100 tracking-wide">CineOps AI</h1>
              <p className="text-[10px] text-gray-400 uppercase">Autonomous Control</p>
            </div>
          </div>

          {/* Core Navigation - flex-grow pushes exit section down */}
          <div className="flex-grow space-y-1">
            <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase px-3 pb-2">Operations</p>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#121722]'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* EXIT ROOM SECTION */}
          <div className="pt-6 border-t border-[#262f3f]">
            <Link 
              href="/" 
              className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-semibold text-rose-400 bg-rose-950/40 border border-rose-900/60 hover:bg-rose-900 hover:text-rose-300 transition-colors shadow-inner"
            >
              {/* Exit/Logout Icon */}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Terminate Control Session
            </Link>
          </div>

          {/* Sidebar Footer */}
          <div className="text-[10px] text-gray-600 font-mono">
            CineOps Enterprise v3.6
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#07090e]">
        {children}
      </main>
    </div>
  );
}
