import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Safely parse incoming JSON body without throwing unhandled exceptions
    const body = await req.json().catch(() => ({}));
    const node = body.node || 'Node-04';
    const temp = body.temp || '92°C';
    const safetyLimit = body.safetyLimit || '80°C';

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
            text: `🔥 *CineOps Server Overheating Alert*\n\n*Target Server:*\n\`${node}\` \n\n*Current Temperature:*\n\`${temp}\` *(Safety Limit: ${safetyLimit})*`,
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

    // Slack returns plain text ("ok"), NOT JSON
    const slackText = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        { error: `Slack returned HTTP ${response.status}: ${slackText}` },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, slackMessage: slackText });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Server execution error' },
      { status: 500 }
    );
  }
}
