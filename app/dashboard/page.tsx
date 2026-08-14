'use client';
import React, { useState } from 'react';

export default function DashboardPage() {
  // State management for UI feedback
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Function to call the internal API endpoint that dispatches to Slack
  const triggerSimulatedAlert = async () => {
    setIsLoading(true);
    setFeedback(null);

    try {
      // Define a mock payload simulating a high-temperature event
      const simulatedPayload = {
        serverName: "RenderNode-Chaos (Simulator)",
        temperature: 98,
        threshold: 80
      };

      const response = await fetch('/api/alerts/thermal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(simulatedPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to dispatch alert.');
      }

      setFeedback({ type: 'success', message: 'Simulated alert dispatched to Slack successfully!' });
    } catch (error: any) {
      console.error("Failed to trigger alert:", error);
      setFeedback({ type: 'error', message: error.message || 'Internal error while triggering alert.' });
    } finally {
      setIsLoading(false);
      // Clear the feedback message automatically after 5 seconds
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-100">Studio Control Room</h2>
        <div className="text-xs text-emerald-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Systems Nominal
        </div>
      </div>

      {/* Main Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Metric Card 1 (Mocked) */}
        <div className="bg-[#0b0e14] border border-[#262f3f] rounded-2xl p-6">
          <div className="flex justify-between items-center text-sm font-bold text-gray-300">
            GPU Cluster Load <span className="text-emerald-400 text-xs">+4.2%</span>
          </div>
          <div className="text-5xl font-extrabold text-amber-400 mt-2">78.4%</div>
        </div>

        {/* Metric Card 2 (Mocked) */}
        <div className="bg-[#0b0e14] border border-[#262f3f] rounded-2xl p-6">
          <div className="flex justify-between items-center text-sm font-bold text-gray-300">
            Active Alerts <span className="text-gray-500 text-xs">(24h)</span>
          </div>
          <div className="text-5xl font-extrabold text-gray-100 mt-2">3 <span className="text-rose-500 text-sm">WARN</span></div>
        </div>

        {/* CHAOS ENGINEERING CARD - Contains the Slack Trigger Button */}
        <div className="bg-[#0b0e14] border border-dashed border-[#313c4f] rounded-2xl p-6 xl:col-span-2 relative overflow-hidden">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-300">
            <span className="text-amber-500 text-lg">⚠️</span>
            Chaos Engineering Simulator
          </div>
          <p className="text-xs text-gray-500 mt-2 max-w-sm">
            Execute autonomous remediation tests by injecting simulated thermal load failures into the pipeline.
          </p>
          
          <button 
            onClick={triggerSimulatedAlert}
            disabled={isLoading}
            className={`mt-4 px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              isLoading 
                ? 'bg-rose-900/60 text-rose-300 cursor-not-allowed border border-rose-800/80' 
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-950/30'
            }`}
          >
            {isLoading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-rose-300 border-t-transparent rounded-full animate-spin"></span>
                Dispatching Alert...
              </>
            ) : (
              <>
                🔥 Inject Thermal Critical Failure
              </>
            )}
          </button>

          {/* Inline Feedback Toast */}
          {feedback && (
            <div className={`absolute top-4 right-4 text-[10px] px-3 py-1 rounded border ${
              feedback.type === 'success' 
                ? 'bg-emerald-950/50 text-emerald-300 border-emerald-900' 
                : 'bg-rose-950/50 text-rose-300 border-rose-900'
            }`}>
              {feedback.message}
            </div>
          )}
        </div>
      </div>

      {/* Placeholder for future detailed telemetry sections */}
      <div className="h-64 rounded-2xl border border-[#262f3f] bg-[#0b0e14] flex items-center justify-center text-xs text-gray-600 font-mono">
        &gt; Awaiting detailed node telemetry stream...
      </div>
    </div>
  );
}
