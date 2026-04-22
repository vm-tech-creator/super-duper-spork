'use client';

import { useState, useEffect } from 'react';
import GameCard from '@/components/GameCard';

const GAMES_DATA = [
  {
    id: 1,
    title: 'The Pointing Pointer',
    description: 'A site that tracks your cursor and displays a random photo of someone pointing exactly where it is.',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=400&fit=crop',
    genre: 'Interactive & Useless Fun',
    rating: 4.3,
    players: 'Solo',
    releaseDate: 'Mar 2026',
  },
  {
    id: 10,
    title: 'Interactive Space Model',
    description: 'An interactive 3D model of our solar system where you can explore planets, moons, and celestial bodies.',
    imageUrl: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=500&h=400&fit=crop',
    genre: 'Space',
    rating: 4.8,
    players: 'Solo',
    releaseDate: 'Apr 2026',
  },
  {
    id: 2,
    title: 'Endless Horse',
    description: 'A page with a pixelated horse whose legs get longer and longer as you scroll infinitely.',
    imageUrl: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=500&h=400&fit=crop',
    genre: 'Interactive & Useless Fun',
    rating: 4.5,
    players: 'Solo',
    releaseDate: 'Feb 2026',
  },
  {
    id: 3,
    title: 'Find the Invisible Cow',
    description: 'A digital "Marco Polo" game where audio gets louder as your mouse gets closer to a hidden cow.',
    imageUrl: 'https://images.unsplash.com/photo-1612128425821-aea0a3d3b40f?w=500&h=400&fit=crop',
    genre: 'Interactive & Useless Fun',
    rating: 4.6,
    players: 'Solo',
    releaseDate: 'Jan 2026',
  },
  {
    id: 4,
    title: 'Passive-Aggressive Password Tester',
    description: 'A tool that critiques your password strength in the voice of a judgmental in-law.',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=400&fit=crop',
    genre: 'Interactive & Useless Fun',
    rating: 4.7,
    players: 'Solo',
    releaseDate: 'Mar 2026',
  },
  {
    id: 5,
    title: 'Cat Bounce',
    description: 'A page where images of cats bounce around; clicking a button makes it "rain" cats.',
    imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&h=400&fit=crop',
    genre: 'Interactive & Useless Fun',
    rating: 4.9,
    players: 'Solo',
    releaseDate: 'Dec 2025',
  },
  {
    id: 6,
    title: 'Hacker Typer',
    description: 'A simulator where typing random keys on your keyboard generates high-speed "green code" like a 90s hacker movie.',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=400&fit=crop',
    genre: 'Interactive & Useless Fun',
    rating: 4.4,
    players: 'Solo',
    releaseDate: 'Nov 2025',
  },
  {
    id: 7,
    title: 'Elon Musk\'s Fortune',
    description: 'A simulator that lets you try to spend a billionaire\'s entire net worth on ridiculous items.',
    imageUrl: 'https://images.unsplash.com/photo-1553729784-e91953dec042?w=500&h=400&fit=crop',
    genre: 'Humorous & Absurd Concepts',
    rating: 4.6,
    players: 'Solo',
    releaseDate: 'Apr 2026',
  },
  {
    id: 8,
    title: 'Who is Pissed Off At Your Music?',
    description: 'A quiz that takes your music taste and tells you which demographic you\'re most likely annoying.',
    imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=500&h=400&fit=crop',
    genre: 'Humorous & Absurd Concepts',
    rating: 4.8,
    players: 'Solo',
    releaseDate: 'Mar 2026',
  },
  {
    id: 9,
    title: 'Always Judge a Book by its Cover',
    description: 'A curated collection of the weirdest and most confusing real book titles ever published.',
    imageUrl: 'https://images.unsplash.com/photo-1507842217343-583f7270bfbb?w=500&h=400&fit=crop',
    genre: 'Humorous & Absurd Concepts',
    rating: 4.7,
    players: 'Solo',
    releaseDate: 'Feb 2026',
  },
];

export default function GamesPage() {
  const [scrolled, setScrolled] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Scroll reveal animation
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    return () => revealObserver.disconnect();
  }, []);

  const handlePlayGame = (gameId: number) => {
    alert(`Starting game ${gameId}...`);
  };

  return (
    <div className="relative min-h-screen bg-[#080f1c] text-[#e8edf5] overflow-x-hidden">
      {/* Noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Nav */}
      <nav
        className={`fixed top-0 w-full z-50 flex items-center justify-between px-[5%] h-[68px] bg-[rgba(8,15,28,.85)] backdrop-blur-[16px] transition-shadow ${
          scrolled ? 'shadow-[0_4px_40px_rgba(0,0,0,.5)]' : ''
        } border-b border-[rgba(73,122,182,.2)]`}
      >
        <a href="/" className="flex items-center gap-2.5 text-decoration-none">
          <div className="w-9 h-9 bg-gradient-to-br from-[#ffc105] to-[#e0a800] rounded-lg grid place-items-center font-['Bebas_Neue'] text-xl text-[#080f1c] shadow-[0_0_16px_rgba(255,193,5,.35)]">
            S
          </div>
          <div className="font-['Barlow_Condensed'] font-black text-xl uppercase tracking-[.04em]">
            <span className="text-[#ffc105]">Sahara</span>
          </div>
        </a>
        <ul className="flex gap-8 list-none">
          <li>
            <a
              href="/"
              className="text-[#7a93b4] no-underline font-medium uppercase tracking-[.05em] text-[.875rem] transition-colors hover:text-[#ffc105]"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="/games"
              className="text-[#ffc105] no-underline font-medium uppercase tracking-[.05em] text-[.875rem]"
            >
              Games
            </a>
          </li>
        </ul>
        <button className="bg-[#ffc105] text-[#080f1c] border-none px-6 py-2.5 rounded transition-all hover:bg-[#ffcf3a] hover:translate-y-[-1px] hover:shadow-[0_6px_24px_rgba(255,193,5,.4)] font-['Barlow_Condensed'] font-bold uppercase tracking-[.08em] text-[.95rem] cursor-pointer">
          Sign In
        </button>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-[120px]">
        {/* Hero Section */}
        <section className="px-[5%] py-20">
          <div className="max-w-6xl mx-auto space-y-6 text-center mb-16">
            <h1 className="font-['Barlow_Condensed'] font-black text-5xl uppercase tracking-[.04em] text-[#e8edf5]">
              Discover{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffc105] to-[#ffcf3a]">
                Amazing Games
              </span>
            </h1>
            <p className="text-xl text-[#7a93b4] max-w-2xl mx-auto">
              Explore our collection of premium games featuring stunning visuals, immersive gameplay, and unforgettable experiences.
            </p>
          </div>

          {/* Filter Controls */}
          <div className="max-w-6xl mx-auto mb-12 flex flex-wrap gap-3 justify-center">
            {['All', 'Interactive & Useless Fun', 'Humorous & Absurd Concepts', 'Space'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-6 py-2 rounded uppercase font-bold tracking-[.05em] text-sm transition-all ${
                  selectedFilter === filter
                    ? 'bg-[#ffc105] text-[#080f1c] shadow-[0_4px_16px_rgba(255,193,5,.25)]'
                    : 'bg-[rgba(73,122,182,.1)] text-[#7a93b4] hover:bg-[rgba(255,193,5,.1)] hover:text-[#ffc105]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Games Grid */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {GAMES_DATA.filter(game => selectedFilter === 'All' || game.genre === selectedFilter).map((game, index) => (
              <div
                key={game.id}
                className="reveal"
                style={{
                  transitionDelay: `${index * 80}ms`,
                }}
              >
                <GameCard
                  id={game.id}
                  title={game.title}
                  description={game.description}
                  imageUrl={game.imageUrl}
                  genre={game.genre}
                  rating={game.rating}
                  players={game.players}
                  releaseDate={game.releaseDate}
                  onPlay={() => handlePlayGame(game.id)}
                />
              </div>
            ))}
          </div>

          {/* Category Cards Section */}
          <div className="mt-24 space-y-8">
            <div className="text-center">
              <h2 className="font-['Bebas_Neue'] text-[clamp(2.4rem,5vw,3.8rem)] leading-none tracking-[.03em] text-[#e8edf5]">
                EXPLORE MORE<br/><span className="text-[#ffc105]">CONTENT</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Games', emoji: '🎮', description: 'Discover thousands of amazing games across all genres.' },
                { title: 'Videos', emoji: '🎬', description: 'Stream movies, series, and short films.' },
                { title: 'Books', emoji: '📚', description: 'Dive into our vast library of digital books.' },
                { title: 'Experiences', emoji: '✨', description: 'Immersive interactive experiences and adventures.' }
              ].map((card, index) => (
                <div
                  key={card.title}
                  className="reveal relative overflow-hidden rounded-xl border border-[rgba(73,122,182,.2)] bg-[#101e34] p-8 cursor-pointer transition-all hover:translate-y-[-6px] hover:shadow-[0_24px_60px_rgba(0,0,0,.5)] hover:border-[rgba(255,193,5,.35)] group"
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="absolute inset-0 opacity-0 bg-gradient-to-br from-[rgba(255,193,5,.06)] to-transparent transition-opacity group-hover:opacity-100"></div>
                  <div className="w-14 h-14 rounded-xl grid place-items-center text-3xl mb-4 relative z-10">{card.emoji}</div>
                  <div className="font-['Barlow_Condensed'] font-black text-[1.5rem] uppercase tracking-[.04em] text-[#e8edf5] mb-2 relative z-10">{card.title}</div>
                  <div className="text-[.88rem] text-[#7a93b4] leading-[1.65] relative z-10">{card.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-[5%] py-20 bg-gradient-to-r from-[rgba(255,193,5,.1)] to-[rgba(73,122,182,.1)] border-y border-[rgba(255,193,5,.1)]">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="font-['Barlow_Condensed'] font-black text-4xl uppercase tracking-[.04em]">
              Ready to Play?
            </h2>
            <p className="text-lg text-[#7a93b4]">
              Create your account and start playing today. Get exclusive rewards and unlock premium content.
            </p>
            <button className="bg-[#ffc105] text-[#080f1c] border-none px-8 py-3 rounded font-['Barlow_Condensed'] font-bold uppercase tracking-[.08em] transition-all hover:bg-[#ffcf3a] hover:translate-y-[-2px] hover:shadow-[0_6px_24px_rgba(255,193,5,.4)] cursor-pointer text-lg">
              Get Started Free
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[rgba(73,122,182,.2)] bg-[rgba(8,15,28,.6)] px-[5%] py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-sm">
          <div>
            <h4 className="font-bold text-[#ffc105] mb-3 uppercase tracking-[.05em]">Games</h4>
            <ul className="space-y-2 text-[#7a93b4]">
              <li><a href="#" className="hover:text-[#ffc105] transition-colors">All Games</a></li>
              <li><a href="#" className="hover:text-[#ffc105] transition-colors">New Releases</a></li>
              <li><a href="#" className="hover:text-[#ffc105] transition-colors">Top Rated</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#ffc105] mb-3 uppercase tracking-[.05em]">Company</h4>
            <ul className="space-y-2 text-[#7a93b4]">
              <li><a href="#" className="hover:text-[#ffc105] transition-colors">About</a></li>
              <li><a href="#" className="hover:text-[#ffc105] transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-[#ffc105] transition-colors">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#ffc105] mb-3 uppercase tracking-[.05em]">Support</h4>
            <ul className="space-y-2 text-[#7a93b4]">
              <li><a href="#" className="hover:text-[#ffc105] transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-[#ffc105] transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-[#ffc105] transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#ffc105] mb-3 uppercase tracking-[.05em]">Legal</h4>
            <ul className="space-y-2 text-[#7a93b4]">
              <li><a href="#" className="hover:text-[#ffc105] transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-[#ffc105] transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-[#ffc105] transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[rgba(73,122,182,.2)] pt-8 text-center text-[#497ab6] text-sm">
          <p>&copy; 2026 Sahara Games. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
