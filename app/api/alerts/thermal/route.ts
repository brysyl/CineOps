import { NextResponse } from 'next/server';

// Simulates a thermal critical-failure event on a random render node and
// forwards it to the Slack alert route, which builds and posts the
// formatted message via SLACK_WEBHOOK_URL. Used by the "Inject Thermal
// Critical Failure" chaos-engineering control on the dashboard.

const NODE_POOL = Array.from({ length: 32 }, (_, i) => `Node-${String(i + 1).padStart(2, '0')}`);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const node = body.node || NODE_POOL[Math.floor(Math.random() * NODE_POOL.length)];
    const safetyLimit = body.safetyLimit ?? 80;
    const temp = body.temp ?? safetyLimit + Math.floor(Math.random() * 15) + 5;
    const cluster = body.cluster || 'Stage-03-Prod';

    const origin = new URL(req.url).origin;

    const slackResponse = await fetch(`${origin}/api/slack`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ node, temp, safetyLimit, cluster }),
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
      injected: { node, temp, safetyLimit, cluster },
      slack: slackResult,
    });
  } catch (error: any) {
    console.error('Thermal alert injection error:', error);
    return NextResponse.json({ error: 'Server execution error' }, { status: 500 }
                            );
  }
}
