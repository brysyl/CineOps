import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { node, temp, safetyLimit } = body;
    
    const webhookUrl = process.env.SLACK_WEBHOOK_URL;
    
    // Debug: Ensure variable is present
    if (!webhookUrl) {
      console.error('SLACK_WEBHOOK_URL is undefined in process.env');
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 });
    }

    const payload = {
      text: `🔥 CineOps Alert: ${node || 'Unknown Node'}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Thermal Event Detected*\nNode: ${node}\nTemp: ${temp}\nLimit: ${safetyLimit || '80°C'}`
          }
        }
      ]
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error('Slack Webhook Failed:', response.status, responseText);
      return NextResponse.json({ error: `Slack rejected request: ${responseText}` }, { status: response.status });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('API Route Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
