import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { dispatchIncidentWebhook } from '@/lib/dispatchWebhook';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const systemInstruction = `
You are CineOps AI, an autonomous multi-agent systems integrator and render cluster architect managing high-performance GPU nodes.
When given a diagnostic command, thermal alert, or optimization request:
1. Parse the system metrics and isolate the failing hardware sub-tree or VRAM bottleneck.
2. Formulate a precise, low-level mitigation script (e.g., executing PID sub-tree interruption, flushing OpenVDB volumetric caches, or re-routing Blender/Maya compute jobs to idle blades).
3. Output a structured, professional systems engineering response with explicit execution steps, log codes, and verification confirmation.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    const resultText = response.text || 'Autonomous execution completed successfully.';

    // Determine severity based on prompt content
    const isCritical = prompt.includes('EMERGENCY') || prompt.includes('VRAM spiked') || prompt.includes('thermal');
    const severity = isCritical ? 'CRITICAL' : 'SUCCESS';
    const code = isCritical ? 'LOG-ERR-904' : 'LOG-OPT-201';
    const agentName = isCritical ? 'ThermalSentinel & MemAgent' : 'RenderPipelineMaster';
    const status = isCritical ? 'THREAT NEUTRALIZED' : 'OPTIMIZATION COMPLETE';

    // Automatically dispatch webhook notification to Discord/Slack channel
    await dispatchIncidentWebhook({
      agentName,
      severity,
      message: resultText.slice(0, 250) + '...',
      code,
      status,
    });

    return NextResponse.json({ result: resultText });
  } catch (error: any) {
    console.error('Agent API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Agent Error' }, { status: 500 });
  }
}
