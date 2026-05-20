'use client';

import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

interface SiteHeaderProps {
  links?: { label: string; href: string }[];
  rightSlot?: ReactNode;
}

const defaultLinks = [
  { label: 'Home', href: '/' },
  { label: 'Games', href: '/games' },
];

export default function SiteHeader({ links = defaultLinks, rightSlot }: SiteHeaderProps) {
  const [mobileNav, setMobileNav] = useState(false);
  const [siteMode, setSiteMode] = useState<'classic' | 'fancy' | 'neon' | 'minimal' | 'dark' | 'vibrant' | 'glassmorphism'>('classic');

  const modeSelectClass =
    siteMode === 'neon'
      ? 'border-[#00ff88]/50 bg-black/80 text-[#00ff88]'
      : siteMode === 'fancy'
      ? 'border-[#ffc105]/40 bg-gradient-to-r from-[#ffc105]/15 to-[#497ab6]/15 text-[#f0f4fa]'
      : siteMode === 'vibrant'
      ? 'border-[#e94560]/50 bg-[#1a1528]/90 text-[#ffb8c8]'
      : siteMode === 'dark'
      ? 'border-[#4a6f9f]/40 bg-[#0f1620]/95 text-[#d0d8e8]'
      : siteMode === 'minimal'
      ? 'border-[#7a93b4]/30 bg-transparent text-[#8ba3c4]'
      : siteMode === 'glassmorphism'
      ? 'border-white/20 bg-white/5 text-white'
      : 'border-[#88a9d8]/25 bg-[#0c1829]/90 text-[#e8edf5]';

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-3 pt-3 sm:px-5 sm:pt-4">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl border px-3 py-2.5 pl-4 shadow-lg shadow-black/10 transition-[background,border-color,box-shadow] duration-300 sm:px-5 sm:py-3 border-[#88a9d8]/18 bg-[#080f1c]/88 backdrop-blur-2xl">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#ffc105] to-[#d9a004] font-['Bebas_Neue'] text-xl text-[#0a0f18] shadow-[0_4px_20px_rgba(255,193,5,0.22)]">
            S
          </div>
          <div className="leading-tight">
            <div className="font-['Barlow_Condensed'] text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#88a9d8]">
              Supersite
            </div>
            <div className="font-['Barlow_Condensed'] text-lg font-extrabold uppercase tracking-wide text-[#f0f4fa]">
              Sahara
            </div>
          </div>
        </Link>

        <ul className="hidden list-none items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[#8ba3c4] no-underline transition-colors hover:bg-white/[0.04] hover:text-[#ffc105]"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="#"
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#8ba3c4] no-underline transition-colors hover:bg-white/[0.04] hover:text-[#ffc105]"
            >
              Sign in
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <select
            value={siteMode}
            onChange={(e) => setSiteMode(e.target.value as typeof siteMode)}
            aria-label="Visual theme"
            className={`max-w-[7.5rem] cursor-pointer rounded-xl border py-2 pl-3 pr-8 text-[0.7rem] font-semibold uppercase tracking-wide sm:max-w-none sm:text-xs ${modeSelectClass}`}
          >
            <option value="classic">Classic</option>
            <option value="fancy">Fancy</option>
            <option value="neon">Neon</option>
            <option value="minimal">Minimal</option>
            <option value="dark">Dark</option>
            <option value="vibrant">Vibrant</option>
            <option value="glassmorphism">Glass</option>
          </select>

          <Link
            href="/videos"
            className="hidden items-center gap-2 rounded-xl bg-[#ffc105] px-4 py-2 text-sm font-semibold text-[#0a0f18] no-underline shadow-[0_4px_24px_rgba(255,193,5,0.28)] transition hover:bg-[#ffcf3a] sm:inline-flex"
          >
            Watch
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>

          {rightSlot}

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#88a9d8]/20 bg-white/[0.03] text-[#e8edf5] md:hidden"
            aria-expanded={mobileNav}
            aria-label="Menu"
            onClick={() => setMobileNav((o) => !o)}
          >
            {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileNav && (
        <div className="mx-auto mt-2 max-w-6xl rounded-2xl border border-[#88a9d8]/15 bg-[#080f1c]/95 p-4 shadow-xl backdrop-blur-2xl md:hidden">
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {links.map((link) => (
              <li key={link.href}>
                {link.href.startsWith('/') ? (
                  <Link
                    href={link.href}
                    className="block rounded-lg px-3 py-3 text-sm font-medium text-[#c5d4eb] no-underline hover:bg-white/[0.05]"
                    onClick={() => setMobileNav(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="block rounded-lg px-3 py-3 text-sm font-medium text-[#c5d4eb] no-underline hover:bg-white/[0.05]"
                    onClick={() => setMobileNav(false)}
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}
            <li>
              <a
                href="#"
                className="block rounded-lg px-3 py-3 text-sm font-medium text-[#c5d4eb] no-underline hover:bg-white/[0.05]"
                onClick={() => setMobileNav(false)}
              >
                Sign in
              </a>
            </li>
          </ul>
          <Link
            href="/videos"
            className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#ffc105] py-3 text-sm font-semibold text-[#0a0f18] no-underline shadow-[0_4px_24px_rgba(255,193,5,0.28)] transition hover:bg-[#ffcf3a]"
            onClick={() => setMobileNav(false)}
          >
            Watch
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          {rightSlot && <div className="mt-3">{rightSlot}</div>}
        </div>
      )}
    </header>
  );
}
