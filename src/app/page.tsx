'use client';

import { useEffect, useState } from 'react';

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
            <div className="relative overflow-hidden rounded-xl border border-[rgba(73,122,182,.2)] bg-[#101e34] p-9 pb-8 cursor-pointer transition-all hover:translate-y-[-6px] hover:shadow-[0_24px_60px_rgba(0,0,0,.5)] hover:border-[rgba(255,193,5,.35)] group reveal">
              <div className="absolute inset-0 opacity-0 bg-gradient-to-br from-[rgba(255,193,5,.06)] to-transparent transition-opacity group-hover:opacity-100"></div>
              <div className="w-14 h-14 rounded-xl grid place-items-center text-2xl mb-5 relative z-10">🎮</div>
              <div className="font-['Barlow_Condensed'] font-black text-[1.5rem] uppercase tracking-[.04em] text-[#e8edf5] mb-2 relative z-10">Games</div>
              <div className="text-[.88rem] text-[#7a93b4] leading-[1.65] relative z-10">From casual mobile puzzles to immersive open-world adventures — discover thousands of titles across every genre imaginable.</div>
              <div className="absolute top-6 right-6 text-[3.5rem] leading-none text-[rgba(255,255,255,.04)] pointer-events-none">01</div>
              <div className="mt-6 flex items-center gap-2 text-[.82rem] font-semibold uppercase tracking-[.1em] text-[#ffc105] relative z-10 transition-all group-hover:gap-3.5">Browse Games ›</div>
            </div>

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

      {/* Trending Videos */}
      <section className="py-[120px] px-[5%] bg-[#080f1c]" id="videos">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-20 reveal">
            <div className="flex items-center gap-2.5 text-[#ffc105] font-bold text-[.78rem] uppercase tracking-[.2em] mb-3">
              <div className="w-8 h-0.5 bg-[#ffc105]"></div>
              Trending Now
            </div>
            <h2 className="font-['Bebas_Neue'] text-[clamp(2.4rem,5vw,3.8rem)] leading-none tracking-[.03em] text-[#e8edf5]">
              SHORT-FORM<br/><span className="text-[#ffc105]">VIDEOS FOR YOU</span>
            </h2>
            <p className="text-[#7a93b4] max-w-[420px] text-[.95rem] leading-[1.7] mt-4">
              Discover viral-worthy short videos. Perfect for quick entertainment and inspiration — all under 90 seconds.
            </p>
          </div>

          {/* Filter Tags */}
          <div className="flex gap-3 mb-12 reveal flex-wrap">
            <button className="px-4 py-2 rounded-full text-[.85rem] font-semibold uppercase tracking-[.08em] bg-[#ffc105] text-[#080f1c] transition-all hover:shadow-[0_0_20px_rgba(255,193,5,.4)]">
              All
            </button>
            <button className="px-4 py-2 rounded-full text-[.85rem] font-semibold uppercase tracking-[.08em] border border-[rgba(73,122,182,.3)] text-[#7a93b4] transition-all hover:border-[#ffc105] hover:text-[#ffc105]">
              Entertaining
            </button>
            <button className="px-4 py-2 rounded-full text-[.85rem] font-semibold uppercase tracking-[.08em] border border-[rgba(73,122,182,.3)] text-[#7a93b4] transition-all hover:border-[#ffc105] hover:text-[#ffc105]">
              Educational
            </button>
            <button className="px-4 py-2 rounded-full text-[.85rem] font-semibold uppercase tracking-[.08em] border border-[rgba(73,122,182,.3)] text-[#7a93b4] transition-all hover:border-[#ffc105] hover:text-[#ffc105]">
              Creative
            </button>
            <button className="px-4 py-2 rounded-full text-[.85rem] font-semibold uppercase tracking-[.08em] border border-[rgba(73,122,182,.3)] text-[#7a93b4] transition-all hover:border-[#ffc105] hover:text-[#ffc105]">
              Lifestyle
            </button>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Video Card 1 */}
            <div className="group reveal cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1a2e4a] to-[#0d1a2e] aspect-video">
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,193,5,.15)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-end justify-between p-4 z-10">
                  <div className="text-[.7rem] font-bold uppercase tracking-[.12em] text-[#ffc105] bg-[rgba(0,0,0,.6)] px-2 py-1 rounded backdrop-blur-sm">
                    45 sec
                  </div>
                  <div className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">▶️</div>
                </div>
                <div className="absolute inset-0 bg-blue-600 opacity-40" />
              </div>
              <div className="bg-[#101e34] border border-[rgba(73,122,182,.2)] border-t-0 p-4 rounded-b-xl">
                <h3 className="text-[#e8edf5] font-semibold text-[.95rem] mb-2 line-clamp-2">Minimalist Architecture in the Desert</h3>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#7a93b4] text-[.8rem]">Khan Studios</p>
                  <span className="text-[#ffc105] text-[.75rem] font-bold">48.2K ▲</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="text-[.7rem] text-[#497ab6] bg-[rgba(73,122,182,.1)] px-2 py-0.5 rounded-full">Architecture</span>
                  <span className="text-[.7rem] text-[#497ab6] bg-[rgba(73,122,182,.1)] px-2 py-0.5 rounded-full">Design</span>
                </div>
              </div>
            </div>

            {/* Video Card 2 */}
            <div className="group reveal cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1a2e4a] to-[#0d1a2e] aspect-video">
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,193,5,.15)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-end justify-between p-4 z-10">
                  <div className="text-[.7rem] font-bold uppercase tracking-[.12em] text-[#ffc105] bg-[rgba(0,0,0,.6)] px-2 py-1 rounded backdrop-blur-sm">
                    32 sec
                  </div>
                  <div className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">▶️</div>
                </div>
                <div className="absolute inset-0 bg-emerald-600 opacity-35" />
              </div>
              <div className="bg-[#101e34] border border-[rgba(73,122,182,.2)] border-t-0 p-4 rounded-b-xl">
                <h3 className="text-[#e8edf5] font-semibold text-[.95rem] mb-2 line-clamp-2">Quick Kitchen Tips for Busy Professionals</h3>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#7a93b4] text-[.8rem]">Chef's Corner</p>
                  <span className="text-[#ffc105] text-[.75rem] font-bold">156.3K ▲</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="text-[.7rem] text-[#497ab6] bg-[rgba(73,122,182,.1)] px-2 py-0.5 rounded-full">Lifestyle</span>
                  <span className="text-[.7rem] text-[#497ab6] bg-[rgba(73,122,182,.1)] px-2 py-0.5 rounded-full">Tutorial</span>
                </div>
              </div>
            </div>

            {/* Video Card 3 */}
            <div className="group reveal cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1a2e4a] to-[#0d1a2e] aspect-video">
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,193,5,.15)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-end justify-between p-4 z-10">
                  <div className="text-[.7rem] font-bold uppercase tracking-[.12em] text-[#ffc105] bg-[rgba(0,0,0,.6)] px-2 py-1 rounded backdrop-blur-sm">
                    58 sec
                  </div>
                  <div className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">▶️</div>
                </div>
                <div className="absolute inset-0 bg-purple-600 opacity-35" />
              </div>
              <div className="bg-[#101e34] border border-[rgba(73,122,182,.2)] border-t-0 p-4 rounded-b-xl">
                <h3 className="text-[#e8edf5] font-semibold text-[.95rem] mb-2 line-clamp-2">AI Trends You Need to Know About</h3>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#7a93b4] text-[.8rem]">Tech Insights Daily</p>
                  <span className="text-[#ffc105] text-[.75rem] font-bold">324.1K ▲</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="text-[.7rem] text-[#497ab6] bg-[rgba(73,122,182,.1)] px-2 py-0.5 rounded-full">Tech</span>
                  <span className="text-[.7rem] text-[#497ab6] bg-[rgba(73,122,182,.1)] px-2 py-0.5 rounded-full">News</span>
                </div>
              </div>
            </div>

            {/* Video Card 4 */}
            <div className="group reveal cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1a2e4a] to-[#0d1a2e] aspect-video">
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,193,5,.15)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-end justify-between p-4 z-10">
                  <div className="text-[.7rem] font-bold uppercase tracking-[.12em] text-[#ffc105] bg-[rgba(0,0,0,.6)] px-2 py-1 rounded backdrop-blur-sm">
                    67 sec
                  </div>
                  <div className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">▶️</div>
                </div>
                <div className="absolute inset-0 bg-orange-500 opacity-35" />
              </div>
              <div className="bg-[#101e34] border border-[rgba(73,122,182,.2)] border-t-0 p-4 rounded-b-xl">
                <h3 className="text-[#e8edf5] font-semibold text-[.95rem] mb-2 line-clamp-2">Fitness Motivation: High-Intensity Challenge</h3>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#7a93b4] text-[.8rem]">Fitness Elite</p>
                  <span className="text-[#ffc105] text-[.75rem] font-bold">89.7K ▲</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="text-[.7rem] text-[#497ab6] bg-[rgba(73,122,182,.1)] px-2 py-0.5 rounded-full">Health</span>
                  <span className="text-[.7rem] text-[#497ab6] bg-[rgba(73,122,182,.1)] px-2 py-0.5 rounded-full">Wellness</span>
                </div>
              </div>
            </div>

            {/* Video Card 5 */}
            <div className="group reveal cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1a2e4a] to-[#0d1a2e] aspect-video">
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,193,5,.15)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-end justify-between p-4 z-10">
                  <div className="text-[.7rem] font-bold uppercase tracking-[.12em] text-[#ffc105] bg-[rgba(0,0,0,.6)] px-2 py-1 rounded backdrop-blur-sm">
                    40 sec
                  </div>
                  <div className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">▶️</div>
                </div>
                <div className="absolute inset-0 bg-cyan-600 opacity-35" />
              </div>
              <div className="bg-[#101e34] border border-[rgba(73,122,182,.2)] border-t-0 p-4 rounded-b-xl">
                <h3 className="text-[#e8edf5] font-semibold text-[.95rem] mb-2 line-clamp-2">Travel Guide: Hidden Gems in Barcelona</h3>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#7a93b4] text-[.8rem]">Wanderlust Chronicles</p>
                  <span className="text-[#ffc105] text-[.75rem] font-bold">215.8K ▲</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="text-[.7rem] text-[#497ab6] bg-[rgba(73,122,182,.1)] px-2 py-0.5 rounded-full">Travel</span>
                  <span className="text-[.7rem] text-[#497ab6] bg-[rgba(73,122,182,.1)] px-2 py-0.5 rounded-full">Vlog</span>
                </div>
              </div>
            </div>

            {/* Video Card 6 */}
            <div className="group reveal cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1a2e4a] to-[#0d1a2e] aspect-video">
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,193,5,.15)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-end justify-between p-4 z-10">
                  <div className="text-[.7rem] font-bold uppercase tracking-[.12em] text-[#ffc105] bg-[rgba(0,0,0,.6)] px-2 py-1 rounded backdrop-blur-sm">
                    53 sec
                  </div>
                  <div className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">▶️</div>
                </div>
                <div className="absolute inset-0 bg-rose-600 opacity-35" />
              </div>
              <div className="bg-[#101e34] border border-[rgba(73,122,182,.2)] border-t-0 p-4 rounded-b-xl">
                <h3 className="text-[#e8edf5] font-semibold text-[.95rem] mb-2 line-clamp-2">Sustainable Living: Small Changes, Big Impact</h3>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#7a93b4] text-[.8rem]">Green Living Hub</p>
                  <span className="text-[#ffc105] text-[.75rem] font-bold">127.4K ▲</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="text-[.7rem] text-[#497ab6] bg-[rgba(73,122,182,.1)] px-2 py-0.5 rounded-full">Lifestyle</span>
                  <span className="text-[.7rem] text-[#497ab6] bg-[rgba(73,122,182,.1)] px-2 py-0.5 rounded-full">Eco</span>
                </div>
              </div>
            </div>

            {/* Video Card 7 */}
            <div className="group reveal cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1a2e4a] to-[#0d1a2e] aspect-video">
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,193,5,.15)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-end justify-between p-4 z-10">
                  <div className="text-[.7rem] font-bold uppercase tracking-[.12em] text-[#ffc105] bg-[rgba(0,0,0,.6)] px-2 py-1 rounded backdrop-blur-sm">
                    75 sec
                  </div>
                  <div className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">▶️</div>
                </div>
                <div className="absolute inset-0 bg-indigo-600 opacity-35" />
              </div>
              <div className="bg-[#101e34] border border-[rgba(73,122,182,.2)] border-t-0 p-4 rounded-b-xl">
                <h3 className="text-[#e8edf5] font-semibold text-[.95rem] mb-2 line-clamp-2">Comedy Sketch: Corporate Life Unplugged</h3>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#7a93b4] text-[.8rem]">The Comedy Lab</p>
                  <span className="text-[#ffc105] text-[.75rem] font-bold">412.6K ▲</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="text-[.7rem] text-[#497ab6] bg-[rgba(73,122,182,.1)] px-2 py-0.5 rounded-full">Comedy</span>
                  <span className="text-[.7rem] text-[#497ab6] bg-[rgba(73,122,182,.1)] px-2 py-0.5 rounded-full">Humor</span>
                </div>
              </div>
            </div>

            {/* Video Card 8 */}
            <div className="group reveal cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1a2e4a] to-[#0d1a2e] aspect-video">
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,193,5,.15)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-end justify-between p-4 z-10">
                  <div className="text-[.7rem] font-bold uppercase tracking-[.12em] text-[#ffc105] bg-[rgba(0,0,0,.6)] px-2 py-1 rounded backdrop-blur-sm">
                    61 sec
                  </div>
                  <div className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">▶️</div>
                </div>
                <div className="absolute inset-0 bg-amber-600 opacity-35" />
              </div>
              <div className="bg-[#101e34] border border-[rgba(73,122,182,.2)] border-t-0 p-4 rounded-b-xl">
                <h3 className="text-[#e8edf5] font-semibold text-[.95rem] mb-2 line-clamp-2">Photography Masterclass: Golden Hour Secrets</h3>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#7a93b4] text-[.8rem]">Lens Academy</p>
                  <span className="text-[#ffc105] text-[.75rem] font-bold">203.2K ▲</span>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="text-[.7rem] text-[#497ab6] bg-[rgba(73,122,182,.1)] px-2 py-0.5 rounded-full">Creative</span>
                  <span className="text-[.7rem] text-[#497ab6] bg-[rgba(73,122,182,.1)] px-2 py-0.5 rounded-full">Tutorial</span>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center reveal">
            <button className="bg-gradient-to-br from-[#ffc105] to-[#e0a800] text-[#080f1c] border-none px-12 py-4 rounded transition-all hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(255,193,5,.35)] font-['Barlow_Condensed'] font-black uppercase tracking-[.1em] text-[1.05rem] cursor-pointer">
              Explore All Videos ›
            </button>
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
