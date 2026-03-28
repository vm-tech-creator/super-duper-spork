'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
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

  const getModeStyles = () => {
    const bases: any = {
      classic: { bg: 'bg-[#080f1c]', accentColor: '#ffc105', textPrimary: '#e8edf5', textSecondary: '#7a93b4', cardBg: '#101e34', borderColor: 'rgba(73,122,182,.2)', glow: 'rgba(255,193,5,.4)' },
      fancy: { bg: 'bg-gradient-to-br from-[#080f1c] via-[#1a1f3a] to-[#0d1a2e]', accentColor: '#ffc105', textPrimary: '#e8edf5', textSecondary: '#7a93b4', cardBg: '#101e34', borderColor: '#ffc105', glow: 'rgba(255,193,5,.5)' },
      neon: { bg: 'bg-[#000000]', accentColor: '#00ff88', textPrimary: '#00ff88', textSecondary: '#00ff88', cardBg: '#0a0a0a', borderColor: '#00ff88', glow: '#00ff88' },
      minimal: { bg: 'bg-[#0f1419]', accentColor: '#7a93b4', textPrimary: '#e8edf5', textSecondary: '#7a93b4', cardBg: '#1a1f2e', borderColor: 'rgba(122,147,180,.2)', glow: 'rgba(122,147,180,.2)' },
      dark: { bg: 'bg-[#0a0e1a]', accentColor: '#496bb0', textPrimary: '#d0d8e8', textSecondary: '#8899c5', cardBg: '#0f1520', borderColor: 'rgba(73,107,176,.3)', glow: 'rgba(73,107,176,.3)' },
      vibrant: { bg: 'bg-gradient-to-br from-[#1a0a2e] via-[#16213e] to-[#0f3460]', accentColor: '#e94560', textPrimary: '#ffffffff', textSecondary: '#eeffff', cardBg: '#1a2a3a', borderColor: '#e94560', glow: 'rgba(233,69,96,.4)' },
      glassmorphism: { bg: 'bg-[#080f1c]/30 backdrop-blur-md', accentColor: '#ffc105', textPrimary: '#e8edf5', textSecondary: '#7a93b4', cardBg: 'rgba(16,30,52,.4)', borderColor: 'rgba(255,193,5,.2)', glow: 'rgba(255,193,5,.2)' }
    };
    return bases[siteMode] || bases.classic;
  };

  const modeStyle = getModeStyles();

  return (
    <div className={`relative min-h-screen ${modeStyle.bg} text-[${modeStyle.textPrimary}] overflow-x-hidden`}>
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
        <div className="flex items-center gap-4">
          <select 
            value={siteMode} 
            onChange={(e) => setSiteMode(e.target.value as any)}
            className={`px-4 py-2 rounded font-['Barlow_Condensed'] text-[.85rem] uppercase tracking-[.05em] cursor-pointer transition-all ${
              siteMode === 'neon'
                ? 'bg-[#0a0a0a] border-2 border-[#00ff88] text-[#00ff88] hover:border-[#ff00ff] hover:text-[#ff00ff] hover:shadow-[0_0_15px_#00ff88]'
                : siteMode === 'fancy'
                ? 'bg-gradient-to-r from-[#ffc105] to-[#497ab6] text-[#080f1c] border-2 border-[#ffc105] hover:shadow-[0_4px_16px_rgba(255,193,5,.3)]'
                : siteMode === 'vibrant'
                ? 'bg-gradient-to-r from-[#e94560] to-[#ff6b9d] text-white border-2 border-[#e94560] hover:shadow-[0_4px_16px_rgba(233,69,96,.3)]'
                : siteMode === 'dark'
                ? 'bg-[#0f1620] border border-[#4a6f9f] text-[#e8edf5] hover:border-[#6a9fbf]'
                : siteMode === 'minimal'
                ? 'border-b-2 border-[#7a93b4] text-[#7a93b4] bg-transparent hover:border-[#ffc105] hover:text-[#ffc105]'
                : siteMode === 'glassmorphism'
                ? 'bg-[rgba(255,255,255,.1)] backdrop-blur-lg border border-[rgba(255,255,255,.3)] text-white hover:border-[#ffc105]'
                : 'bg-[#101e34] border border-[rgba(73,122,182,.3)] text-[#e8edf5] hover:border-[#ffc105]'
            }`}
          >
            <option value="classic">🎯 Classic</option>
            <option value="fancy">✨ Fancy</option>
            <option value="neon">⚡ Neon</option>
            <option value="minimal">— Minimal</option>
            <option value="dark">🌙 Dark Mode</option>
            <option value="vibrant">🎨 Vibrant</option>
            <option value="glassmorphism">🔮 Glass</option>
          </select>
          <button className="bg-[#ffc105] text-[#080f1c] border-none px-6 py-2.5 rounded transition-all hover:bg-[#ffcf3a] hover:translate-y-[-1px] hover:shadow-[0_6px_24px_rgba(255,193,5,.4)] font-['Barlow_Condensed'] font-bold uppercase tracking-[.08em] text-[.95rem] cursor-pointer">
            Explore Now
          </button>
        </div>
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

          <h1 className={`font-['Bebas_Neue'] text-[clamp(4rem,11vw,9rem)] leading-[.92] tracking-[.03em] animate-fade-up ${
            siteMode === 'neon'
              ? 'text-[#00ff88] drop-shadow-[0_0_40px_#00ff88]'
              : siteMode === 'fancy'
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#ffc105] to-[#497ab6] drop-shadow-[0_0_40px_rgba(255,193,5,.4)]'
              : siteMode === 'vibrant'
              ? 'text-[#ffffffff] drop-shadow-[0_0_40px_#e94560]'
              : siteMode === 'dark'
              ? 'text-[#e8edf5] drop-shadow-[0_0_40px_rgba(100,159,191,.3)]'
              : siteMode === 'minimal'
              ? 'text-[#7a93b4]'
              : siteMode === 'glassmorphism'
              ? 'text-white drop-shadow-[0_0_40px_rgba(255,255,255,.3)]'
              : 'text-[#e8edf5] drop-shadow-[0_0_40px_rgba(255,193,5,.4)]'
          }`}>
            EXPLORE<br/>
            THE <span className={
              siteMode === 'neon'
                ? 'text-[#ff00ff] drop-shadow-[0_0_40px_#ff00ff]'
                : siteMode === 'fancy'
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#497ab6] to-[#ffc105]'
                : siteMode === 'vibrant'
                ? 'text-[#e94560]'
                : siteMode === 'dark'
                ? 'text-[#4a6f9f]'
                : siteMode === 'minimal'
                ? 'text-[#ffc105]'
                : siteMode === 'glassmorphism'
                ? 'text-[#ffc105]'
                : 'text-[#ffc105] drop-shadow-[0_0_40px_rgba(255,193,5,.4)]'
            }>SAHARA</span>
          </h1>

          <p className="font-['Barlow_Condensed'] font-semibold text-[clamp(1rem,2.5vw,1.5rem)] uppercase tracking-[.25em] text-[#7a93b4] mt-3 animate-fade-up">
            Games · Videos · Music · <span className="text-[#497ab6]">Education</span> &amp; Beyond
          </p>

          <p className={`text-[1.1rem] leading-[1.7] max-w-[560px] mx-auto mt-7 animate-fade-up ${
            siteMode === 'neon'
              ? 'text-[#00ff88]/80'
              : siteMode === 'fancy'
              ? 'text-[#7a93b4]'
              : siteMode === 'vibrant'
              ? 'text-[#b8a9d1]'
              : siteMode === 'dark'
              ? 'text-[#7a93b4]'
              : siteMode === 'minimal'
              ? 'text-[#7a93b4]'
              : siteMode === 'glassmorphism'
              ? 'text-white/80'
              : 'text-[#7a93b4]'
          }`}>
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
              <div className={`flex items-center gap-2.5 font-bold text-[.78rem] uppercase tracking-[.2em] mb-3 ${
                siteMode === 'neon'
                  ? 'text-[#00ff88]'
                  : siteMode === 'fancy'
                  ? 'text-[#ffc105]'
                  : siteMode === 'vibrant'
                  ? 'text-[#e94560]'
                  : siteMode === 'dark'
                  ? 'text-[#4a6f9f]'
                  : siteMode === 'minimal'
                  ? 'text-[#7a93b4]'
                  : siteMode === 'glassmorphism'
                  ? 'text-white'
                  : 'text-[#ffc105]'
              }`}>
                <div className={`w-8 h-0.5 ${
                  siteMode === 'neon'
                    ? 'bg-[#00ff88] shadow-[0_0_10px_#00ff88]'
                    : siteMode === 'fancy'
                    ? 'bg-[#ffc105]'
                    : siteMode === 'vibrant'
                    ? 'bg-[#e94560] shadow-[0_0_10px_#e94560]'
                    : siteMode === 'dark'
                    ? 'bg-[#4a6f9f]'
                    : siteMode === 'minimal'
                    ? 'bg-[#7a93b4]'
                    : siteMode === 'glassmorphism'
                    ? 'bg-white'
                    : 'bg-[#ffc105]'
                }`}></div>
                Browse Categories
              </div>
              <h2 className={`font-['Bebas_Neue'] text-[clamp(2.4rem,5vw,3.8rem)] leading-none tracking-[.03em] ${
                siteMode === 'neon'
                  ? 'text-[#00ff88] drop-shadow-[0_0_20px_#00ff88]'
                  : siteMode === 'fancy'
                  ? 'text-[#e8edf5]'
                  : siteMode === 'vibrant'
                  ? 'text-[#ffffffff]'
                  : siteMode === 'dark'
                  ? 'text-[#e8edf5]'
                  : siteMode === 'minimal'
                  ? 'text-[#7a93b4]'
                  : siteMode === 'glassmorphism'
                  ? 'text-white'
                  : 'text-[#e8edf5]'
              }`}>
                WHAT DO YOU WANT<br/><span className={
                  siteMode === 'neon'
                    ? 'text-[#ff00ff] drop-shadow-[0_0_20px_#ff00ff]'
                    : siteMode === 'fancy'
                    ? 'text-[#ffc105]'
                    : siteMode === 'vibrant'
                    ? 'text-[#e94560]'
                    : siteMode === 'dark'
                    ? 'text-[#4a6f9f]'
                    : siteMode === 'minimal'
                    ? 'text-[#ffc105]'
                    : siteMode === 'glassmorphism'
                    ? 'text-[#ffc105]'
                    : 'text-[#ffc105]'
                }>TO EXPLORE TODAY?</span>
              </h2>
            </div>
            <p className={`max-w-[320px] text-[.9rem] leading-[1.7] ${
              siteMode === 'neon'
                ? 'text-[#00ff88]/70'
                : siteMode === 'fancy'
                ? 'text-[#7a93b4]'
                : siteMode === 'vibrant'
                ? 'text-[#b8a9d1]'
                : siteMode === 'dark'
                ? 'text-[#7a93b4]'
                : siteMode === 'minimal'
                ? 'text-[#7a93b4]'
                : siteMode === 'glassmorphism'
                ? 'text-white/80'
                : 'text-[#7a93b4]'
            }`}>
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

      {/* Trending Videos - Entertainment Section */}
      <section className={`py-[120px] px-[5%] ${siteMode === 'fancy' || siteMode === 'vibrant' ? 'bg-gradient-to-br from-current via-transparent to-current' : siteMode === 'neon' ? 'bg-[#000000]' : siteMode === 'dark' ? 'bg-[#0a0e1a]' : siteMode === 'glassmorphism' ? 'bg-[#080f1c]/50 backdrop-blur-lg' : 'bg-[#080f1c]'}`} id="videos">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-20 reveal">
            <div className={`flex items-center gap-2.5 font-bold text-[.78rem] uppercase tracking-[.2em] mb-3 ${siteMode === 'neon' ? 'text-[#00ff88]' : siteMode === 'vibrant' ? 'text-[#e94560]' : 'text-[#ffc105]'}`}>
              <div className={`w-8 h-0.5 ${siteMode === 'neon' ? 'bg-[#00ff88] shadow-[0_0_10px_#00ff88]' : siteMode === 'vibrant' ? 'bg-[#e94560] shadow-[0_0_10px_#e94560]' : 'bg-[#ffc105]'}`}></div>
              🎬 ENTERTAINMENT
            </div>
            <h2 className={`font-['Bebas_Neue'] text-[clamp(2.4rem,5vw,3.8rem)] leading-none tracking-[.03em] ${siteMode === 'fancy' ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#ffc105] to-[#497ab6]' : siteMode === 'neon' ? 'text-[#00ff88] drop-shadow-[0_0_20px_#00ff88]' : siteMode === 'vibrant' ? 'text-[#ffffffff]' : 'text-[#e8edf5]'}`}>
              SHORT-FORM<br/><span className={siteMode === 'fancy' ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#497ab6] to-[#ffc105]' : siteMode === 'neon' ? 'text-[#ff00ff] drop-shadow-[0_0_20px_#ff00ff]' : siteMode === 'vibrant' ? 'text-[#e94560]' : 'text-[#ffc105]'}>VIDEOS FOR YOU</span>
            </h2>
          </div>

          {/* Filter Tags */}
          <div className="flex gap-3 mb-12 reveal flex-wrap">
            {['All', 'Entertaining', 'Educational', 'Creative', 'Lifestyle'].map((category) => (
              <button 
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-[.85rem] font-semibold uppercase tracking-[.08em] transition-all ${
                  activeCategory === category
                    ? siteMode === 'neon'
                      ? 'bg-[#00ff88] text-[#000000] shadow-[0_0_20px_#00ff88]'
                      : siteMode === 'fancy'
                      ? 'bg-gradient-to-r from-[#ffc105] to-[#497ab6] text-[#080f1c] shadow-[0_8px_24px_rgba(255,193,5,.3)]'
                      : siteMode === 'vibrant'
                      ? 'bg-[#e94560] text-[#ffffff] shadow-[0_8px_24px_rgba(233,69,96,.3)]'
                      : siteMode === 'dark'
                      ? 'bg-[#496bb0] text-[#ffffff]'
                      : 'bg-[#ffc105] text-[#080f1c]'
                    : siteMode === 'neon'
                    ? 'border border-[#00ff88] text-[#00ff88] hover:shadow-[0_0_15px_#00ff88]'
                    : siteMode === 'minimal'
                    ? 'border-b-2 border-[#7a93b4] text-[#7a93b4] hover:border-[#ffc105] hover:text-[#ffc105]'
                    : siteMode === 'vibrant'
                    ? 'border border-[#e94560] text-[#eeffff] hover:border-[#e94560]'
                    : 'border border-[rgba(73,122,182,.3)] text-[#7a93b4] hover:border-[#ffc105] hover:text-[#ffc105]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Videos Grid with Player Boxes */}
          <div className={`grid gap-5 ${siteMode === 'minimal' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
            {[
              { title: 'Minimalist Architecture', creator: 'Khan Studios', views: '48.2K', duration: '45', color: '#1e40af', tags: ['Architecture', 'Design'] },
              { title: 'Kitchen Tips for Professionals', creator: 'Chef\' Corner', views: '156.3K', duration: '32', color: '#047857', tags: ['Lifestyle', 'Tutorial'] },
              { title: 'AI Trends You Should Know', creator: 'Tech Insights Daily', views: '324.1K', duration: '58', color: '#7c3aed', tags: ['Tech', 'News'] },
              { title: 'Fitness Challenge', creator: 'Fitness Elite', views: '89.7K', duration: '67', color: '#ea580c', tags: ['Health', 'Wellness'] },
              { title: 'Travel: Barcelona Guide', creator: 'Wanderlust Chronicles', views: '215.8K', duration: '40', color: '#0891b2', tags: ['Travel', 'Vlog'] },
              { title: 'Sustainable Living', creator: 'Green Living Hub', views: '127.4K', duration: '53', color: '#be185d', tags: ['Lifestyle', 'Eco'] },
              { title: 'Comedy: Corporate Life', creator: 'The Comedy Lab', views: '412.6K', duration: '75', color: '#4f46e5', tags: ['Comedy', 'Humor'] },
              { title: 'Photography Masterclass', creator: 'Lens Academy', views: '203.2K', duration: '61', color: '#b45309', tags: ['Creative', 'Tutorial'] },
            ].map((video, idx) => {
              if (siteMode === 'fancy') {
                return (
                  <div key={idx} className="group reveal cursor-pointer">
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
                  </div>
                );
              } else if (siteMode === 'neon') {
                return (
                  <div key={idx} className="group reveal cursor-pointer">
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
                  </div>
                );
              } else if (siteMode === 'vibrant') {
                return (
                  <div key={idx} className="group reveal cursor-pointer">
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
                  </div>
                );
              } else if (siteMode === 'dark') {
                return (
                  <div key={idx} className="group reveal cursor-pointer">
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
                  </div>
                );
              } else if (siteMode === 'glassmorphism') {
                return (
                  <div key={idx} className="group reveal cursor-pointer">
                    <div className="relative overflow-hidden rounded-xl transition-all duration-300 backdrop-blur-md hover:scale-105">
                      {/* Video Player Box */}
                      <div className="relative overflow-hidden rounded-xl bg-[#ffffff]/10 backdrop-blur-md aspect-video border border-[#ffffff]/20">
                        <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-100 opacity-70">
                          <div className="w-16 h-16 rounded-full bg-[#ffc105]/30 flex items-center justify-center group-hover:scale-125 transition-transform">
                            <div className="text-4xl">▶️</div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 bg-[#ffc105]/30 backdrop-blur-sm border border-[#ffc105]/50 px-3 py-1 rounded-full text-[.7rem] font-bold text-[#ffc105]">
                        {video.duration}s
                      </div>
                      <div className="bg-[#ffffff]/10 backdrop-blur-md border-t border-[#ffffff]/30 rounded-b-xl p-4">
                        <h3 className="text-[#e8edf5] font-semibold text-[.9rem] mb-1 line-clamp-2">{video.title}</h3>
                        <p className="text-[#b8c5dd] text-[.75rem]">{video.creator}</p>
                      </div>
                    </div>
                  </div>
                );
              } else if (siteMode === 'minimal') {
                return (
                  <article key={idx} className="group reveal cursor-pointer">
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
                  </article>
                );
              } else {
                // Classic mode
                return (
                  <div key={idx} className="group reveal cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02]">
                    {/* Video Player Box */}
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1a2e4a] to-[#0d1a2e] aspect-video">
                      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,193,5,.15)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-5xl mb-2 opacity-80 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300">▶️</div>
                          <p className="text-[#ffc105] text-xs font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">TAP TO PLAY</p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 text-[.7rem] font-bold uppercase tracking-[.12em] text-[#ffc105] bg-[rgba(0,0,0,.6)] px-2 py-1 rounded backdrop-blur-sm z-10">
                      {video.duration} sec
                    </div>
                    <div className="bg-[#101e34] border border-[rgba(73,122,182,.2)] border-t-0 p-4 rounded-b-xl">
                      <h3 className="text-[#e8edf5] font-semibold text-[.95rem] mb-2 line-clamp-2">{video.title}</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-[#7a93b4] text-[.8rem]">{video.creator}</p>
                        <span className="text-[#ffc105] text-[.75rem] font-bold">⬆️ {video.views}</span>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center reveal">
            <button className={`px-12 py-4 rounded font-['Barlow_Condensed'] font-black uppercase tracking-[.1em] text-[1.05rem] cursor-pointer transition-all ${
              siteMode === 'neon'
                ? 'bg-[#00ff88] text-[#000000] hover:shadow-[0_0_30px_#00ff88]'
                : siteMode === 'fancy'
                ? 'bg-gradient-to-br from-[#ffc105] to-[#497ab6] text-[#080f1c] hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(255,193,5,.35)]'
                : siteMode === 'vibrant'
                ? 'bg-[#e94560] text-[#ffffff] hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(233,69,96,.35)]'
                : siteMode === 'minimal'
                ? 'border-2 border-[#7a93b4] text-[#7a93b4] hover:bg-[#7a93b4] hover:text-[#080f1c]'
                : siteMode === 'dark'
                ? 'bg-[#496bb0] text-[#d0d8e8] hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(73,107,176,.35)]'
                : siteMode === 'glassmorphism'
                ? 'bg-[#ffc105]/30 backdrop-blur-md border border-[#ffc105]/50 text-[#ffc105] hover:bg-[#ffc105]/50'
                : 'bg-gradient-to-br from-[#ffc105] to-[#e0a800] text-[#080f1c] hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(255,193,5,.35)]'
            }`}>
              Explore All Videos ›
            </button>
          </div>
        </div>
      </section>

      {/* Animations Showcase Section */}
      <section className={`py-[120px] px-[5%] ${siteMode === 'fancy' || siteMode === 'vibrant' ? 'bg-gradient-to-b from-current via-transparent to-current' : siteMode === 'dark' ? 'bg-gradient-to-b from-[#0a0e1a] to-[#050710]' : siteMode === 'glassmorphism' ? 'bg-gradient-to-b from-[#080f1c]/50 to-[#050710]/50 backdrop-blur-lg' : 'bg-gradient-to-b from-[#0d1a2e] to-[#080f1c]'}`} id="animations">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-20 text-center reveal">
            <div className={`flex items-center justify-center gap-2.5 font-bold text-[.78rem] uppercase tracking-[.2em] mb-3 ${siteMode === 'neon' ? 'text-[#00ff88]' : siteMode === 'vibrant' ? 'text-[#e94560]' : 'text-[#ffc105]'}`}>
              <div className={`w-8 h-0.5 ${siteMode === 'neon' ? 'bg-[#00ff88] shadow-[0_0_10px_#00ff88]' : siteMode === 'vibrant' ? 'bg-[#e94560] shadow-[0_0_10px_#e94560]' : 'bg-[#ffc105]'}`}></div>
              Interactive Features
              <div className={`w-8 h-0.5 ${siteMode === 'neon' ? 'bg-[#00ff88] shadow-[0_0_10px_#00ff88]' : siteMode === 'vibrant' ? 'bg-[#e94560] shadow-[0_0_10px_#e94560]' : 'bg-[#ffc105]'}`}></div>
            </div>
            <h2 className={`font-['Bebas_Neue'] text-[clamp(2.4rem,5vw,3.8rem)] leading-none tracking-[.03em] mb-4 ${siteMode === 'fancy' ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#ffc105] to-[#497ab6]' : siteMode === 'neon' ? 'text-[#00ff88] drop-shadow-[0_0_20px_#00ff88]' : siteMode === 'vibrant' ? 'text-[#ffffffff]' : 'text-[#e8edf5]'}`}>
              EXPERIENCE<br/><span className={siteMode === 'fancy' ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#497ab6] to-[#ffc105]' : siteMode === 'neon' ? 'text-[#ff00ff] drop-shadow-[0_0_20px_#ff00ff]' : siteMode === 'vibrant' ? 'text-[#e94560]' : 'text-[#ffc105]'}>SMOOTH ANIMATIONS</span>
            </h2>
            <p className={`max-w-[520px] mx-auto text-[.95rem] leading-[1.7] ${
              siteMode === 'neon' ? 'text-[#00ff88]' : siteMode === 'vibrant' ? 'text-[#b8a9d1]' : 'text-[#7a93b4]'
            }`}>
              Click, hover, and interact with the elements below to see our smooth animations and transitions in action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Floating Animation Card */}
            <div className="reveal">
              <div className={`rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center group transition-all duration-300 ${
                siteMode === 'neon' 
                  ? 'bg-[#0a0a0a] border-2 border-[#00ff88] hover:border-[#ff00ff] hover:shadow-[0_0_20px_#00ff88]' 
                  : siteMode === 'fancy'
                  ? 'bg-gradient-to-br from-[#101e34] to-[#0d1a2e] border-2 border-[#ffc105] hover:border-[#497ab6]'
                  : siteMode === 'vibrant'
                  ? 'bg-gradient-to-br from-[#1a3a4a] to-[#0f2535] border-2 border-[#e94560] hover:border-[#ff6b9d]'
                  : siteMode === 'dark'
                  ? 'bg-[#0f1620] border border-[#2a3f5f] hover:border-[#4a6f9f]'
                  : siteMode === 'glassmorphism'
                  ? 'bg-[#ffffff]/10 backdrop-blur-lg border border-[#ffffff]/20 hover:border-[#ffc105]'
                  : 'bg-[#101e34] border border-[rgba(73,122,182,.2)] hover:border-[#ffc105]'
              }`}>
                <div className="text-6xl mb-4 animate-bounce">🎈</div>
                <h3 className={`font-semibold text-[1.2rem] mb-2 ${
                  siteMode === 'neon' ? 'text-[#00ff88]' : siteMode === 'vibrant' ? 'text-[#ffc0d9]' : 'text-[#e8edf5]'
                }`}>Floating Animation</h3>
                <p className={`text-[.9rem] ${
                  siteMode === 'neon' ? 'text-[#00ff88]/70' : siteMode === 'vibrant' ? 'text-[#b8a9d1]' : 'text-[#7a93b4]'
                }`}>Elements that smoothly float and bounce as you interact with them</p>
              </div>
            </div>

            {/* Pulse Animation Card */}
            <div className="reveal">
              <div className={`rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center group transition-all duration-300 ${
                siteMode === 'neon' 
                  ? 'bg-[#0a0a0a] border-2 border-[#ff00ff] hover:border-[#00ff88] hover:shadow-[0_0_20px_#ff00ff]' 
                  : siteMode === 'fancy'
                  ? 'bg-gradient-to-br from-[#101e34] to-[#0d1a2e] border-2 border-[#497ab6] hover:border-[#ffc105]'
                  : siteMode === 'vibrant'
                  ? 'bg-gradient-to-br from-[#1a3a4a] to-[#0f2535] border-2 border-[#ff6b9d] hover:border-[#e94560]'
                  : siteMode === 'dark'
                  ? 'bg-[#0f1620] border border-[#2a3f5f] hover:border-[#6a9fbf]'
                  : siteMode === 'glassmorphism'
                  ? 'bg-[#ffffff]/10 backdrop-blur-lg border border-[#ffffff]/20 hover:border-[#ffc105]'
                  : 'bg-[#101e34] border border-[rgba(73,122,182,.2)] hover:border-[#ffc105]'
              }`}>
                <div className={`w-16 h-16 rounded-full animate-pulse mb-4 ${
                  siteMode === 'neon'
                    ? 'bg-gradient-to-br from-[#00ff88] to-[#ff00ff] shadow-[0_0_20px_#00ff88]'
                    : siteMode === 'fancy'
                    ? 'bg-gradient-to-br from-[#ffc105] to-[#497ab6] shadow-[0_0_20px_rgba(255,193,5,.4)]'
                    : siteMode === 'vibrant'
                    ? 'bg-gradient-to-br from-[#e94560] to-[#ff6b9d] shadow-[0_0_20px_#e94560]'
                    : 'bg-gradient-to-br from-[#ffc105] to-[#497ab6] shadow-[0_0_20px_rgba(255,193,5,.4)]'
                }`}></div>
                <h3 className={`font-semibold text-[1.2rem] mb-2 ${
                  siteMode === 'neon' ? 'text-[#ff00ff]' : siteMode === 'vibrant' ? 'text-[#ffc0d9]' : 'text-[#e8edf5]'
                }`}>Pulsing Glow</h3>
                <p className={`text-[.9rem] ${
                  siteMode === 'neon' ? 'text-[#ff00ff]/70' : siteMode === 'vibrant' ? 'text-[#b8a9d1]' : 'text-[#7a93b4]'
                }`}>Gentle glowing effects that draw attention without overwhelming</p>
              </div>
            </div>

            {/* Spin Animation Card */}
            <div className="reveal">
              <div className={`rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center group cursor-pointer transition-all duration-300 ${
                siteMode === 'neon' 
                  ? 'bg-[#0a0a0a] border-2 border-[#00ff88] hover:border-[#00ffff]' 
                  : siteMode === 'fancy'
                  ? 'bg-gradient-to-br from-[#101e34] to-[#0d1a2e] border-2 border-[#ffc105] hover:border-[#497ab6]'
                  : siteMode === 'vibrant'
                  ? 'bg-gradient-to-br from-[#1a3a4a] to-[#0f2535] border-2 border-[#ff6b9d] hover:border-[#ffb3d9]'
                  : siteMode === 'dark'
                  ? 'bg-[#0f1620] border border-[#2a3f5f] hover:border-[#5a8faf]'
                  : siteMode === 'glassmorphism'
                  ? 'bg-[#ffffff]/10 backdrop-blur-lg border border-[#ffffff]/20 hover:border-[#ffc105]'
                  : 'bg-[#101e34] border border-[rgba(73,122,182,.2)] hover:border-[#ffc105]'
              }`} onClick={() => alert('Clicked! Try dragging on other elements.')}>
                <div className="text-6xl mb-4 group-hover:animate-spin">⚙️</div>
                <h3 className={`font-semibold text-[1.2rem] mb-2 ${
                  siteMode === 'neon' ? 'text-[#00ffff]' : siteMode === 'vibrant' ? 'text-[#ffc0d9]' : 'text-[#e8edf5]'
                }`}>Spin on Hover</h3>
                <p className={`text-[.9rem] ${
                  siteMode === 'neon' ? 'text-[#00ffff]/70' : siteMode === 'vibrant' ? 'text-[#b8a9d1]' : 'text-[#7a93b4]'
                }`}>Elements that rotate smoothly when you interact with them</p>
              </div>
            </div>

            {/* Scale Animation Card */}
            <div className="reveal cursor-pointer group">
              <div className={`rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center transition-all duration-300 ${
                siteMode === 'neon' 
                  ? 'bg-[#0a0a0a] border-2 border-[#ff00ff] hover:border-[#00ff88] hover:scale-110 hover:shadow-[0_0_30px_#ff00ff]' 
                  : siteMode === 'fancy'
                  ? 'bg-gradient-to-br from-[#101e34] to-[#0d1a2e] border-2 border-[#497ab6] hover:border-[#ffc105] hover:scale-110 hover:shadow-[0_8px_30px_rgba(255,193,5,.25)]'
                  : siteMode === 'vibrant'
                  ? 'bg-gradient-to-br from-[#1a3a4a] to-[#0f2535] border-2 border-[#ff6b9d] hover:border-[#e94560] hover:scale-110 hover:shadow-[0_0_30px_#e94560]'
                  : siteMode === 'dark'
                  ? 'bg-[#0f1620] border border-[#2a3f5f] hover:border-[#6a9fbf] hover:scale-110 hover:shadow-[0_8px_20px_rgba(100,159,191,.2)]'
                  : siteMode === 'glassmorphism'
                  ? 'bg-[#ffffff]/10 backdrop-blur-lg border border-[#ffffff]/20 hover:border-[#ffc105] hover:scale-110 hover:shadow-[0_8px_30px_rgba(255,193,5,.2)]'
                  : 'bg-[#101e34] border border-[rgba(73,122,182,.2)] hover:border-[#ffc105] hover:scale-110 hover:shadow-[0_0_30px_rgba(255,193,5,.3)]'
              }`}>
                <div className="text-6xl mb-4 group-hover:scale-150 transition-transform duration-300">📦</div>
                <h3 className={`font-semibold text-[1.2rem] mb-2 ${
                  siteMode === 'neon' ? 'text-[#ff00ff]' : siteMode === 'vibrant' ? 'text-[#ffc0d9]' : 'text-[#e8edf5]'
                }`}>Scale Transform</h3>
                <p className={`text-[.9rem] ${
                  siteMode === 'neon' ? 'text-[#ff00ff]/70' : siteMode === 'vibrant' ? 'text-[#b8a9d1]' : 'text-[#7a93b4]'
                }`}>Cards that smoothly grow larger when you hover over them</p>
              </div>
            </div>

            {/* Gradient Animation Card */}
            <div className="reveal">
              <div className={`rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center group transition-all duration-300 ${
                siteMode === 'neon' 
                  ? 'bg-gradient-to-br from-[#0a0a0a] to-[#005500] border-2 border-[#00ff88] hover:border-[#ff00ff]' 
                  : siteMode === 'fancy'
                  ? 'bg-gradient-to-br from-[#101e34] to-[#0d1a2e] hover:from-[#1a2e4a] hover:to-[#101e34] border-2 border-[#ffc105] hover:border-[#497ab6]'
                  : siteMode === 'vibrant'
                  ? 'bg-gradient-to-br from-[#1a3a4a] to-[#0f2535] hover:from-[#2a4a5a] hover:to-[#1f3545] border-2 border-[#e94560]'
                  : siteMode === 'dark'
                  ? 'bg-gradient-to-br from-[#0f1620] to-[#0a0f15] border border-[#2a3f5f] hover:border-[#5a8faf]'
                  : siteMode === 'glassmorphism'
                  ? 'bg-gradient-to-br from-[#ffffff]/15 to-[#ffffff]/5 border border-[#ffffff]/25 hover:border-[#ffc105] backdrop-blur-lg'
                  : 'bg-gradient-to-br from-[#101e34] to-[#0d1a2e] hover:from-[#1a2e4a] hover:to-[#101e34] border border-[rgba(73,122,182,.2)] hover:border-[#ffc105]'
              }`}>
                <div className="text-6xl mb-4">🎨</div>
                <h3 className={`font-semibold text-[1.2rem] mb-2 ${
                  siteMode === 'neon' ? 'text-[#00ff88]' : siteMode === 'vibrant' ? 'text-[#ffc0d9]' : 'text-[#e8edf5]'
                }`}>Gradient Shift</h3>
                <p className={`text-[.9rem] ${
                  siteMode === 'neon' ? 'text-[#00ff88]/70' : siteMode === 'vibrant' ? 'text-[#b8a9d1]' : 'text-[#7a93b4]'
                }`}>Backgrounds that smoothly transition between different gradients</p>
              </div>
            </div>

            {/* Slide Animation Card */}
            <div className="reveal">
              <div className={`rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center overflow-hidden group transition-all duration-300 ${
                siteMode === 'neon' 
                  ? 'bg-[#0a0a0a] border-2 border-[#00ffff] hover:border-[#ff00ff] hover:shadow-[0_0_20px_#00ffff]' 
                  : siteMode === 'fancy'
                  ? 'bg-gradient-to-br from-[#101e34] to-[#0d1a2e] border-2 border-[#ffc105] hover:border-[#497ab6]'
                  : siteMode === 'vibrant'
                  ? 'bg-gradient-to-br from-[#1a3a4a] to-[#0f2535] border-2 border-[#ff6b9d] hover:border-[#e94560]'
                  : siteMode === 'dark'
                  ? 'bg-[#0f1620] border border-[#2a3f5f] hover:border-[#7aaffb]'
                  : siteMode === 'glassmorphism'
                  ? 'bg-[#ffffff]/10 backdrop-blur-lg border border-[#ffffff]/20 hover:border-[#ffc105]'
                  : 'bg-[#101e34] border border-[rgba(73,122,182,.2)] hover:border-[#ffc105]'
              }`}>
                <div className="text-6xl mb-4 group-hover:translate-x-2 group-hover:animate-pulse transition-all duration-300">→</div>
                <h3 className={`font-semibold text-[1.2rem] mb-2 ${
                  siteMode === 'neon' ? 'text-[#00ffff]' : siteMode === 'vibrant' ? 'text-[#ffc0d9]' : 'text-[#e8edf5]'
                }`}>Slide Effect</h3>
                <p className={`text-[.9rem] ${
                  siteMode === 'neon' ? 'text-[#00ffff]/70' : siteMode === 'vibrant' ? 'text-[#b8a9d1]' : 'text-[#7a93b4]'
                }`}>Content that smoothly slides and transitions into view</p>
              </div>
            </div>
          </div>

          {/* Interactive Button */}
          <div className="mt-20 text-center reveal">
            <button className={`border-none px-12 py-4 rounded font-['Barlow_Condensed'] font-black uppercase tracking-[.1em] text-[1.05rem] cursor-pointer transition-all ${
              siteMode === 'neon'
                ? 'bg-[#00ff88] text-[#000000] hover:shadow-[0_12px_40px_rgba(0,255,136,.4)] hover:translate-y-[-4px] active:translate-y-[-2px]'
                : siteMode === 'fancy'
                ? 'bg-gradient-to-br from-[#ffc105] to-[#497ab6] text-[#080f1c] hover:shadow-[0_12px_40px_rgba(255,193,5,.35)] hover:translate-y-[-4px] active:translate-y-[-2px]'
                : siteMode === 'vibrant'
                ? 'bg-gradient-to-br from-[#e94560] to-[#ff6b9d] text-white hover:shadow-[0_12px_40px_rgba(233,69,96,.4)] hover:translate-y-[-4px] active:translate-y-[-2px]'
                : siteMode === 'dark'
                ? 'bg-gradient-to-br from-[#4a6f9f] to-[#2a4f7f] text-[#e8edf5] hover:shadow-[0_12px_40px_rgba(100,159,191,.3)] hover:translate-y-[-4px] active:translate-y-[-2px]'
                : siteMode === 'minimal'
                ? 'border-2 border-[#ffc105] text-[#ffc105] hover:bg-[#ffc105] hover:text-[#080f1c] hover:shadow-[0_8px_24px_rgba(255,193,5,.25)]'
                : siteMode === 'glassmorphism'
                ? 'bg-[#ffffff]/20 backdrop-blur-lg border border-[#ffffff]/30 text-white hover:bg-[#ffffff]/30 hover:border-[#ffc105] hover:shadow-[0_12px_40px_rgba(255,193,5,.2)]'
                : 'bg-gradient-to-br from-[#ffc105] to-[#e0a800] text-[#080f1c] hover:translate-y-[-4px] hover:shadow-[0_12px_40px_rgba(255,193,5,.4)] active:translate-y-[-2px]'
            }`}>
              Try Clicking Me! ✨
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
