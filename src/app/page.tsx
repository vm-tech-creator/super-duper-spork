
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MousePointer2,
  Music2,
  Palette,
  Play,
  Sparkles,
  Zap,
  X,
  Gamepad2,
  Clapperboard,
  BookOpen,
  ArrowRight,
  Menu,
  LayoutGrid,
  Layers,
} from 'lucide-react';
import GameCard from '@/components/GameCard';

/** Comprehensive video collection with different categories */
const VIDEOS_DATA = [
  // Educational Videos
  {
    id: 1,
    title: 'The Science of Cooking: Why Do Onions Make You Cry?',
    creator: 'SciShow',
    views: '2.1M+',
    duration: '4',
    category: 'Educational',
    subcategory: 'Science',
    tags: ['Educational', 'Science'],
    color: '#4ade80',
    platform: 'youtube' as const,
    href: 'https://www.youtube.com/watch?v=8oOe_5X3YXI',
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=225&fit=crop',
  },
  {
    id: 2,
    title: 'How the Universe Works',
    creator: 'Vsauce',
    views: '15M+',
    duration: '25',
    category: 'Educational',
    subcategory: 'Science',
    tags: ['Educational', 'Science'],
    color: '#3b82f6',
    platform: 'youtube' as const,
    href: 'https://www.youtube.com/watch?v=9D05ej8u-gU',
    thumbnail: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=225&fit=crop',
  },
  {
    id: 3,
    title: 'The History of the Internet',
    creator: 'Crash Course',
    views: '8.5M+',
    duration: '12',
    category: 'Educational',
    subcategory: 'History',
    tags: ['Educational', 'History'],
    color: '#f59e0b',
    platform: 'youtube' as const,
    href: 'https://www.youtube.com/watch?v=9hIQjrMHTv4',
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=225&fit=crop',
  },
  {
    id: 4,
    title: 'How Languages Evolve',
    creator: 'Linguistics',
    views: '1.2M+',
    duration: '8',
    category: 'Educational',
    subcategory: 'Language',
    tags: ['Educational', 'Language'],
    color: '#8b5cf6',
    platform: 'youtube' as const,
    href: 'https://www.youtube.com/watch?v=_4i2Oso1luU',
    thumbnail: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=225&fit=crop',
  },

  // Cooking Videos
  {
    id: 5,
    title: 'Perfect Chocolate Chip Cookies',
    creator: 'Tasty',
    views: '50M+',
    duration: '3',
    category: 'Cooking',
    subcategory: 'Desserts',
    tags: ['Cooking', 'Lifestyle'],
    color: '#dc2626',
    platform: 'youtube' as const,
    href: 'https://www.youtube.com/watch?v=8aA9Enb8FVk',
    thumbnail: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=225&fit=crop',
  },
  {
    id: 6,
    title: 'How to Make Sushi at Home',
    creator: 'Chef Steps',
    views: '12M+',
    duration: '15',
    category: 'Cooking',
    subcategory: 'Asian',
    tags: ['Cooking', 'Lifestyle'],
    color: '#059669',
    platform: 'youtube' as const,
    href: 'https://www.youtube.com/watch?v=1anwXmp0LGo',
    thumbnail: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=225&fit=crop',
  },
  {
    id: 7,
    title: 'The Art of Pizza Making',
    creator: 'Serious Eats',
    views: '8M+',
    duration: '20',
    category: 'Cooking',
    subcategory: 'Italian',
    tags: ['Cooking', 'Lifestyle'],
    color: '#ea580c',
    platform: 'youtube' as const,
    href: 'https://www.youtube.com/watch?v=8oOe_5X3YXI',
    thumbnail: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=225&fit=crop',
  },
  {
    id: 8,
    title: 'Healthy Meal Prep for the Week',
    creator: 'Downshiftology',
    views: '3M+',
    duration: '18',
    category: 'Cooking',
    subcategory: 'Healthy',
    tags: ['Cooking', 'Lifestyle'],
    color: '#16a34a',
    platform: 'youtube' as const,
    href: 'https://www.youtube.com/watch?v=8oOe_5X3YXI',
    thumbnail: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=225&fit=crop',
  },

  // Funny Videos
  {
    id: 9,
    title: 'Key & Peele — Substitute Teacher',
    creator: 'Comedy Central',
    views: '220M+',
    duration: '3',
    category: 'Funny',
    subcategory: 'Sketch Comedy',
    tags: ['Entertaining', 'Creative'],
    color: '#1e40af',
    platform: 'youtube' as const,
    href: 'https://www.youtube.com/watch?v=cN7n8C00LJw',
    thumbnail: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=400&h=225&fit=crop',
  },
  {
    id: 10,
    title: 'Dramatic Chipmunk',
    creator: 'YouTube Classic',
    views: '50M+',
    duration: '0',
    category: 'Funny',
    subcategory: 'Memes',
    tags: ['Entertaining'],
    color: '#ea580c',
    platform: 'youtube' as const,
    href: 'https://www.youtube.com/watch?v=a1Y73sPHCXw',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=225&fit=crop',
  },
  {
    id: 11,
    title: 'Khaby Lame — "Why though?"',
    creator: '@khaby.lame',
    views: 'TikTok',
    duration: '1',
    category: 'Funny',
    subcategory: 'Social Media',
    tags: ['Entertaining', 'Lifestyle'],
    color: '#0891b2',
    platform: 'tiktok' as const,
    href: 'https://www.tiktok.com/@khaby.lame/video/6979606181463526661',
    thumbnail: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400&h=225&fit=crop',
  },
  {
    id: 12,
    title: 'Evolution of Dance',
    creator: 'Judson Laipply',
    views: '10M+',
    duration: '6',
    category: 'Funny',
    subcategory: 'Dance',
    tags: ['Entertaining', 'Creative'],
    color: '#4f46e5',
    platform: 'youtube' as const,
    href: 'https://www.youtube.com/watch?v=dMH0bHeRHTv4',
    thumbnail: 'https://images.unsplash.com/photo-1504609773096-104ff4de7cac?w=400&h=225&fit=crop',
  },

  // Cat Videos
  {
    id: 13,
    title: 'Cats Being Jerks',
    creator: 'Cat Videos',
    views: '25M+',
    duration: '5',
    category: 'Cat Videos',
    subcategory: 'Funny Cats',
    tags: ['Entertaining', 'Pets'],
    color: '#f97316',
    platform: 'youtube' as const,
    href: 'https://www.youtube.com/watch?v=hY7m5jjJ9mM',
    thumbnail: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=225&fit=crop',
  },
  {
    id: 14,
    title: 'Kitten vs Laser Pointer',
    creator: 'Animal Planet',
    views: '15M+',
    duration: '3',
    category: 'Cat Videos',
    subcategory: 'Playful Cats',
    tags: ['Entertaining', 'Pets'],
    color: '#ec4899',
    platform: 'youtube' as const,
    href: 'https://www.youtube.com/watch?v=8QE9jfz9ZHg',
    thumbnail: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400&h=225&fit=crop',
  },
  {
    id: 15,
    title: 'Cats Who Think They\'re Dogs',
    creator: 'Pet Collective',
    views: '8M+',
    duration: '4',
    category: 'Cat Videos',
    subcategory: 'Funny Cats',
    tags: ['Entertaining', 'Pets'],
    color: '#06b6d4',
    platform: 'youtube' as const,
    href: 'https://www.youtube.com/watch?v=8QE9jfz9ZHg',
    thumbnail: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=225&fit=crop',
  },
  {
    id: 16,
    title: 'Grumpy Cat Compilation',
    creator: 'Funny Pets',
    views: '30M+',
    duration: '6',
    category: 'Cat Videos',
    subcategory: 'Grumpy Cats',
    tags: ['Entertaining', 'Pets'],
    color: '#84cc16',
    platform: 'youtube' as const,
    href: 'https://www.youtube.com/watch?v=8QE9jfz9ZHg',
    thumbnail: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=225&fit=crop',
  },

  // Science Videos
  {
    id: 17,
    title: 'Why Do We Have Seasons?',
    creator: 'MinutePhysics',
    views: '5M+',
    duration: '4',
    category: 'Science',
    subcategory: 'Astronomy',
    tags: ['Educational', 'Science'],
    color: '#6366f1',
    platform: 'youtube' as const,
    href: 'https://www.youtube.com/watch?v=DD_8Jm5pTLk',
    thumbnail: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=225&fit=crop',
  },
  {
    id: 18,
    title: 'The Science of Black Holes',
    creator: 'PBS Space Time',
    views: '3M+',
    duration: '15',
    category: 'Science',
    subcategory: 'Physics',
    tags: ['Educational', 'Science'],
    color: '#000000',
    platform: 'youtube' as const,
    href: 'https://www.youtube.com/watch?v=4Hf8aXVcVqE',
    thumbnail: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=225&fit=crop',
  },
  {
    id: 19,
    title: 'How Vaccines Work',
    creator: 'Amoeba Sisters',
    views: '2M+',
    duration: '8',
    category: 'Science',
    subcategory: 'Biology',
    tags: ['Educational', 'Science'],
    color: '#10b981',
    platform: 'youtube' as const,
    href: 'https://www.youtube.com/watch?v=8oOe_5X3YXI',
    thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=225&fit=crop',
  },
  {
    id: 20,
    title: 'The Chemistry of Fireworks',
    creator: 'Reactions',
    views: '1.5M+',
    duration: '6',
    category: 'Science',
    subcategory: 'Chemistry',
    tags: ['Educational', 'Science'],
    color: '#ef4444',
    platform: 'youtube' as const,
    href: 'https://www.youtube.com/watch?v=8oOe_5X3YXI',
    thumbnail: 'https://images.unsplash.com/photo-1464822759844-d150f39ac1ac?w=400&h=225&fit=crop',
  },
];

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

/** Comprehensive games collection with different categories */
const GAMES_DATA = [
  {
    id: 1,
    title: 'The Pointing Pointer',
    description: 'A site that tracks your cursor and displays a random photo of someone pointing exactly where it is.',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
    genre: 'Interactive & Useless Fun',
    rating: 4.3,
    players: 'Solo',
    releaseDate: 'Mar 2026',
    developer: 'Cursor Labs',
    features: ['Cursor Tracking', 'Random Photos', 'Pointing People'],
  },
  {
    id: 2,
    title: 'Infinite Scroll Simulator',
    description: 'Endlessly scroll through procedurally generated content that never actually loads anything.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    genre: 'Interactive & Useless Fun',
    rating: 4.1,
    players: 'Solo',
    releaseDate: 'Feb 2026',
    developer: 'Scroll Masters',
    features: ['Infinite Scrolling', 'Procedural Generation', 'Loading Simulation'],
  },
  {
    id: 3,
    title: 'Button Clicker Extreme',
    description: 'Click buttons as fast as you can! The ultimate test of finger speed and button-clicking prowess.',
    imageUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
    genre: 'Interactive & Useless Fun',
    rating: 4.5,
    players: 'Solo',
    releaseDate: 'Jan 2026',
    developer: 'Button Studios',
    features: ['Fast Clicking', 'Score Tracking', 'Finger Exercise'],
  },
  {
    id: 4,
    title: 'Color Picker Roulette',
    description: 'Pick random colors and see what happens! A chaotic color exploration experience.',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&h=600&fit=crop',
    genre: 'Interactive & Useless Fun',
    rating: 4.2,
    players: 'Solo',
    releaseDate: 'Dec 2025',
    developer: 'Color Chaos',
    features: ['Random Colors', 'Visual Effects', 'Color Exploration'],
  },
  {
    id: 5,
    title: 'Cat Bounce Game',
    description: 'Click anywhere to spawn bouncing cats! Watch them bounce around in chaotic fun.',
    imageUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&h=600&fit=crop',
    genre: 'Casual & Relaxing',
    rating: 4.8,
    players: 'Solo',
    releaseDate: 'Apr 2026',
    developer: 'Cat Studios',
    features: ['Cat Physics', 'Bouncing Animation', 'Click to Spawn'],
  },
  {
    id: 6,
    title: 'Wealth Simulator 2026',
    description: 'Simulate becoming incredibly wealthy through absurd and impossible scenarios.',
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=600&fit=crop',
    genre: 'Simulation & Absurd',
    rating: 4.6,
    players: 'Solo',
    releaseDate: 'Mar 2026',
    developer: 'Money Labs',
    features: ['Wealth Simulation', 'Absurd Scenarios', 'Dark Humor'],
  },
  {
    id: 7,
    title: 'Who Wants to Be a Millionaire? (But With Impossible Questions)',
    description: 'Answer impossible questions for a chance to win absolutely nothing.',
    imageUrl: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=600&fit=crop',
    genre: 'Quiz & Trivia',
    rating: 4.4,
    players: 'Solo',
    releaseDate: 'Feb 2026',
    developer: 'Quiz Masters',
    features: ['Impossible Questions', 'Lifelines', 'Zero Prizes'],
  },
  {
    id: 8,
    title: 'Who is Pissed Off At Your Music?',
    description: 'A quiz that takes your music taste and tells you which demographic you\'re most likely annoying.',
    imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800&h=600&fit=crop',
    genre: 'Humorous & Absurd Concepts',
    rating: 4.8,
    players: 'Solo',
    releaseDate: 'Mar 2026',
    developer: 'Humor Labs',
    features: ['Music Quiz', 'Personality Analysis', 'Sarcastic Results'],
  },
  {
    id: 9,
    title: 'Always Judge a Book by its Cover',
    description: 'A curated collection of the weirdest and most confusing real book titles ever published.',
    imageUrl: 'https://images.unsplash.com/photo-1507842217343-583f7270bfbb?w=800&h=600&fit=crop',
    genre: 'Humorous & Absurd Concepts',
    rating: 4.7,
    players: 'Solo',
    releaseDate: 'Feb 2026',
    developer: 'Literary Labs',
    features: ['Real Books', 'Hilarious Titles', 'Educational'],
  },
  {
    id: 10,
    title: 'Space Explorer 3D',
    description: 'Navigate through stunning 3D space, collecting stars while avoiding asteroids in this immersive space adventure.',
    imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop',
    genre: '3D Action & Adventure',
    rating: 4.9,
    players: 'Solo',
    releaseDate: 'Apr 2026',
    developer: 'Cosmic Studios',
    features: ['3D Graphics', 'Realistic Physics', 'Particle Effects', 'Space Exploration'],
  },
  {
    id: 11,
    title: 'Maze Runner 3D',
    description: 'Navigate through complex 3D mazes, collect coins, and race against time in this thrilling maze adventure.',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    genre: '3D Puzzle & Action',
    rating: 4.8,
    players: 'Solo',
    releaseDate: 'Apr 2026',
    developer: 'Labyrinth Games',
    features: ['3D Mazes', 'Keyboard Controls', 'Time Pressure', 'Progressive Difficulty'],
  },
  {
    id: 12,
    title: 'Bubble Popper 3D',
    description: 'Pop colorful 3D bubbles in this relaxing yet challenging bubble-popping extravaganza with combo system.',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
    genre: '3D Casual & Relaxing',
    rating: 4.9,
    players: 'Solo',
    releaseDate: 'Apr 2026',
    developer: 'Bubble Dynamics',
    features: ['3D Bubbles', 'Combo System', 'Particle Effects', 'Mouse Controls'],
  },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [siteMode, setSiteMode] = useState<'classic' | 'learning' | 'fun' | 'creative' | 'relax' | 'challenge' | 'adventure'>('classic');
  const [activeCategory, setActiveCategory] = useState('All');

  const getFilteredSpotlightVideos = () => {
    const modeFilters: Record<typeof siteMode, string[]> = {
      classic: ['Entertaining', 'Educational', 'Creative'],
      learning: ['Educational'],
      fun: ['Entertaining', 'Creative'],
      creative: ['Creative'],
      relax: ['Entertaining', 'Lifestyle'],
      challenge: ['Educational', 'Creative'],
      adventure: ['Entertaining', 'Creative'],
    };
    const allowedTags = modeFilters[siteMode] || modeFilters.classic;
    return VIDEOS_DATA.filter((v) =>
      activeCategory === 'All' || (allowedTags.some(tag => v.tags.includes(tag)) && (activeCategory === 'All' || v.tags.includes(activeCategory)))
    );
  };

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
      learning: '#0d1420',
      fun: '#0d1420',
      creative: '#0d1420',
      relax: '#0d1420',
      challenge: '#0d1420',
      adventure: '#0d1420',
    };
    document.documentElement.style.setProperty('--bg', rootBg[siteMode]);
  }, [siteMode]);

  useEffect(() => {
    // Particles animation
    const pc = document.getElementById('particles');
    const createdParticles: HTMLDivElement[] = [];
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

  const getModeStyles = () => {
    const bases: Record<typeof siteMode, {
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
      modeIcon: string;
      modeDescription: string;
      primaryAction: string;
      secondaryAction: string;
    }> = {
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
        modeIcon: '🎯',
        modeDescription: 'Balanced experience with all content types',
        primaryAction: 'Explore All',
        secondaryAction: 'Watch Videos',
      },
      learning: {
        accentColor: '#4ade80',
        textPrimary: '#f0fdf4',
        textSecondary: '#86efac',
        cardBg: '#0f5132',
        borderColor: 'rgba(74,222,128,.3)',
        glow: 'rgba(74,222,128,.4)',
        viewportBg: `
          radial-gradient(ellipse 100% 80% at 50% -20%, rgba(34, 197, 94, 0.25) 0%, transparent 55%),
          radial-gradient(ellipse 60% 50% at 100% 50%, rgba(22, 163, 74, 0.3) 0%, transparent 50%),
          radial-gradient(ellipse 50% 40% at 0% 80%, rgba(74, 222, 128, 0.12) 0%, transparent 45%),
          linear-gradient(180deg, #0a2e1a 0%, #0f3e2a 40%, #0f5132 100%)
        `,
        contentShell: '',
        meshBlob1: 'radial-gradient(circle, rgba(74,222,128,0.35) 0%, transparent 65%)',
        meshBlob2: 'radial-gradient(circle, rgba(34,197,94,0.4) 0%, transparent 65%)',
        sectionCategories: 'border-t border-green-400/20 bg-[#0f3e2a]',
        sectionVideos: 'bg-[#0a2e1a]',
        sectionWhy: 'border-t border-green-400/20 bg-gradient-to-b from-[#0f3e2a] to-[#0a2e1a]',
        sectionFooter: 'border-t border-green-400/20 bg-[#052e16]',
        modeIcon: '📚',
        modeDescription: 'Educational content, quizzes, and learning games',
        primaryAction: 'Start Learning',
        secondaryAction: 'Take Quiz',
      },
      fun: {
        accentColor: '#f59e0b',
        textPrimary: '#fffbeb',
        textSecondary: '#fcd34d',
        cardBg: '#451a03',
        borderColor: 'rgba(245,158,11,.3)',
        glow: 'rgba(245,158,11,.5)',
        viewportBg: `
          radial-gradient(ellipse 100% 80% at 50% -20%, rgba(245, 158, 11, 0.3) 0%, transparent 55%),
          radial-gradient(ellipse 60% 50% at 100% 50%, rgba(217, 119, 6, 0.35) 0%, transparent 50%),
          radial-gradient(ellipse 50% 40% at 0% 80%, rgba(245, 158, 11, 0.15) 0%, transparent 45%),
          linear-gradient(180deg, #2d1b06 0%, #451a03 40%, #78350f 100%)
        `,
        contentShell: '',
        meshBlob1: 'radial-gradient(circle, rgba(245,158,11,0.4) 0%, transparent 65%)',
        meshBlob2: 'radial-gradient(circle, rgba(217,119,6,0.45) 0%, transparent 65%)',
        sectionCategories: 'border-t border-amber-400/20 bg-[#451a03]',
        sectionVideos: 'bg-[#2d1b06]',
        sectionWhy: 'border-t border-amber-400/20 bg-gradient-to-b from-[#451a03] to-[#2d1b06]',
        sectionFooter: 'border-t border-amber-400/20 bg-[#1c0f04]',
        modeIcon: '🎉',
        modeDescription: 'Games, jokes, and silly entertainment',
        primaryAction: 'Play Games',
        secondaryAction: 'Watch Comedy',
      },
      creative: {
        accentColor: '#a855f7',
        textPrimary: '#faf5ff',
        textSecondary: '#c4b5fd',
        cardBg: '#2e1065',
        borderColor: 'rgba(168,85,247,.3)',
        glow: 'rgba(168,85,247,.4)',
        viewportBg: `
          radial-gradient(ellipse 100% 80% at 50% -20%, rgba(168, 85, 247, 0.25) 0%, transparent 55%),
          radial-gradient(ellipse 60% 50% at 100% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
          radial-gradient(ellipse 50% 40% at 0% 80%, rgba(168, 85, 247, 0.12) 0%, transparent 45%),
          linear-gradient(180deg, #1e0a3c 0%, #2e1065 40%, #4c1d95 100%)
        `,
        contentShell: '',
        meshBlob1: 'radial-gradient(circle, rgba(168,85,247,0.35) 0%, transparent 65%)',
        meshBlob2: 'radial-gradient(circle, rgba(147,51,234,0.4) 0%, transparent 65%)',
        sectionCategories: 'border-t border-purple-400/20 bg-[#2e1065]',
        sectionVideos: 'bg-[#1e0a3c]',
        sectionWhy: 'border-t border-purple-400/20 bg-gradient-to-b from-[#2e1065] to-[#1e0a3c]',
        sectionFooter: 'border-t border-purple-400/20 bg-[#0f0529]',
        modeIcon: '🎨',
        modeDescription: 'Art, music, and creative activities',
        primaryAction: 'Create Art',
        secondaryAction: 'Make Music',
      },
      relax: {
        accentColor: '#06b6d4',
        textPrimary: '#ecfeff',
        textSecondary: '#67e8f9',
        cardBg: '#164e63',
        borderColor: 'rgba(6,182,212,.3)',
        glow: 'rgba(6,182,212,.4)',
        viewportBg: `
          radial-gradient(ellipse 100% 80% at 50% -20%, rgba(6, 182, 212, 0.2) 0%, transparent 55%),
          radial-gradient(ellipse 60% 50% at 100% 50%, rgba(2, 132, 199, 0.25) 0%, transparent 50%),
          radial-gradient(ellipse 50% 40% at 0% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 45%),
          linear-gradient(180deg, #0c2d36 0%, #164e63 40%, #0891b2 100%)
        `,
        contentShell: '',
        meshBlob1: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 65%)',
        meshBlob2: 'radial-gradient(circle, rgba(2,132,199,0.35) 0%, transparent 65%)',
        sectionCategories: 'border-t border-cyan-400/20 bg-[#164e63]',
        sectionVideos: 'bg-[#0c2d36]',
        sectionWhy: 'border-t border-cyan-400/20 bg-gradient-to-b from-[#164e63] to-[#0c2d36]',
        sectionFooter: 'border-t border-cyan-400/20 bg-[#042f2e]',
        modeIcon: '🧘',
        modeDescription: 'Calming content and peaceful activities',
        primaryAction: 'Relax Now',
        secondaryAction: 'Meditate',
      },
      challenge: {
        accentColor: '#ef4444',
        textPrimary: '#fef2f2',
        textSecondary: '#fca5a5',
        cardBg: '#7f1d1d',
        borderColor: 'rgba(239,68,68,.3)',
        glow: 'rgba(239,68,68,.4)',
        viewportBg: `
          radial-gradient(ellipse 100% 80% at 50% -20%, rgba(239, 68, 68, 0.25) 0%, transparent 55%),
          radial-gradient(ellipse 60% 50% at 100% 50%, rgba(220, 38, 38, 0.3) 0%, transparent 50%),
          radial-gradient(ellipse 50% 40% at 0% 80%, rgba(239, 68, 68, 0.12) 0%, transparent 45%),
          linear-gradient(180deg, #450a0a 0%, #7f1d1d 40%, #dc2626 100%)
        `,
        contentShell: '',
        meshBlob1: 'radial-gradient(circle, rgba(239,68,68,0.35) 0%, transparent 65%)',
        meshBlob2: 'radial-gradient(circle, rgba(220,38,38,0.4) 0%, transparent 65%)',
        sectionCategories: 'border-t border-red-400/20 bg-[#7f1d1d]',
        sectionVideos: 'bg-[#450a0a]',
        sectionWhy: 'border-t border-red-400/20 bg-gradient-to-b from-[#7f1d1d] to-[#450a0a]',
        sectionFooter: 'border-t border-red-400/20 bg-[#2a0a0a]',
        modeIcon: '🏆',
        modeDescription: 'Puzzles, brain teasers, and difficult challenges',
        primaryAction: 'Take Challenge',
        secondaryAction: 'Solve Puzzle',
      },
      adventure: {
        accentColor: '#f97316',
        textPrimary: '#fff7ed',
        textSecondary: '#fdba74',
        cardBg: '#9a3412',
        borderColor: 'rgba(249,115,22,.3)',
        glow: 'rgba(249,115,22,.4)',
        viewportBg: `
          radial-gradient(ellipse 100% 80% at 50% -20%, rgba(249, 115, 22, 0.25) 0%, transparent 55%),
          radial-gradient(ellipse 60% 50% at 100% 50%, rgba(234, 88, 12, 0.3) 0%, transparent 50%),
          radial-gradient(ellipse 50% 40% at 0% 80%, rgba(249, 115, 22, 0.12) 0%, transparent 45%),
          linear-gradient(180deg, #4c1d0a 0%, #9a3412 40%, #ea580c 100%)
        `,
        contentShell: '',
        meshBlob1: 'radial-gradient(circle, rgba(249,115,22,0.35) 0%, transparent 65%)',
        meshBlob2: 'radial-gradient(circle, rgba(234,88,12,0.4) 0%, transparent 65%)',
        sectionCategories: 'border-t border-orange-400/20 bg-[#9a3412]',
        sectionVideos: 'bg-[#4c1d0a]',
        sectionWhy: 'border-t border-orange-400/20 bg-gradient-to-b from-[#9a3412] to-[#4c1d0a]',
        sectionFooter: 'border-t border-orange-400/20 bg-[#2a1206]',
        modeIcon: '🗺️',
        modeDescription: 'Stories, role-playing, and adventure games',
        primaryAction: 'Start Adventure',
        secondaryAction: 'Tell Story',
      },
    };
    return bases[siteMode] || bases.classic;
  };

  const modeStyle = getModeStyles();

  // Filter content based on mode
  const getFilteredCategories = () => {
    type CategoryItem = {
      title: string;
      desc: string;
      icon: any;
      href: string;
      cta: string;
      num: string;
    };
    const modeCategories: Record<typeof siteMode, CategoryItem[]> = {
      classic: [
        { title: 'Games', desc: 'Casual to epic—genres for every mood and session length.', icon: Gamepad2, href: '/games', cta: 'Browse games', num: '01' },
        { title: 'Videos', desc: 'LaughTube and more—curated, family-aware picks with a cleaner UI.', icon: Clapperboard, href: '/videos', cta: 'Open videos', num: '02' },
        { title: 'Music', desc: 'Playlists, live sets, and artist journeys in one flow.', icon: Music2, href: '#categories', cta: 'Listen', num: '03' },
        { title: 'Education', desc: 'Courses and explainers from institutions and indie experts alike.', icon: BookOpen, href: '#categories', cta: 'Learn', num: '04' },
      ],
      learning: [
        { title: 'Educational Videos', desc: 'Learn through engaging videos and documentaries.', icon: Clapperboard, href: '/videos', cta: 'Watch & Learn', num: '01' },
        { title: 'Learning Games', desc: 'Educational games that make learning fun.', icon: Gamepad2, href: '/games', cta: 'Play & Learn', num: '02' },
        { title: 'Quizzes', desc: 'Test your knowledge with interactive quizzes.', icon: BookOpen, href: '#categories', cta: 'Take Quiz', num: '03' },
        { title: 'Tutorials', desc: 'Step-by-step guides and how-to content.', icon: BookOpen, href: '#categories', cta: 'Start Tutorial', num: '04' },
      ],
      fun: [
        { title: 'Comedy Videos', desc: 'Hilarious videos to brighten your day.', icon: Clapperboard, href: '/videos', cta: 'Watch Comedy', num: '01' },
        { title: 'Fun Games', desc: 'Silly and entertaining games for all ages.', icon: Gamepad2, href: '/games', cta: 'Play Games', num: '02' },
        { title: 'Jokes', desc: 'Collections of jokes and funny stories.', icon: Sparkles, href: '#categories', cta: 'Read Jokes', num: '03' },
        { title: 'Memes', desc: 'Funny memes and viral content.', icon: Sparkles, href: '#categories', cta: 'View Memes', num: '04' },
      ],
      creative: [
        { title: 'Art Tutorials', desc: 'Learn to draw, paint, and create art.', icon: Palette, href: '#categories', cta: 'Create Art', num: '01' },
        { title: 'Music Maker', desc: 'Create and remix music online.', icon: Music2, href: '#categories', cta: 'Make Music', num: '02' },
        { title: 'Creative Writing', desc: 'Write stories, poems, and creative content.', icon: BookOpen, href: '#categories', cta: 'Write Stories', num: '03' },
        { title: 'DIY Projects', desc: 'Hands-on creative projects and crafts.', icon: Sparkles, href: '#categories', cta: 'Start DIY', num: '04' },
      ],
      relax: [
        { title: 'Calming Videos', desc: 'Peaceful videos for relaxation and mindfulness.', icon: Clapperboard, href: '/videos', cta: 'Relax & Watch', num: '01' },
        { title: 'Meditation', desc: 'Guided meditation and breathing exercises.', icon: Sparkles, href: '#categories', cta: 'Meditate', num: '02' },
        { title: 'Nature Sounds', desc: 'Soothing nature sounds and ambient audio.', icon: Music2, href: '#categories', cta: 'Listen', num: '03' },
        { title: 'Peaceful Games', desc: 'Calm and relaxing games.', icon: Gamepad2, href: '/games', cta: 'Play Calmly', num: '04' },
      ],
      challenge: [
        { title: 'Brain Puzzles', desc: 'Logic puzzles and brain teasers.', icon: Sparkles, href: '#categories', cta: 'Solve Puzzles', num: '01' },
        { title: 'Challenge Games', desc: 'Difficult games that test your skills.', icon: Gamepad2, href: '/games', cta: 'Take Challenge', num: '02' },
        { title: 'Riddles', desc: 'Tricky riddles and lateral thinking puzzles.', icon: BookOpen, href: '#categories', cta: 'Solve Riddles', num: '03' },
        { title: 'Strategy Games', desc: 'Games that require planning and strategy.', icon: Gamepad2, href: '/games', cta: 'Play Strategy', num: '04' },
      ],
      adventure: [
        { title: 'Adventure Stories', desc: 'Exciting stories and role-playing adventures.', icon: BookOpen, href: '#categories', cta: 'Read Stories', num: '01' },
        { title: 'Adventure Games', desc: 'Epic adventure and RPG games.', icon: Gamepad2, href: '/games', cta: 'Start Adventure', num: '02' },
        { title: 'Exploration Videos', desc: 'Videos about exploration and discovery.', icon: Clapperboard, href: '/videos', cta: 'Explore', num: '03' },
        { title: 'Mythology', desc: 'Stories from mythology and folklore.', icon: BookOpen, href: '#categories', cta: 'Learn Myths', num: '04' },
      ],
    };
    return modeCategories[siteMode] || modeCategories.classic;
  };

  const categories = getFilteredCategories();

  // Filter videos based on mode and active category
  const visibleSpotlightVideos = getFilteredSpotlightVideos();

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
              ['Games', '/games'],
              ['Videos', '/videos'],
              ['Books', '/books'],
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
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <select
              value={siteMode}
              onChange={(e) => setSiteMode(e.target.value as typeof siteMode)}
              aria-label="Experience mode"
              className={`max-w-[7.5rem] cursor-pointer rounded-xl border py-2 pl-3 pr-8 text-[0.7rem] font-semibold uppercase tracking-wide sm:max-w-none sm:text-xs ${
                siteMode === 'learning'
                  ? 'border-[#4ade80]/50 bg-green-900/80 text-[#4ade80]'
                  : siteMode === 'fun'
                  ? 'border-[#f59e0b]/50 bg-amber-900/80 text-[#f59e0b]'
                  : siteMode === 'creative'
                  ? 'border-[#a855f7]/50 bg-purple-900/80 text-[#a855f7]'
                  : siteMode === 'relax'
                  ? 'border-[#06b6d4]/50 bg-cyan-900/80 text-[#06b6d4]'
                  : siteMode === 'challenge'
                  ? 'border-[#ef4444]/50 bg-red-900/80 text-[#ef4444]'
                  : siteMode === 'adventure'
                  ? 'border-[#f97316]/50 bg-orange-900/80 text-[#f97316]'
                  : 'border-[#88a9d8]/25 bg-[#0c1829]/90 text-[#e8edf5]'
              }`}
            >
              <option value="classic">🎯 Classic</option>
              <option value="learning">📚 Learning</option>
              <option value="fun">🎉 Fun</option>
              <option value="creative">🎨 Creative</option>
              <option value="relax">🧘 Relax</option>
              <option value="challenge">🏆 Challenge</option>
              <option value="adventure">🗺️ Adventure</option>
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
                ['Games', '/games'],
                ['Videos', '/videos'],
                ['Books', '/books'],
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
          <div className="animate-fade-down mb-8 inline-flex items-center gap-2 rounded-full border bg-[rgba(255,193,5,0.07)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] backdrop-blur-sm" style={{ borderColor: modeStyle.accentColor, color: modeStyle.accentColor }}>
            <span className="text-lg">{modeStyle.modeIcon}</span>
            {modeStyle.modeDescription}
          </div>

          <h1
            className="animate-fade-up font-['Bebas_Neue'] text-[clamp(3.25rem,10vw,6.75rem)] leading-[0.95] tracking-[0.02em]"
            style={{ color: modeStyle.textPrimary }}
          >
            {siteMode === 'learning' && <>Learn & Grow<br /><span style={{ color: modeStyle.accentColor }}>With Fun</span></>}
            {siteMode === 'fun' && <>Laugh & Play<br /><span style={{ color: modeStyle.accentColor }}>All Day</span></>}
            {siteMode === 'creative' && <>Create & Build<br /><span style={{ color: modeStyle.accentColor }}>Your Dreams</span></>}
            {siteMode === 'relax' && <>Find Your Peace<br /><span style={{ color: modeStyle.accentColor }}>Relax Deeply</span></>}
            {siteMode === 'challenge' && <>Test Your Limits<br /><span style={{ color: modeStyle.accentColor }}>Rise Higher</span></>}
            {siteMode === 'adventure' && <>Explore Worlds<br /><span style={{ color: modeStyle.accentColor }}>Go Further</span></>}
            {siteMode === 'classic' && <>Explore without<br /><span style={{ background: `linear-gradient(to right, ${modeStyle.accentColor}, #88a9d8)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>the clutter</span></>}
          </h1>

          <p className="animate-fade-up mx-auto mt-6 max-w-xl text-base font-medium leading-relaxed sm:text-lg" style={{ color: modeStyle.textSecondary }}>
            {siteMode === 'learning' && 'Discover educational games, videos, and quizzes that make learning exciting and engaging for all ages.'}
            {siteMode === 'fun' && 'Enjoy hilarious videos, silly games, and entertaining content that brings joy and laughter to everyone.'}
            {siteMode === 'creative' && 'Unleash your creativity with art tutorials, music makers, and hands-on projects that inspire imagination.'}
            {siteMode === 'relax' && 'Find peace and tranquility with calming videos, meditation guides, and soothing activities for mindfulness.'}
            {siteMode === 'challenge' && 'Push your boundaries with brain puzzles, strategy games, and challenges that sharpen your mind.'}
            {siteMode === 'adventure' && 'Embark on epic journeys through stories, adventure games, and exploration content that sparks wonder.'}
            {siteMode === 'classic' && 'Sahara brings games, video, music, and learning together in one calm, fast interface—so you spend less time hunting and more time enjoying.'}
          </p>

          <div className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={siteMode === 'learning' ? '/games' : siteMode === 'fun' ? '/videos' : siteMode === 'creative' ? '#categories' : siteMode === 'relax' ? '/videos' : siteMode === 'challenge' ? '/games' : siteMode === 'adventure' ? '/games' : '/videos'}
              className="inline-flex items-center gap-2 rounded-2xl px-7 py-3.5 text-sm font-semibold no-underline shadow-[0_8px_32px_rgba(255,193,5,0.25)] transition hover:-translate-y-0.5"
              style={{ backgroundColor: modeStyle.accentColor, color: '#0a0f18', boxShadow: `0_8px_32px_${modeStyle.glow}` }}
            >
              <Play className="h-4 w-4 fill-current" aria-hidden />
              {modeStyle.primaryAction}
            </Link>
            <a
              href={siteMode === 'learning' ? '#categories' : siteMode === 'fun' ? '/games' : siteMode === 'creative' ? '#categories' : siteMode === 'relax' ? '#categories' : siteMode === 'challenge' ? '#categories' : siteMode === 'adventure' ? '/videos' : '#categories'}
              className="inline-flex items-center gap-2 rounded-2xl border bg-white/[0.03] px-7 py-3.5 text-sm font-semibold no-underline backdrop-blur-sm transition hover:bg-white/[0.06]"
              style={{ borderColor: modeStyle.borderColor, color: modeStyle.textPrimary }}
            >
              {modeStyle.secondaryAction}
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
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: modeStyle.textSecondary }}>
                {siteMode === 'learning' && 'Learning Zones'}
                {siteMode === 'fun' && 'Fun Zones'}
                {siteMode === 'creative' && 'Creative Zones'}
                {siteMode === 'relax' && 'Relax Zones'}
                {siteMode === 'challenge' && 'Challenge Zones'}
                {siteMode === 'adventure' && 'Adventure Zones'}
                {siteMode === 'classic' && 'Spaces'}
              </p>
              <h2 className="font-['Bebas_Neue'] text-[clamp(2.5rem,5vw,3.5rem)] leading-none tracking-wide" style={{ color: modeStyle.textPrimary }}>
                {siteMode === 'learning' && <>Choose Your<br /><span style={{ color: modeStyle.accentColor }}>Learning Path</span></>}
                {siteMode === 'fun' && <>Find Your<br /><span style={{ color: modeStyle.accentColor }}>Fun Zone</span></>}
                {siteMode === 'creative' && <>Express Your<br /><span style={{ color: modeStyle.accentColor }}>Creativity</span></>}
                {siteMode === 'relax' && <>Discover<br /><span style={{ color: modeStyle.accentColor }}>Inner Peace</span></>}
                {siteMode === 'challenge' && <>Face Your<br /><span style={{ color: modeStyle.accentColor }}>Challenges</span></>}
                {siteMode === 'adventure' && <>Start Your<br /><span style={{ color: modeStyle.accentColor }}>Adventure</span></>}
                {siteMode === 'classic' && <>Pick a world<span style={{ color: modeStyle.accentColor }}>.</span></>}
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed md:text-base" style={{ color: modeStyle.textSecondary }}>
              {siteMode === 'learning' && 'Explore educational content tailored to different learning styles and interests.'}
              {siteMode === 'fun' && 'Dive into entertainment that brings joy, laughter, and memorable moments.'}
              {siteMode === 'creative' && 'Unleash your artistic side with tools and inspiration for creative expression.'}
              {siteMode === 'relax' && 'Find tranquility and mindfulness through peaceful activities and content.'}
              {siteMode === 'challenge' && 'Test your skills and push your limits with engaging challenges and puzzles.'}
              {siteMode === 'adventure' && 'Embark on exciting journeys through stories, games, and exploration.'}
              {siteMode === 'classic' && 'Each area is tuned for discovery—same palette and navigation everywhere so you always know where you are.'}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const inner = (
                <>
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom right, ${modeStyle.accentColor}15, transparent)` }} />
                  </div>
                  <div className="relative z-10 mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0c1829]/80 shadow-inner" style={{ borderColor: modeStyle.borderColor, color: modeStyle.accentColor }}>
                    <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                  </div>
                  <h3 className="relative z-10 font-['Barlow_Condensed'] text-xl font-bold uppercase tracking-wide" style={{ color: modeStyle.textPrimary }}>
                    {cat.title}
                  </h3>
                  <p className="relative z-10 mt-2 text-sm leading-relaxed" style={{ color: modeStyle.textSecondary }}>{cat.desc}</p>
                  <span className="absolute right-5 top-5 font-['Bebas_Neue'] text-5xl opacity-[0.04]" style={{ color: modeStyle.textPrimary }}>{cat.num}</span>
                  <div className="relative z-10 mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-[gap] group-hover:gap-3" style={{ color: modeStyle.accentColor }}>
                    {cat.cta}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </div>
                </>
              );
              const cardClass = `group reveal relative overflow-hidden rounded-2xl bg-[#0c1829]/70 p-8 pb-7 shadow-[0_4px_40px_rgba(0,0,0,0.2)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]`;
              return cat.href.startsWith('/') ? (
                <Link key={cat.title} href={cat.href} className={`${cardClass} block no-underline`} style={{ borderColor: modeStyle.borderColor, backgroundColor: modeStyle.cardBg }}>
                  {inner}
                </Link>
              ) : (
                <a key={cat.title} href={cat.href} className={`${cardClass} block no-underline`} style={{ borderColor: modeStyle.borderColor, backgroundColor: modeStyle.cardBg }}>
                  {inner}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Games Section */}
      <section className={`py-[120px] px-[5%] ${modeStyle.sectionVideos}`} id="games">
        <div className="max-w-[1400px] mx-auto">
          <div className="reveal mb-14 max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: modeStyle.textSecondary }}>
              {siteMode === 'learning' && 'Educational Games'}
              {siteMode === 'fun' && 'Fun & Games'}
              {siteMode === 'creative' && 'Creative Games'}
              {siteMode === 'relax' && 'Relaxing Games'}
              {siteMode === 'challenge' && 'Challenge Games'}
              {siteMode === 'adventure' && 'Adventure Games'}
              {siteMode === 'classic' && 'Game Spotlight'}
            </p>
            <h2 className="font-['Bebas_Neue'] text-[clamp(2.25rem,4.5vw,3.25rem)] leading-none tracking-wide" style={{ color: modeStyle.textPrimary }}>
              {siteMode === 'learning' && <>Play & Learn<br /><span style={{ color: modeStyle.accentColor }}>Through Games</span></>}
              {siteMode === 'fun' && <>Games That Make<br /><span style={{ color: modeStyle.accentColor }}>You Smile</span></>}
              {siteMode === 'creative' && <>Games That Spark<br /><span style={{ color: modeStyle.accentColor }}>Creativity</span></>}
              {siteMode === 'relax' && <>Games That Help<br /><span style={{ color: modeStyle.accentColor }}>You Relax</span></>}
              {siteMode === 'challenge' && <>Games That Test<br /><span style={{ color: modeStyle.accentColor }}>Your Skills</span></>}
              {siteMode === 'adventure' && <>Games That Take<br /><span style={{ color: modeStyle.accentColor }}>You Places</span></>}
              {siteMode === 'classic' && <>Featured games<span style={{ color: modeStyle.accentColor }}>.</span></>}
            </h2>
            <p className="mt-4 text-sm leading-relaxed sm:text-base" style={{ color: modeStyle.textSecondary }}>
              {siteMode === 'learning' && <>Discover games that make learning fun and interactive. Click any card to play.</>}
              {siteMode === 'fun' && <>Enjoy hilarious and entertaining games. Click any card to play.</>}
              {siteMode === 'creative' && <>Play games that encourage creativity and imagination. Click any card to play.</>}
              {siteMode === 'relax' && <>Find calming and peaceful games for relaxation. Click any card to play.</>}
              {siteMode === 'challenge' && <>Take on challenging games that test your abilities. Click any card to play.</>}
              {siteMode === 'adventure' && <>Embark on exciting adventures through games. Click any card to play.</>}
              {siteMode === 'classic' && <>Click a card to play a featured game. More games on <Link href="/games" style={{ color: modeStyle.accentColor, fontWeight: '500' }} className="no-underline hover:underline">our games page</Link>.</>}
            </p>
          </div>

          {/* Games Grid */}
          <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {GAMES_DATA.slice(0, 8).map((game) => (
              <GameCard
                key={game.id}
                id={game.id}
                title={game.title}
                description={game.description}
                imageUrl={game.imageUrl}
                genre={game.genre}
                rating={game.rating}
                players={game.players}
                releaseDate={game.releaseDate}
              />
            ))}
          </div>

          <div className="reveal mt-12 text-center">
            <Link
              href="/games"
              className="inline-flex items-center gap-2 rounded-xl bg-[#ffc105] px-8 py-4 text-sm font-semibold text-[#0a0f18] no-underline shadow-[0_4px_24px_rgba(255,193,5,0.28)] transition hover:bg-[#ffcf3a] hover:-translate-y-0.5"
            >
              View All Games
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Videos - Entertainment Section */}
      <section className={`py-[120px] px-[5%] ${modeStyle.sectionVideos}`} id="videos">
        <div className="max-w-[1400px] mx-auto">
          <div className="reveal mb-14 max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em]" style={{ color: modeStyle.textSecondary }}>
              {siteMode === 'learning' && 'Educational Spotlight'}
              {siteMode === 'fun' && 'Comedy Spotlight'}
              {siteMode === 'creative' && 'Creative Spotlight'}
              {siteMode === 'relax' && 'Calming Spotlight'}
              {siteMode === 'challenge' && 'Challenge Spotlight'}
              {siteMode === 'adventure' && 'Adventure Spotlight'}
              {siteMode === 'classic' && 'Spotlight'}
            </p>
            <h2 className="font-['Bebas_Neue'] text-[clamp(2.25rem,4.5vw,3.25rem)] leading-none tracking-wide" style={{ color: modeStyle.textPrimary }}>
              {siteMode === 'learning' && <>Learn Through<br /><span style={{ color: modeStyle.accentColor }}>Amazing Videos</span></>}
              {siteMode === 'fun' && <>Laugh Out Loud<br /><span style={{ color: modeStyle.accentColor }}>With These Picks</span></>}
              {siteMode === 'creative' && <>Get Inspired<br /><span style={{ color: modeStyle.accentColor }}>By Creativity</span></>}
              {siteMode === 'relax' && <>Find Peace<br /><span style={{ color: modeStyle.accentColor }}>In These Moments</span></>}
              {siteMode === 'challenge' && <>Test Yourself<br /><span style={{ color: modeStyle.accentColor }}>With Challenges</span></>}
              {siteMode === 'adventure' && <>Explore New Worlds<br /><span style={{ color: modeStyle.accentColor }}>Through Stories</span></>}
              {siteMode === 'classic' && <>Short-form picks<span style={{ color: modeStyle.accentColor }}>.</span></>}
            </h2>
            <p className="mt-4 text-sm leading-relaxed sm:text-base" style={{ color: modeStyle.textSecondary }}>
              {siteMode === 'learning' && <>Discover educational videos that make learning fun and engaging. Tap any card to watch on YouTube.</>}
              {siteMode === 'fun' && <>Enjoy hilarious comedy clips and entertaining content. Tap any card to watch on YouTube or TikTok.</>}
              {siteMode === 'creative' && <>Watch inspiring creative content and artistic performances. Tap any card to watch on YouTube.</>}
              {siteMode === 'relax' && <>Find calming and peaceful videos for relaxation. Tap any card to watch on YouTube.</>}
              {siteMode === 'challenge' && <>Watch challenging content and motivational videos. Tap any card to watch on YouTube.</>}
              {siteMode === 'adventure' && <>Explore adventure stories and exciting journeys. Tap any card to watch on YouTube.</>}
              {siteMode === 'classic' && <>Tap a card to open a classic funny clip on <span style={{ color: modeStyle.textPrimary, fontWeight: '500' }}>YouTube</span> or <span style={{ color: modeStyle.textPrimary, fontWeight: '500' }}>TikTok</span> in a new tab. More on <Link href="/videos" style={{ color: modeStyle.accentColor, fontWeight: '500' }} className="no-underline hover:underline">LaughTube</Link>.</>}
            </p>
          </div>

          <div className="reveal mb-10 flex flex-wrap gap-2">
            {(
              siteMode === 'learning' ? ['All', 'Educational', 'Science'] :
              siteMode === 'fun' ? ['All', 'Funny', 'Cat Videos', 'Entertaining'] :
              siteMode === 'creative' ? ['All', 'Creative', 'Entertaining'] :
              siteMode === 'relax' ? ['All', 'Cooking', 'Entertaining', 'Lifestyle'] :
              siteMode === 'challenge' ? ['All', 'Educational', 'Creative'] :
              siteMode === 'adventure' ? ['All', 'Entertaining', 'Creative'] :
              ['All', 'Educational', 'Funny', 'Cooking', 'Cat Videos', 'Science']
            ).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  activeCategory === category
                    ? 'shadow-[0_4px_20px_rgba(255,193,5,0.2)]'
                    : 'border bg-[#0c1829]/50 hover:text-[#e8edf5]'
                }`}
                style={{
                  backgroundColor: activeCategory === category ? modeStyle.accentColor : undefined,
                  color: activeCategory === category ? '#0a0f18' : modeStyle.textSecondary,
                  borderColor: activeCategory === category ? modeStyle.accentColor : modeStyle.borderColor,
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Videos Grid with Player Boxes */}
          {visibleSpotlightVideos.length === 0 ? (
            <p className="reveal text-sm text-[#8ba3c4]">Nothing in this filter—pick &quot;All&quot; or another vibe.</p>
          ) : (
          <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {visibleSpotlightVideos.map((video, idx) => {
              const openLabel = `Open "${video.title}" on ${video.platform} in a new tab`;
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
