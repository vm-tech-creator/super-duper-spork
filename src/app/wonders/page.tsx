import Link from 'next/link';
import { ArrowLeft, Landmark } from 'lucide-react';
import WondersInteractiveMap from '@/components/WondersInteractiveMap';

export default function WondersPage() {
  return (
    <main className="relative min-h-screen bg-[#07111f] text-[#e8edf5]" style={{ paddingTop: 'var(--header-offset, 72px)' }}>
      <section className="relative z-20 px-[5%] pb-20 pt-8">
        <div className="mx-auto w-full max-w-6xl">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 rounded-xl border border-white/25 bg-black/25 px-4 py-2 text-sm font-semibold text-white no-underline shadow-lg backdrop-blur-md transition hover:border-[#ffc105]/70 hover:text-[#ffc105]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Home
          </Link>

          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#ffc105]/40 bg-black/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#ffc105] shadow-lg backdrop-blur-md">
              <Landmark className="h-4 w-4" aria-hidden />
              World History
            </div>
            <h1 className="font-['Bebas_Neue'] text-6xl leading-none tracking-wide text-white drop-shadow-[0_8px_28px_rgba(0,0,0,0.55)] sm:text-7xl">
              The 7 Wonders of the World
            </h1>
            <p className="mt-5 max-w-2xl text-lg font-medium leading-relaxed text-white drop-shadow-[0_6px_18px_rgba(0,0,0,0.6)]">
              A quick tour through the seven modern wonders people still travel the world to see.
            </p>
          </div>
        </div>
      </section>

      <WondersInteractiveMap />
    </main>
  );
}
