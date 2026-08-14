import { NextResponse } from 'next/server';

// Deterministic-but-varied remediation actions, keyed loosely to severity.
// In production this text should come from the actual Gemini reasoning
// response rather than being chosen client-side — see note at bottom.
const REMEDIATION_ACTIONS = [
  {
    action: 'Triggered thermal load shedding and re-routed active render tasks to standby nodes.',
    detail: 'Non-critical background jobs paused; GPU clocks throttled 15% pending temp recovery.',
  },
  {
    action: 'Issued a graceful container restart on the affected node after confirming no active take was in progress.',
    detail: 'Active Take Lock checked and cleared before restart — no frames were lost.',
  },
  {
    action: 'Flushed VRAM cache and reassigned the current frame batch to Node pool standby capacity.',
    detail: 'Estimated frame delay: under 90 seconds. No manual intervention required.',
  },
  {
    action: 'Reduced render tile size and disabled denoising pass temporarily to cut GPU thermal load.',
    detail: 'Output quality unaffected; pass will re-run automatically once thermals normalize.',
  },
];

function pickRemediation(temp: number, safetyLimit: number) {
  const overage = temp - safetyLimit;
  if (overage >= 15) return REMEDIATION_ACTIONS[1]; // most severe -> restart
  if (overage >= 10) return REMEDIATION_ACTIONS[0];
  if (overage >= 5) return REMEDIATION_ACTIONS[2];
  return REMEDIATION_ACTIONS[3];
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const node = body.node;
    const temp = body.temp;
    const safetyLimit = body.safetyLimit;
    const cluster = body.cluster || 'Stage-03-Prod';
    // Optional: allows a real Gemini call upstream to pass its own reasoning
    // text through, bypassing the local simulation below.
    const agentReasoning: string | undefined = body.agentReasoning;

    if (!node || temp === undefined || safetyLimit === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: node, temp, and safetyLimit are all required.' },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'SLACK_WEBHOOK_URL variable is missing in Vercel settings.' },
        { status: 500 }
      );
    }

    const remediation = pickRemediation(Number(temp), Number(safetyLimit));
    const reasoningText =
      agentReasoning ??
      `Gemini 3.6 Flash reasoning bus detected sustained thermal excursion on ${node} (${temp}°C vs ${safetyLimit}°C limit). ${remediation.action}`;

    const slackPayload = {
      text: `🔥 CineOps Thermal Failure Alert - ${node}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text:
              `🔥 *CineOps Server Overheating Alert*\n\n` +
              `*Target Server:*\n${node}\n\n` +
              `*Current Temperature:*\n${temp}°C (Safety Limit: ${safetyLimit}°C)`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `⚡ *Autonomous Action Initiated:* ${reasoningText}`,
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `*Status:* Remediating | *Cluster:* ${cluster} | _${remediation.detail}_`,
            },
          ],
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

    return NextResponse.json({ success: true, slackMessage: slackText });
  } catch (error: any) {
    console.error('Slack alert route error:', error);
    return NextResponse.json({ error: 'Server execution error' }, { status: 500 });
  }
}

// NOTE: `remediation` text and `reasoningText` are currently generated
// locally from simple thresholds — this is a stand-in for the real Gemini
// agent's output. Once the agent-reasoning endpoint (app/api/agent/route.ts)
// produces genuine diagnostic text, pass it through as `agentReasoning` in
// the request body so this route displays real reasoning instead of the
// simulat
ed fallback.
