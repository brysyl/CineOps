'use client';
import React, { useState, useEffect } from 'react';

type AgentMode = 'gemini' | 'local-simulation';

interface IncidentLog {
  id: string;
  node: string;
  title?: string;
  action?: string;
  mode?: AgentMode;
  created_at?: string;
}

export default function DiagnosticsPage() {
  const [directive, setDirective] = useState('Check health status of Node-04 and optimize VRAM allocation.');
  const [output, setOutput] = useState('System ready. Enter directive or select quick action to dispatch Gemini 3.6 Flash agent.');
  const [loading, setLoading] = useState(false);
  // Tracks the mode of the LAST actual response — starts null until a real
  // call has happened, so we never show a false "Active" state before
  // anything has actually run.
  const [lastMode, setLastMode] = useState<AgentMode | null>(null);

  const [logs, setLogs] = useState<IncidentLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);

  const quickDirectives = [
    'Check health status of Node-04 and optimize VRAM allocation.',
    'Run cluster thermal audit and adjust fan curves.',
    'Simulate failover protocol for RenderPipelineMaster.',
    'Purge stale OpenVDR volume caches across all render blades.',
  ];

  // Pull real incident history from Supabase instead of static fixtures.
  useEffect(() => {
    const loadLogs = async () => {
      setLogsLoading(true);
      try {
        const res = await fetch('/api/incidents');
        const data = await res.json();
        setLogs(Array.isArray(data.incidents) ? data.incidents : []);
      } catch {
        setLogs([]);
      } finally {
        setLogsLoading(false);
      }
    };
    loadLogs();
  }, [lastMode]); // refetch after every dispatch so new incidents show up

  const handleDispatch = async () => {
    setLoading(true);
    setOutput(`[CONNECTING] Establishing secure WebSocket / API Bus to Gemini 3.6 Flash...\n[DISPATCHING] Directive: "${directive}"`);

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ directive }),
      });
      const data = await res.json();
      setOutput(data.output ?? '[ERROR] No output returned.');
      setLastMode(data.mode ?? null);
    } catch (err) {
      setOutput(`[ERROR] Failed to reach Gemini reasoning bus: ${err}`);
      setLastMode(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInjectChaos = () => {
    setDirective('Simulate thermal runaway on Node-02 and trigger autonomous failover protocol.');
    setOutput(
      `[WARNING] CHAOS INJECTED: Simulate Overheat on Node-02!\n[ALERT] Thermal threshold exceeded (92°C). Autonomous failover ready for agent dispatch.`
    );
  };

  const isLive = lastMode === 'gemini';
  const engineBadgeLabel =
    lastMode === null
      ? 'Awaiting first dispatch'
      : isLive
      ? 'Gemini Engine Active (3.6 Flash)'
      : 'Simulated Fallback (no live call)';

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-[#0b0e14] border border-[#262f3f] p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-amber-500 flex items-center gap-2">
            <span>⚡</span> CineOps Autonomous Agent Brain & Diagnostics
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Live multi-agent reasoning console and automated cluster telemetry logs.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleInjectChaos}
            className="bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-700/50 px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Inject Chaos (Simulate Overheat)
          </button>
          <div className="px-3 py-2 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Live Stream Connected
          </div>
        </div>
      </div>

      {/* Live Gemini Reasoning Bus Card */}
      <div className="bg-[#0b0e14] border border-[#262f3f] p-6 rounded-xl space-y-6">
        <div className="flex justify-between items-center border-b border-[#262f3f] pb-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <span>⚡</span> Live Gemini Reasoning Bus
          </div>
          {/* Was hardcoded — now reflects the mode of the last actual
              response so this never claims "Active" during a simulation
              fallback. */}
          <span
            className={`text-[10px] px-2.5 py-1 rounded font-mono border ${
              lastMode === null
                ? 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                : isLive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}
          >
            {engineBadgeLabel}
          </span>
        </div>

        {/* Quick Diagnostics & Directives */}
        <div className="space-y-2">
          <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Quick Diagnostics & Directives</span>
          <div className="flex flex-wrap gap-2">
            {quickDirectives.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setDirective(item)}
                className="text-xs bg-[#121722] hover:bg-[#1a2233] text-gray-300 border border-[#262f3f] px-3 py-2 rounded-lg transition-colors text-left"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Operator Directive */}
        <div className="space-y-2">
          <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Custom Operator Directive</span>
          <div className="flex gap-3">
            <input
              type="text"
              value={directive}
              onChange={(e) => setDirective(e.target.value)}
              className="flex-1 bg-[#080a0f] border border-[#262f3f] rounded-lg px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-amber-500 font-mono"
            />
            <button
              onClick={handleDispatch}
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-gray-950 font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors shadow-sm shrink-0"
            >
              {loading ? 'Processing...' : 'Dispatch Agent'}
            </button>
          </div>
        </div>

        {/* Agent Reasoning Stream Output */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">Agent Reasoning Stream Output</span>
            <span className="text-[10px] text-gray-500 font-mono">Secure WebSocket / API Bus</span>
          </div>
          <pre className="bg-[#080a0f] border border-[#262f3f] rounded-lg p-4 text-xs font-mono text-emerald-400 h-48 overflow-y-auto leading-relaxed whitespace-pre-wrap">
            {output}
          </pre>
        </div>
      </div>

      {/* Real-Time Agent Diagnostics & Telemetry Logs — now sourced from
          Supabase (cineops_incidents) instead of a static fixture array. */}
      <div className="bg-[#0b0e14] border border-[#262f3f] p-6 rounded-xl space-y-4">
        <div>
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <span>📊</span> Real-Time Agent Diagnostics & Telemetry Logs
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">Historical and active autonomous multi-agent triggers across render nodes.</p>
        </div>

        <div className="space-y-3 pt-2">
          {logsLoading && (
            <p className="text-xs text-gray-500 font-mono">Loading incident history…</p>
          )}

          {!logsLoading && logs.length === 0 && (
            <p className="text-xs text-gray-500 font-mono">No incidents recorded yet. Dispatch the agent to generate one.</p>
          )}

          {logs.map((log) => (
            <div key={log.id} className="bg-[#080a0f] border border-[#262f3f] p-4 rounded-xl flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-amber-400 font-bold text-xs font-mono">{log.node}</span>
                  {log.created_at && (
                    <span className="text-[10px] text-gray-500 font-mono">
                      [{new Date(log.created_at).toLocaleTimeString()}]
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-300 mt-1">{log.action ?? log.title}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] text-gray-400 font-mono bg-[#121722] px-2 py-1 rounded border border-[#262f3f]">{log.id}</span>
                <span
                  className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider border ${
                    log.mode === 'gemini'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  {log.mode === 'gemini' ? 'GEMINI' : 'SIMULATED'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
                }

