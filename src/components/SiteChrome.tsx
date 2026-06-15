'use client';

import { ReactNode } from 'react';
import SaharaHeader from '@/components/SaharaHeader';
import ThemeScript from '@/components/ThemeScript';

/** Global shell: one header + themed main area on every route. */
export default function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <div className="sahara-app flex min-h-screen flex-col">
      <ThemeScript />
      <SaharaHeader />
      <main className="sahara-main flex-1" style={{ paddingTop: 'var(--header-offset)' }}>
        {children}
      </main>
    </div>
  );
}
