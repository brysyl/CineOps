import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    
    const serverName = body.serverName || 'RenderNode-04 (Virtual Production / Stage 03)';
    const temperature = body.temperature || 88; // Default mock temperature in °C
    const threshold = body.threshold || 80;

    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'SLACK_WEBHOOK_URL environment variable is missing.' },
        { status: 500 }
      );
    }

    // Format rich Slack alert payload
    const payload = {
      text: `🔥 *THERMAL WARNING:* Server \`${serverName}\` heated up to ${temperature}°C!`,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🔥 CineOps Server Overheating Alert',
            emoji: true,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Target Server:* \n\`${serverName}\``,
            },
            {
              type: 'mrkdwn',
              text: `*Current Temperature:* \n\`${temperature}°C\` *(Safety Limit: ${threshold}°C)*`,
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '⚡ *Autonomous Action Initiated:* Gemini 3.6 Flash reasoning bus triggered thermal load shedding and re-routed active Blender render tasks to standby nodes.',
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `*Status:* Remediating | *Cluster:* Stage-03-Prod`,
            },
          ],
        },
      ],
    };

    const slackResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!slackResponse.ok) {
      const errText = await slackResponse.text();
      return NextResponse.json(
        { error: `Slack Webhook returned error: ${errText}` },
        { status: slackResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Thermal alert dispatched for ${serverName} at ${temperature}°C`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
