import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

type AgentRequest = {
  anomaly?: string;
  node?: string;
  directive?: string;
  payload?: unknown;
};

// Canned scenarios used ONLY when GEMINI_API_KEY is not configured, or when
// a live call fails/returns unparseable output. Every response built from
// this path is explicitly labeled mode: 'local-simulation' so the UI can
// tell it apart from a real model call.
const SIMULATIONS: Record<
  string,
  { title: string; cause: string; action: string; severity: 'CRITICAL' | 'WARNING' }
> = {
  vram: {
    title: 'UE5.4 texture streaming pool overflow',
    cause: 'TextureStreamingPool reached 16,384MB on Node-04 after a 16K texture burst.',
    action: 'Clear GPU cache, migrate frames to Node-12, throttle texture mipmaps to 75%.',
    severity: 'CRITICAL',
  },
  thermal: {
    title: 'GPU thermal throttling on Node-12',
    cause: 'GPU hotspot reached 91°C during the volumetric render pass.',
    action: 'Reduce render concurrency, migrate queue to Node-19, raise cooling profile.',
    severity: 'WARNING',
  },
  asset: {
    title: 'Missing asset dependency in Scene 08 / Take 3',
    cause: 'Published scene references an unmounted shared asset path.',
    action: 'Mount asset volume, rehydrate dependency, and re-queue the affected frame range.',
    severity: 'CRITICAL',
  },
};

function buildSimulation(anomaly: string) {
  const selected = SIMULATIONS[anomaly] ?? SIMULATIONS.vram;
  const node = anomaly === 'thermal' ? 'Node-12' : 'Node-04';
  return {
    mode: 'local-simulation' as const,
    incident: {
      id: `INC-${Date.now().toString().slice(-4)}`,
      ...selected,
      node,
      duration: '1.4s',
      saved: '$2,840',
    },
    steps: [
      { phase: 'Anomaly Ingestion', detail: 'Grafana alert webhook received and normalized.', status: 'complete' },
      { phase: 'Grafana Log & Trace Query', detail: `Queried Loki for render-worker telemetry on ${node}.`, status: 'complete' },
      { phase: 'Root Cause Analysis', detail: selected.cause, status: 'complete' },
      { phase: 'Autonomous Remediation', detail: selected.action, status: 'complete' },
    ],
  };
}

async function persistIncident(incident: Record<string, unknown>, mode: 'gemini' | 'local-simulation') {
  if (!supabaseAdmin) return;
  await supabaseAdmin.from('cineops_incidents').insert({ ...incident, mode });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as AgentRequest;
  const anomaly = body.anomaly ?? 'vram';
  // Free-text operator directive (from the dashboard's custom-directive
  // input) takes priority over the anomaly-key based structured prompt when
  // provided — preserves the original route.ts behavior for ad-hoc queries.
  const directive = body.directive;

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

  // --- No API key: honest simulation fallback ---
  if (!apiKey) {
    const result = buildSimulation(anomaly);
    await persistIncident(result.incident, 'local-simulation');
    return NextResponse.json(result);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = directive
      ? `You are CineOps AI, an autonomous cluster architect and high-performance systems integrator. Provide a professional technical execution log, cluster segment status report, and telemetry breakdown for this operator directive: "${directive}"`
      : `You are CineOps AI, an autonomous observability agent for a VFX render farm. Analyze this alert and return strict JSON with keys incident (title, severity, node, cause, action, duration, saved) and steps (array of phase, detail, status). Alert: ${JSON.stringify(body.payload ?? { anomaly })}. Use concise production-safe remediation reasoning.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      // Only force structured JSON for the structured incident path — a
      // free-text directive response should stay as prose.
      ...(directive ? {} : { config: { responseMimeType: 'application/json' } }),
    });

    const text = response.text ?? '';

    // Free-text directive: return prose output directly, no JSON parsing.
    if (directive) {
      return NextResponse.json({
        mode: 'gemini',
        output: text || 'Execution completed with zero payload returned.',
      });
    }

    // Structured incident path: parse and persist.
    let result: ReturnType<typeof buildSimulation>;
    try {
      result = JSON.parse(text) as ReturnType<typeof buildSimulation>;
    } catch {
      const fallback = buildSimulation(anomaly);
      await persistIncident(fallback.incident, 'local-simulation');
      return NextResponse.json({
        ...fallback,
        warning: 'Gemini response was not valid JSON; showing simulated fallback.',
        rawModelText: text,
      });
    }

    if (result.incident) await persistIncident(result.incident, 'gemini');

    return NextResponse.json({ ...result, mode: 'gemini' });
  } catch (err: any) {
    console.error('Gemini agent route error:', err);

    if (directive) {
      return NextResponse.json({ output: `System Exception: ${err.message}` }, { status: 500 });
    }

    const fallback = buildSimulation(anomaly);
    await persistIncident(fallback.incident, 'local-simulation');
    return NextResponse.json({
      ...fallback,
      warning: `Gemini API call failed: ${err.message}. Showing simulated fallback
      .`,
    });
  }
        }
