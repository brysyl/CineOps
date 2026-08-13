'use client';

import React, { useState } from 'react';

export default function AgentReasoningPage() {
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

  return (
    <div className="min-h-screen bg-[#0b0e14] text-gray-200 p-6 lg:p-10 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-800 pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-amber-500 flex items-center gap-2">
              <span>🤖</span> CineOps Autonomous Agent Brain
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Live multi-agent reasoning console powered by Google Gemini and real-time cluster metrics.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#121620] px-3 py-1.5 rounded-lg border border-gray-800 text-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Gemini Engine Online
          </div>
        </div>

        {/* Quick Prompt Presets */}
        <div className="bg-[#121620] p-4 rounded-xl border border-gray-800 space-y-3">
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
              className="flex-1 bg-[#121620] border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-100 focus:outline-none focus:border-amber-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold px-6 py-3 rounded-xl text-sm transition-all disabled:opacity-50 flex items-center gap-2"
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
          <div className="bg-[#080a0f] border border-gray-800 rounded-xl p-5 font-mono text-xs text-emerald-400 min-h-[350px] max-h-[500px] overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
            {output}
          </div>
        </div>

      </div>
    </div>
  );
}
