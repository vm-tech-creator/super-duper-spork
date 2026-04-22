'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Clapperboard,
  Gamepad2,
  Layers,
  LayoutGrid,
  Menu,
  MousePointer2,
  Music2,
  Palette,
  Play,
  Sparkles,
  Zap,
  X,
} from 'lucide-react';

/** Real comedy clips — opens YouTube or TikTok in a new tab. */
const SPOTLIGHT_VIDEOS = [
  {
    title: 'Key & Peele — Substitute Teacher',
    creator: 'Comedy Central',
    views: '220M+',
    duration: '3',
    color: '#1e40af',
    tags: ['Entertaining', 'Creative'],
    platform: 'youtube' as const,
    href: 'https://www.youtube.com/watch?v=cN7n8C00LJw',
  },
  {
    title: 'history of the entire world, i guess',
    creator: 'bill wurtz',
    views: '190M+',
    duration: '20',
    color: '#7c3aed',
    tags: ['Educational', 'Entertaining', 'Creative'],
    platform: 'youtube' as const,
    href: 'https://www.youtube.com/watch?v=h3Yfk_uaexU',
  },
  {
    title: 'Old Spice | The Man Your Man Could Smell Like',
    creator: 'Old Spice',
    views: '62M+',
    duration: '1',
    color: '#047857',
    tags: ['Entertaining', 'Lifestyle'],
    platform: 'youtube' as const,
    href: 'https://www.youtube.com/watch?v=owGykVbfgUE',
  },
  {
    title: 'Dramatic Chipmunk',
    creator: 'YouTube classic',
    views: '50M+',
    duration: '0',
    color: '#ea580c',
    tags: ['Entertaining'],
    platform: 'youtube' as const,
    href: 'https://www.youtube.com/watch?v=a1Y73sPHCXw',
  },
  {
    title: 'Khaby Lame — “Why though?”',
    creator: '@khaby.lame',
    views: 'TikTok',
    duration: '1',
    color: '#0891b2',
    tags: ['Entertaining', 'Lifestyle'],
    platform: 'tiktok' as const,
    href: 'https://www.tiktok.com/@khaby.lame/video/6979606181463526661',
  },
  {
    title: 'Potter Puppet Pals: The Mysterious Ticking Noise',
    creator: 'Neil Cicierega',
    views: '20M+',
    duration: '2',
    color: '#be185d',
    tags: ['Entertaining', 'Creative'],
    platform: 'youtube' as const,
    href: 'https://www.youtube.com/watch?v=eRBOgtFF0rk',
  },
  {
    title: 'Evolution of Dance',
    creator: 'Judson Laipply',
    views: '10M+',
    duration: '6',
    color: '#4f46e5',
    tags: ['Entertaining', 'Creative'],
    platform: 'youtube' as const,
    href: 'https://www.youtube.com/watch?v=dMH0bHeRRN0',
  },
  {
    title: 'Double Rainbow (all the way)',
    creator: 'Yosemitebear62',
    views: '50M+',
    duration: '3',
    color: '#b45309',
    tags: ['Entertaining', 'Lifestyle'],
    platform: 'youtube' as const,
    href: 'https://www.youtube.com/watch?v=OQSNhk5ICTI',
  },
  {
    title: 'NBA on TikTok — buzzer-beater chaos',
    creator: '@nba',
    views: 'TikTok',
    duration: '1',
    color: '#ea580c',
    tags: ['Entertaining', 'Creative'],
    platform: 'tiktok' as const,
    href: 'https://www.tiktok.com/@nba/video/6916828043552223496',
  },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [siteMode, setSiteMode] = useState<'classic' | 'fancy' | 'neon' | 'minimal' | 'dark' | 'vibrant' | 'glassmorphism'>('classic');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const rootBg: Record<typeof siteMode, string> = {
      classic: '#060a12',
      fancy: '#0d1420',
      neon: '#000000',
      minimal: '#0f1419',
      dark: '#0a0e1a',
      vibrant: '#16213e',
      glassmorphism: '#0a1524',
    };
    document.documentElement.style.setProperty('--bg', rootBg[siteMode]);
  }, [siteMode]);

  useEffect(() => {
    // Particles animation
    const pc = document.getElementById('particles');
    if (pc) {
      const colors = ['#ffc105','#497ab6','#2b4c7d','#ffffff'];
      for (let i = 0; i < 14; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 4 + 1;
        p.style.cssText = `
          width:${size}px; height:${size}px;
          left:${Math.random()*100}%;
          background:${colors[Math.floor(Math.random()*colors.length)]};
          animation-duration:${Math.random()*14+8}s;
          animation-delay:${Math.random()*10}s;
        `;
        pc.appendChild(p);
      }
    }

    // Counter animation
    const counters = document.querySelectorAll('[data-target]');
    const animateCounter = (el: HTMLElement) => {
      const target = +el.dataset.target!;
      const duration = 1800;
      const step = target / (duration / 16);
      let current = 0;
      const t = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target + (target >= 100 ? 'M+' : target < 10 ? '' : '+');
          clearInterval(t);
        } else {
          el.textContent = Math.floor(current) + '+';
        }
      }, 16);
    };
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target as HTMLElement);
          statsObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => statsObserver.observe(c));

    // Scroll reveal
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.transitionDelay = (i * 80) + 'ms';
          e.target.classList.add('visible');
          revealObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  }, []);

  const getModeStyles = () => {
    const bases: Record<
      typeof siteMode,
      {
        accentColor: string;
        textPrimary: string;
        textSecondary: string;
        cardBg: string;
        borderColor: string;
        glow: string;
        viewportBg: string;
        contentShell: string;
        meshBlob1: string;
        meshBlob2: string;
        sectionCategories: string;
        sectionVideos: string;
        sectionWhy: string;
        sectionFooter: string;
      }
    > = {
      classic: {
        accentColor: '#ffc105',
        textPrimary: '#e8edf5',
        textSecondary: '#7a93b4',
        cardBg: '#101e34',
        borderColor: 'rgba(73,122,182,.2)',
        glow: 'rgba(255,193,5,.4)',
        viewportBg: `
          radial-gradient(ellipse 100% 80% at 50% -20%, rgba(73, 122, 182, 0.28) 0%, transparent 55%),
          radial-gradient(ellipse 60% 50% at 100% 50%, rgba(43, 76, 125, 0.35) 0%, transparent 50%),
          radial-gradient(ellipse 50% 40% at 0% 80%, rgba(255, 193, 5, 0.08) 0%, transparent 45%),
          linear-gradient(180deg, #060a12 0%, #0a1422 40%, #0c1829 100%)
        `,
        contentShell: '',
        meshBlob1: 'radial-gradient(circle, rgba(255,193,5,0.35) 0%, transparent 65%)',
        meshBlob2: 'radial-gradient(circle, rgba(73,122,182,0.45) 0%, transparent 65%)',
        sectionCategories: 'border-t border-[#88a9d8]/10 bg-[#0a1422]',
        sectionVideos: 'bg-[#080f1c]',
        sectionWhy: 'border-t border-[#88a9d8]/10 bg-gradient-to-b from-[#0a1422] to-[#060a12]',
        sectionFooter: 'border-t border-[#88a9d8]/10 bg-[#050810]',
      },
      fancy: {
        accentColor: '#ffc105',
        textPrimary: '#e8edf5',
        textSecondary: '#7a93b4',
        cardBg: '#101e34',
        borderColor: '#ffc105',
        glow: 'rgba(255,193,5,.5)',
        viewportBg: `
          radial-gradient(ellipse 80% 60% at 70% 20%, rgba(255, 193, 5, 0.14) 0%, transparent 50%),
          radial-gradient(ellipse 60% 50% at 10% 60%, rgba(73, 122, 182, 0.22) 0%, transparent 50%),
          linear-gradient(135deg, #080f1c 0%, #1a1f3a 45%, #0d1a2e 100%)
        `,
        contentShell: '',
        meshBlob1: 'radial-gradient(circle, rgba(255,193,5,0.4) 0%, transparent 65%)',
        meshBlob2: 'radial-gradient(circle, rgba(120,140,220,0.35) 0%, transparent 65%)',
        sectionCategories: 'border-t border-[#ffc105]/15 bg-gradient-to-b from-[#12182a] to-[#0a1422]',
        sectionVideos: 'bg-gradient-to-br from-[#0d1a2e] via-[#101e34] to-[#080f1c]',
        sectionWhy: 'border-t border-[#ffc105]/12 bg-gradient-to-b from-[#101e34] via-[#0d1a2e] to-[#080f1c]',
        sectionFooter: 'border-t border-[#ffc105]/12 bg-[#060a12]',
      },
      neon: {
        accentColor: '#00ff88',
        textPrimary: '#00ff88',
        textSecondary: '#00ff88',
        cardBg: '#0a0a0a',
        borderColor: '#00ff88',
        glow: '#00ff88',
        viewportBg: `
          radial-gradient(ellipse 100% 80% at 50% -30%, rgba(0, 255, 136, 0.16) 0%, transparent 55%),
          radial-gradient(ellipse 50% 40% at 100% 80%, rgba(255, 0, 255, 0.08) 0%, transparent 45%),
          linear-gradient(180deg, #000000 0%, #030303 50%, #000000 100%)
        `,
        contentShell: '',
        meshBlob1: 'radial-gradient(circle, rgba(0,255,136,0.28) 0%, transparent 65%)',
        meshBlob2: 'radial-gradient(circle, rgba(255,0,255,0.2) 0%, transparent 65%)',
        sectionCategories: 'border-t border-[#00ff88]/20 bg-[#000000]',
        sectionVideos: 'bg-[#000000]',
        sectionWhy: 'border-t border-[#00ff88]/15 bg-gradient-to-b from-[#000000] to-[#030303]',
        sectionFooter: 'border-t border-[#00ff88]/15 bg-[#000000]',
      },
      minimal: {
        accentColor: '#7a93b4',
        textPrimary: '#e8edf5',
        textSecondary: '#7a93b4',
        cardBg: '#1a1f2e',
        borderColor: 'rgba(122,147,180,.2)',
        glow: 'rgba(122,147,180,.2)',
        viewportBg: `
          radial-gradient(ellipse 80% 55% at 50% -10%, rgba(122, 147, 180, 0.08) 0%, transparent 50%),
          linear-gradient(180deg, #0f1419 0%, #121820 50%, #0f1419 100%)
        `,
        contentShell: '',
        meshBlob1: 'radial-gradient(circle, rgba(122,147,180,0.18) 0%, transparent 65%)',
        meshBlob2: 'radial-gradient(circle, rgba(90,110,140,0.15) 0%, transparent 65%)',
        sectionCategories: 'border-t border-[rgba(122,147,180,.12)] bg-[#121820]',
        sectionVideos: 'bg-[#0f1419]',
        sectionWhy: 'border-t border-[rgba(122,147,180,.1)] bg-gradient-to-b from-[#121820] to-[#0f1419]',
        sectionFooter: 'border-t border-[rgba(122,147,180,.1)] bg-[#0a0d12]',
      },
      dark: {
        accentColor: '#496bb0',
        textPrimary: '#d0d8e8',
        textSecondary: '#8899c5',
        cardBg: '#0f1520',
        borderColor: 'rgba(73,107,176,.3)',
        glow: 'rgba(73,107,176,.3)',
        viewportBg: `
          radial-gradient(ellipse 90% 70% at 50% 0%, rgba(73, 107, 176, 0.14) 0%, transparent 55%),
          linear-gradient(180deg, #0a0e1a 0%, #0c1018 100%)
        `,
        contentShell: '',
        meshBlob1: 'radial-gradient(circle, rgba(73,107,176,0.3) 0%, transparent 65%)',
        meshBlob2: 'radial-gradient(circle, rgba(45,65,110,0.35) 0%, transparent 65%)',
        sectionCategories: 'border-t border-[rgba(73,107,176,.15)] bg-[#0a0e1a]',
        sectionVideos: 'bg-[#0a0e1a]',
        sectionWhy: 'border-t border-[rgba(73,107,176,.12)] bg-gradient-to-b from-[#0c1018] to-[#0a0e1a]',
        sectionFooter: 'border-t border-[rgba(73,107,176,.12)] bg-[#060910]',
      },
      vibrant: {
        accentColor: '#e94560',
        textPrimary: '#ffffffff',
        textSecondary: '#eeffff',
        cardBg: '#1a2a3a',
        borderColor: '#e94560',
        glow: 'rgba(233,69,96,.4)',
        viewportBg: `
          radial-gradient(ellipse 70% 50% at 80% 10%, rgba(233, 69, 96, 0.38) 0%, transparent 55%),
          radial-gradient(ellipse 60% 45% at 10% 70%, rgba(255, 255, 255, 0.09) 0%, transparent 50%),
          linear-gradient(135deg, #1a0a2e 0%, #16213e 40%, #0f3460 100%)
        `,
        contentShell: '',
        meshBlob1: 'radial-gradient(circle, rgba(233,69,96,0.35) 0%, transparent 65%)',
        meshBlob2: 'radial-gradient(circle, rgba(100,180,255,0.25) 0%, transparent 65%)',
        sectionCategories: 'border-t border-[#e94560]/25 bg-gradient-to-b from-[#1a1528] to-[#0f2850]',
        sectionVideos: 'bg-gradient-to-br from-[#1a0a2e] via-transparent to-[#0f3460]',
        sectionWhy: 'border-t border-[#e94560]/20 bg-gradient-to-b from-[#16213e] to-[#0f3460]',
        sectionFooter: 'border-t border-[#e94560]/20 bg-[#0a0614]',
      },
      glassmorphism: {
        accentColor: '#ffc105',
        textPrimary: '#e8edf5',
        textSecondary: '#7a93b4',
        cardBg: 'rgba(16,30,52,.28)',
        borderColor: 'rgba(255,193,5,.2)',
        glow: 'rgba(255,193,5,.2)',
        viewportBg: `
          radial-gradient(ellipse 75% 55% at 15% 25%, rgba(255, 193, 5, 0.38) 0%, transparent 50%),
          radial-gradient(ellipse 65% 50% at 90% 20%, rgba(73, 122, 182, 0.55) 0%, transparent 55%),
          radial-gradient(ellipse 55% 45% at 50% 100%, rgba(43, 76, 125, 0.48) 0%, transparent 50%),
          linear-gradient(160deg, #0a1628 0%, #152a48 38%, #1e4070 100%)
        `,
        contentShell: 'bg-[#0a1524]/[0.18] backdrop-blur-2xl',
        meshBlob1: 'radial-gradient(circle, rgba(255,193,5,0.45) 0%, transparent 65%)',
        meshBlob2: 'radial-gradient(circle, rgba(73,122,182,0.5) 0%, transparent 65%)',
        sectionCategories: 'border-t border-white/10 bg-[#ffffff]/[0.07] backdrop-blur-xl',
        sectionVideos: 'bg-[#ffffff]/[0.06] backdrop-blur-xl',
        sectionWhy: 'border-t border-white/10 bg-gradient-to-b from-[#ffffff]/[0.08] to-[#0a1524]/[0.12] backdrop-blur-xl',
        sectionFooter: 'border-t border-white/10 bg-[#040a14]/55 backdrop-blur-lg',
      },
    };
    return bases[siteMode] || bases.classic;
  };

  const modeStyle = getModeStyles();
  const visibleSpotlightVideos = SPOTLIGHT_VIDEOS.filter(
    (v) => activeCategory === 'All' || v.tags.includes(activeCategory)
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: modeStyle.viewportBg }}
      />
      <header className="fixed top-0 left-0 right-0 z-[100] px-3 pt-3 sm:px-5 sm:pt-4">
        <nav
          className={`mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-2xl border px-3 py-2.5 pl-4 shadow-lg shadow-black/10 transition-[background,border-color,box-shadow] duration-300 sm:px-5 sm:py-3 ${
            scrolled
              ? 'border-[#88a9d8]/18 bg-[#080f1c]/88 backdrop-blur-2xl'
              : 'border-white/[0.07] bg-[#080f1c]/50 backdrop-blur-xl'
          }`}
        >
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
            {[
              ['Videos', '/videos'],
              ['Explore', '#categories'],
              ['Features', '#why'],
              ['About', '#about'],
            ].map(([label, href]) => (
              <li key={label}>
                {href.startsWith('/') ? (
                  <Link
                    href={href}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-[#8ba3c4] no-underline transition-colors hover:bg-white/[0.04] hover:text-[#ffc105]"
                  >
                    {label}
                  </Link>
                ) : (
                  <a
                    href={href}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-[#8ba3c4] no-underline transition-colors hover:bg-white/[0.04] hover:text-[#ffc105]"
                  >
                    {label}
                  </a>
                )}
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
              className={`max-w-[7.5rem] cursor-pointer rounded-xl border py-2 pl-3 pr-8 text-[0.7rem] font-semibold uppercase tracking-wide sm:max-w-none sm:text-xs ${
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
                  : 'border-[#88a9d8]/25 bg-[#0c1829]/90 text-[#e8edf5]'
              }`}
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
              {[
                ['Videos', '/videos'],
                ['Explore', '#categories'],
                ['Features', '#why'],
                ['About', '#about'],
              ].map(([label, href]) => (
                <li key={label}>
                  {href.startsWith('/') ? (
                    <Link
                      href={href}
                      className="block rounded-lg px-3 py-3 text-sm font-medium text-[#c5d4eb] no-underline hover:bg-white/[0.05]"
                      onClick={() => setMobileNav(false)}
                    >
                      {label}
                    </Link>
                  ) : (
                    <a
                      href={href}
                      className="block rounded-lg px-3 py-3 text-sm font-medium text-[#c5d4eb] no-underline hover:bg-white/[0.05]"
                      onClick={() => setMobileNav(false)}
                    >
                      {label}
                    </a>
                  )}
                </li>
              ))}
              <li>
                <Link
                  href="/videos"
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#ffc105] py-3 text-sm font-semibold text-[#0a0f18] no-underline"
                  onClick={() => setMobileNav(false)}
                >
                  Start watching
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>
      <div
        className={`relative z-10 min-h-screen overflow-x-hidden ${modeStyle.contentShell}`.trim()}
        style={{ color: modeStyle.textPrimary }}
      >
      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-28 pb-24" id="home">
        <div
          className="hero-mesh-blob pointer-events-none absolute -right-32 top-1/4 h-[min(80vw,520px)] w-[min(80vw,520px)] rounded-full opacity-40 blur-3xl"
          style={{ background: modeStyle.meshBlob1 }}
        />
        <div
          className="hero-mesh-blob pointer-events-none absolute -left-40 bottom-0 h-[min(90vw,480px)] w-[min(90vw,480px)] rounded-full opacity-35 blur-3xl [animation-delay:-6s]"
          style={{ background: modeStyle.meshBlob2 }}
        />

        <div id="particles" className="pointer-events-none absolute inset-0 overflow-hidden opacity-60" />

        <svg className="pointer-events-none absolute bottom-0 left-0 h-[min(28vh,200px)] w-full text-[#2b4c7d]/25" viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden>
          <path
            fill="currentColor"
            d="M0,160 C320,120 520,40 720,80 C920,120 1120,180 1440,100 L1440,200 L0,200 Z"
          />
        </svg>

        <div className="relative z-10 mx-auto max-w-5xl px-5 text-center sm:px-8">
          <div className="animate-fade-down mb-8 inline-flex items-center gap-2 rounded-full border border-[#ffc105]/25 bg-[#ffc105]/[0.07] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#ffc105] backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            One hub for play, watch, learn
          </div>

          <h1
            className={`animate-fade-up font-['Bebas_Neue'] text-[clamp(3.25rem,10vw,6.75rem)] leading-[0.95] tracking-[0.02em] ${
              siteMode === 'neon'
                ? 'text-[#00ff88]'
                : siteMode === 'fancy'
                ? 'bg-gradient-to-br from-[#f0f4fa] via-[#ffc105] to-[#497ab6] bg-clip-text text-transparent'
                : siteMode === 'vibrant'
                ? 'text-white'
                : siteMode === 'minimal'
                ? 'text-[#8ba3c4]'
                : 'text-[#f0f4fa]'
            }`}
          >
            Explore without
            <br />
            <span
              className={
                siteMode === 'neon'
                  ? 'text-[#ff79e6]'
                  : siteMode === 'vibrant'
                  ? 'text-[#ff7a9c]'
                  : 'bg-gradient-to-r from-[#ffc105] to-[#88a9d8] bg-clip-text text-transparent'
              }
            >
              the clutter
            </span>
          </h1>

          <p className="animate-fade-up mx-auto mt-6 max-w-xl text-base font-medium leading-relaxed text-[#8ba3c4] sm:text-lg">
            Sahara brings games, video, music, and learning together in one calm, fast interface—so you spend less time hunting and more time enjoying.
          </p>

          <div className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/videos"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#ffc105] px-7 py-3.5 text-sm font-semibold text-[#0a0f18] no-underline shadow-[0_8px_32px_rgba(255,193,5,0.25)] transition hover:-translate-y-0.5 hover:bg-[#ffcf3a]"
            >
              <Play className="h-4 w-4 fill-current" aria-hidden />
              Watch LaughTube
            </Link>
            <a
              href="#categories"
              className="inline-flex items-center gap-2 rounded-2xl border border-[#88a9d8]/25 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-[#e8edf5] no-underline backdrop-blur-sm transition hover:border-[#88a9d8]/45 hover:bg-white/[0.06]"
            >
              Browse spaces
              <ArrowRight className="h-4 w-4 opacity-70" aria-hidden />
            </a>
          </div>

          <div className="animate-fade-up mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-0 sm:rounded-3xl sm:border sm:border-[#88a9d8]/12 sm:bg-[#0c1829]/50 sm:px-6 sm:py-8 sm:backdrop-blur-md">
            {[
              ['250', 'Million people'],
              ['10', 'M+ catalog items'],
              ['190', 'Countries'],
              ['4', 'Core worlds'],
            ].map(([target, sub], i) => (
              <div
                key={sub}
                className={`relative text-center ${i > 0 ? 'sm:before:absolute sm:before:left-0 sm:before:top-1/2 sm:before:h-10 sm:before:w-px sm:before:-translate-y-1/2 sm:before:bg-[#88a9d8]/15' : ''}`}
              >
                <div className="font-['Bebas_Neue'] text-4xl leading-none text-[#ffc105] sm:text-[2.75rem]" data-target={target}>
                  0
                </div>
                <div className="mt-1.5 text-[0.65rem] font-medium uppercase tracking-[0.12em] text-[#8ba3c4]">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className={`px-[5%] py-24 ${modeStyle.sectionCategories}`} id="categories">
        <div className="mx-auto max-w-6xl">
          <div className="reveal mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#88a9d8]">Spaces</p>
              <h2 className="font-['Bebas_Neue'] text-[clamp(2.5rem,5vw,3.5rem)] leading-none tracking-wide text-[#f0f4fa]">
                Pick a world
                <span className="text-[#ffc105]">.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-[#8ba3c4] md:text-base">
              Each area is tuned for discovery—same palette and navigation everywhere so you always know where you are.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Games',
                desc: 'Casual to epic—genres for every mood and session length.',
                icon: Gamepad2,
                href: '#categories',
                cta: 'Browse games',
                num: '01',
              },
              {
                title: 'Videos',
                desc: 'LaughTube and more—curated, family-aware picks with a cleaner UI.',
                icon: Clapperboard,
                href: '/videos',
                cta: 'Open videos',
                num: '02',
              },
              {
                title: 'Music',
                desc: 'Playlists, live sets, and artist journeys in one flow.',
                icon: Music2,
                href: '#categories',
                cta: 'Listen',
                num: '03',
              },
              {
                title: 'Education',
                desc: 'Courses and explainers from institutions and indie experts alike.',
                icon: BookOpen,
                href: '#categories',
                cta: 'Learn',
                num: '04',
              },
            ].map((cat) => {
              const Icon = cat.icon;
              const inner = (
                <>
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ffc105]/[0.07] via-transparent to-[#497ab6]/10" />
                  </div>
                  <div className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#88a9d8]/15 bg-[#0c1829]/80 text-[#ffc105] shadow-inner">
                    <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                  </div>
                  <h3 className="relative z-10 font-['Barlow_Condensed'] text-xl font-bold uppercase tracking-wide text-[#f0f4fa]">
                    {cat.title}
                  </h3>
                  <p className="relative z-10 mt-2 text-sm leading-relaxed text-[#8ba3c4]">{cat.desc}</p>
                  <span className="absolute right-5 top-5 font-['Bebas_Neue'] text-5xl text-[#f0f4fa]/[0.04]">{cat.num}</span>
                  <div className="relative z-10 mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#ffc105] transition-[gap] group-hover:gap-3">
                    {cat.cta}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </div>
                </>
              );
              const cardClass =
                'group reveal relative overflow-hidden rounded-2xl border border-[#88a9d8]/12 bg-[#0c1829]/70 p-8 pb-7 shadow-[0_4px_40px_rgba(0,0,0,0.2)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#ffc105]/25 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]';
              return cat.href.startsWith('/') ? (
                <Link key={cat.title} href={cat.href} className={`${cardClass} block no-underline`}>
                  {inner}
                </Link>
              ) : (
                <a key={cat.title} href={cat.href} className={`${cardClass} block no-underline`}>
                  {inner}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trending Videos - Entertainment Section */}
      <section className={`py-[120px] px-[5%] ${modeStyle.sectionVideos}`} id="videos">
        <div className="max-w-[1400px] mx-auto">
          <div className="reveal mb-14 max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#88a9d8]">Spotlight</p>
            <h2 className="font-['Bebas_Neue'] text-[clamp(2.25rem,4.5vw,3.25rem)] leading-none tracking-wide text-[#f0f4fa]">
              Short-form picks
              <span className="text-[#ffc105]">.</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#8ba3c4] sm:text-base">
              Tap a card to open a classic funny clip on{' '}
              <span className="font-medium text-[#e8edf5]">YouTube</span> or{' '}
              <span className="font-medium text-[#e8edf5]">TikTok</span> in a new tab. More on{' '}
              <Link href="/videos" className="font-medium text-[#ffc105] no-underline hover:underline">
                LaughTube
              </Link>
              .
            </p>
          </div>

          <div className="reveal mb-10 flex flex-wrap gap-2">
            {['All', 'Entertaining', 'Educational', 'Creative', 'Lifestyle'].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  activeCategory === category
                    ? 'bg-[#ffc105] text-[#0a0f18] shadow-[0_4px_20px_rgba(255,193,5,0.2)]'
                    : 'border border-[#88a9d8]/18 bg-[#0c1829]/50 text-[#8ba3c4] hover:border-[#88a9d8]/35 hover:text-[#e8edf5]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Videos Grid with Player Boxes */}
          {visibleSpotlightVideos.length === 0 ? (
            <p className="reveal text-sm text-[#8ba3c4]">Nothing in this filter—pick &quot;All&quot; or another vibe.</p>
          ) : (
          <div className={`grid gap-5 ${siteMode === 'minimal' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
            {visibleSpotlightVideos.map((video, idx) => {
              const openLabel = `Open “${video.title}” on ${video.platform} in a new tab`;
              if (siteMode === 'fancy') {
                return (
                  <a key={idx} href={video.href} target="_blank" rel="noopener noreferrer" aria-label={openLabel} className="group reveal block cursor-pointer no-underline text-inherit">
                    <div className="relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.05] hover:-rotate-1 shadow-xl">
                      {/* Video Player Box */}
                      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a2e4a] to-[#0d1a2e] aspect-video">
                        <div className="absolute inset-0 background-animate opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle, ${video.color}, transparent)` }}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-6xl mb-4 group-hover:scale-150 transition-transform duration-500">▶️</div>
                            <p className="text-[#ffc105] font-black text-sm">CLICK TO PLAY</p>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ffc105] to-[#497ab6] group-hover:h-2 transition-all duration-300"></div>
                      </div>
                      <div className="absolute top-4 right-4 bg-[rgba(0,0,0,.7)] border border-[#ffc105] px-3 py-1.5 rounded-full text-[.7rem] font-bold uppercase text-[#ffc105]">
                        {video.duration}s
                      </div>
                      <div className="bg-gradient-to-b from-[#101e34] to-[#0d1a2e] border-2 border-t-0 border-[#ffc105] p-5 rounded-b-2xl">
                        <h3 className="text-[#ffc105] font-black text-[1rem] mb-2 line-clamp-2">{video.title}</h3>
                        <div className="flex items-center justify-between">
                          <p className="text-[#7a93b4] text-[.8rem]">{video.creator}</p>
                          <span className="text-[#ffc105] font-bold drop-shadow-[0_0_8px_rgba(255,193,5,.5)]">⭐ {video.views}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              } else if (siteMode === 'neon') {
                return (
                  <a key={idx} href={video.href} target="_blank" rel="noopener noreferrer" aria-label={openLabel} className="group reveal block cursor-pointer no-underline text-inherit">
                    <div className="relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-[1.08] hover:shadow-[0_0_30px_#00ff88]">
                      {/* Video Player Box */}
                      <div className="relative overflow-hidden rounded-lg bg-[#000000] aspect-video border-2 border-[#00ff88]">
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(circle, ${video.color}33, transparent)` }}>
                          <div className="text-4xl text-[#00ff88] drop-shadow-[0_0_10px_#00ff88]">▶️</div>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 bg-[#00ff88] text-[#000000] px-2 py-1 rounded font-mono text-[.7rem] font-bold">
                        {video.duration}s
                      </div>
                      <div className="bg-[#0a0a0a] border-2 border-t-0 border-[#ff00ff] p-4 rounded-b-lg">
                        <h3 className="text-[#00ff88] font-mono text-[.9rem] mb-1 line-clamp-2 drop-shadow-[0_0_10px_#00ff88]">{video.title}</h3>
                        <p className="text-[#ff00ff] text-[.75rem] font-mono">{video.creator}</p>
                      </div>
                    </div>
                  </a>
                );
              } else if (siteMode === 'vibrant') {
                return (
                  <a key={idx} href={video.href} target="_blank" rel="noopener noreferrer" aria-label={openLabel} className="group reveal block cursor-pointer no-underline text-inherit">
                    <div className="relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.05] shadow-lg">
                      {/* Video Player Box */}
                      <div className="relative overflow-hidden rounded-xl aspect-video border-2 border-[#e94560]" style={{ background: `linear-gradient(135deg, ${video.color}20, transparent)` }}>
                        <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-100 opacity-70 transition-opacity">
                          <div className="text-5xl text-[#e94560] group-hover:scale-125 transition-transform">{parseInt(video.duration) < 50 ? '🎯' : parseInt(video.duration) < 70 ? '⚡' : '🔥'}</div>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 bg-[#e94560] text-white px-3 py-1 rounded-full text-[.7rem] font-bold">
                        {video.duration}sec
                      </div>
                      <div className="bg-gradient-to-r from-[#1a2a3a] to-[#0f3460] border-2 border-t-0 border-[#e94560] p-4 rounded-b-xl">
                        <h3 className="text-white font-bold text-[.95rem] mb-2 line-clamp-2">{video.title}</h3>
                        <div className="flex justify-between text-[.75rem]">
                          <span className="text-[#eeffff]">{video.creator}</span>
                          <span className="text-[#e94560] font-bold">👁 {video.views}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              } else if (siteMode === 'dark') {
                return (
                  <a key={idx} href={video.href} target="_blank" rel="noopener noreferrer" aria-label={openLabel} className="group reveal block cursor-pointer no-underline text-inherit">
                    <div className="relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(73,107,176,.4)]">
                      {/* Video Player Box */}
                      <div className="relative overflow-hidden rounded-lg bg-[#0f1520] aspect-video border border-[rgba(73,107,176,.3)]">
                        <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-100 opacity-60">
                          <div className="text-5xl text-[#496bb0]">▶️</div>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 bg-[#496bb0] text-[#d0d8e8] px-2 py-1 rounded text-[.7rem] font-bold">
                        {video.duration}s
                      </div>
                      <div className="bg-[#0f1520] border border-t-0 border-[rgba(73,107,176,.3)] p-4 rounded-b-lg">
                        <h3 className="text-[#d0d8e8] font-semibold text-[.9rem] mb-1 line-clamp-2">{video.title}</h3>
                        <p className="text-[#8899c5] text-[.75rem]">{video.creator}</p>
                      </div>
                    </div>
                  </a>
                );
              } else if (siteMode === 'glassmorphism') {
                return (
                  <a key={idx} href={video.href} target="_blank" rel="noopener noreferrer" aria-label={openLabel} className="group reveal block cursor-pointer no-underline text-inherit">
                    <div className="relative overflow-hidden rounded-xl transition-all duration-300 backdrop-blur-md hover:scale-105">
                      {/* Video Player Box */}
                      <div className="relative overflow-hidden rounded-xl bg-[#ffffff]/[0.06] backdrop-blur-md aspect-video border border-[#ffffff]/15">
                        <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-100 opacity-70">
                          <div className="w-16 h-16 rounded-full bg-[#ffc105]/20 flex items-center justify-center group-hover:scale-125 transition-transform backdrop-blur-sm">
                            <div className="text-4xl">▶️</div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 bg-[#ffc105]/20 backdrop-blur-sm border border-[#ffc105]/40 px-3 py-1 rounded-full text-[.7rem] font-bold text-[#ffc105]">
                        {video.duration}s
                      </div>
                      <div className="bg-[#ffffff]/[0.05] backdrop-blur-md border-t border-[#ffffff]/20 rounded-b-xl p-4">
                        <h3 className="text-[#e8edf5] font-semibold text-[.9rem] mb-1 line-clamp-2">{video.title}</h3>
                        <p className="text-[#b8c5dd] text-[.75rem]">{video.creator}</p>
                      </div>
                    </div>
                  </a>
                );
              } else if (siteMode === 'minimal') {
                return (
                  <a key={idx} href={video.href} target="_blank" rel="noopener noreferrer" aria-label={openLabel} className="group reveal block cursor-pointer no-underline text-inherit">
                    <div className="aspect-video bg-[#1a1f2e] rounded overflow-hidden mb-4 transition-all hover:shadow-lg border border-[rgba(122,147,180,.2)]">
                      <div className="w-full h-full flex items-center justify-center text-4xl opacity-60 group-hover:opacity-100 transition-opacity">
                        ▶️
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#e8edf5] text-[.95rem] mb-2 line-clamp-2">{video.title}</h3>
                      <div className="flex items-center justify-between text-[.8rem]">
                        <span className="text-[#7a93b4]">{video.creator} • {video.duration}s</span>
                        <span className="text-[#ffc105] font-semibold">{video.views}</span>
                      </div>
                    </div>
                  </a>
                );
              } else {
                return (
                  <a
                    key={idx}
                    href={video.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={openLabel}
                    className="group reveal relative block cursor-pointer overflow-hidden rounded-2xl border border-[#88a9d8]/12 bg-[#0c1829]/60 shadow-[0_4px_32px_rgba(0,0,0,0.18)] backdrop-blur-sm no-underline text-inherit transition duration-300 hover:-translate-y-0.5 hover:border-[#ffc105]/22"
                  >
                    <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-[#2b4c7d]/35 to-[#080f1c]">
                      <div
                        className="absolute inset-0 opacity-40 mix-blend-soft-light transition-opacity group-hover:opacity-70"
                        style={{
                          background: `radial-gradient(ellipse at 30% 20%, ${video.color}55, transparent 55%)`,
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/10 text-[#ffc105] shadow-lg backdrop-blur-md transition duration-300 group-hover:scale-110 group-hover:border-[#ffc105]/35">
                          <Play className="h-6 w-6 fill-current" aria-hidden />
                        </div>
                      </div>
                      <div className="absolute bottom-3 right-3 rounded-lg bg-black/55 px-2 py-1 text-[0.65rem] font-semibold tabular-nums text-white backdrop-blur-sm">
                        {video.duration}s
                      </div>
                    </div>
                    <div className="border-t border-[#88a9d8]/10 p-4">
                      <h3 className="mb-2 line-clamp-2 text-[0.95rem] font-semibold leading-snug text-[#f0f4fa]">{video.title}</h3>
                      <div className="flex items-center justify-between gap-2 text-[0.8rem]">
                        <p className="truncate text-[#8ba3c4]">{video.creator}</p>
                        <span className="shrink-0 font-medium text-[#ffc105]">{video.views}</span>
                      </div>
                    </div>
                  </a>
                );
              }
            })}
          </div>
          )}

          <div className="reveal mt-16 text-center">
            <Link
              href="/videos"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#ffc105] px-10 py-3.5 text-sm font-semibold text-[#0a0f18] no-underline shadow-[0_8px_28px_rgba(255,193,5,0.22)] transition hover:-translate-y-0.5 hover:bg-[#ffcf3a]"
            >
              Open LaughTube
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className={`px-[5%] py-24 ${modeStyle.sectionWhy}`} id="why">
        <div className="mx-auto max-w-6xl">
          <div className="reveal mb-14 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#88a9d8]">Why Sahara</p>
            <h2 className="font-['Bebas_Neue'] text-[clamp(2.25rem,4.5vw,3.25rem)] tracking-wide text-[#f0f4fa]">
              Built to feel fast<span className="text-[#ffc105]">.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[#8ba3c4] sm:text-base">
              Motion and color support the content—nothing screams for attention unless you ask it to.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Zap,
                title: 'Snappy interactions',
                body: 'Hover, focus, and scroll states use short, consistent timing so the UI feels tight, not twitchy.',
              },
              {
                icon: LayoutGrid,
                title: 'One coherent shell',
                body: 'Navigation, cards, and CTAs share the same radii and borders—easier to scan, harder to get lost.',
              },
              {
                icon: Palette,
                title: 'Themes that respect you',
                body: 'Switch looks without breaking layout. Classic stays restrained; experimental modes stay optional.',
              },
              {
                icon: Layers,
                title: 'Layered depth',
                body: 'Soft glass, light grain, and restrained shadows add depth instead of flat “template” blocks.',
              },
              {
                icon: MousePointer2,
                title: 'Touch-friendly targets',
                body: 'Buttons and chips are sized for real thumbs—not mouse-only hit areas from 2014.',
              },
              {
                icon: Sparkles,
                title: 'Delight in the details',
                body: 'Micro-motion on cards and hero elements rewards exploration without slowing anyone down.',
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="reveal group rounded-2xl border border-[#88a9d8]/10 bg-[#0c1829]/55 p-6 shadow-[0_4px_32px_rgba(0,0,0,0.12)] backdrop-blur-sm transition duration-300 hover:border-[#88a9d8]/22 hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[#88a9d8]/12 bg-[#080f1c]/60 text-[#ffc105] transition group-hover:border-[#ffc105]/25">
                  <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
                </div>
                <h3 className="text-base font-semibold text-[#f0f4fa]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#8ba3c4]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-[5%] py-24" id="about">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
          <div className="reveal">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#88a9d8]">About</p>
            <h2 className="font-['Bebas_Neue'] text-[clamp(2rem,4vw,2.75rem)] leading-none tracking-wide text-[#f0f4fa]">
              A supersite for curious people<span className="text-[#ffc105]">.</span>
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[#8ba3c4] sm:text-base">
              Sahara is a demo front door: rich landing, curated video hub, and room to grow. The palette stays anchored in
              deep blue (#2b4c7d), mid blue (#497ab6), soft blue (#88a9d8), and warm gold (#ffc105)—professional enough for
              classrooms, warm enough for home.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/videos"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#ffc105] px-6 py-3 text-sm font-semibold text-[#0a0f18] no-underline transition hover:bg-[#ffcf3a]"
              >
                Try LaughTube
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <a
                href="#categories"
                className="inline-flex items-center rounded-2xl border border-[#88a9d8]/20 px-6 py-3 text-sm font-semibold text-[#e8edf5] no-underline transition hover:border-[#88a9d8]/40"
              >
                Back to spaces
              </a>
            </div>
          </div>
          <div className="reveal relative overflow-hidden rounded-3xl border border-[#88a9d8]/12 bg-[#0c1829]/70 p-8 shadow-[0_24px_60px_rgba(0,0,0,0.25)] backdrop-blur-md">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-50 blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(255,193,5,0.35), transparent 70%)' }}
            />
            <blockquote className="relative text-lg font-medium leading-relaxed text-[#e8edf5]">
              “Good design disappears. You notice the content, the joke, the lesson—not the chrome around it.”
            </blockquote>
            <p className="relative mt-6 text-sm text-[#8ba3c4]">— The whole point of this refresh</p>
          </div>
        </div>
      </section>

      <footer className={`px-[5%] py-14 ${modeStyle.sectionFooter}`}>
        <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#ffc105] font-['Bebas_Neue'] text-lg text-[#0a0f18]">
                S
              </span>
              <span className="font-['Barlow_Condensed'] text-lg font-bold uppercase tracking-wide text-[#f0f4fa]">
                Sahara
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#8ba3c4]">
              Explore. Learn. Laugh. One modern surface—no visual noise required.
            </p>
          </div>
          <div className="flex flex-wrap gap-10 text-sm">
            <div>
              <p className="mb-3 font-semibold text-[#f0f4fa]">Explore</p>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                <li>
                  <Link href="/videos" className="text-[#8ba3c4] no-underline hover:text-[#ffc105]">
                    Videos
                  </Link>
                </li>
                <li>
                  <a href="#categories" className="text-[#8ba3c4] no-underline hover:text-[#ffc105]">
                    Categories
                  </a>
                </li>
                <li>
                  <a href="#why" className="text-[#8ba3c4] no-underline hover:text-[#ffc105]">
                    Features
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-semibold text-[#f0f4fa]">Project</p>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                <li>
                  <a href="#about" className="text-[#8ba3c4] no-underline hover:text-[#ffc105]">
                    About
                  </a>
                </li>
                <li>
                  <span className="text-[#5c6d8a]">Sign in — coming soon</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-12 max-w-6xl border-t border-[#88a9d8]/10 pt-8 text-center text-xs text-[#5c6d8a]">
          © {new Date().getFullYear()} Sahara demo · Crafted for clarity
        </p>
      </footer>
      </div>
    </div>
  );
}
