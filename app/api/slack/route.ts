import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 0. Verify caller — require a shared secret so this webhook can't be
    // triggered anonymously by anyone who finds the URL.
    const authHeader = req.headers.get('x-cineops-secret');
    const expectedSecret = process.env.CINEOPS_INTERNAL_SECRET;

    if (!expectedSecret) {
      return NextResponse.json(
        { error: 'CINEOPS_INTERNAL_SECRET variable is missing in Vercel settings.' },
        { status: 500 }
      );
    }

    if (authHeader !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Safely parse incoming JSON body without throwing unhandled exceptions
    const body = await req.json().catch(() => ({}));
    const node = body.node;
    const temp = body.temp;
    const safetyLimit = body.safetyLimit;

    // Fail loudly instead of alerting on fabricated defaults — a missing
    // node/temp means something upstream is broken and we don't want to
    // page someone about a node that doesn't exist.
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

    // 2. Build payload
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

    // 3. Post to Slack
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackPayload),
    });

    // Slack returns plain text ("ok"), NOT JSON — check both status and body,
    // since Slack has historically returned 200 with a non-"ok" body on
    // certain webhook misconfigurations.
    const slackText = await response.text();

    if (!response.ok || slackText !== 'ok') {
      return NextResponse.json(
        { error: `Slack webhook rejected the alert: ${response.status} ${slackText}` },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, slackMessage: slackText });
  } catch (error: any) {
    // Avoid leaking internal error details to untrusted callers.
    console.error('Slack alert route error:', error);
    return NextResponse.json({ error: 'Server execution error' }, { status: 500 });
  }
}
