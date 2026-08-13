import { GoogleGenAI } from '@google/genai';
import { incidents } from '@/lib/data';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

type AgentRequest = { anomaly?: string; node?: string; payload?: unknown };

const simulations: Record<string, { title: string; cause: string; action: string; severity: 'CRITICAL' | 'WARNING' }> = {
  vram: { title: 'UE5.4 texture streaming pool overflow', cause: 'TextureStreamingPool reached 16,384MB on Node-04 after a 16K texture burst.', action: 'Clear GPU cache, migrate frames to Node-12, throttle texture mipmaps to 75%.', severity: 'CRITICAL' },
  thermal: { title: 'GPU thermal throttling on Node-12', cause: 'GPU hotspot reached 91°C during the volumetric render pass.', action: 'Reduce render concurrency, migrate queue to Node-19, raise cooling profile.', severity: 'WARNING' },
  asset: { title: 'Missing asset dependency in Scene 08 / Take 3', cause: 'Published scene references an unmounted shared asset path.', action: 'Mount asset volume, rehydrate dependency, and re-queue the affected frame range.', severity: 'CRITICAL' },
};

function simulation(anomaly = 'vram') {
  const selected = simulations[anomaly] ?? simulations.vram;
  return {
    mode: 'local-simulation',
    incident: { id: `INC-${Date.now().toString().slice(-4)}`, ...selected, node: anomaly === 'thermal' ? 'Node-12' : 'Node-04', duration: '1.4s', saved: '$2,840' },
    steps: [
      { phase: 'Anomaly Ingestion', detail: 'Grafana alert webhook received and normalized.', status: 'complete' },
      { phase: 'Grafana Log & Trace Query', detail: `Queried Loki for render-worker telemetry on ${anomaly === 'thermal' ? 'Node-12' : 'Node-04'}.`, status: 'complete' },
      { phase: 'Root Cause Analysis', detail: selected.cause, status: 'complete' },
      { phase: 'Autonomous Remediation', detail: selected.action, status: 'complete' },
    ],
  };
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as AgentRequest;
  const anomaly = body.anomaly ?? 'vram';

  if (!process.env.GEMINI_API_KEY) {
    const result = simulation(anomaly);
    if (supabaseAdmin) await supabaseAdmin.from('cineops_incidents').insert({ title: result.incident.title, severity: result.incident.severity, node: result.incident.node, cause: result.incident.cause, action: result.incident.action, duration: result.incident.duration, saved: result.incident.saved });
    return Response.json(result);
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `You are CineOps AI, an autonomous observability agent for a VFX render farm. Analyze this alert and return strict JSON with keys incident (title, severity, node, cause, action, duration, saved) and steps (array of phase, detail, status). Alert: ${JSON.stringify(body.payload ?? body)}. Use concise production-safe remediation reasoning.`;
  const response = await ai.models.generateContent({ model: 'gemini-3.6-flash', contents: prompt, config: { responseMimeType: 'application/json' } });
  const text = response.text ?? JSON.stringify(simulation(anomaly));
  const result = JSON.parse(text) as ReturnType<typeof simulation>;
  if (supabaseAdmin && result.incident) await supabaseAdmin.from('cineops_incidents').insert({ ...result.incident });
  return Response.json({ ...result, mode: 'gemini' });
}
