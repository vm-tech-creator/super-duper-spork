'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function WondersInteractiveMap() {
  return (
    <div className="flex justify-center py-12">
      <Link
        href="/wonders/map"
        className="inline-flex items-center gap-2 rounded-xl border border-[#ffc105]/50 bg-[#ffc105]/10 px-8 py-3 font-bold text-[#ffc105] shadow-lg transition hover:border-[#ffc105] hover:bg-[#ffc105]/20 hover:shadow-xl"
      >
        <MapPin className="h-5 w-5" />
        Explore the Wonders Map
      </Link>
    </div>
  );
}
