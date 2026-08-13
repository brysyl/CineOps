'use client';
import React, { useState } from 'react';

export default function DiagnosticsPage() {
  const [directive, setDirective] = useState('Check health status of Node-04 and optimize VRAM allocation.');
  const [output, setOutput] = useState('System ready. Enter directive or select quick action.');

  const handleDispatch = () => {
    setOutput(`Executing directive: "${directive}"...\nGemini 3.6 Flash reasoning bus active.\nTelemetry optimized across active render blades. Status: SUCCESS.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#0b0e14] border border-[#262f3f] p-6 rounded-xl">
        <div>
          <h2 className="text-lg font-bold text-amber-500">CineOps Autonomous Agent Brain & Diagnostics</h2>
          <p className="text-xs text-gray-400">Live multi-agent reasoning console and automated cluster telemetry logs.</p>
        </div>
        <div>
          <span className="px-3 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Live Stream Connected
          </span>
        </div>
      </div>

      <div className="bg-[#0b0e14] border border-[#262f3f] p-6 rounded-xl space-y-4">
        <h3 className="text-sm font-semibold text-amber-400">Live Gemini Reasoning Bus</h3>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Custom Operator Directive</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={directive}
              onChange={(e) => setDirective(e.target.value)}
              className="flex-1 bg-[#1a2233] border border-[#262f3f] rounded-lg px-4 py-2 text-sm text-gray-200 focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={handleDispatch}
              className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-semibold px-5 py-2 rounded-lg text-sm transition-colors"
            >
              Dispatch Agent
            </button>
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Agent Reasoning Stream Output</label>
          <pre className="bg-[#080a0f] border border-[#262f3f] rounded-lg p-4 text-xs font-mono text-green-400 h-48 overflow-y-auto">
            {output}
          </pre>
        </div>
      </div>
    </div>
  );
}
