'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [videoMode, setVideoMode] = useState<'classic' | 'fancy' | 'neon' | 'minimal'>('classic');
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
    const createdParticles: HTMLDivElement[] = [];
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
        createdParticles.push(p);
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

    // Cleanup particles on unmount
    return () => {
      createdParticles.forEach(p => p.remove());
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#080f1c] text-[#e8edf5] overflow-x-hidden">
      {/* Noise overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`
           }} />

      {/* Nav */}
      <nav className={`fixed top-0 w-full z-50 flex items-center justify-between px-[5%] h-[68px] bg-[#080f1c]/85 backdrop-blur-[16px] transition-shadow ${scrolled ? 'shadow-[0_4px_40px_rgba(0,0,0,.5)]' : ''} border-b border-[rgba(73,122,182,.2)]`}>
        <Link href="/" className="flex items-center gap-2.5 text-decoration-none">
          <div className="w-9 h-9 bg-gradient-to-br from-[#ffc105] to-[#e0a800] rounded-lg grid place-items-center font-bebas-neue text-xl text-[#080f1c] shadow-[0_0_16px_rgba(255,193,5,.35)]">
            S
          </div>
          <div className="font-barlow-condensed font-black text-xl uppercase tracking-[.04em]">
            <span className="text-[#ffc105]">Sahara</span>
          </div>
        </Link>
        <ul className="flex gap-8 list-none">
          <li><Link href="#categories" className="text-[#7a93b4] no-underline font-medium uppercase tracking-[.05em] text-[.875rem] transition-colors hover:text-[#ffc105]">Explore</Link></li>
          <li><Link href="#why" className="text-[#7a93b4] no-underline font-medium uppercase tracking-[.05em] text-[.875rem] transition-colors hover:text-[#ffc105]">Features</Link></li>
          <li><Link href="#about" className="text-[#7a93b4] no-underline font-medium uppercase tracking-[.05em] text-[.875rem] transition-colors hover:text-[#ffc105]">About</Link></li>
          <li><a href="#" className="text-[#7a93b4] no-underline font-medium uppercase tracking-[.05em] text-[.875rem] transition-colors hover:text-[#ffc105]">Sign In</a></li>
        </ul>
        <div className="flex items-center gap-4">
          <select 
            value={videoMode} 
            onChange={(e) => setVideoMode(e.target.value as any)}
            className="bg-[#101e34] border border-[rgba(73,122,182,.3)] text-[#e8edf5] px-4 py-2 rounded font-barlow-condensed text-[.85rem] uppercase tracking-[.05em] cursor-pointer transition-all hover:border-[#ffc105]"
          >
            <option value="classic">Classic Mode</option>
            <option value="fancy">✨ Fancy Mode</option>
            <option value="neon">⚡ Neon Mode</option>
            <option value="minimal">— Minimal Mode</option>
          </select>
          <button className="bg-[#ffc105] text-[#080f1c] border-none px-6 py-2.5 rounded transition-all hover:bg-[#ffcf3a] hover:translate-y-[-1px] hover:shadow-[0_6px_24px_rgba(255,193,5,.4)] font-barlow-condensed font-bold uppercase tracking-[.08em] text-[.95rem] cursor-pointer">
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

          <h1 className="font-bebas-neue text-[clamp(4rem,11vw,9rem)] leading-[.92] tracking-[.03em] text-[#e8edf5] animate-fade-up">
            EXPLORE<br/>
            THE <span className="text-[#ffc105] drop-shadow-[0_0_40px_rgba(255,193,5,.4)]">SAHARA</span>
          </h1>

          <p className="font-barlow-condensed font-semibold text-[clamp(1rem,2.5vw,1.5rem)] uppercase tracking-[.25em] text-[#7a93b4] mt-3 animate-fade-up">
            Games · Videos · Music · <span className="text-[#497ab6]">Education</span> &amp; Beyond
          </p>

          <p className="text-[1.1rem] text-[#7a93b4] leading-[1.7] max-w-[560px] mx-auto mt-7 animate-fade-up">
            One destination. Infinite possibilities. Discover a universe of entertainment,
            knowledge, and creativity — all under one roof.
          </p>

          <div className="flex items-center justify-center gap-4 mt-11 flex-wrap animate-fade-up">
            <button className="bg-gradient-to-br from-[#ffc105] to-[#e0a800] text-[#080f1c] border-none px-10 py-4 rounded transition-all hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(255,193,5,.35)] font-barlow-condensed font-black uppercase tracking-[.1em] text-[1.05rem] cursor-pointer">
              Start Exploring →
            </button>
            <button className="bg-transparent text-[#e8edf5] border border-[rgba(73,122,182,.2)] px-8 py-3.5 rounded transition-all hover:border-[#497ab6] hover:text-[#497ab6] hover:bg-[rgba(73,122,182,.08)] font-barlow-condensed font-bold uppercase tracking-[.1em] text-[1.05rem] cursor-pointer">
              Watch Intro
            </button>
          </div>

          <div className="flex justify-center gap-12 mt-16 flex-wrap animate-fade-up">
            <div className="text-center">
              <div className="text-[#ffc105] font-bebas-neue text-[2.8rem] leading-none" data-target="250">0</div>
              <div className="text-[.75rem] text-[#7a93b4] uppercase tracking-[.12em] mt-1">Million Users</div>
            </div>
            <div className="w-px bg-[rgba(73,122,182,.2)] self-stretch my-1" />
            <div className="text-center">
              <div className="text-[#ffc105] font-bebas-neue text-[2.8rem] leading-none" data-target="10">0</div>
              <div className="text-[.75rem] text-[#7a93b4] uppercase tracking-[.12em] mt-1">M+ Content Items</div>
            </div>
            <div className="w-px bg-[rgba(73,122,182,.2)] self-stretch my-1" />
            <div className="text-center">
              <div className="text-[#ffc105] font-bebas-neue text-[2.8rem] leading-none" data-target="190">0</div>
              <div className="text-[.75rem] text-[#7a93b4] uppercase tracking-[.12em] mt-1">Countries</div>
            </div>
            <div className="w-px bg-[rgba(73,122,182,.2)] self-stretch my-1" />
            <div className="text-center">
              <div className="text-[#ffc105] font-bebas-neue text-[2.8rem] leading-none" data-target="4">0</div>
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
              <h2 className="font-bebas-neue text-[clamp(2.4rem,5vw,3.8rem)] leading-none tracking-[.03em] text-[#e8edf5]">
                WHAT DO YOU WANT<br/><span className="text-[#ffc105]">TO EXPLORE TODAY?</span>
              </h2>
            </div>
            <p className="text-[#7a93b4] max-w-[320px] text-[.9rem] leading-[1.7]">
              Dive into any world you choose — we have everything from epic gaming to world-class education.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-5">
            <Link href="/games" className="relative overflow-hidden rounded-xl border border-[rgba(73,122,182,.2)] bg-[#101e34] p-9 pb-8 cursor-pointer transition-all hover:translate-y-[-6px] hover:shadow-[0_24px_60px_rgba(0,0,0,.5)] hover:border-[rgba(255,193,5,.35)] group reveal block">
              <div className="absolute inset-0 opacity-0 bg-gradient-to-br from-[rgba(255,193,5,.06)] to-transparent transition-opacity group-hover:opacity-100"></div>
              <div className="w-14 h-14 rounded-xl grid place-items-center text-2xl mb-5 relative z-10">🎮</div>
              <div className="font-barlow-condensed font-black text-[1.5rem] uppercase tracking-[.04em] text-[#e8edf5] mb-2 relative z-10">Games</div>
              <div className="text-[.88rem] text-[#7a93b4] leading-[1.65] relative z-10">From casual mobile puzzles to immersive open-world adventures — discover thousands of titles across every genre imaginable.</div>
              <div className="absolute top-6 right-6 text-[3.5rem] leading-none text-[rgba(255,255,255,.04)] pointer-events-none">01</div>
              <div className="mt-6 flex items-center gap-2 text-[.82rem] font-semibold uppercase tracking-[.1em] text-[#ffc105] relative z-10 transition-all group-hover:gap-3.5">Browse Games ›</div>
            </Link>

            <Link href="/videos" className="relative overflow-hidden rounded-xl border border-[rgba(73,122,182,.2)] bg-[#101e34] p-9 pb-8 cursor-pointer transition-all hover:translate-y-[-6px] hover:shadow-[0_24px_60px_rgba(0,0,0,.5)] hover:border-[rgba(255,193,5,.35)] group reveal block">
              <div className="absolute inset-0 opacity-0 bg-gradient-to-br from-[rgba(255,193,5,.06)] to-transparent transition-opacity group-hover:opacity-100"></div>
              <div className="w-14 h-14 rounded-xl grid place-items-center text-2xl mb-5 relative z-10">🎬</div>
              <div className="font-barlow-condensed font-black text-[1.5rem] uppercase tracking-[.04em] text-[#e8edf5] mb-2 relative z-10">Videos</div>
              <div className="text-[.88rem] text-[#7a93b4] leading-[1.65] relative z-10">Stream movies, series, short films, docs, and viral clips from creators worldwide.</div>
              <div className="absolute top-6 right-6 text-[3.5rem] leading-none text-[rgba(255,255,255,.04)] pointer-events-none">02</div>
              <div className="mt-6 flex items-center gap-2 text-[.82rem] font-semibold uppercase tracking-[.1em] text-[#ffc105] relative z-10 transition-all group-hover:gap-3.5">Watch Now ›</div>
            </Link>

            <Link href="/music" className="relative overflow-hidden rounded-xl border border-[rgba(73,122,182,.2)] bg-[#101e34] p-9 pb-8 cursor-pointer transition-all hover:translate-y-[-6px] hover:shadow-[0_24px_60px_rgba(0,0,0,.5)] hover:border-[rgba(255,193,5,.35)] group reveal block">
              <div className="absolute inset-0 opacity-0 bg-gradient-to-br from-[rgba(255,193,5,.06)] to-transparent transition-opacity group-hover:opacity-100"></div>
              <div className="w-14 h-14 rounded-xl grid place-items-center text-2xl mb-5 relative z-10">🎵</div>
              <div className="font-barlow-condensed font-black text-[1.5rem] uppercase tracking-[.04em] text-[#e8edf5] mb-2 relative z-10">Music</div>
              <div className="text-[.88rem] text-[#7a93b4] leading-[1.65] relative z-10">90M+ tracks. Every genre. Curated playlists, live sessions, and artist radio — all in one place.</div>
              <div className="absolute top-6 right-6 text-[3.5rem] leading-none text-[rgba(255,255,255,.04)] pointer-events-none">03</div>
              <div className="mt-6 flex items-center gap-2 text-[.82rem] font-semibold uppercase tracking-[.1em] text-[#ffc105] relative z-10 transition-all group-hover:gap-3.5">Browse Music ›</div>
            </Link>

            <Link href="/education" className="relative overflow-hidden rounded-xl border border-[rgba(73,122,182,.2)] bg-[#101e34] p-9 pb-8 cursor-pointer transition-all hover:translate-y-[-6px] hover:shadow-[0_24px_60px_rgba(0,0,0,.5)] hover:border-[rgba(255,193,5,.35)] group reveal block">
              <div className="absolute inset-0 opacity-0 bg-gradient-to-br from-[rgba(255,193,5,.06)] to-transparent transition-opacity group-hover:opacity-100"></div>
              <div className="w-14 h-14 rounded-xl grid place-items-center text-2xl mb-5 relative z-10">📚</div>
              <div className="font-barlow-condensed font-black text-[1.5rem] uppercase tracking-[.04em] text-[#e8edf5] mb-2 relative z-10">Education</div>
              <div className="text-[.88rem] text-[#7a93b4] leading-[1.65] relative z-10">Courses, tutorials, and learning paths from top institutions and expert instructors worldwide.</div>
              <div className="absolute top-6 right-6 text-[3.5rem] leading-none text-[rgba(255,255,255,.04)] pointer-events-none">04</div>
              <div className="mt-6 flex items-center gap-2 text-[.82rem] font-semibold uppercase tracking-[.1em] text-[#ffc105] relative z-10 transition-all group-hover:gap-3.5">Start Learning ›</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Videos - Mode-based Rendering */}
      <section className={`py-[120px] px-[5%] ${videoMode === 'fancy' ? 'bg-gradient-to-br from-[#080f1c] via-[#1a1f3a] to-[#0d1a2e]' : videoMode === 'neon' ? 'bg-[#000000]' : 'bg-[#080f1c]'}`} id="videos">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-20 reveal">
            <div className="flex items-center gap-2.5 text-[#ffc105] font-bold text-[.78rem] uppercase tracking-[.2em] mb-3">
              <div className={`w-8 h-0.5 ${videoMode === 'neon' ? 'bg-[#00ff88] shadow-[0_0_10px_#00ff88]' : 'bg-[#ffc105]'}`}></div>
              Trending Now
            </div>
            <h2 className={`font-bebas-neue text-[clamp(2.4rem,5vw,3.8rem)] leading-none tracking-[.03em] ${videoMode === 'fancy' ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#ffc105] to-[#497ab6]' : videoMode === 'neon' ? 'text-[#00ff88] drop-shadow-[0_0_20px_#00ff88]' : 'text-[#e8edf5]'}`}>
              SHORT-FORM<br/><span className={videoMode === 'fancy' ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#497ab6] to-[#ffc105]' : videoMode === 'neon' ? 'text-[#ff00ff] drop-shadow-[0_0_20px_#ff00ff]' : 'text-[#ffc105]'}>VIDEOS FOR YOU</span>
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
                    ? videoMode === 'neon'
                      ? 'bg-[#00ff88] text-[#000000] shadow-[0_0_20px_#00ff88]'
                      : videoMode === 'fancy'
                      ? 'bg-gradient-to-r from-[#ffc105] to-[#497ab6] text-[#080f1c] shadow-[0_8px_24px_rgba(255,193,5,.3)]'
                      : 'bg-[#ffc105] text-[#080f1c]'
                    : videoMode === 'neon'
                    ? 'border border-[#00ff88] text-[#00ff88] hover:shadow-[0_0_15px_#00ff88]'
                    : videoMode === 'minimal'
                    ? 'border-b-2 border-[#7a93b4] text-[#7a93b4] hover:border-[#ffc105] hover:text-[#ffc105]'
                    : 'border border-[rgba(73,122,182,.3)] text-[#7a93b4] hover:border-[#ffc105] hover:text-[#ffc105]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Videos Grid */}
          <div className={`grid gap-5 ${videoMode === 'minimal' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
            {[
              { title: 'Minimalist Architecture in the Desert', creator: 'Khan Studios', views: '48.2K', duration: '45', color: 'blue', tags: ['Architecture', 'Design'] },
              { title: 'Quick Kitchen Tips for Busy Professionals', creator: 'Chef\'s Corner', views: '156.3K', duration: '32', color: 'emerald', tags: ['Lifestyle', 'Tutorial'] },
              { title: 'AI Trends You Need to Know About', creator: 'Tech Insights Daily', views: '324.1K', duration: '58', color: 'purple', tags: ['Tech', 'News'] },
              { title: 'Fitness Motivation: High-Intensity Challenge', creator: 'Fitness Elite', views: '89.7K', duration: '67', color: 'orange', tags: ['Health', 'Wellness'] },
              { title: 'Travel Guide: Hidden Gems in Barcelona', creator: 'Wanderlust Chronicles', views: '215.8K', duration: '40', color: 'cyan', tags: ['Travel', 'Vlog'] },
              { title: 'Sustainable Living: Small Changes, Big Impact', creator: 'Green Living Hub', views: '127.4K', duration: '53', color: 'rose', tags: ['Lifestyle', 'Eco'] },
              { title: 'Comedy Sketch: Corporate Life Unplugged', creator: 'The Comedy Lab', views: '412.6K', duration: '75', color: 'indigo', tags: ['Comedy', 'Humor'] },
              { title: 'Photography Masterclass: Golden Hour Secrets', creator: 'Lens Academy', views: '203.2K', duration: '61', color: 'amber', tags: ['Creative', 'Tutorial'] },
            ].map((video, idx) => {
              const colorMap: Record<string, string> = {
                blue: '#1e40af', emerald: '#047857', purple: '#7c3aed', orange: '#ea580c',
                cyan: '#0891b2', rose: '#be185d', indigo: '#4f46e5', amber: '#b45309'
              };
              
              if (videoMode === 'fancy') {
                return (
                  <div key={idx} className="group reveal cursor-pointer">
                    <div className="relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.05] hover:-rotate-1">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#ffc105] via-[#497ab6] to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-2xl"></div>
                      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a2e4a] to-[#0d1a2e] aspect-video">
                        <div className="absolute inset-0 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle, ${colorMap[video.color]}, transparent)` }}></div>
                        <div className="absolute inset-0 flex items-end justify-between p-4 z-10">
                          <div className="text-[.7rem] font-bold uppercase tracking-[.12em] text-[#ffc105] bg-[rgba(0,0,0,.7)] px-3 py-1.5 rounded-full backdrop-blur-md border border-[#ffc105]">
                            {video.duration} sec
                          </div>
                          <div className="text-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-150">▶️</div>
                        </div>
                        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${colorMap[video.color]}40, transparent)` }} />
                      </div>
                      <div className="bg-gradient-to-b from-[#101e34] to-[#0d1a2e] border-2 border-[#ffc105] border-t-0 p-5 rounded-b-2xl">
                        <h3 className="text-[#ffc105] font-black text-[1rem] mb-3 line-clamp-2">{video.title}</h3>
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[#7a93b4] text-[.8rem] font-semibold">{video.creator}</p>
                          <span className="text-[#ffc105] text-[.75rem] font-black drop-shadow-[0_0_8px_rgba(255,193,5,.5)]">⭐ {video.views}</span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {video.tags.map((tag: string) => (
                            <span key={tag} className="text-[.65rem] text-[#ffc105] bg-[#ffc10520] px-3 py-1 rounded-full border border-[#ffc105] font-bold">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else if (videoMode === 'neon') {
                return (
                  <div key={idx} className="group reveal cursor-pointer">
                    <div className="relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-[1.08] hover:shadow-[0_0_30px_#00ff88]">
                      <div className="relative overflow-hidden rounded-lg bg-[#0a0a0a] aspect-video border-2 border-[#00ff88]">
                        <div className="absolute inset-0 flex items-end justify-between p-4 z-10">
                          <div className="text-[.7rem] font-bold text-[#000] bg-[#00ff88] px-2 py-1 rounded font-mono">
                            {video.duration}s
                          </div>
                          <div className="text-lg opacity-0 group-hover:opacity-100 transition-opacity text-[#00ff88] drop-shadow-[0_0_10px_#00ff88]">▶️</div>
                        </div>
                        <div className="absolute inset-0 opacity-30" style={{ background: `linear-gradient(135deg, ${colorMap[video.color]}, transparent)` }} />
                      </div>
                      <div className="bg-[#0a0a0a] border-l-4 border-r-4 border-b-4 border-[#ff00ff] p-4 rounded-b-lg">
                        <h3 className="text-[#00ff88] font-mono text-[.9rem] mb-2 line-clamp-2 drop-shadow-[0_0_10px_#00ff88]">{video.title}</h3>
                        <div className="flex items-center justify-between text-[.75rem]">
                          <p className="text-[#00ff88] font-mono">{video.creator}</p>
                          <span className="text-[#ff00ff] font-mono drop-shadow-[0_0_10px_#ff00ff]">{video.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else if (videoMode === 'minimal') {
                return (
                  <article key={idx} className="group reveal cursor-pointer">
                    <div className="aspect-video bg-gradient-to-br from-[#1a2e4a] to-[#0d1a2e] rounded overflow-hidden mb-4 transition-all hover:shadow-lg">
                      <div className="w-full h-full flex items-center justify-center text-4xl opacity-60 group-hover:opacity-100 transition-opacity">
                        ▶️
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#e8edf5] text-[.95rem] mb-2 line-clamp-2">{video.title}</h3>
                      <div className="flex items-center gap-2 text-[.8rem]">
                        <span className="text-[#7a93b4]">{video.creator}</span>
                        <span className="text-[#ffc105] font-semibold">{video.views}</span>
                      </div>
                    </div>
                  </article>
                );
              } else {
                return (
                  <div key={idx} className="group reveal cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1a2e4a] to-[#0d1a2e] aspect-video">
                      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(255,193,5,.15)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 flex items-end justify-between p-4 z-10">
                        <div className="text-[.7rem] font-bold uppercase tracking-[.12em] text-[#ffc105] bg-[rgba(0,0,0,.6)] px-2 py-1 rounded backdrop-blur-sm">
                          {video.duration} sec
                        </div>
                        <div className="text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110">▶️</div>
                      </div>
                      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${colorMap[video.color]}35, transparent)` }} />
                    </div>
                    <div className="bg-[#101e34] border border-[rgba(73,122,182,.2)] border-t-0 p-4 rounded-b-xl">
                      <h3 className="text-[#e8edf5] font-semibold text-[.95rem] mb-2 line-clamp-2">{video.title}</h3>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[#7a93b4] text-[.8rem]">{video.creator}</p>
                        <span className="text-[#ffc105] text-[.75rem] font-bold">⬆️ {video.views}</span>
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {video.tags.map((tag: string) => (
                          <span key={tag} className="text-[.7rem] text-[#497ab6] bg-[rgba(73,122,182,.1)] px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center reveal">
            <button className={`px-12 py-4 rounded font-barlow-condensed font-black uppercase tracking-[.1em] text-[1.05rem] cursor-pointer transition-all ${
              videoMode === 'neon'
                ? 'bg-[#00ff88] text-[#000000] hover:shadow-[0_0_30px_#00ff88]'
                : videoMode === 'fancy'
                ? 'bg-gradient-to-br from-[#ffc105] to-[#497ab6] text-[#080f1c] hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(255,193,5,.35)]'
                : videoMode === 'minimal'
                ? 'border-2 border-[#ffc105] text-[#ffc105] hover:bg-[#ffc105] hover:text-[#080f1c]'
                : 'bg-gradient-to-br from-[#ffc105] to-[#e0a800] text-[#080f1c] hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(255,193,5,.35)]'
            }`}>
              Explore All Videos ›
            </button>
          </div>
        </div>
      </section>

      {/* Animations Showcase Section */}
      <section className="py-[120px] px-[5%] bg-gradient-to-b from-[#0d1a2e] to-[#080f1c]" id="animations">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-20 text-center reveal">
            <div className="flex items-center justify-center gap-2.5 text-[#ffc105] font-bold text-[.78rem] uppercase tracking-[.2em] mb-3">
              <div className="w-8 h-0.5 bg-[#ffc105]"></div>
              Interactive Features
              <div className="w-8 h-0.5 bg-[#ffc105]"></div>
            </div>
            <h2 className="font-bebas-neue text-[clamp(2.4rem,5vw,3.8rem)] leading-none tracking-[.03em] text-[#e8edf5] mb-4">
              EXPERIENCE<br/><span className="text-[#ffc105]">SMOOTH ANIMATIONS</span>
            </h2>
            <p className="text-[#7a93b4] max-w-[520px] mx-auto text-[.95rem] leading-[1.7]">
              Click, hover, and interact with the elements below to see our smooth animations and transitions in action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Floating Animation Card */}
            <div className="reveal">
              <div className="bg-[#101e34] border border-[rgba(73,122,182,.2)] rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center group hover:border-[#ffc105] transition-all duration-300">
                <div className="text-6xl mb-4 animate-bounce">🎈</div>
                <h3 className="text-[#e8edf5] font-semibold text-[1.2rem] mb-2">Floating Animation</h3>
                <p className="text-[#7a93b4] text-[.9rem]">Elements that smoothly float and bounce as you interact with them</p>
              </div>
            </div>

            {/* Pulse Animation Card */}
            <div className="reveal">
              <div className="bg-[#101e34] border border-[rgba(73,122,182,.2)] rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center group hover:border-[#ffc105] transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ffc105] to-[#497ab6] animate-pulse mb-4 shadow-[0_0_20px_rgba(255,193,5,.4)]"></div>
                <h3 className="text-[#e8edf5] font-semibold text-[1.2rem] mb-2">Pulsing Glow</h3>
                <p className="text-[#7a93b4] text-[.9rem]">Gentle glowing effects that draw attention without overwhelming</p>
              </div>
            </div>

            {/* Spin Animation Card */}
            <div className="reveal">
              <div className="bg-[#101e34] border border-[rgba(73,122,182,.2)] rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center group hover:border-[#ffc105] transition-all duration-300 cursor-pointer" onClick={() => alert('Clicked! Try dragging on other elements.')}>
                <div className="text-6xl mb-4 group-hover:animate-spin">⚙️</div>
                <h3 className="text-[#e8edf5] font-semibold text-[1.2rem] mb-2">Spin on Hover</h3>
                <p className="text-[#7a93b4] text-[.9rem]">Elements that rotate smoothly when you interact with them</p>
              </div>
            </div>

            {/* Scale Animation Card */}
            <div className="reveal cursor-pointer group">
              <div className="bg-[#101e34] border border-[rgba(73,122,182,.2)] rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center hover:scale-110 hover:border-[#ffc105] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,193,5,.3)]">
                <div className="text-6xl mb-4 group-hover:scale-150 transition-transform duration-300">📦</div>
                <h3 className="text-[#e8edf5] font-semibold text-[1.2rem] mb-2">Scale Transform</h3>
                <p className="text-[#7a93b4] text-[.9rem]">Cards that smoothly grow larger when you hover over them</p>
              </div>
            </div>

            {/* Gradient Animation Card */}
            <div className="reveal">
              <div className="bg-gradient-to-br from-[#101e34] to-[#0d1a2e] border border-[rgba(73,122,182,.2)] rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center group hover:from-[#1a2e4a] hover:to-[#101e34] transition-all duration-300 hover:border-[#ffc105]">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-[#e8edf5] font-semibold text-[1.2rem] mb-2">Gradient Shift</h3>
                <p className="text-[#7a93b4] text-[.9rem]">Backgrounds that smoothly transition between different gradients</p>
              </div>
            </div>

            {/* Slide Animation Card */}
            <div className="reveal">
              <div className="bg-[#101e34] border border-[rgba(73,122,182,.2)] rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center overflow-hidden group hover:border-[#ffc105] transition-all duration-300">
                <div className="text-6xl mb-4 group-hover:translate-x-2 group-hover:animate-pulse transition-all duration-300">→</div>
                <h3 className="text-[#e8edf5] font-semibold text-[1.2rem] mb-2">Slide Effect</h3>
                <p className="text-[#7a93b4] text-[.9rem]">Content that smoothly slides and transitions into view</p>
              </div>
            </div>
          </div>

          {/* Interactive Button */}
          <div className="mt-20 text-center reveal">
            <button className="bg-gradient-to-br from-[#ffc105] to-[#e0a800] text-[#080f1c] border-none px-12 py-4 rounded font-barlow-condensed font-black uppercase tracking-[.1em] text-[1.05rem] cursor-pointer transition-all hover:translate-y-[-4px] hover:shadow-[0_12px_40px_rgba(255,193,5,.4)] active:translate-y-[-2px]">
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
