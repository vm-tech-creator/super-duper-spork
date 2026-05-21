'use client';

import { useState, useEffect } from 'react';
import SaharaHeader from '@/components/SaharaHeader';
import GameCard from '@/components/GameCard';
import PacMan from '@/components/games/PacMan';
import ThePointingPointer from '@/components/games/ThePointingPointer';
import EndlessHorse from '@/components/games/EndlessHorse';
import FindTheInvisibleCow from '@/components/games/FindTheInvisibleCow';
import PasswordTester from '@/components/games/PasswordTester';
import CatBounce from '@/components/games/CatBounce';
import HackerTyper from '@/components/games/HackerTyper';
import ElonFortune from '@/components/games/ElonFortune';
import MusicQuiz from '@/components/games/MusicQuiz';
import WeirdBooks from '@/components/games/WeirdBooks';
import SuperstarRacing from '@/components/games/SuperstarRacing';
import SpaceWar from '@/components/games/SpaceWar';
import Snake from '@/components/games/Snake';
import SiteHeader from '@/components/SiteHeader';

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
    id: 11,
    title: 'To create a rocket',
    description: 'Build your own rocket from parts and launch it into space! Customize with thrusters, parachutes, fuel tanks, and more.',
    imageUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?w=500&h=400&fit=crop',
    genre: 'Space',
    rating: 4.9,
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
  {
    id: 15,
    title: 'Space War',
    description: 'Battle against an AI opponent in rocket combat! Use arrow keys to move and space to shoot.',
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500&h=400&fit=crop',
    genre: 'Space',
    rating: 4.9,
    players: '1v1',
    releaseDate: 'May 2026',
  },
  {
    id: 16,
    title: 'Snake',
    description: 'A classic snake game where you eat apples to grow longer. Don\'t hit the walls or yourself!',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop',
    genre: 'Classic Arcade Game',
    rating: 4.9,
    players: 'Solo',
    releaseDate: 'May 2026',
  },
  {
    id: 13,
    title: 'Pac-Man',
    description: 'A classic maze game where you navigate Pac-Man through a two-line pathway maze while avoiding colorful ghosts.',
    imageUrl: 'https://images.unsplash.com/photo-1535371579214-d6a72b3b5c47?w=500&h=400&fit=crop',
    genre: 'Classic Arcade Game',
    rating: 4.9,
    players: 'Solo',
    releaseDate: 'Apr 2026',
  },
  {
    id: 13,
    title: 'Neon Flames',
    description: 'Paint your own nebula with glowing cosmic trails while a slow space background drifts behind you.',
    imageUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=500&h=400&fit=crop',
    genre: 'Interactive & Useless Fun',
    rating: 4.9,
    players: 'Solo',
    releaseDate: 'May 2026',
  },
  {
    id: 15,
    title: 'Blobmixer',
    description: 'A dreamy 3D blob playground where you can tap, squish, and shape floating liquid forms in mid-air.',
    imageUrl: 'https://images.unsplash.com/photo-1612831205498-89a5d8c7f3a6?w=500&h=400&fit=crop',
    genre: '3D Playground',
    rating: 4.9,
    players: 'Solo',
    releaseDate: 'May 2026',
  },
  {
    id: 14,
    title: 'Superstar Racing',
    description: 'A hill climb-style racing adventure with hills, coins, fuel, and physics-driven controls.',
    imageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&h=600&fit=crop',
    genre: 'Racing',
    rating: 4.9,
    players: 'Solo',
    releaseDate: 'May 2026',
  },
];

export default function GamesPage() {
  const [selectedFilter, setSelectedFilter] = useState('All');

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
    <div className="relative min-h-screen text-[#e8edf5] overflow-x-hidden" style={{
      backgroundImage: `
        repeating-linear-gradient(
          0deg,
          rgba(0, 0, 0, 0.15),
          rgba(0, 0, 0, 0.15) 2px,
          transparent 2px,
          transparent 4px
        ),
        repeating-linear-gradient(
          90deg,
          rgba(0, 0, 0, 0.15),
          rgba(0, 0, 0, 0.15) 2px,
          transparent 2px,
          transparent 4px
        )
      `,
      backgroundColor: '#001a4d'
    }}>
      {/* Noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Nav */}
      <SiteHeader
        links={[
          { label: 'Home', href: '/' },
          { label: 'Games', href: '/games' },
        ]}
        rightSlot={
          <button
            onClick={() => window.location.href = '/games/avatar'}
            className="bg-[#4a90e2] text-white border-none px-4 py-2 rounded transition-all hover:bg-[#357abd] hover:translate-y-[-1px] hover:shadow-[0_4px_16px_rgba(74,144,226,.3)] font-barlow font-bold uppercase tracking-[.08em] text-[.85rem] cursor-pointer"
          >
            Avatar
          </button>
        }
      />

      {/* Main Content */}
      <main className="relative z-10 pt-[120px]">
        {/* Hero Section - Arcade Machine */}
        <section className="px-[5%] py-20 relative overflow-hidden bg-gradient-to-b from-[rgba(0,26,77,.5)] to-[#001a4d]">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-12">
              {/* Left: Pac-Man Game Scene */}
              <div className="flex justify-center order-2 lg:order-1">
                <div className="relative" style={{
                  width: '360px',
                  height: '400px',
                  backgroundColor: '#000033',
                  border: '6px solid #ffc105',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 0 40px rgba(255, 193, 5, 0.4), inset 0 0 20px rgba(0,0,0,0.5)'
                }}>
                  {/* Game Board Background */}
                  <div className="absolute inset-0 bg-[#000033]"></div>

                  {/* Pellets Grid - Removed */}
                  <div className="absolute inset-0" style={{
                    display: 'none'
                  }}></div>

                  {/* Maze Structure - Classic Pac-Man Layout */}
                  <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }} viewBox="0 0 360 400">
                    {/* Border walls */}
                    <rect x="10" y="10" width="340" height="380" fill="none" stroke="#0066ff" strokeWidth="4"/>
                    
                    {/* Vertical walls top section */}
                    <rect x="58" y="40" width="4" height="60" fill="#0066ff"/>
                    <rect x="110" y="40" width="4" height="60" fill="#0066ff"/>
                    <rect x="178" y="40" width="4" height="60" fill="#0066ff"/>
                    <rect x="248" y="40" width="4" height="60" fill="#0066ff"/>
                    <rect x="298" y="40" width="4" height="60" fill="#0066ff"/>
                    
                    {/* Horizontal walls top */}
                    <rect x="35" y="68" width="290" height="4" fill="#0066ff"/>
                    <rect x="35" y="128" width="290" height="4" fill="#0066ff"/>
                    
                    {/* Center ghost house */}
                    <rect x="140" y="170" width="80" height="60" fill="none" stroke="#0066ff" strokeWidth="4"/>
                    <rect x="145" y="190" width="70" height="20" fill="none" stroke="#0066ff" strokeWidth="2"/>
                    
                    {/* Horizontal walls middle */}
                    <rect x="35" y="168" width="290" height="4" fill="#0066ff"/>
                    <rect x="35" y="232" width="290" height="4" fill="#0066ff"/>
                    
                    {/* Vertical dividers middle */}
                    <rect x="58" y="130" width="4" height="138" fill="#0066ff"/>
                    <rect x="110" y="130" width="4" height="138" fill="#0066ff"/>
                    <rect x="248" y="130" width="4" height="138" fill="#0066ff"/>
                    <rect x="298" y="130" width="4" height="138" fill="#0066ff"/>
                    
                    {/* Bottom section walls */}
                    <rect x="35" y="292" width="290" height="4" fill="#0066ff"/>
                    <rect x="35" y="340" width="290" height="4" fill="#0066ff"/>
                    
                    {/* Vertical walls bottom */}
                    <rect x="80" y="234" width="4" height="106" fill="#0066ff"/>
                    <rect x="178" y="234" width="4" height="106" fill="#0066ff"/>
                    <rect x="278" y="234" width="4" height="106" fill="#0066ff"/>
                  </svg>

                  {/* Pac-Man - Smooth Curves */}
                  <div className="absolute" style={{
                    width: '32px',
                    height: '32px',
                    animation: 'pacmanChase 14s infinite',
                    zIndex: 10
                  }}>
                    <svg width="32" height="32" viewBox="0 0 32 32">
                      <circle cx="16" cy="16" r="15" fill="#ffff00"/>
                      <polygon points="4,16 10,10 10,22" fill="#000033"/>
                    </svg>
                  </div>

                  {/* Red Ghost - Smooth Curves */}
                  <div className="absolute" style={{
                    width: '32px',
                    height: '32px',
                    animation: 'redGhostEvade 11s infinite',
                    zIndex: 5
                  }}>
                    <svg width="32" height="32" viewBox="0 0 32 32">
                      {/* Ghost body */}
                      <ellipse cx="16" cy="14" rx="12" ry="12" fill="#ff0000"/>
                      <rect x="4" y="14" width="24" height="10" fill="#ff0000"/>
                      {/* 4 balanced spikes */}
                      <rect x="7" y="20" width="3" height="4" fill="#ff0000"/>
                      <rect x="13" y="24" width="3" height="4" fill="#ff0000"/>
                      <rect x="19" y="20" width="3" height="4" fill="#ff0000"/>
                      <rect x="25" y="24" width="3" height="4" fill="#ff0000"/>
                      {/* Square dot eyes - no pupils */}
                      <rect x="10" y="10" width="2" height="2" fill="#fff"/>
                      <rect x="20" y="10" width="2" height="2" fill="#fff"/>
                    </svg>
                  </div>

                  {/* Pink Ghost - Smooth Curves */}
                  <div className="absolute" style={{
                    width: '32px',
                    height: '32px',
                    animation: 'pinkGhostEvade 12s infinite',
                    zIndex: 5
                  }}>
                    <svg width="32" height="32" viewBox="0 0 32 32">
                      {/* Ghost body */}
                      <ellipse cx="16" cy="14" rx="12" ry="12" fill="#ffb7dd"/>
                      <rect x="4" y="14" width="24" height="10" fill="#ffb7dd"/>
                      {/* 4 balanced spikes */}
                      <rect x="7" y="20" width="3" height="4" fill="#ffb7dd"/>
                      <rect x="13" y="24" width="3" height="4" fill="#ffb7dd"/>
                      <rect x="19" y="20" width="3" height="4" fill="#ffb7dd"/>
                      <rect x="25" y="24" width="3" height="4" fill="#ffb7dd"/>
                      {/* Square dot eyes - no pupils */}
                      <rect x="10" y="10" width="2" height="2" fill="#fff"/>
                      <rect x="20" y="10" width="2" height="2" fill="#fff"/>
                    </svg>
                  </div>

                  {/* Cyan Ghost - Smooth Curves */}
                  <div className="absolute" style={{
                    width: '32px',
                    height: '32px',
                    animation: 'cyanGhostEvade 13s infinite',
                    zIndex: 5
                  }}>
                    <svg width="32" height="32" viewBox="0 0 32 32">
                      {/* Ghost body */}
                      <ellipse cx="16" cy="14" rx="12" ry="12" fill="#00ffff"/>
                      <rect x="4" y="14" width="24" height="10" fill="#00ffff"/>
                      {/* 4 balanced spikes */}
                      <rect x="7" y="20" width="3" height="4" fill="#00ffff"/>
                      <rect x="13" y="24" width="3" height="4" fill="#00ffff"/>
                      <rect x="19" y="20" width="3" height="4" fill="#00ffff"/>
                      <rect x="25" y="24" width="3" height="4" fill="#00ffff"/>
                      {/* Square dot eyes - no pupils */}
                      <rect x="10" y="10" width="2" height="2" fill="#fff"/>
                      <rect x="20" y="10" width="2" height="2" fill="#fff"/>
                    </svg>
                  </div>

                  {/* Score Display - Pixelated */}
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '10px',
                    color: '#ffff00',
                    fontSize: '8px',
                    fontWeight: 'bold',
                    fontFamily: 'Courier New, monospace',
                    textShadow: '0 0 4px rgba(255,255,0,0.8)',
                    zIndex: 20,
                    letterSpacing: '1px'
                  }}>
                    SCORE: 98750
                  </div>

                  {/* CSS Animations */}
                  <style>{`
                    @keyframes pacmanChase {
                      0% { left: 20px; top: 50px; }
                      12.5% { left: 300px; top: 50px; }
                      25% { left: 300px; top: 140px; }
                      37.5% { left: 140px; top: 140px; }
                      50% { left: 140px; top: 270px; }
                      62.5% { left: 300px; top: 270px; }
                      75% { left: 300px; top: 130px; }
                      87.5% { left: 20px; top: 130px; }
                      100% { left: 20px; top: 50px; }
                    }
                    @keyframes redGhostEvade {
                      0% { left: 160px; top: 180px; }
                      25% { left: 40px; top: 180px; }
                      50% { left: 40px; top: 90px; }
                      75% { left: 160px; top: 90px; }
                      100% { left: 160px; top: 180px; }
                    }
                    @keyframes pinkGhostEvade {
                      0% { left: 160px; top: 200px; }
                      33% { left: 280px; top: 200px; }
                      66% { left: 280px; top: 270px; }
                      100% { left: 160px; top: 200px; }
                    }
                    @keyframes cyanGhostEvade {
                      0% { left: 160px; top: 220px; }
                      50% { left: 60px; top: 220px; }
                      100% { left: 160px; top: 220px; }
                    }
                  `}</style>
                </div>
              </div>

              {/* Right: Content */}
              <div className="space-y-8 order-1 lg:order-2">
                <div className="space-y-6">
                  <div>
                    <div className="inline-flex items-center justify-center gap-2 mb-3 px-4 py-2 rounded-full bg-[rgba(255,193,5,.15)] border border-[rgba(255,193,5,.3)]">
                      <span className="text-[#ffc105] font-barlow font-bold text-xs uppercase tracking-widest">🎮 Gaming Universe</span>
                    </div>
                  </div>
                  <h1 className="font-bebas-neue font-black text-5xl uppercase tracking-[.04em] text-[#e8edf5] drop-shadow-[0_0_20px_rgba(255,193,5,.3)] leading-tight">
                    DISCOVER{' '}
                    <span className="text-[#ffc105] drop-shadow-[0_0_30px_rgba(255,193,5,.5)]">
                      AMAZING GAMES
                    </span>
                  </h1>
                  <p className="text-lg text-[#7a93b4] leading-relaxed">
                    Explore our collection of extraordinary, hilarious, and absolutely pointless games that will waste your time in the best way possible.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="max-w-6xl mx-auto mb-12 flex flex-wrap gap-3 justify-center">
            {['All', 'Interactive & Useless Fun', 'Humorous & Absurd Concepts', 'Space'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-8 py-3 rounded-lg uppercase font-black tracking-[.08em] text-sm transition-all duration-300 relative overflow-hidden group ${
                  selectedFilter === filter
                    ? 'bg-gradient-to-r from-[#ffc105] to-[#ffcf3a] text-[#080f1c] shadow-[0_0_30px_rgba(255,193,5,.5)] scale-105'
                    : 'bg-[rgba(73,122,182,.15)] text-[#7a93b4] hover:bg-[rgba(255,193,5,.15)] hover:text-[#ffc105] border border-[rgba(73,122,182,.3)] hover:border-[#ffc105]'
                }`}
              >
                {selectedFilter === filter && (
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></span>
                )}
                <span className="relative z-10">{filter}</span>
              </button>
            ))}
          </div>

          {/* Games Grid */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 relative">
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
          <div className="mt-32 space-y-12 relative">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-3xl animate-bounce" style={{ animationDelay: '0.1s' }}>⭐</span>
                <h2 className="font-bebas-neue text-[clamp(2.4rem,5vw,3.8rem)] leading-none tracking-[.03em] text-[#e8edf5]">
                  EXPLORE MORE
                </h2>
                <span className="text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>⭐</span>
              </div>
              <p className="text-[#ffc105] font-bebas-neue font-black text-[1.5rem] drop-shadow-[0_0_10px_rgba(255,193,5,.3)]">CONTENT CATEGORIES</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { title: 'Games', emoji: '🎮', description: 'Discover thousands of amazing games across all genres.' },
                { title: 'Videos', emoji: '🎬', description: 'Stream movies, series, and short films.' },
                { title: 'Books', emoji: '📚', description: 'Dive into our vast library of digital books.' },
                { title: 'Experiences', emoji: '✨', description: 'Immersive interactive experiences and adventures.' }
              ].map((card, index) => (
                <div
                  key={card.title}
                  className="reveal relative overflow-hidden rounded-xl border-2 border-[rgba(255,193,5,.3)] bg-gradient-to-br from-[#101e34] to-[#0a0f1f] p-8 cursor-pointer transition-all duration-300 hover:translate-y-[-8px] hover:shadow-[0_30px_80px_rgba(255,193,5,.3)] hover:border-[#ffc105] group"
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[rgba(255,193,5,.1)] via-transparent to-[rgba(73,122,182,.1)]"></div>
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-40 bg-[#ffc105] rounded-full blur-3xl opacity-20"></div>
                  </div>

                  {/* Icon with animation */}
                  <div className="relative z-10 mb-6">
                    <div className="w-20 h-20 rounded-lg grid place-items-center text-5xl bg-gradient-to-br from-[rgba(255,193,5,.2)] to-[rgba(73,122,182,.2)] group-hover:from-[rgba(255,193,5,.4)] group-hover:to-[rgba(73,122,182,.4)] transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12">
                      <span className="inline-block animate-bounce">{card.emoji}</span>
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="relative z-10 space-y-3">
                    <h3 className="font-['Barlow_Condensed'] font-black text-[1.5rem] uppercase tracking-[.04em] text-[#e8edf5] group-hover:text-[#ffc105] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-[.88rem] text-[#7a93b4] leading-[1.65] group-hover:text-[#97b3d4] transition-colors">
                      {card.description}
                    </p>
                  </div>

                  {/* Arrow indicator on hover */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#ffc105] transform translate-x-2 group-hover:translate-x-0 text-2xl">
                    →
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-[5%] py-20 relative overflow-hidden bg-gradient-to-r from-[rgba(255,193,5,.08)] via-[rgba(8,15,28,.95)] to-[rgba(73,122,182,.08)] border-y border-[rgba(255,193,5,.2)]">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#ffc105] rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#497ab6] rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          </div>

          <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-3xl animate-spin" style={{ animationDuration: '2s' }}>🎯</span>
                <h2 className="font-bebas-neue font-black text-4xl uppercase tracking-[.04em] text-[#ffc105] drop-shadow-[0_0_20px_rgba(255,193,5,.3)]">
                  READY TO PLAY?
                </h2>
                <span className="text-3xl animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>🎯</span>
              </div>
              <p className="text-lg text-[#7a93b4] leading-relaxed">
                Create your account and start playing today. Get exclusive rewards and unlock premium content.
              </p>
            </div>
            
            <button className="relative group px-10 py-4 rounded-lg font-bebas-neue font-black uppercase tracking-[.1em] transition-all duration-300 text-lg overflow-hidden bg-gradient-to-r from-[#ffc105] to-[#ffcf3a] text-[#080f1c] hover:shadow-[0_0_40px_rgba(255,193,5,.5)] hover:translate-y-[-3px] active:translate-y-0 cursor-pointer">
              <span className="absolute inset-0 bg-gradient-to-r from-[#ffcf3a] to-[#ffc105] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative z-10 flex items-center justify-center gap-2">
                <span className="animate-bounce" style={{ animationDelay: '0s' }}>▶</span>
                Get Started Free
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>▶</span>
              </span>
            </button>

            <p className="text-sm text-[#497ab6] italic">
              🎮 Join thousands of players wasting time productively!
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[rgba(255,193,5,.2)] bg-gradient-to-b from-[rgba(8,15,28,.7)] to-[rgba(8,15,28,.95)] px-[5%] py-12 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-40 left-1/3 w-96 h-96 bg-[#497ab6] rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-[#ffc105] rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="group">
              <h4 className="font-barlow font-bold text-[#ffc105] mb-4 uppercase tracking-[.08em] text-sm flex items-center gap-2 group-hover:text-[#ffcf3a] transition-colors">
                <span className="text-lg">🎮</span> Games
              </h4>
              <ul className="space-y-3 text-[#7a93b4] text-sm">
                <li><a href="#" className="hover:text-[#ffc105] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1">All Games <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span></a></li>
                <li><a href="#" className="hover:text-[#ffc105] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1">New Releases <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span></a></li>
                <li><a href="#" className="hover:text-[#ffc105] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1">Top Rated <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span></a></li>
              </ul>
            </div>

            <div className="group">
              <h4 className="font-barlow font-bold text-[#ffc105] mb-4 uppercase tracking-[.08em] text-sm flex items-center gap-2 group-hover:text-[#ffcf3a] transition-colors">
                <span className="text-lg">🏢</span> Company
              </h4>
              <ul className="space-y-3 text-[#7a93b4] text-sm">
                <li><a href="#" className="hover:text-[#ffc105] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1">About <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span></a></li>
                <li><a href="#" className="hover:text-[#ffc105] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1">Blog <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span></a></li>
                <li><a href="#" className="hover:text-[#ffc105] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1">Careers <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span></a></li>
              </ul>
            </div>

            <div className="group">
              <h4 className="font-barlow font-bold text-[#ffc105] mb-4 uppercase tracking-[.08em] text-sm flex items-center gap-2 group-hover:text-[#ffcf3a] transition-colors">
                <span className="text-lg">💬</span> Support
              </h4>
              <ul className="space-y-3 text-[#7a93b4] text-sm">
                <li><a href="#" className="hover:text-[#ffc105] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1">Help Center <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span></a></li>
                <li><a href="#" className="hover:text-[#ffc105] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1">Community <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span></a></li>
                <li><a href="#" className="hover:text-[#ffc105] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1">Contact <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span></a></li>
              </ul>
            </div>

            <div className="group">
              <h4 className="font-barlow font-bold text-[#ffc105] mb-4 uppercase tracking-[.08em] text-sm flex items-center gap-2 group-hover:text-[#ffcf3a] transition-colors">
                <span className="text-lg">⚖️</span> Legal
              </h4>
              <ul className="space-y-3 text-[#7a93b4] text-sm">
                <li><a href="#" className="hover:text-[#ffc105] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1">Privacy <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span></a></li>
                <li><a href="#" className="hover:text-[#ffc105] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1">Terms <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span></a></li>
                <li><a href="#" className="hover:text-[#ffc105] hover:translate-x-1 transition-all duration-200 inline-flex items-center gap-1">Cookies <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span></a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[rgba(73,122,182,.2)] pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <p className="text-[#497ab6] text-sm flex items-center justify-center md:justify-start gap-2">
                  <span className="text-lg animate-pulse">⭐</span>
                  &copy; 2026 Sahara Games. All rights reserved.
                  <span className="text-lg animate-pulse" style={{ animationDelay: '0.7s' }}>⭐</span>
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <span className="text-[#ffc105] text-2xl animate-bounce" style={{ animationDuration: '1.5s' }}>🎯</span>
                <span className="text-[#497ab6] text-2xl animate-bounce" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }}>🎮</span>
                <span className="text-[#ffc105] text-2xl animate-bounce" style={{ animationDuration: '1.5s', animationDelay: '0.6s' }}>🕹️</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
