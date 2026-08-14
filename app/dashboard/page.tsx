'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Server, HardDrive, Layers, Flame, AlertTriangle, Thermometer, Activity, AlertCircle } from 'lucide-react';

interface RenderJob {
  id: string;
  name: string;
  engine: string;
  status: 'RENDERING' | 'REALLOCATED' | 'QUEUED' | 'COMPLETED' | 'HALTED';
  output: string;
  frames: string;
  node: string;
  progress: number;
}

const INITIAL_JOBS: RenderJob[] = [
  { id: 'JOB-1032', name: 'Neon Rain / Final Composite', engine: 'Unreal Engine 5.4', status: 'RENDERING', output: '8K EXR', frames: '1,284 / 2,400 frames', node: 'Node - 12', progress: 50 },
  { id: 'JOB-1031', name: 'Astra / Volumetric Pass', engine: 'Blender 4.2', status: 'RENDERING', output: '4K EXR', frames: '324 / 324 frames', node: 'Node - 07', progress: 100 },
  { id: 'JOB-1030', name: 'Scene 08 / Take 3', engine: 'Maya 2025', status: 'REALLOCATED', output: '8K EXR', frames: '672 / 672 frames', node: 'Node - 04 → 12', progress: 100 },
  { id: 'JOB-1029', name: 'LED Volume Calibration', engine: 'Unreal Engine 5.4', status: 'QUEUED', output: '4K EXR', frames: '0 / 750 frames', node: 'Node - 19', progress: 0 },
  { id: 'JOB-1028', name: 'Hero Asset / Fur Groom', engine: 'Maya 2025', status: 'COMPLETED', output: '4K EXR', frames: '960 / 960 frames', node: 'Node - 22', progress: 100 },
  { id: 'JOB-1027', name: 'Atmosphere / 16-bit Deep', engine: 'Blender 4.2', status: 'HALTED', output: '8K EXR', frames: '411 / 1,000 frames', node: 'Node - 04', progress: 41 },
];

export default function ControlRoomDashboard() {
  const [jobs, setJobs] = useState<RenderJob[]>(INITIAL_JOBS);
  const [gpuTemp, setGpuTemp] = useState<number>(67);
  const [slackSending, setSlackSending] = useState(false);
  const [slackDispatched, setSlackDispatched] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      setJobs((prev) =>
        prev.map((j) => (j.status === 'RENDERING' ? { ...j, progress: Math.min(100, j.progress + 1) } : j))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const injectThermalFailure = async () => {
    setSlackSending(true);
    setErrorMsg('');
    setGpuTemp(92);

    try {
      const res = await fetch('/api/slack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ node: 'Node-04', temp: '92°C', safetyLimit: '80°C' }),
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        data = { error: text || `HTTP ${res.status} Response` };
      }

      if (!res.ok || data.error) {
        setErrorMsg(data.error || 'Failed to dispatch alert');
      } else {
        setSlackDispatched(true);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Network request failed');
    } finally {
      setSlackSending(false);
      setTimeout(() => {
        setGpuTemp(67);
        setSlackDispatched(false);
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-gray-100 p-6 font-sans">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            PRODUCTION LIVE
          </div>
          <h1 className="text-2xl font-bold">Good afternoon, operator.</h1>
          <p className="text-xs text-gray-400">Here is the health of your render ecosystem right now.</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
          <span className="px-2 py-1 bg-[#121927] border border-[#1e293b] rounded">STAGE 03</span>
          <span>Updated: Just now</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#0c121e] border border-[#1e293b] rounded-xl p-4">
          <div className="flex justify-between items-start text-gray-400 text-xs mb-2">
            <span>GPU cluster utilization</span>
            <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">LIVE</span>
          </div>
          <div className="text-3xl font-bold font-mono">78.4%</div>
          <div className="text-[11px] text-emerald-400 mt-2">+4.2% vs last hour</div>
        </div>

        <div className="bg-[#0c121e] border border-[#1e293b] rounded-xl p-4">
          <div className="flex justify-between items-start text-gray-400 text-xs mb-2">
            <span>Active render nodes</span>
            <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">LIVE</span>
          </div>
          <div className="text-3xl font-bold font-mono">28 / 32</div>
          <div className="text-[11px] text-emerald-400 mt-2">87.5% availability</div>
        </div>

        <div className="bg-[#0c121e] border border-[#1e293b] rounded-xl p-4">
          <div className="flex justify-between items-start text-gray-400 text-xs mb-2">
            <span>VRAM consumption</span>
            <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">LIVE</span>
          </div>
          <div className="text-3xl font-bold font-mono">312.8 GB</div>
          <div className="text-[11px] text-gray-400 mt-2">of 400 GB allocated</div>
        </div>

        <div className="bg-[#0c121e] border border-[#1e293b] rounded-xl p-4">
          <div className="flex justify-between items-start text-gray-400 text-xs mb-2">
            <span>Frames in queue</span>
            <span className="text-emerald-400 font-mono text-[10px] bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40">LIVE</span>
          </div>
          <div className="text-3xl font-bold font-mono">4,860</div>
          <div className="text-[11px] text-gray-400 mt-2">12 jobs processing</div>
        </div>
      </div>

      {/* Trigger Alert Section */}
      <div className="bg-[#121622] border border-amber-500/20 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono uppercase mb-1">
              <AlertTriangle className="w-4 h-4" /> AUTONOMOUS CHAOS ENGINEERING BUS
            </div>
            <p className="text-xs text-gray-400">
              Trigger a thermal incident payload to dispatch a live Slack webhook alert and test autonomous agent load shedding.
            </p>
          </div>
          <button
            onClick={injectThermalFailure}
            disabled={slackSending}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold font-mono transition-all ${
              slackDispatched
                ? 'bg-emerald-600 text-white'
                : slackSending
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-red-600 hover:bg-red-500 text-white'
            }`}
          >
            {slackSending ? 'DISPATCHING...' : slackDispatched ? 'ALERT DISPATCHED!' : '🔥 Inject Thermal Critical Failure'}
          </button>
        </div>

        {errorMsg && (
          <div className="mt-3 p-2.5 bg-red-950/60 border border-red-500/40 rounded text-red-300 text-xs font-mono break-all">
            ⚠️ {errorMsg}
          </div>
        )}
      </div>

      {/* Node Grid */}
      <div className="bg-[#0c121e] border border-[#1e293b] rounded-xl p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold">Cluster performance</h2>
          <div className="flex items-center gap-3 text-[11px] font-mono text-gray-400">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-amber-400"></span> GPU</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-emerald-400"></span> HEALTHY</span>
          </div>
        </div>
        <div className="grid grid-cols-8 gap-2">
          {Array.from({ length: 32 }, (_, i) => {
            const num = (i + 1).toString().padStart(2, '0');
            const isFault = i === 3 && gpuTemp >= 90;
            const isWarn = [24, 26, 29, 30].includes(i);
            const statusBg = isFault
              ? 'bg-red-500 text-white animate-pulse'
              : isWarn
              ? 'bg-amber-400/80 text-black'
              : 'bg-emerald-400 text-black';
            return (
              <div key={i} className={`h-10 rounded flex items-center justify-center font-mono text-xs font-bold ${statusBg}`}>
                #{num}
              </div>
            );
          })}
        </div>
      </div>

      {/* System Signals & Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#0c121e] border border-[#1e293b] rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-4">System signals</h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 bg-[#121927] rounded-lg">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="font-medium">GPU Thermals</div>
                  <div className="text-[10px] text-gray-500">Within operating range</div>
                </div>
              </div>
              <span className={`font-mono text-sm font-bold ${gpuTemp >= 90 ? 'text-red-400 animate-pulse' : 'text-gray-200'}`}>
                {gpuTemp}°C
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-[#121927] rounded-lg">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="font-medium">Worker heartbeat</div>
                  <div className="text-[10px] text-gray-500">32 / 32 responding</div>
                </div>
              </div>
              <span className="font-mono text-emerald-400 font-bold">99.98%</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-[#121927] rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="font-medium">Anomalies</div>
                  <div className="text-[10px] text-gray-500">Agent watching Node-04</div>
                </div>
              </div>
              <span className="font-mono text-red-400 font-bold">01</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#0c121e] border border-[#1e293b] rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold">Active render queue</h2>
            <span className="text-xs text-amber-400 font-mono">View audit trail →</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-gray-500 text-[10px] font-mono border-b border-[#1e293b]">
                <tr>
                  <th className="pb-2">JOB</th>
                  <th className="pb-2">ENGINE</th>
                  <th className="pb-2">STATUS</th>
                  <th className="pb-2">OUTPUT</th>
                  <th className="pb-2">NODE</th>
                  <th className="pb-2 text-right">PROGRESS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182234]">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-[#121927]/50">
                    <td className="py-3 font-medium">
                      {job.name}
                      <div className="text-[10px] text-gray-500 font-mono">{job.id}</div>
                    </td>
                    <td className="py-3 text-gray-400">{job.engine}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        job.status === 'RENDERING' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/50' :
                        job.status === 'REALLOCATED' ? 'bg-amber-950 text-amber-400 border border-amber-800/50' :
                        job.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50' :
                        'bg-red-950 text-red-400 border border-red-800/50'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-300">
                      {job.output}
                      <div className="text-[10px] text-gray-500 font-mono">{job.frames}</div>
                    </td>
                    <td className="py-3 font-mono text-gray-400">{job.node}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2 font-mono">
                        <span>{job.progress}%</span>
                        <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${job.status === 'HALTED' ? 'bg-red-500' : 'bg-cyan-400'}`}
                            style={{ width: `${job.progress}%` }}
                          ></div>
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
    </div>
  );
}
