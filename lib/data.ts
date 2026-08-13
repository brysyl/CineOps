export type JobStatus = 'RENDERING' | 'COMPLETED' | 'QUEUED' | 'FAILED' | 'REMEDIATED';

export type RenderJob = {
  id: string;
  title: string;
  engine: string;
  status: JobStatus;
  resolution: string;
  frames: string;
  node: string;
  progress: number;
  time: string;
};

export type Incident = {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'WARNING' | 'RESOLVED';
  node: string;
  cause: string;
  action: string;
  duration: string;
  saved: string;
  createdAt: string;
};

export const jobs: RenderJob[] = [
  { id: 'JOB-0842', title: 'Neon Rain / Final Composite', engine: 'Unreal Engine 5.4', status: 'RENDERING', resolution: '8K EXR', frames: '1,204 / 2,400', node: 'Node-12', progress: 50, time: '18m 42s' },
  { id: 'JOB-0841', title: 'Astra / Volumetric Pass', engine: 'Blender 4.2', status: 'RENDERING', resolution: '4K EXR', frames: '824 / 824', node: 'Node-07', progress: 100, time: '41m 08s' },
  { id: 'JOB-0840', title: 'Scene 08 / Take 3', engine: 'Maya 2025', status: 'REMEDIATED', resolution: '8K EXR', frames: '612 / 612', node: 'Node-04 → 12', progress: 100, time: '12m 16s' },
  { id: 'JOB-0839', title: 'LED Volume Calibration', engine: 'Unreal Engine 5.4', status: 'QUEUED', resolution: '4K EXR', frames: '0 / 180', node: 'Node-19', progress: 0, time: 'Queued' },
  { id: 'JOB-0838', title: 'Hero Asset / Fur Groom', engine: 'Maya 2025', status: 'COMPLETED', resolution: '4K EXR', frames: '960 / 960', node: 'Node-22', progress: 100, time: '32m 54s' },
  { id: 'JOB-0837', title: 'Atmosphere / 16-bit Deep', engine: 'Blender 4.2', status: 'FAILED', resolution: '8K EXR', frames: '441 / 1,080', node: 'Node-04', progress: 41, time: '9m 03s' },
];

export const incidents: Incident[] = [
  { id: 'INC-2098', title: 'UE5.4 texture streaming pool overflow', severity: 'RESOLVED', node: 'Node-04', cause: 'VRAM allocation crossed 94% after a 16K texture burst.', action: 'Cleared GPU cache, migrated frames to Node-12, throttled texture mipmaps.', duration: '1.4s', saved: '$2,840', createdAt: 'Today, 14:32:18' },
  { id: 'INC-2097', title: 'Thermal throttling detected', severity: 'RESOLVED', node: 'Node-12', cause: 'GPU hotspot reached 91°C during a dense volumetric pass.', action: 'Reduced render concurrency, moved queue to Node-19, raised cooling profile.', duration: '2.1s', saved: '$1,920', createdAt: 'Today, 13:08:42' },
  { id: 'INC-2096', title: 'Missing asset dependency: FX_Smoke_04', severity: 'RESOLVED', node: 'Node-08', cause: 'Published scene referenced an unmounted shared asset path.', action: 'Mounted asset volume, rehydrated dependency, re-queued frame range.', duration: '3.8s', saved: '$4,120', createdAt: 'Today, 11:46:05' },
  { id: 'INC-2095', title: 'Render worker heartbeat drift', severity: 'WARNING', node: 'Node-27', cause: 'Heartbeat latency exceeded 800ms for three consecutive samples.', action: 'Worker connection reset and telemetry stream re-established.', duration: '0.8s', saved: '$680', createdAt: 'Yesterday, 22:18:31' },
];

export const nodeUtilization = [58, 61, 63, 65, 67, 66, 70, 68, 72, 74, 71, 76, 78, 75, 79, 77, 81, 80, 83, 78, 82, 84, 80, 79, 86, 84, 87, 83, 81, 88, 85, 82];

export const liveLogs = [
  '[14:32:18.004] ALERT grafana/vrm-high  node=Node-04 vram=94.2%',
  '[14:32:18.086] QUERY loki  {job="render-worker", node="Node-04"}',
  '[14:32:18.219] MATCH TextureStreamingPool overflow: 16384MB / 16384MB',
  '[14:32:18.402] RCA Gemini  UE5.4 texture streaming pool overflow',
  '[14:32:18.519] ACTION clear_gpu_cache(node-04)        ACK',
  '[14:32:18.781] ACTION migrate_frames(job-0837, node-12) ACK',
  '[14:32:19.104] ACTION throttle_mipmaps(node-04, 0.75)   ACK',
  '[14:32:19.409] RESOLVED  downtime=0s  saved=$2,840',
];
