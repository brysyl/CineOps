'use client';

import React, { useState } from 'react';

export default function DashboardAgentPage() {
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('System ready. Enter an operational directive or select a preset query below.');
  const [loading, setLoading] = useState(false);

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
    }
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
    { agent: 'ThermalSentinel', time: '14:29:45', message: 'Optimized liquid cooling parameters across render cluster', code: 'LOG-9002', status: 'SUCCESS' },
    { agent: 'CorridorGuardian-AI', time: '14:29:30', message: 'Autonomous boundary anomaly detected and neutralized', code: 'LOG-9001', status: 'SUCCESS' },
  ];

  return (
    <div className="space-y-8 text-gray-200 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-800 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-amber-500 flex items-center gap-2">
            <span>🤖</span> CineOps Autonomous Agent Brain & Diagnostics
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Live multi-agent reasoning console and automated cluster telemetry logs.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#121620] px-3 py-1.5 rounded-lg border border-gray-800 text-xs text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Stream Connected
        </div>
      </div>

      {/* Gemini Interactive Console Section */}
      <div className="bg-[#121620]/60 border border-gray-800 rounded-2xl p-6 space-y-6 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
            <span className="text-amber-500">⚡</span> Live Gemini Reasoning Bus
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
              <span className="text-amber-500">📊</span> Real-Time Agent Diagnostics & Telemetry Logs
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
