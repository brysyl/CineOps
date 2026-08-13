export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { query?: string; type?: 'metrics' | 'logs' };
  const baseUrl = process.env.GRAFANA_URL;
  const token = process.env.GRAFANA_SERVICE_ACCOUNT_TOKEN;

  if (!baseUrl || !token) {
    return Response.json({ mode: 'local-simulation', data: { resultType: 'matrix', result: [{ metric: { job: 'render-worker', cluster: 'cineops-demo' }, values: [[Date.now() / 1000, '72']] }] }, message: 'Grafana credentials not configured; returned deterministic telemetry.' });
  }

  const endpoint = body.type === 'logs' ? `${baseUrl.replace(/\/$/, '')}/loki/api/v1/query_range?query=${encodeURIComponent(body.query ?? '{job="render-worker"}')}` : `${baseUrl.replace(/\/$/, '')}/api/v1/query?query=${encodeURIComponent(body.query ?? 'avg(gpu_utilization)')}`;
  const response = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, cache: 'no-store' });
  if (!response.ok) return Response.json({ error: 'Grafana query failed.' }, { status: response.status });
  return Response.json({ mode: 'grafana', data: await response.json() });
}
