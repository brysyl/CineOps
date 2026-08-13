'use client';

import React, { useState, useEffect } from 'react';

interface AgentLog {
  id: string;
  timestamp: string;
  agent: string;
  action: string;
  status: 'SUCCESS' | 'RUNNING' | 'FAILED';
  targetNode: string;
}

export default function AgentView() {
  const [logs, setLogs] = useState<AgentLog[]>([
    { id: 'LOG-8821', timestamp: '14:06:12', agent: 'CorridorGuardian-AI', action: 'Optimized VRAM allocation on render node', status: 'SUCCESS', targetNode: 'Node-04' },
    { id: 'LOG-8822', timestamp: '14:07:05', agent: 'ThermalSentinel', action: 'Throttled frame concurrency due to temperature spike', status: 'SUCCESS', targetNode: 'Node-12' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-amber-500">Agent Diagnostics</h1>
          <p className="text-zinc-400 text-sm mt-1">Real-time telemetry, reasoning logs, and autonomous multi-agent triggers.</p>
        </div>
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium rounded-full animate-pulse">
          Agents Active
        </span>
      </div>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Live Reasoning Stream</h2>
        <div className="space-y-3 font-mono text-xs">
          {logs.map((log) => (
            <div key={log.id} className="p-4 bg-zinc-950 border border-zinc-800/80 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-semibold">{log.agent}</span>
                  <span className="text-zinc-500">[{log.targetNode}]</span>
                  <span className="text-zinc-600">({log.timestamp})</span>
                </div>
                <p className="text-zinc-300 font-sans text-sm">{log.action}</p>
              </div>
              <div className="flex items-center gap-3 self-end md:self-center">
                <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px] rounded">
                  {log.id}
                </span>
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans text-xs rounded font-medium">
                  {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
