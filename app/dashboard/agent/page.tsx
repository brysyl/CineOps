'use client';

import React, { useState } from 'react';

export default function DashboardAgentPage() {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('System ready. Enter an operational directive or select a preset query below.');
  const [loading, setLoading] = useState(false);
  const [isChaosActive, setIsChaosActive] = useState(false);

  const runAgent = async (queryText: string) => {
    setLoading(true);
    setOutput('Initiating multi-agent telemetry dispatch & reasoning sweep...');
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: queryText }),
      });
      const data = await res.json();
      if (data.result) {
        setOutput(data.result);
      } else {
        setOutput(data.error || 'Agent stream returned an empty response.');
      }
    } catch (err: any) {
      setOutput(`Error: ${err.message || 'Failed to connect to agent reasoning bus.'}`);
    } finally {
      setLoading(false);
      setIsChaosActive(false);
    }
  };

  const handleChaosInjection = () => {
    setIsChaosActive(true);
    const chaosPrompt = "EMERGENCY ALERT: Node-04 VRAM spiked to 98.4% (89°C thermal threshold exceeded) due to runaway OpenVDB volumetric cache allocation. Execute immediate diagnostic sweep, invoke `CineOps-MemAgent::PurgeStaleCaches()`, and restore cluster safety metrics.";
    setPrompt(chaosPrompt);
    runAgent(chaosPrompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    runAgent(prompt);
  };

  const diagnosticsLogs = [
    { agent: 'RenderPipelineMaster', time: '14:34:39', message: 'Re-sequenced failed Blender compute job and re-routed to idle blade', code: 'LOG-9004', status: 'SUCCESS' },
    { agent: 'ThermalSentinel', time: '14:34:19', message: 'Adjusted fan curves and power caps following sustained heavy ray-tracing load', code: 'LOG-9003', status: 'SUCCESS' },
    { agent: 'AutonomousBalancer', time: '14:24:45', message: 'Migrated active Maya composition frame queue to stabilize cluster load distribution', code: 'LOG-9007', status: 'SUCCESS' },
    { agent: 'VAMOptimizer', time: '14:21:22', message: 'Auto-flushed GPU cache to prevent out of memory exception during 16K texture stream', code: 'LOG-9006', status: 'SUCCESS' },
    { agent: 'CorridorGuardian-AI', time: '14:22:20', message: 'Edge AI camera module verified zero physical perimeter security breaches', code: 'LOG-9005', status: 'SUCCESS' },
  ];

  return (
    <div className="space-y-8 text-gray-200 pb-12">
      
      {/* Header with Chaos Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-800 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-amber-500 flex items-center gap-2">
            <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            CineOps Autonomous Agent Brain & Diagnostics
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Live multi-agent reasoning console and automated cluster telemetry logs.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Chaos Injection Button */}
          <button
            onClick={handleChaosInjection}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-all shadow-lg shadow-red-600/20 flex items-center gap-2 border border-red-500 animate-pulse disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Inject Chaos (Simulate Overheat)
          </button>

          <div className="flex items-center gap-2 bg-[#121620] px-3 py-2 rounded-lg border border-gray-800 text-xs text-emerald-400">
            <span className={`w-2 h-2 rounded-full ${isChaosActive ? 'bg-red-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></span>
            {isChaosActive ? 'Chaos Mode Active' : 'Live Stream Connected'}
          </div>
        </div>
      </div>

      {/* Chaos Alert Banner (Conditional) */}
      {isChaosActive && (
        <div className="bg-red-950/40 border border-red-600/50 rounded-xl p-4 flex items-center gap-3 text-red-300 text-sm animate-pulse">
          <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <strong className="font-semibold">CRITICAL ALERT:</strong> Artificial thermal spike & VRAM saturation injected into Node-04. Awaiting Gemini agent mitigation stream...
          </div>
        </div>
      )}

      {/* Gemini Interactive Console Section */}
      <div className="bg-[#121620]/60 border border-gray-800 rounded-2xl p-6 space-y-6 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Live Gemini Reasoning Bus
          </h2>
          <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full">
            Gemini Engine Active
          </span>
        </div>

        {/* Quick Prompt Presets */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Quick Diagnostics & Directives</label>
          <div className="flex flex-wrap gap-2">
            {[
              "Check health status of Node-04 and optimize VRAM allocation.",
              "Run cluster thermal audit and adjust fan curves.",
              "Simulate failover protocol for RenderPipelineMaster.",
              "Purge stale OpenVDB volume caches across all render blades."
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={() => { setPrompt(preset); runAgent(preset); }}
                disabled={loading}
                className="text-xs bg-[#1a202c] hover:bg-amber-500/10 hover:border-amber-500/50 border border-gray-700 text-gray-300 px-3 py-2 rounded-lg transition-all text-left disabled:opacity-50"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Custom Operator Directive</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Audit render cluster queues for latency bottlenecks..."
              className="flex-1 bg-[#0b0e14] border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold px-6 py-3 rounded-xl text-sm transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-amber-500/10"
            >
              {loading ? 'Reasoning...' : 'Dispatch Agent'}
            </button>
          </div>
        </form>

        {/* Terminal Output Window */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Agent Reasoning Stream Output</span>
            <span>Secure WebSocket / API Bus</span>
          </div>
          <div className="bg-[#080a0f] border border-gray-800 rounded-xl p-5 font-mono text-xs text-emerald-400 min-h-[250px] max-h-[400px] overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
            {output}
          </div>
        </div>
      </div>

      {/* Diagnostics List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Real-Time Agent Diagnostics & Telemetry Logs
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Historical and active autonomous multi-agent triggers across render nodes.</p>
          </div>
        </div>

        <div className="space-y-3">
          {diagnosticsLogs.map((log, index) => (
            <div key={index} className="bg-[#121620] border border-gray-800/80 hover:border-gray-700 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all shadow-md">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-amber-400 font-medium text-sm">{log.agent}</span>
                  <span className="text-gray-500 text-xs">[{log.time}]</span>
                </div>
                <p className="text-xs text-gray-300 font-mono">{log.message}</p>
              </div>
              <div className="flex items-center gap-3 self-end md:self-center">
                <span className="bg-[#1a202c] text-gray-400 border border-gray-800 px-2.5 py-1 rounded-md text-[10px] font-mono">{log.code}</span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider">{log.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
