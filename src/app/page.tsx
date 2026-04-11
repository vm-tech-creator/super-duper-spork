'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Particles animation
    const pc = document.getElementById('particles');
    if (pc) {
      const colors = ['#ffc105','#497ab6','#2b4c7d','#ffffff'];
      for (let i = 0; i < 28; i++) {
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

  return (
    <div className="relative min-h-screen bg-[#080f1c] text-[#e8edf5] overflow-x-hidden">
      {/* Noise overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`
           }} />

      {/* Nav */}
      <nav className={`fixed top-0 w-full z-50 flex items-center justify-between px-[5%] h-[68px] bg-[rgba(8,15,28,.85)] backdrop-blur-[16px] transition-shadow ${scrolled ? 'shadow-[0_4px_40px_rgba(0,0,0,.5)]' : ''} border-b border-[rgba(73,122,182,.2)]`}>
        <a href="#" className="flex items-center gap-2.5 text-decoration-none">
          <div className="w-9 h-9 bg-gradient-to-br from-[#ffc105] to-[#e0a800] rounded-lg grid place-items-center font-['Bebas_Neue'] text-xl text-[#080f1c] shadow-[0_0_16px_rgba(255,193,5,.35)]">
            S
          </div>
          <div className="font-['Barlow_Condensed'] font-black text-xl uppercase tracking-[.04em]">
            <span className="text-[#ffc105]">Sahara</span>
          </div>
        </a>
        <ul className="flex gap-8 list-none">
          <li><a href="#categories" className="text-[#7a93b4] no-underline font-medium uppercase tracking-[.05em] text-[.875rem] transition-colors hover:text-[#ffc105]">Explore</a></li>
          <li><a href="#why" className="text-[#7a93b4] no-underline font-medium uppercase tracking-[.05em] text-[.875rem] transition-colors hover:text-[#ffc105]">Features</a></li>
          <li><a href="#about" className="text-[#7a93b4] no-underline font-medium uppercase tracking-[.05em] text-[.875rem] transition-colors hover:text-[#ffc105]">About</a></li>
          <li><a href="#" className="text-[#7a93b4] no-underline font-medium uppercase tracking-[.05em] text-[.875rem] transition-colors hover:text-[#ffc105]">Sign In</a></li>
        </ul>
        <button className="bg-[#ffc105] text-[#080f1c] border-none px-6 py-2.5 rounded transition-all hover:bg-[#ffcf3a] hover:translate-y-[-1px] hover:shadow-[0_6px_24px_rgba(255,193,5,.4)] font-['Barlow_Condensed'] font-bold uppercase tracking-[.08em] text-[.95rem] cursor-pointer">
          Explore Now
        </button>
      </nav>

      {/* Hero */}
      <section className="min-h-screen relative flex items-center justify-center overflow-hidden" id="home">
        <div className="absolute inset-0"
             style={{
               background: `
                 radial-gradient(ellipse 80% 60% at 50% 110%, rgba(43,76,125,.55) 0%, transparent 70%),
                 radial-gradient(ellipse 60% 40% at 20% 80%, rgba(255,193,5,.07) 0%, transparent 60%),
                 radial-gradient(ellipse 50% 30% at 80% 90%, rgba(73,122,182,.1) 0%, transparent 60%),
                 linear-gradient(180deg, #080f1c 0%, #0d1a2e 60%, #10223a 100%)
               `
             }} />

        {/* Particles */}
        <div id="particles" className="absolute inset-0 overflow-hidden" />

        {/* Dune SVG */}
        <svg className="absolute bottom-[-2px] left-0 w-full h-[220px] pointer-events-none" viewBox="0 0 1440 220" preserveAspectRatio="none">
          <path d="M0,200 C240,140 480,60 720,100 C960,140 1200,180 1440,120 L1440,220 L0,220 Z" fill="rgba(43,76,125,0.18)"/>
          <path d="M0,210 C360,160 600,80 900,120 C1100,145 1300,190 1440,155 L1440,220 L0,220 Z" fill="rgba(13,26,46,0.95)"/>
        </svg>

        <div className="relative z-10 text-center px-[5%] pb-20 pt-[100px] max-w-[960px]">
          <div className="inline-flex items-center gap-2 bg-[rgba(255,193,5,.1)] border border-[rgba(255,193,5,.3)] rounded-full px-4 py-1.5 text-[.78rem] font-semibold uppercase tracking-[.12em] text-[#ffc105] mb-7 animate-fade-down">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ffc105] shadow-[0_0_8px_#ffc105] animate-pulse" />
            Welcome to the World's Largest Supersite
          </div>

          <h1 className="font-['Bebas_Neue'] text-[clamp(4rem,11vw,9rem)] leading-[.92] tracking-[.03em] text-[#e8edf5] animate-fade-up">
            EXPLORE<br/>
            THE <span className="text-[#ffc105] drop-shadow-[0_0_40px_rgba(255,193,5,.4)]">SAHARA</span>
          </h1>

          <p className="font-['Barlow_Condensed'] font-semibold text-[clamp(1rem,2.5vw,1.5rem)] uppercase tracking-[.25em] text-[#7a93b4] mt-3 animate-fade-up">
            Games · Videos · Music · <span className="text-[#497ab6]">Education</span> &amp; Beyond
          </p>

          <p className="text-[1.1rem] text-[#7a93b4] leading-[1.7] max-w-[560px] mx-auto mt-7 animate-fade-up">
            One destination. Infinite possibilities. Discover a universe of entertainment,
            knowledge, and creativity — all under one roof.
          </p>

          <div className="flex items-center justify-center gap-4 mt-11 flex-wrap animate-fade-up">
            <button className="bg-gradient-to-br from-[#ffc105] to-[#e0a800] text-[#080f1c] border-none px-10 py-4 rounded transition-all hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(255,193,5,.35)] font-['Barlow_Condensed'] font-black uppercase tracking-[.1em] text-[1.05rem] cursor-pointer">
              Start Exploring →
            </button>
            <button className="bg-transparent text-[#e8edf5] border border-[rgba(73,122,182,.2)] px-8 py-3.5 rounded transition-all hover:border-[#497ab6] hover:text-[#497ab6] hover:bg-[rgba(73,122,182,.08)] font-['Barlow_Condensed'] font-bold uppercase tracking-[.1em] text-[1.05rem] cursor-pointer">
              Watch Intro
            </button>
          </div>

          <div className="flex justify-center gap-12 mt-16 flex-wrap animate-fade-up">
            <div className="text-center">
              <div className="text-[#ffc105] font-['Bebas_Neue'] text-[2.8rem] leading-none" data-target="250">0</div>
              <div className="text-[.75rem] text-[#7a93b4] uppercase tracking-[.12em] mt-1">Million Users</div>
            </div>
            <div className="w-px bg-[rgba(73,122,182,.2)] self-stretch my-1" />
            <div className="text-center">
              <div className="text-[#ffc105] font-['Bebas_Neue'] text-[2.8rem] leading-none" data-target="10">0</div>
              <div className="text-[.75rem] text-[#7a93b4] uppercase tracking-[.12em] mt-1">M+ Content Items</div>
            </div>
            <div className="w-px bg-[rgba(73,122,182,.2)] self-stretch my-1" />
            <div className="text-center">
              <div className="text-[#ffc105] font-['Bebas_Neue'] text-[2.8rem] leading-none" data-target="190">0</div>
              <div className="text-[.75rem] text-[#7a93b4] uppercase tracking-[.12em] mt-1">Countries</div>
            </div>
            <div className="w-px bg-[rgba(73,122,182,.2)] self-stretch my-1" />
            <div className="text-center">
              <div className="text-[#ffc105] font-['Bebas_Neue'] text-[2.8rem] leading-none" data-target="4">0</div>
              <div className="text-[.75rem] text-[#7a93b4] uppercase tracking-[.12em] mt-1">Core Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-[100px] px-[5%] bg-[#0d1a2e]" id="categories">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-end justify-between gap-6 mb-16 flex-wrap reveal">
            <div>
              <div className="flex items-center gap-2.5 text-[#ffc105] font-bold text-[.78rem] uppercase tracking-[.2em] mb-3">
                <div className="w-8 h-0.5 bg-[#ffc105]"></div>
                Browse Categories
              </div>
              <h2 className="font-['Bebas_Neue'] text-[clamp(2.4rem,5vw,3.8rem)] leading-none tracking-[.03em] text-[#e8edf5]">
                WHAT DO YOU WANT<br/><span className="text-[#ffc105]">TO EXPLORE TODAY?</span>
              </h2>
            </div>
            <p className="text-[#7a93b4] max-w-[320px] text-[.9rem] leading-[1.7]">
              Dive into any world you choose — we have everything from epic gaming to world-class education.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-5">
            <Link href="/games">
              <div className="relative overflow-hidden rounded-xl border border-[rgba(73,122,182,.2)] bg-[#101e34] p-9 pb-8 cursor-pointer transition-all hover:translate-y-[-6px] hover:shadow-[0_24px_60px_rgba(0,0,0,.5)] hover:border-[rgba(255,193,5,.35)] group reveal">
                <div className="absolute inset-0 opacity-0 bg-gradient-to-br from-[rgba(255,193,5,.06)] to-transparent transition-opacity group-hover:opacity-100"></div>
                <div className="w-14 h-14 rounded-xl grid place-items-center text-2xl mb-5 relative z-10">🎮</div>
                <div className="font-['Barlow_Condensed'] font-black text-[1.5rem] uppercase tracking-[.04em] text-[#e8edf5] mb-2 relative z-10">Games</div>
                <div className="text-[.88rem] text-[#7a93b4] leading-[1.65] relative z-10">From casual mobile puzzles to immersive open-world adventures — discover thousands of titles across every genre imaginable.</div>
                <div className="absolute top-6 right-6 text-[3.5rem] leading-none text-[rgba(255,255,255,.04)] pointer-events-none">01</div>
                <div className="mt-6 flex items-center gap-2 text-[.82rem] font-semibold uppercase tracking-[.1em] text-[#ffc105] relative z-10 transition-all group-hover:gap-3.5">Browse Games ›</div>
              </div>
            </Link>

            <div className="relative overflow-hidden rounded-xl border border-[rgba(73,122,182,.2)] bg-[#101e34] p-9 pb-8 cursor-pointer transition-all hover:translate-y-[-6px] hover:shadow-[0_24px_60px_rgba(0,0,0,.5)] hover:border-[rgba(255,193,5,.35)] group reveal">
              <div className="absolute inset-0 opacity-0 bg-gradient-to-br from-[rgba(255,193,5,.06)] to-transparent transition-opacity group-hover:opacity-100"></div>
              <div className="w-14 h-14 rounded-xl grid place-items-center text-2xl mb-5 relative z-10">🎬</div>
              <div className="font-['Barlow_Condensed'] font-black text-[1.5rem] uppercase tracking-[.04em] text-[#e8edf5] mb-2 relative z-10">Videos</div>
              <div className="text-[.88rem] text-[#7a93b4] leading-[1.65] relative z-10">Stream movies, series, short films, docs, and viral clips from creators worldwide.</div>
              <div className="absolute top-6 right-6 text-[3.5rem] leading-none text-[rgba(255,255,255,.04)] pointer-events-none">02</div>
              <div className="mt-6 flex items-center gap-2 text-[.82rem] font-semibold uppercase tracking-[.1em] text-[#ffc105] relative z-10 transition-all group-hover:gap-3.5">Watch Now ›</div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-[rgba(73,122,182,.2)] bg-[#101e34] p-9 pb-8 cursor-pointer transition-all hover:translate-y-[-6px] hover:shadow-[0_24px_60px_rgba(0,0,0,.5)] hover:border-[rgba(255,193,5,.35)] group reveal">
              <div className="absolute inset-0 opacity-0 bg-gradient-to-br from-[rgba(255,193,5,.06)] to-transparent transition-opacity group-hover:opacity-100"></div>
              <div className="w-14 h-14 rounded-xl grid place-items-center text-2xl mb-5 relative z-10">🎵</div>
              <div className="font-['Barlow_Condensed'] font-black text-[1.5rem] uppercase tracking-[.04em] text-[#e8edf5] mb-2 relative z-10">Music</div>
              <div className="text-[.88rem] text-[#7a93b4] leading-[1.65] relative z-10">90M+ tracks. Every genre. Curated playlists, live sessions, and artist radio — all in one place.</div>
              <div className="absolute top-6 right-6 text-[3.5rem] leading-none text-[rgba(255,255,255,.04)] pointer-events-none">03</div>
              <div className="mt-6 flex items-center gap-2 text-[.82rem] font-semibold uppercase tracking-[.1em] text-[#ffc105] relative z-10 transition-all group-hover:gap-3.5">Listen Now ›</div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-[rgba(73,122,182,.2)] bg-[#101e34] p-9 pb-8 cursor-pointer transition-all hover:translate-y-[-6px] hover:shadow-[0_24px_60px_rgba(0,0,0,.5)] hover:border-[rgba(255,193,5,.35)] group reveal">
              <div className="absolute inset-0 opacity-0 bg-gradient-to-br from-[rgba(255,193,5,.06)] to-transparent transition-opacity group-hover:opacity-100"></div>
              <div className="w-14 h-14 rounded-xl grid place-items-center text-2xl mb-5 relative z-10">📚</div>
              <div className="font-['Barlow_Condensed'] font-black text-[1.5rem] uppercase tracking-[.04em] text-[#e8edf5] mb-2 relative z-10">Education</div>
              <div className="text-[.88rem] text-[#7a93b4] leading-[1.65] relative z-10">Courses, tutorials, and learning paths from top institutions and expert instructors worldwide.</div>
              <div className="absolute top-6 right-6 text-[3.5rem] leading-none text-[rgba(255,255,255,.04)] pointer-events-none">04</div>
              <div className="mt-6 flex items-center gap-2 text-[.82rem] font-semibold uppercase tracking-[.1em] text-[#ffc105] relative z-10 transition-all group-hover:gap-3.5">Start Learning ›</div>
            </div>
          </div>
        </div>
      </section>

      {/* Placeholder for more sections */}
      <div className="h-screen flex items-center justify-center">
        <p className="text-xl">More sections coming soon...</p>
      </div>
    </div>
  );
}
