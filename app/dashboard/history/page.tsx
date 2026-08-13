import React from 'react';

export default function HistoryPage() {
  const incidents = [
    { id: 'INC-9004', node: 'RenderPipelineMaster', desc: 'Re-sequenced failed Blender compute job and re-routed to idle blade', time: '14:34:19', status: 'SUCCESS' },
    { id: 'INC-9003', node: 'ThermalSentinel', desc: 'Adjusted fan curves and power caps following sustained heavy ray-tracing load', time: '14:34:19', status: 'SUCCESS' },
    { id: 'INC-9007', node: 'AutonomousBalancer', desc: 'Migrated active Maya composition frame queue to stabilize cluster load distribution', time: '14:24:45', status: 'SUCCESS' },
    { id: 'INC-9006', node: 'VAMOptimizer', desc: 'Auto-flushed GPU cache to prevent out of memory exception during 16K texture stream', time: '14:21:22', status: 'SUCCESS' },
    { id: 'INC-9005', node: 'CorridorGuardian-AI', desc: 'Edge AI camera module verified zero physical perimeter security breaches', time: '14:20:20', status: 'SUCCESS' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#0b0e14] border border-[#262f3f] p-6 rounded-xl">
        <h2 className="text-lg font-bold text-amber-500">Incident History & Telemetry Audits</h2>
        <p className="text-xs text-gray-400">Archived autonomous multi-agent triggers across render nodes.</p>
      </div>
      <div className="space-y-3">
        {incidents.map((inc) => (
          <div key={inc.id} className="bg-[#0b0e14] border border-[#262f3f] p-4 rounded-xl flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-amber-400 font-bold text-sm">{inc.node}</span>
                <span className="text-xs text-gray-500">[{inc.time}]</span>
              </div>
              <p className="text-xs text-gray-300 mt-1">{inc.desc}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-gray-400 font-mono">{inc.id}</span>
              <span className="px-2.5 py-1 rounded bg-green-500/10 text-green-400 text-xs font-semibold border border-green-500/20">{inc.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
