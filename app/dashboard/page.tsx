'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Server,
  HardDrive,
  Layers,
  Flame,
  AlertTriangle,
  Thermometer,
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

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
  {
    id: 'JOB-1032',
    name: 'Neon Rain / Final Composite',
    engine: 'Unreal Engine 5.4',
    status: 'RENDERING',
    output: '8K EXR',
    frames: '1,200 / 2,400 frames',
    node: 'Node - 12',
    progress: 50,
  },
  {
    id: 'JOB-1031',
    name: 'Action / Volumetric Pass',
    engine: 'Blender 4.2',
    status: 'RENDERING',
    output: '4K EXR',
    frames: '324 / 324 frames',
    node: 'Node - 07',
    progress: 100,
  },
  {
    id: 'JOB-1030',
    name: 'Scene 03 / Take 2',
    engine: 'Maya 2025',
    status: 'REALLOCATED',
    output: '4K EXR',
    frames: '120 / 1,400 frames',
    node: 'Node - 01 → 12',
    progress: 100,
  },
  {
    id: 'JOB-1029',
    name: 'LIDAR Volume Calibration',
    engine: 'Unreal Engine 5.4',
    status: 'QUEUED',
    output: '4K HDR',
    frames: '0 / 750 frames',
    node: 'Node - 19',
    progress: 0,
  },
  {
    id: 'JOB-1028',
    name: 'Hero Asset / Fur Groom',
    engine: 'Maya 2025',
    status: 'COMPLETED',
    output: '4K EXR',
    frames: '600 / 600 frames',
    node: 'Node - 22',
    progress: 100,
  },
  {
    id: 'JOB-1027',
    name: 'Atmosphere / 16-bit Deep',
    engine: 'Blender 4.2',
    status: 'HALTED',
    output: '8K EXR',
    frames: '441 / 1,800 frames',
    node: 'Node - 04',
    progress: 41,
  },
];

// Nodes matching exact screenshot pattern (#25, #27, #30, #31 highlighted in warning color)
const WARNING_NODES = [25, 27, 30, 31];

export default function ControlRoomDashboard() {
  const [jobs] = useState<RenderJob[]>(INITIAL_JOBS);
  const [gpuTemp, setGpuTemp] = useState<number>(67);
  const [anomaliesCount, setAnomaliesCount] = useState<number>(1);
  const [slackSending, setSlackSending] = useState(false);
  const [slackDispatched, setSlackDispatched] = useState(false);

  // Trigger Live Slack Alert via Chaos Engineering Payload
  const injectThermalFailure = async () => {
    setSlackSending(true);
    setGpuTemp(89);
    setAnomaliesCount(3);

    try {
      await fetch('/api/alerts/slack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: '#cineops-alerts',
          message: '🔥 CRITICAL THERMAL INCIDENT INJECTED: GPU cluster temperature spiked to 89°C on Node-04. Autonomous reroute initiated.',
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => null);
    } finally {
      setTimeout(() => {
        setSlackSending(false);
        setSlackDispatched(true);

        // Auto-recover after 4 seconds
        setTimeout(() => {
          setGpuTemp(67);
          setAnomaliesCount(1);
          setSlackDispatched(false);
        }, 4000);
      }, 700);
    }
  };

  const getStatusBadge = (status: RenderJob['status']) => {
    switch (status) {
      case 'RENDERING':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'REALLOCATED':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'QUEUED':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
      case 'COMPLETED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'HALTED':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
  };

  const getProgressBarColor = (status: RenderJob['status']) => {
    switch (status) {
      case 'HALTED':
        return 'bg-rose-500';
      case 'QUEUED':
        return 'bg-gray-600';
      default:
        return 'bg-cyan-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-gray-100 p-4 sm:p-6 lg:p-8 font-sans selection:bg-emerald-500/30">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
              PRODUCTION LIVE
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
            Good afternoon, operator.
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Here is the health of your render ecosystem right now.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded bg-[#101726] border border-[#1d283d] text-xs font-mono text-gray-300">
            STAGE 03
          </span>
          <span className="text-xs font-mono text-gray-500">
            updated 2s ago
          </span>
        </div>
      </div>

      {/* TOP 4 METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Metric 1 */}
        <div className="bg-[#0b101d] border border-[#182234] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              LIVE
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white">78.4%</div>
            <div className="text-xs font-medium text-gray-300 mt-1">GPU cluster utilization</div>
            <div className="text-[11px] font-mono text-emerald-400 mt-0.5">+4.2% vs last hour</div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0b101d] border border-[#182234] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Server className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              LIVE
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white">28 / 32</div>
            <div className="text-xs font-medium text-gray-300 mt-1">Active render nodes</div>
            <div className="text-[11px] font-mono text-emerald-400 mt-0.5">87.5% availability</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#0b101d] border border-[#182234] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <HardDrive className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              LIVE
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white">312.8 GB</div>
            <div className="text-xs font-medium text-gray-300 mt-1">VRAM consumption</div>
            <div className="text-[11px] font-mono text-gray-500 mt-0.5">of 400 GB allocated</div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#0b101d] border border-[#182234] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              LIVE
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white">4,860</div>
            <div className="text-xs font-medium text-gray-300 mt-1">Frames in queue</div>
            <div className="text-[11px] font-mono text-gray-500 mt-0.5">12 jobs processing</div>
          </div>
        </div>

      </div>

      {/* AUTONOMOUS CHAOS ENGINEERING BUS / SLACK ALERT BANNER */}
      <div className="bg-[#0b101d] border border-amber-500/30 rounded-xl p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded bg-amber-500/10 text-amber-400 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold text-amber-400 tracking-wider uppercase">
              AUTONOMOUS CHAOS ENGINEERING BUS
            </h2>
            <p className="text-xs text-gray-300 mt-1">
              Trigger a simulated incident payload to dispatch a live Slack webhook alert and test autonomous agent load balancing.
            </p>
          </div>
        </div>

        <button
          onClick={injectThermalFailure}
          disabled={slackSending}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-950/40 active:scale-95 disabled:opacity-50 whitespace-nowrap"
        >
          {slackSending ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : slackDispatched ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          ) : (
            <Flame className="w-3.5 h-3.5" />
          )}
          {slackSending ? 'DISPATCHING SLACK PAYLOAD...' : slackDispatched ? 'SLACK NOTIFIED!' : 'Inject Thermal Critical Failure'}
        </button>
      </div>

      {/* CLUSTER PERFORMANCE GRID (32 NODES) */}
      <div className="bg-[#0b101d] border border-[#182234] rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Cluster performance</h2>
            <p className="text-xs text-gray-400">GPU utilization across 32 render nodes</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              GPU
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              HEALTHY
            </span>
          </div>
        </div>

        {/* 32 Node Layout Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 my-3">
          {Array.from({ length: 32 }, (_, i) => {
            const nodeNum = i + 1;
            const isWarning = WARNING_NODES.includes(nodeNum);
            const formattedNum = `#${nodeNum.toString().padStart(2, '0')}`;

            return (
              <div
                key={nodeNum}
                className={`h-11 rounded-md p-1.5 flex flex-col justify-end text-[10px] font-mono font-bold transition-all ${
                  isWarning
                    ? 'bg-amber-400 text-black shadow-md shadow-amber-400/10'
                    : 'bg-emerald-400 text-black shadow-md shadow-emerald-400/10'
                }`}
              >
                <span>{formattedNum}</span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-gray-500 mt-3 pt-2 border-t border-[#182234]">
          <span>Node Utilization / Last 5 min</span>
          <span>MIN 16% — MAX 98%</span>
        </div>
      </div>

      {/* SYSTEM SIGNALS */}
      <div className="bg-[#0b101d] border border-[#182234] rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">System signals</h2>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            4 NOMINAL
          </span>
        </div>

        <div className="space-y-3">
          {/* Signal 1 */}
          <div className="bg-[#070a12] border border-[#182234] rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Thermometer className={`w-4 h-4 ${gpuTemp > 75 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`} />
              <div>
                <div className="text-xs font-semibold text-gray-200">GPU thermals</div>
                <div className="text-[11px] text-gray-500">
                  {gpuTemp > 75 ? 'CRITICAL SPIKE DETECTED' : 'Nominal operating range'}
                </div>
              </div>
            </div>
            <span className={`text-sm font-mono font-bold ${gpuTemp > 75 ? 'text-rose-400' : 'text-gray-200'}`}>
              {gpuTemp}°C
            </span>
          </div>

          {/* Signal 2 */}
          <div className="bg-[#070a12] border border-[#182234] rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-xs font-semibold text-gray-200">Worker heartbeat</div>
                <div className="text-[11px] text-gray-500">32/32 nodes responding</div>
              </div>
            </div>
            <span className="text-sm font-mono font-bold text-gray-200">
              99.98%
            </span>
          </div>

          {/* Signal 3 */}
          <div className="bg-[#070a12] border border-[#182234] rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-xs font-semibold text-gray-200">Anomalies</div>
                <div className="text-[11px] text-gray-500">Agent rerouting Node-04</div>
              </div>
            </div>
            <span className="text-sm font-mono font-bold text-amber-400">
              {anomaliesCount.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* ACTIVE RENDER QUEUE TABLE */}
      <div className="bg-[#0b101d] border border-[#182234] rounded-xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-[#182234] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Active render queue</h2>
            <p className="text-xs text-gray-400">Jobs currently flowing through the farm</p>
          </div>
          <button className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors">
            View audit trail <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#182234] bg-[#070a12]/60 text-gray-400 font-mono text-[10px] uppercase tracking-wider">
                <th className="py-3 px-5 font-semibold">JOB</th>
                <th className="py-3 px-5 font-semibold">ENGINE</th>
                <th className="py-3 px-5 font-semibold">STATUS</th>
                <th className="py-3 px-5 font-semibold">OUTPUT</th>
                <th className="py-3 px-5 font-semibold">NODE</th>
                <th className="py-3 px-5 font-semibold text-right">PROGRESS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182234] text-xs font-sans">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-[#101726] transition-colors group">
                  
                  {/* Job Name & ID */}
                  <td className="py-3.5 px-5">
                    <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {job.name}
                    </div>
                    <div className="text-[10px] font-mono text-gray-500 mt-0.5">{job.id}</div>
                  </td>

                  {/* Engine */}
                  <td className="py-3.5 px-5 font-mono text-gray-300 text-xs">
                    {job.engine}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getStatusBadge(job.status)}`}>
                      {job.status}
                    </span>
                  </td>

                  {/* Output & Frame count */}
                  <td className="py-3.5 px-5">
                    <div className="font-mono text-gray-200 text-xs">{job.output}</div>
                    <div className="text-[10px] font-mono text-gray-500 mt-0.5">{job.frames}</div>
                  </td>

                  {/* Assigned Node */}
                  <td className="py-3.5 px-5 font-mono text-gray-400 text-xs">
                    {job.node}
                  </td>

                  {/* Progress Bar & Percentage */}
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-3 font-mono text-gray-300">
                      <span className="w-8 text-right text-xs">{job.progress}%</span>
                      <div className="w-20 bg-[#070a12] h-1.5 rounded-full overflow-hidden border border-[#182234]">
                        <div
                          className={`h-full ${getProgressBarColor(job.status)} transition-all duration-500`}
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
      </div>

    </div>
  );
}

