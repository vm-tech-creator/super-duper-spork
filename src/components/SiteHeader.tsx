import Link from 'next/link';
import { ReactNode } from 'react';

interface SiteHeaderProps {
  links?: { label: string; href: string }[];
  rightSlot?: ReactNode;
}

const defaultLinks = [
  { label: 'Home', href: '/' },
  { label: 'Games', href: '/games' },
];

export default function SiteHeader({ links = defaultLinks, rightSlot }: SiteHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-3 pt-3 sm:px-5 sm:pt-4">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl border border-[#88a9d8]/18 bg-[#080f1c]/88 px-3 py-2.5 pl-4 shadow-lg shadow-black/10 backdrop-blur-2xl transition-[background,border-color,box-shadow] duration-300">
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
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          {rightSlot}
        </div>
      </nav>
    </header>
  );
}
