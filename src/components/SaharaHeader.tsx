'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight, Moon, Sun } from 'lucide-react';
import { useTheme, type Theme } from '@/context/ThemeContext';
import SettingsMenu from './SettingsMenu';

interface SaharaHeaderProps {
  links?: { label: string; href: string }[];
  rightSlot?: ReactNode;
}

const defaultLinks = [
  { label: 'Videos', href: '/videos' },
  { label: 'Books', href: '/books' },
  { label: 'Music', href: '/music' },
  { label: 'Games', href: '/games' },
  { label: 'About', href: '/about' },
];

const themes: Theme[] = [
  'classic',
  'fancy',
  'neon',
  'minimal',
  'dark',
  'vibrant',
  'glassmorphism',
  'retro',
  'relax',
];

const themeLabels: Record<Theme, string> = {
  classic: 'Classic',
  fancy: 'Fancy',
  neon: 'Neon',
  minimal: 'Minimal',
  dark: 'Dark',
  vibrant: 'Vibrant',
  glassmorphism: 'Glass',
  retro: 'Retro',
  relax: 'Relax',
};

export default function SaharaHeader({ links = defaultLinks, rightSlot }: SaharaHeaderProps) {
  const [mobileNav, setMobileNav] = useState(false);
  const { theme, setTheme, lightDark, setLightDark, audience, setAudience } = useTheme();

  return (
    <header className="sahara-header fixed left-0 right-0 z-[100] px-3 sm:px-5">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-2 rounded-[var(--ui-radius-lg)] border px-2 py-2 pl-3 shadow-[var(--control-shadow)] transition-[background,border-color,box-shadow,color] duration-300 sm:gap-3 sm:px-4 sm:py-2.5 sm:pl-4 border-[var(--border)] bg-[var(--bg2)]/88 backdrop-blur-[var(--header-blur)]"
        style={{ color: 'var(--text)' }}
      >
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dim)] font-['Bebas_Neue'] text-xl text-[var(--bg)] shadow-[0_4px_20px_rgba(255,193,5,0.22)]">
            S
          </div>
          <div className="leading-tight">
            <div className="font-['Barlow_Condensed'] text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[var(--secondary-soft)]">
              Supersite
            </div>
            <div className="font-['Barlow_Condensed'] text-lg font-extrabold uppercase tracking-wide text-[var(--text)]">
              Sahara
            </div>
          </div>
        </Link>

        <ul className="hidden list-none items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] no-underline transition-colors hover:bg-white/[0.04] hover:text-[var(--gold)]"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="#"
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] no-underline transition-colors hover:bg-white/[0.04] hover:text-[var(--gold)]"
            >
              Sign in
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Theme + mode + audience — shared on every page */}
          <div className="flex items-center gap-1 rounded-[var(--ui-radius)] border border-[var(--border)] bg-[var(--surface)] p-0.5 sm:gap-1.5 sm:p-1">
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
            aria-label="Theme selector"
            className="max-w-[5.5rem] cursor-pointer rounded-[calc(var(--ui-radius)-2px)] border-0 bg-transparent px-1.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-[var(--text)] outline-none transition-colors hover:text-[var(--gold)] sm:max-w-none sm:px-2 sm:py-1.5 sm:text-[0.7rem]"
          >
            {themes.map((t) => (
              <option key={t} value={t} className="bg-[var(--bg2)] text-[var(--text)]">
                {themeLabels[t]}
              </option>
            ))}
          </select>

          <span className="hidden h-5 w-px bg-[var(--border)] sm:block" aria-hidden />

          <button
            type="button"
            onClick={() => setLightDark(lightDark === 'dark' ? 'light' : 'dark')}
            className="inline-flex h-8 w-8 items-center justify-center rounded-[calc(var(--ui-radius)-2px)] text-[var(--text)] transition-all duration-300 hover:bg-[var(--surface-elevated)] hover:text-[var(--gold)] sm:h-9 sm:w-9"
            aria-label={lightDark === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={lightDark === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {lightDark === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <span className="hidden h-5 w-px bg-[var(--border)] sm:block" aria-hidden />

          <div className="inline-flex items-center rounded-[calc(var(--ui-radius)-2px)] p-0.5">
            <button
              type="button"
              onClick={() => setAudience('kid')}
              className={`rounded-[calc(var(--ui-radius)-4px)] px-2 py-1 text-[0.65rem] font-semibold uppercase transition-all duration-300 sm:px-2.5 sm:text-xs ${
                audience === 'kid'
                  ? 'bg-[var(--gold)] text-[var(--bg)] shadow-md'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
              aria-pressed={audience === 'kid'}
            >
              Kid
            </button>
            <button
              type="button"
              onClick={() => setAudience('adult')}
              className={`rounded-[calc(var(--ui-radius)-4px)] px-2 py-1 text-[0.65rem] font-semibold uppercase transition-all duration-300 sm:px-2.5 sm:text-xs ${
                audience === 'adult'
                  ? 'bg-[var(--gold)] text-[var(--bg)] shadow-md'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
              aria-pressed={audience === 'adult'}
            >
              Adult
            </button>
          </div>
          </div>

          <Link
            href="/videos"
            className="hidden items-center gap-2 rounded-xl bg-[var(--gold)] px-3 py-2 sm:px-4 text-xs sm:text-sm font-semibold text-[var(--bg)] no-underline shadow-[0_4px_24px_rgba(255,193,5,0.28)] transition hover:bg-[var(--gold-dim)] sm:inline-flex"
          >
            Watch
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden />
          </Link>

          {rightSlot}

          <SettingsMenu />

          <button
            type="button"
            className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] md:hidden transition-all duration-300 hover:border-[var(--gold)]"
            aria-expanded={mobileNav}
            aria-label="Menu"
            onClick={() => setMobileNav((o) => !o)}
          >
            {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileNav && (
        <div className="mx-auto mt-2 max-w-7xl rounded-2xl border border-[var(--border)] bg-[var(--bg2)]/95 p-4 shadow-xl backdrop-blur-2xl md:hidden">
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg px-3 py-3 text-sm font-medium text-[var(--text)] no-underline hover:bg-[var(--surface)]"
                  onClick={() => setMobileNav(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="#"
                className="block rounded-lg px-3 py-3 text-sm font-medium text-[var(--text)] no-underline hover:bg-[var(--surface)]"
                onClick={() => setMobileNav(false)}
              >
                Sign in
              </a>
            </li>
          </ul>

          {/* Mobile Theme Controls */}
          <div className="mt-3 flex flex-col gap-2 border-t border-[var(--border)] pt-3">
            <label className="text-xs font-semibold uppercase text-[var(--muted)]">Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as Theme)}
              aria-label="Theme selector"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold uppercase text-[var(--text)] cursor-pointer transition-all hover:border-[var(--gold)]"
            >
              {themes.map((t) => (
                <option key={t} value={t} className="bg-[var(--bg2)] text-[var(--text)]">
                  {themeLabels[t]}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => setLightDark(lightDark === 'dark' ? 'light' : 'dark')}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2 text-sm font-semibold text-[var(--text)] transition-all hover:border-[var(--gold)] hover:bg-[var(--surface-elevated)]"
              >
                {lightDark === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {lightDark === 'dark' ? 'Light' : 'Dark'}
              </button>

              <div className="flex-1 inline-flex items-center rounded-lg border border-[var(--border)] bg-[var(--surface)]">
                <button
                  onClick={() => setAudience('kid')}
                  className={`flex-1 py-2 text-sm font-semibold uppercase rounded-md transition-all ${
                    audience === 'kid'
                      ? 'bg-[var(--gold)] text-[var(--bg)] shadow-md'
                      : 'text-[var(--muted)] hover:text-[var(--text)]'
                  }`}
                >
                  Kid
                </button>
                <button
                  onClick={() => setAudience('adult')}
                  className={`flex-1 py-2 text-sm font-semibold uppercase rounded-md transition-all ${
                    audience === 'adult'
                      ? 'bg-[var(--gold)] text-[var(--bg)] shadow-md'
                      : 'text-[var(--muted)] hover:text-[var(--text)]'
                  }`}
                >
                  Adult
                </button>
              </div>
            </div>
          </div>

          <Link
            href="/videos"
            className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[var(--gold)] py-3 text-sm font-semibold text-[var(--bg)] no-underline shadow-[0_4px_24px_rgba(255,193,5,0.28)] transition hover:bg-[var(--gold-dim)]"
            onClick={() => setMobileNav(false)}
          >
            Start watching
          </Link>
          {rightSlot && <div className="mt-3">{rightSlot}</div>}
        </div>
      )}
    </header>
  );
}
