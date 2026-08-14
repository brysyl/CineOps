import { NextResponse } from 'next/server';

interface SlackRequestBody { node?: string; temp?: string; safetyLimit?: string; }

export async function POST(req: Request) {
  try {
    const body: SlackRequestBody = await req.json().catch(() => ({}));
    const targetServer = body.node || 'RenderNode-04 (Maya Farm)';
    const temp = body.temp || '92°C';
    const safetyLimit = body.safetyLimit || '80°C';
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;

    if (!webhookUrl) return NextResponse.json({ error: 'Missing webhook' }, { status: 500 });

    const slackPayload = {
      text: `🔥 CineOps Server Overheating Alert - ${targetServer}`,
      blocks: [{ type: 'section', text: { type: 'mrkdwn', text: `🔥 *CineOps Server Overheating Alert*\n\n*Target Server:*\n\`${targetServer}\` \n\n*Current Temperature:*\n\`${temp}\` *(Safety Limit: ${safetyLimit})*` } }],
    };

    const res = await fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(slackPayload) });
    return NextResponse.json({ success: res.ok });
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
