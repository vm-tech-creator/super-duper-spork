'use client';

import { ReactNode } from 'react';
import SaharaHeader from '@/components/SaharaHeader';

/** Global shell: one header + themed main area on every route. */
export default function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="sahara-app flex min-h-screen flex-col">
      <SaharaHeader />
      <main className="sahara-main flex-1">{children}</main>
    </div>
  );
}
