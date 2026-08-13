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
      <aside className="w-full md:w-64 bg-[#0b0e14] border-r border-[#262f3f] p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            {/* Unified Custom Logo */}
            <svg className="w-9 h-9 shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#121722" stroke="#262f3f" strokeWidth="1" />
              {/* Golden 'C' Shape */}
              <path d="M 21 9 C 15 9 11 12 11 16 C 11 20 15 23 21 23" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              {/* Blue Right Arrow */}
              <path d="M 16 16 H 24 M 21 13 L 24 16 L 21 19" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <div>
              <h1 className="text-sm font-bold text-gray-100 tracking-wide">CineOps AI</h1>
              <p className="text-[10px] text-gray-400">AUTONOMOUS CONTROL ROOM</p>
            </div>
          </div>

          <div className="space-y-1">
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
        </div>

        <div className="pt-6 border-t border-[#262f3f] text-[10px] text-gray-500">
          CineOps Enterprise v3.6
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#07090e]">
        {children}
      </main>
    </div>
  );
}
