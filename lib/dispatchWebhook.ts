export async function dispatchIncidentWebhook({
  agentName,
  severity,
  message,
  code,
  status,
}: {
  agentName: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  message: string;
  code: string;
  status: string;
}) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('Webhook URL not configured in environment variables.');
    return;
  }

  const isDiscord = webhookUrl.includes('discord.com');

  const colorMap = {
    INFO: 0x38bdf8,    // Sky Blue
    WARNING: 0xf59e0b, // Amber
    CRITICAL: 0xef4444,// Red
    SUCCESS: 0x10b981, // Emerald
  };

  if (isDiscord) {
    // Discord Rich Embed payload
    const payload = {
      embeds: [
        {
          title: `CineOps Autonomous Incident Dispatch :: [${code}]`,
          description: message,
          color: colorMap[severity] || 0x38bdf8,
          fields: [
            { name: 'Agent Node', value: agentName, inline: true },
            { name: 'Operational Status', value: status, inline: true },
            { name: 'Timestamp', value: new Date().toISOString(), inline: false },
          ],
          footer: {
            text: 'CineOps AI Autonomous Control Room -- Vercel Edge Telemetry',
          },
        },
      ],
    };

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Failed to dispatch Discord webhook:', error);
    }
  } else {
    // Slack Block Kit payload
    const payload = {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*CineOps Autonomous Incident Dispatch* \`[${code}]\``,
          },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Agent:* ${agentName}` },
            { type: 'mrkdwn', text: `*Status:* ${status}` },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `> ${message}`,
          },
        },
      ],
    };

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('Failed to dispatch Slack webhook:', error);
    }
  }
}
