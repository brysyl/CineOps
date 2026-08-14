'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  Thermometer, 
  Send, 
  CheckCircle2, 
  RefreshCw,
  BellRing,
  Layers
} from 'lucide-react';

interface Job {
  id: string;
  name: string;
  engine: string;
  status: 'PROCESSING' | 'QUEUED' | 'COMPLETED' | 'HALTED';
  statusColor: string;
  output: string;
  frames: string;
  node: string;
  progress: number;
  barColor: string;
}

const INITIAL_JOBS: Job[] = [
  {
    id: 'JOB-9402',
    name: 'Anamorphic Lens Flare Render',
    engine: 'Octane v2024.1',
    status: 'PROCESSING',
    statusColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    output: 'EXR 16-bit Uncompressed',
    frames: '120 / 480 frames',
    node: 'node-alpha-01',
    progress: 45,
    barColor: 'bg-emerald-500',
  },
  {
    id: 'JOB-9403',
    name: 'Thermal Depth Pass Optimization',
    engine: 'Redshift 3.5',
    status: 'QUEUED',
    statusColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    output: 'ProRes 4444 XQ',
    frames: '0 / 1200 frames',
    node: 'node-beta-04',
    progress: 0,
    barColor: 'bg-amber-500',
  },
  {
    id: 'JOB-9401',
    name: 'Color Grade & Grain Injection',
    engine: 'DaVinci Resolve Studio',
    status: 'COMPLETED',
    statusColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    output: 'DNxHR HQX',
    frames: '2400 / 2400 frames',
    node: 'node-gamma-02',
    progress: 100,
    barColor: 'bg-cyan-500',
  },
  {
    id: 'JOB-9400',
    name: 'Optical Flow Motion Vector',
    engine: 'NukeX 15.0',
    status: 'PROCESSING',
    statusColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    output: 'OpenEXR Sequence',
    frames: '820 / 1000 frames',
    node: 'node-alpha-02',
    progress: 82,
    barColor: 'bg-emerald-500',
  },
];

export default function DashboardControl() {
  const [activeJobs, setActiveJobs] = useState<Job[]>(INITIAL_JOBS);
  const [slackSending, setSlackSending] = useState(false);
  const [slackSent, setSlackSent] = useState(false);
  const [isLive, setIsLive] = useState(true);

  // Live simulation tick for progress bars
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setActiveJobs((prev) =>
        prev.map((job) => {
          if (job.status === 'PROCESSING' && job.progress < 100) {
            const nextProgress = Math.min(job.progress + 3, 100);
            const completed = nextProgress === 100;
            return {
              ...job,
              progress: nextProgress,
              status: completed ? 'COMPLETED' : 'PROCESSING',
              statusColor: completed
                ? 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'
                : job.statusColor,
              barColor: completed ? 'bg-cyan-500' : job.barColor,
            };
          }
          return job;
        })
      );
    }, 1800);

    return () => clearInterval(interval);
  }, [isLive]);

  // Dispatch live alert to Slack incoming webhook endpoint
  const sendSlackAlert = async () => {
    setSlackSending(true);
    setSlackSent(false);

    try {
      // Endpoint trigger or route handler call
      await fetch('/api/alerts/slack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: '#cineops-telemetry',
          message: '🚨 CineOps Alert: All 4 Cluster Nodes operating at NOMINAL parameters.',
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => null); // Fallback gracefully if route is mock
    } finally {
      setTimeout(() => {
        setSlackSending(false);
        setSlackSent(true);
        setTimeout(() => setSlackSent(false), 4000);
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e18] text-gray-100 p-4 md:p-8 font-sans selection:bg-emerald-500/30">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1b2438]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
              CineOps // Control Panel
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE TELEMETRY
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1 font-mono">
            Pipeline Orchestration & Real-time Node Diagnostics
          </p>
        </div>

        {/* SLACK LIVE ALERT TRIGGER */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLive(!isLive)}
            className="p-2 rounded-lg border border-[#1b2438] bg-[#0a0e18] hover:bg-[#141b2e] text-gray-400 transition-colors text-xs font-mono flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLive ? 'animate-spin text-emerald-400' : ''}`} />
            {isLive ? 'PAUSE TICK' : 'RESUME TICK'}
          </button>

          <button
            onClick={sendSlackAlert}
            disabled={slackSending}
            className="px-4 py-2 rounded-lg bg-[#1b2438] hover:bg-[#25324e] border border-cyan-500/30 text-cyan-300 font-mono text-xs flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            {slackSending ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : slackSent ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            {slackSending ? 'DISPATCHING...' : slackSent ? 'SLACK NOTIFIED' : 'TRIGGER SLACK ALERT'}
          </button>
        </div>
      </header>

      {/* 4 NOMINALS METRIC GRID */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        
        {/* NOMINAL 1: Core Thermal Status */}
        <div className="bg-[#0e1424] border border-[#1b2438] p-4 rounded-xl relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400">CORE THERMALS</span>
            <Thermometer className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white">38.4°C</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold tracking-wider">
              NOMINAL
            </span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-gray-500">Threshold: &lt; 78.0°C Max</div>
        </div>

        {/* NOMINAL 2: System Load */}
        <div className="bg-[#0e1424] border border-[#1b2438] p-4 rounded-xl relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400">CLUSTER LOAD</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white">24.2%</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold tracking-wider">
              NOMINAL
            </span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-gray-500">128 vCPUs Active</div>
        </div>

        {/* NOMINAL 3: Node Topology */}
        <div className="bg-[#0e1424] border border-[#1b2438] p-4 rounded-xl relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400">NODE TOPOLOGY</span>
            <Layers className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white">04 / 04</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold tracking-wider">
              NOMINAL
            </span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-gray-500">Zero Node Drops</div>
        </div>

        {/* NOMINAL 4: Slack Dispatch Relay */}
        <div className="bg-[#0e1424] border border-[#1b2438] p-4 rounded-xl relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-400">SLACK RELAY</span>
            <BellRing className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white">12ms</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold tracking-wider">
              NOMINAL
            </span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-gray-500">Webhook Connection OK</div>
        </div>

      </section>

      {/* JOBS DASHBOARD TABLE */}
      <section className="bg-[#0e1424] border border-[#1b2438] rounded-xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-[#1b2438] flex items-center justify-between">
          <h2 className="text-sm font-mono font-bold tracking-wider text-gray-200">
            ACTIVE PIPELINE JOBS
          </h2>
          <span className="text-xs font-mono text-gray-400">
            Showing {activeJobs.length} active threads
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1b2438] bg-[#0a0e18]/50 text-gray-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Job / ID</th>
                <th className="py-3 px-4 font-semibold">Engine</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Output / Frames</th>
                <th className="py-3 px-4 font-semibold">Assigned Node</th>
                <th className="py-3 px-4 font-semibold text-right">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b2438] text-xs font-sans">
              {activeJobs.map((job) => (
                <tr key={job.id} className="hover:bg-[#141b2e] transition-colors group">
                  
                  {/* Name & ID */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {job.name}
                    </div>
                    <div className="text-[10px] font-mono text-gray-500 mt-0.5">{job.id}</div>
                  </td>

                  {/* Engine */}
                  <td className="py-3.5 px-4 font-mono text-gray-300">
                    {job.engine}
                  </td>

                  {/* Status Tag */}
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${job.statusColor}`}>
                      {job.status}
                    </span>
                  </td>

                  {/* Output & Frames */}
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-gray-200">{job.output}</div>
                    <div className="text-[10px] font-mono text-gray-500 mt-0.5">{job.frames}</div>
                  </td>

                  {/* Node */}
                  <td className="py-3.5 px-4 font-mono text-gray-300">
                    {job.node}
                  </td>

                  {/* Animated Progress Bar */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-3 font-mono text-gray-300">
                      <span className="w-10 text-right">{job.progress}%</span>
                      <div className="w-20 bg-[#0a0e18] h-1.5 rounded-full overflow-hidden border border-[#1b2438]">
                        <div
                          className={`h-full ${job.barColor} transition-all duration-500 ease-out`}
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}



