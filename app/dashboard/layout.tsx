'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Studio Control Room', href: '/dashboard', icon: '🎛️' },
    { name: 'Gemini Agent & Diagnostics', href: '/dashboard/agent', icon: '🤖' },
    { name: '3D Cluster Topology', href: '/dashboard/topology', icon: '🌐' },
    { name: 'Incident History', href: '/dashboard/incidents', icon: '📋' },
  ];

  return (
    <div className="min-h-screen bg-[#080a0f] text-gray-100 flex flex-col md:flex-row font-sans">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0b0e14] border-b md:border-b-0 md:border-r border-gray-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🤖⚔️</span>
            <div>
              <h1 className="font-bold tracking-tight text-amber-500 text-base">CINECOPS AI</h1>
              <p className="text-[10px] text-gray-400 tracking-widest uppercase">Autonomous Control Room</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-3 mb-2">Operations</p>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm'
                      : 'text-gray-400 hover:bg-[#121620] hover:text-gray-200'
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="pt-6 border-t border-gray-800/80 text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Telemetry stream connected</span>
          </div>
          <p className="text-[10px] text-gray-400">Last sync: 14:35:32 UTC</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
