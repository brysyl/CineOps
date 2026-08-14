'use client';
import React, { useState, useEffect } from 'react';
import { Sparkles, Server, HardDrive, Layers, Flame, AlertTriangle, Thermometer, Activity, AlertCircle, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';

interface RenderJob {
  id: string; name: string; engine: string; status: 'RENDERING' | 'REALLOCATED' | 'QUEUED' | 'COMPLETED' | 'HALTED';
  output: string; frames: string; currentFrame: number; totalFrames: number; node: string; progress: number;
}
const INITIAL_JOBS: RenderJob[] = [
  { id: 'JOB-1032', name: 'Neon Rain / Final Composite', engine: 'Unreal Engine 5.4', status: 'RENDERING', output: '8K EXR', frames: '1,200 / 2,400 frames', currentFrame: 1200, totalFrames: 2400, node: 'Node - 12', progress: 50 },
  { id: 'JOB-1031', name: 'Action / Volumetric Pass', engine: 'Blender 4.2', status: 'RENDERING', output: '4K EXR', frames: '324 / 324 frames', currentFrame: 324, totalFrames: 324, node: 'Node - 07', progress: 100 },
];
const INITIAL_WARNING_NODES = [25, 27, 30, 31];

export default function ControlRoomDashboard() {
  const [jobs, setJobs] = useState<RenderJob[]>(INITIAL_JOBS);
  const [gpuTemp, setGpuTemp] = useState<number>(67);
  const [gpuUtil, setGpuUtil] = useState<number>(78.4);
  const [vram, setVram] = useState<number>(312.8);
  const [slackSending, setSlackSending] = useState(false);
  const injectThermalFailure = async () => {
    setSlackSending(true);
    setGpuTemp(92);
    try {
      await fetch('/api/slack', { method: 'POST', body: JSON.stringify({ node: 'Node-04', temp: '92°C' }) });
    } finally {
      setSlackSending(false);
      setTimeout(() => setGpuTemp(67), 6000);
    }
  };
  return (
    <div className="min-h-screen bg-[#070a12] text-gray-100 p-8">
      <h1 className="text-2xl font-bold">Control Room</h1>
      <button onClick={injectThermalFailure} className="bg-red-600 p-2 text-white">
        {slackSending ? 'Processing...' : 'Inject Fault'}
      </button>
      <div className="text-white text-4xl">Temp: {gpuTemp}°C</div>
    </div>
  );
}
