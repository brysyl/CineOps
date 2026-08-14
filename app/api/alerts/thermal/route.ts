import { NextResponse } from 'next/server';

// Simulates a thermal critical-failure event on a random render node and
// posts it directly to Slack via SLACK_WEBHOOK_URL. Used by the "Inject
// Thermal Critical Failure" chaos-engineering control on the dashboard to
// demonstrate the autonomous agent's alerting path.

const NODE_POOL = Array.from({ length: 32 }, (_, i) => `Node-${String(i + 1).padStart(2, '0')}`);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const node = body.node || NODE_POOL[Math.floor(Math.random() * NODE_POOL.length)];
    const safetyLimit = body.safetyLimit ?? 80;
    // Simulate a temp that's clearly over threshold, unless the caller
    // supplied one explicitly.
    const temp = body.temp ?? safetyLimit + Math.floor(Math.random() * 15) + 5;

    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'SLACK_WEBHOOK_URL variable is missing in Vercel settings.' },
        { status: 500 }
      );
    }

    const slackPayload = {
      text: `🔥 CineOps Thermal Failure Alert - ${node}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `🔥 *CineOps Server Overheating Alert*\n\n*Target Server:* ${node}\n*Current Temp:* ${temp}°C\n*Safety Limit:* ${safetyLimit}°C`,
          },
        },
      ],
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackPayload),
    });

    const slackText = await response.text();

    if (!response.ok || slackText !== 'ok') {
      return NextResponse.json(
        { error: `Slack webhook rejected the alert: ${response.status} ${slackText}` },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      injected: { node, temp, safetyLimit },
      slackMessage: slackText,
    });
  } catch (error: any) {
    console.error('Thermal alert injection error:', error);
    return NextResponse.json({ error: 'Server execution error' }, { status: 500
                                                                  });
  }
}
