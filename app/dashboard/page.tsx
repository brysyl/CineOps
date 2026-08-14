'use client';
import React, { useState } from 'react';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Trigger Slack Alert via internal API route
  const triggerSimulatedAlert = async () => {
    setIsLoading(true);
    setFeedback(null);

    try {
      const simulatedPayload = {
        serverName: "RenderNode-02 (Maya Farm)",
        temperature: 92,
        threshold: 80
      };

      const response = await fetch('/api/alerts/thermal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(simulatedPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to dispatch alert.');
      }

      setFeedback({ type: 'success', message: 'Thermal critical event dispatched to Slack!' });
    } catch (error: any) {
      console.error("Failed to trigger alert:", error);
      setFeedback({ type: 'error', message: error.message || 'Internal error while triggering alert.' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setFeedback(null), 6000);
    }
  };

  const renderNodes = [
    { name: 'RenderNode-01', gpu: 'NVIDIA A100 80GB', load: '84%', temp: 68, status: 'NOMINAL', task: 'Houdini Fluid Simulation #4082' },
    { name: 'RenderNode-02', gpu: 'NVIDIA RTX 4090', load: '98%', temp: 92, status: 'CRITICAL', task: 'Unreal Engine 5 Path Tracing' },
    { name: 'RenderNode-03', gpu: 'NVIDIA A100 80GB', load: '42%', temp: 59, status: 'NOMINAL', task: 'Maya Character Rig Bake' },
    { name: 'RenderNode-04', gpu: 'NVIDIA RTX 4090', load: '12%', temp: 45, status: 'IDLE', task: 'Awaiting Queue Assignment' },
  ];

  const recentEvents = [
    { time: '16:24:12', level: 'WARN', source: 'Gemini Agent', msg: 'Core thermal spike detected on RenderNode-02 (92°C). Autonomous load balancing initiated.' },
    { time: '16:18:05', level: 'INFO', source: 'Orchestrator', msg: 'Job #8821 completed across Nodes 01, 03. Output verified.' },
    { time: '15:52:40', level: 'INFO', source: 'Slack Webhook', msg: 'Thermal alert status webhook dispatched to channel #cineops-incidents.' },
    { time: '15:30:00', level: 'SYS', source: 'Telemetry Engine', msg: 'System integrity check passed. 4/4 nodes reporting heartbeat.' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-100 tracking-tight">Studio Control Room</h2>
          <p className="text-xs text-gray-400">Real-time compute farm telemetry and autonomous AI intervention bus.</p>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href="/api-docs.html" 
            target="_blank" 
            className="text-xs font-mono px-3 py-1.5 rounded-md bg-[#111726] border border-[#262f3f] text-amber-400 hover:border-amber-500/50 transition-colors"
          >
            📄 API Docs
          </a>
          <div className="text-xs text-emerald-400 flex items-center gap-2 bg-emerald-950/40 border border-emerald-900/60 px-3 py-1.5 rounded-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Gemini 3.6 Bus Active
          </div>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0b0e14] border border-[#262f3f] rounded-xl p-5">
          <div className="text-xs font-medium text-gray-400">Total GPU Load</div>
          <div className="text-3xl font-extrabold text-amber-400 mt-2">78.4%</div>
          <div className="text-[10px] text-emerald-400 mt-1">↑ +4.2% from baseline</div>
        </div>

        <div className="bg-[#0b0e14] border border-[#262f3f] rounded-xl p-5">
          <div className="text-xs font-medium text-gray-400">Active Incidents</div>
          <div className="text-3xl font-extrabold text-rose-500 mt-2">1 <span className="text-xs text-gray-400 font-normal">CRITICAL</span></div>
          <div className="text-[10px] text-rose-400 mt-1">RenderNode-02 Overheat</div>
        </div>

        <div className="bg-[#0b0e14] border border-[#262f3f] rounded-xl p-5">
          <div className="text-xs font-medium text-gray-400">Thermal Health Index</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">91.2%</div>
          <div className="text-[10px] text-gray-500 mt-1">Target Threshold: &lt; 80°C</div>
        </div>

        <div className="bg-[#0b0e14] border border-[#262f3f] rounded-xl p-5">
          <div className="text-xs font-medium text-gray-400">Remediation Latency</div>
          <div className="text-3xl font-extrabold text-cyan-400 mt-2">142ms</div>
          <div className="text-[10px] text-cyan-400/80 mt-1">Powered by Gemini Flash</div>
        </div>
      </div>

      {/* Chaos Engineering Injector Card */}
      <div className="bg-[#0b0e14] border border-amber-500/30 rounded-xl p-6 relative overflow-hidden bg-gradient-to-r from-[#0b0e14] via-[#111726] to-[#0b0e14]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
              <span>⚠️</span>
              Chaos Engineering &amp; Evaluator Incident Trigger
            </div>
            <p className="text-xs text-gray-400 mt-1 max-w-xl">
              Inject a simulated thermal overload into <code className="text-amber-300 bg-[#070a10] px-1.5 py-0.5 rounded">RenderNode-02</code>. This calls <code className="text-cyan-300 bg-[#070a10] px-1.5 py-0.5 rounded">/api/alerts/thermal</code> and dispatches a live incident payload directly to the connected Slack workspace.
            </p>
          </div>

          <button 
            onClick={triggerSimulatedAlert}
            disabled={isLoading}
            className={`shrink-0 px-5 py-3 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              isLoading 
                ? 'bg-rose-900/60 text-rose-300 cursor-not-allowed border border-rose-800/80' 
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/50 active:scale-95'
            }`}
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-rose-300 border-t-transparent rounded-full animate-spin"></span>
                Executing Intercept...
              </>
            ) : (
              <>
                🔥 Inject Thermal Critical Failure
              </>
            )}
          </button>
        </div>

        {feedback && (
          <div className={`mt-4 text-xs p-3 rounded-md border ${
            feedback.type === 'success' 
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' 
              : 'bg-rose-950/80 text-rose-300 border-rose-800'
          }`}>
            {feedback.message}
          </div>
        )}
      </div>

      {/* Render Node Telemetry Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Cluster Telemetry &amp; Node Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderNodes.map((node) => (
            <div key={node.name} className="bg-[#0b0e14] border border-[#262f3f] rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-gray-100">{node.name}</h4>
                  <p className="text-[11px] text-gray-500 font-mono">{node.gpu}</p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded border font-mono ${
                  node.status === 'CRITICAL' ? 'bg-rose-950/60 text-rose-400 border-rose-800 animate-pulse' :
                  node.status === 'NOMINAL' ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800' :
                  'bg-gray-900 text-gray-400 border-gray-800'
                }`}>
                  {node.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-400">Core Temp:</span>
                  <span className={node.temp >= 80 ? 'text-rose-400 font-bold' : 'text-gray-200'}>{node.temp}°C</span>
                </div>
                {/* Temperature Bar */}
                <div className="w-full bg-[#121722] h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${node.temp >= 80 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${(node.temp / 100) * 100}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-xs font-mono pt-1">
                  <span className="text-gray-400">Compute Load:</span>
                  <span className="text-amber-400">{node.load}</span>
                </div>
              </div>

              <div className="text-[11px] text-gray-500 bg-[#070a10] p-2 rounded border border-[#1b2333] font-mono truncate">
                &gt; {node.task}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Autonomous Agent Real-Time Audit Log */}
      <div className="bg-[#0b0e14] border border-[#262f3f] rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider">Autonomous Agent Audit Feed</h3>
          <span className="text-[10px] font-mono text-gray-500">REALTIME TELEMETRY BUS</span>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {recentEvents.map((evt, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row gap-2 p-2.5 rounded bg-[#070a10] border border-[#1b2333]">
              <div className="flex gap-2 shrink-0">
                <span className="text-gray-500">{evt.time}</span>
                <span className={`font-bold ${
                  evt.level === 'WARN' ? 'text-amber-400' :
                  evt.level === 'SYS' ? 'text-cyan-400' : 'text-emerald-400'
                }`}>
                  [{evt.level}]
                </span>
                <span className="text-gray-400">[{evt.source}]</span>
              </div>
              <div className="text-gray-300">{evt.msg}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
