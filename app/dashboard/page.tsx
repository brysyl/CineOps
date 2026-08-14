'use client';

import React, { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isTriggered, setIsTriggered] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Dynamic Telemetry States
  const [gpuUtil, setGpuUtil] = useState(78.4);
  const [vram, setVram] = useState(312.8);
  const [gpuTemp, setGpuTemp] = useState(67);
  const [queueFrames, setQueueFrames] = useState(4860);

  // 32 Node baseline setup
  const defaultNodeStatus = Array(32).fill('healthy').map((_, i) => {
    if ([24, 26, 29, 30].includes(i)) return 'warning';
    return 'healthy';
  });

  const [nodeStates, setNodeStates] = useState(defaultNodeStatus);
  
  const [nodeWorkloads, setNodeWorkloads] = useState<number[]>(
    Array(32).fill(1).map(() => 0.7 + Math.random() * 0.3)
  );

  // Real-time telemetry heartbeat interval
  useEffect(() => {
    const interval = setInterval(() => {
      setGpuUtil((prev) => {
        const delta = (Math.random() - 0.48) * 1.2;
        const next = prev + delta;
        return parseFloat(Math.min(Math.max(next, 74.0), 83.5).toFixed(1));
      });

      setVram((prev) => {
        const delta = (Math.random() - 0.5) * 0.8;
        const next = prev + delta;
        return parseFloat(Math.min(Math.max(next, 308.0), 322.5).toFixed(1));
      });

      setGpuTemp((prev) => {
        if (isTriggered) return 92;
        const delta = Math.round((Math.random() - 0.5) * 1);
        return Math.min(Math.max(prev + delta, 65), 72);
      });

      setQueueFrames((prev) => prev + Math.floor((Math.random() - 0.45) * 12));
      setNodeWorkloads(Array(32).fill(0).map(() => 0.65 + Math.random() * 0.35));
    }, 2200);

    return () => clearInterval(interval);
  }, [isTriggered]);

  const triggerThermalAlert = async () => {
    setIsLoading(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/alerts/thermal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serverName: "RenderNode-04 (Maya Farm)",
          temperature: 92,
          threshold: 80
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to dispatch alert.');

      const updatedNodes = [...nodeStates];
      updatedNodes[3] = 'critical';
      setNodeStates(updatedNodes);
      setIsTriggered(true);
      setGpuTemp(92);

      setFeedback({ type: 'success', message: 'Thermal alert dispatched to Slack! Node-04 isolated.' });
    } catch (error: any) {
      setFeedback({ type: 'error', message: error.message || 'Error executing request.' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setFeedback(null), 6000);
    }
  };

  const activeJobs = [
    { id: '200-CB42', name: 'Neon Rain / Final Composite', engine: 'Unreal Engine 5.4', status: 'RENDERING', output: '8K EXR', frames: '1,284 / 2,400 frames', node: 'Node - 12', progress: 50, statusColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', barColor: 'bg-cyan-500' },
    { id: '200-CB41', name: 'Astra / Volumetric Pass', engine: 'Blender 4.2', status: 'RENDERING', output: '4K EXR', frames: '824 / 824 frames', node: 'Node - 07', progress: 100, statusColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', barColor: 'bg-emerald-500' },
    { id: '200-CB40', name: 'Scene 08 / Take 3', engine: 'Maya 2025', status: 'REMEDIATED', output: '8K EXR', frames: '672 / 672 frames', node: 'Node - 04 → 12', progress: 100, statusColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20', barColor: 'bg-emerald-500' },
    { id: '200-CB39', name: 'LED Volume Calibration', engine: 'Unreal Engine 5.4', status: 'QUEUED', output: '4K EXR', frames: '0 / 740 frames', node: 'Node - 19', progress: 0, statusColor: 'bg-slate-500/10 text-slate-400 border-slate-500/20', barColor: 'bg-slate-700' },
    { id: '200-CB38', name: 'Hero Asset / Fur Groom', engine: 'Maya 2025', status: 'COMPLETED', output: '4K EXR', frames: '960 / 960 frames', node: 'Node - 22', progress: 100, statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', barColor: 'bg-emerald-500' },
    { id: '200-CB37', name: 'Atmosphere / 16-bit Deep', engine: 'Blender 4.2', status: 'FAILED', output: '8K EXR', frames: '441 / 1,080 frames', node: 'Node - 04', progress: 41, statusColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20', barColor: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase">Production Live</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Good afternoon, operator.</h1>
          <p className="text-xs text-gray-400 mt-1">Here is the health of your render ecosystem right now.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 text-[10px] font-mono font-semibold bg-[#161d2f] text-gray-400 border border-[#232d42] rounded">STAGE 03</span>
          <span className="text-[11px] font-mono text-gray-500">Updated just now</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#101625] border border-[#1b2438] rounded-xl p-5 relative overflow-hidden">
          <div className="flex justify-between items-center">
            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/60">LIVE</span>
          </div>
          <div className="text-3xl font-extrabold text-white mt-4 font-mono transition-all duration-500">{gpuUtil.toFixed(1)}%</div>
          <div className="text-xs font-semibold text-gray-400 mt-1">GPU cluster utilization</div>
          <div className="text-[11px] text-emerald-400 mt-2 font-mono">+4.2% vs last hour</div>
        </div>

        <div className="bg-[#101625] border border-[#1b2438] rounded-xl p-5 relative overflow-hidden">
          <div className="flex justify-between items-center">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"/></svg>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/60">LIVE</span>
          </div>
          <div className="text-3xl font-extrabold text-white mt-4 font-mono">{isTriggered ? '27 / 32' : '28 / 32'}</div>
          <div className="text-xs font-semibold text-gray-400 mt-1">Active render nodes</div>
          <div className="text-[11px] text-emerald-400 mt-2 font-mono">{isTriggered ? '84.3% availability' : '87.5% availability'}</div>
        </div>

        <div className="bg-[#101625] border border-[#1b2438] rounded-xl p-5 relative overflow-hidden">
          <div className="flex justify-between items-center">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/60">LIVE</span>
          </div>
          <div className="text-3xl font-extrabold text-white mt-4 font-mono transition-all duration-500">{vram.toFixed(1)} GB</div>
          <div className="text-xs font-semibold text-gray-400 mt-1">VRAM consumption</div>
          <div className="text-[11px] text-gray-500 mt-2 font-mono">of 400 GB allocated</div>
        </div>

        <div className="bg-[#101625] border border-[#1b2438] rounded-xl p-5 relative overflow-hidden">
          <div className="flex justify-between items-center">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/60">LIVE</span>
          </div>
          <div className="text-3xl font-extrabold text-white mt-4 font-mono transition-all duration-500">{queueFrames.toLocaleString()}</div>
          <div className="text-xs font-semibold text-gray-400 mt-1">Frames in queue</div>
          <div className="text-[11px] text-gray-500 mt-2 font-mono">12 jobs processing</div>
        </div>
      </div>

      <div className="bg-[#101625] border border-amber-500/30 rounded-xl p-5 relative overflow-hidden bg-gradient-to-r from-[#101625] via-[#141c2e] to-[#101625]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-400 uppercase tracking-wider">
              <span>⚠️</span> Autonomous Chaos Engineering Bus
            </div>
            <p className="text-xs text-gray-400 mt-1">Trigger a thermal incident payload to dispatch a live Slack webhook alert and test autonomous agent load shedding.</p>
          </div>
          <button onClick={triggerThermalAlert} disabled={isLoading} className={`shrink-0 px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-lg ${isLoading ? 'bg-rose-900/60 text-rose-300 border border-rose-800' : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50 active:scale-95'}`}>
            {isLoading ? 'Dispatching Alert...' : '🔥 Inject Thermal Critical Failure'}
          </button>
        </div>
        {feedback && <div className={`mt-3 text-xs p-2.5 rounded border ${feedback.type === 'success' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' : 'bg-rose-950/80 text-rose-300 border-rose-800'}`}>{feedback.message}</div>}
      </div>

      <div className="bg-[#101625] border border-[#1b2438] rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">Cluster performance</h2>
            <p className="text-xs text-gray-400 mt-0.5">GPU utilization across 32 render nodes</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-amber-400"><span className="w-2 h-2 rounded-full bg-amber-400"></span> GPU</span>
            <span className="flex items-center gap-1.5 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> HEALTHY</span>
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 py-2">
          {nodeStates.map((status, index) => {
            const nodeNumber = String(index + 1).padStart(2, '0');
            const opacity = nodeWorkloads[index] || 1;
            return (
              <div key={index} style={{ opacity: status === 'critical' ? 1 : opacity }} className={`h-16 rounded-lg transition-all duration-700 flex flex-col justify-end p-2 text-[10px] font-mono font-bold cursor-pointer relative ${status === 'critical' ? 'bg-rose-500 text-white shadow-lg shadow-rose-950/80 animate-bounce ring-2 ring-rose-400' : status === 'warning' ? 'bg-amber-400 hover:bg-amber-300 text-slate-950' : 'bg-[#10b981] hover:bg-[#0ea5e9] text-slate-950'}`} title={`Node-${nodeNumber}: ${status.toUpperCase()}`}>
                <span className="opacity-80">#{nodeNumber}</span>
              </div>
            );
          })}
        </div>
      </div>
<div className="bg-[#101625] border border-[#1b2438] rounded-xl p-6 space-y-4">
  <div className="flex justify-between items-center">
    <h2 className="text-sm font-bold text-white tracking-wide">System signals</h2>
    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-2 py-0.5 rounded">4 NOMINAL</span>
  </div>
  
  <div className="space-y-3 font-mono text-xs">
    {/* Nominal 1: Thermal Sentinel */}
    <div className="flex justify-between items-center p-3 bg-[#0a0e18] rounded-lg border border-[#182133]">
      <div className="flex items-center gap-3">
        <span className="text-emerald-400 text-base">🌡️</span>
        <div>
          <div className="text-white font-bold">Thermal Sentinel</div>
          <div className="text-[10px] text-gray-500">Within operating range</div>
        </div>
      </div>
      <div className={`text-lg font-bold transition-all duration-500 ${isTriggered ? 'text-rose-400 font-extrabold animate-pulse' : 'text-white'}`}>
        {gpuTemp}°C
      </div>
    </div>

    {/* Nominal 2: VRAM Optimizer */}
    <div className="flex justify-between items-center p-3 bg-[#0a0e18] rounded-lg border border-[#182133]">
      <div className="flex items-center gap-3">
        <span className="text-emerald-400 text-base">💾</span>
        <div>
          <div className="text-white font-bold">VRAM Optimizer</div>
          <div className="text-[10px] text-gray-500">Allocation stable across blades</div>
        </div>
      </div>
      <div className="text-lg font-bold text-white">78%</div>
    </div>

    {/* Nominal 3: Render Pipeline Master */}
    <div className="flex justify-between items-center p-3 bg-[#0a0e18] rounded-lg border border-[#182133]">
      <div className="flex items-center gap-3">
        <span className="text-emerald-400 text-base">⚙️</span>
        <div>
          <div className="text-white font-bold">Render Pipeline Master</div>
          <div className="text-[10px] text-gray-500">Queue processing at standard throughput</div>
        </div>
      </div>
      <div className="text-lg font-bold text-white">14 Jobs</div>
    </div>

    {/* Nominal 4: Autonomous Balancer */}
    <div className="flex justify-between items-center p-3 bg-[#0a0e18] rounded-lg border border-[#182133]">
      <div className="flex items-center gap-3">
        <span className="text-emerald-400 text-base">⚖️</span>
        <div>
          <div className="text-white font-bold">Autonomous Balancer</div>
          <div className="text-[10px] text-gray-500">Load distributed evenly across nodes</div>
        </div>
      </div>
      <div className="text-lg font-bold text-white">0.05v</div>
    </div>
  </div>
</div>


      <div className="bg-[#101625] border border-[#1b2438] rounded-xl p-6 space-y-4 overflow-hidden">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">Active render queue</h2>
            <p className="text-xs text-gray-400 mt-0.5">Jobs currently flowing through the farm</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-[#1b2438] text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-2">Job</th>
                <th className="py-3 px-2">Engine</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Output</th>
                <th className="py-3 px-2">Node</th>
                <th className="py-3 px-2 text-right">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b2438] text-xs">
              {activeJobs.map((job) => (
                <tr key={job.id} className="hover:bg-[#141b2e] transition-colors">
                  <td className="py-3.5 px-2">
                    <div className="font-bold text-white">{job.name}</div>
                    <div className="text-[10px] font-mono text-gray-500">{job.id}</div>
                  </td>
                  <td className="py-3.5 px-2 font-mono text-gray-300">{job.engine}</td>
                  <td className="py-3.5 px-2"><span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${job.statusColor}`}>{job.status}</span></td>
                  <td className="py-3.5 px-2"><div className="font-mono text-gray-200">{job.output}</div><div className="text-[10px] font-mono text-gray-500">{job.frames}</div></td>
                  <td className="py-3.5 px-2 font-mono text-gray-300">{job.node}</td>
                  <td className="py-3.5 px-2 text-right">
                    <div className="flex items-center justify-end gap-3 font-mono text-gray-300">
                      <span>{job.progress}%</span>
                      <div className="w-16 bg-[#0a0e18] h-1.5 rounded-full overflow-hidden border border-[#1b2438]">
                        <div className={`h-full ${job.barColor}`} style={{ width: `${job.progress}%` }}></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
