import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CineOps AI | Autonomous Telemetry for Production',
  description: 'Autonomous observability for VFX render farms and virtual production stages.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
