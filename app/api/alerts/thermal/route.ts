import { NextResponse } from 'next/server';

// Simulates a thermal critical-failure event on a random render node and
// dispatches it through the internal Slack alert pipeline. Used by the
// "Inject Thermal Critical Failure" chaos-engineering control on the
// dashboard to demonstrate the autonomous agent's alerting path.

const NODE_POOL = Array.from({ length: 32 }, (_, i) => `Node-${String(i + 1).padStart(2, '0')}`);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const node = body.node || NODE_POOL[Math.floor(Math.random() * NODE_POOL.length)];
    const safetyLimit = body.safetyLimit ?? 80;
    // Simulate a temp that's clearly over threshold, unless the caller
    // supplied one explicitly.
    const temp = body.temp ?? safetyLimit + Math.floor(Math.random() * 15) + 5;

    const origin = new URL(req.url).origin;
    const internalSecret = process.env.CINEOPS_INTERNAL_SECRET;

    if (!internalSecret) {
      return NextResponse.json(
        { error: 'CINEOPS_INTERNAL_SECRET variable is missing in Vercel settings.' },
        { status: 500 }
      );
    }

    const slackResponse = await fetch(`${origin}/api/slack`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cineops-secret': internalSecret,
      },
      body: JSON.stringify({ node, temp, safetyLimit }),
    });

    const slackResult = await slackResponse.json().catch(() => null);

    if (!slackResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to dispatch thermal alert to Slack', detail: slackResult },
        { status: slackResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      injected: { node, temp, safetyLimit },
      slack: slackResult,
    });
  } catch (error: any) {
    console.error('Thermal alert injection error:', error);
    return NextResponse.json({ error: 'Server execution error' }, { status: 500 });
  }
      }
