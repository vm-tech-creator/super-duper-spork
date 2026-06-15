'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CatBounceGame from '@/components/CatBounceGame';
import SpaceExplorerGame from '@/components/SpaceExplorerGame';
import MazeRunnerGame from '@/components/MazeRunnerGame';
import BubblePopperGame from '@/components/BubblePopperGame';
import ThePointingPointer from '@/components/games/ThePointingPointer';
import EndlessHorse from '@/components/games/EndlessHorse';
import FindTheInvisibleCow from '@/components/games/FindTheInvisibleCow';
import PasswordTester from '@/components/games/PasswordTester';
import CatBounce from '@/components/games/CatBounce';
import HackerTyper from '@/components/games/HackerTyper';
import ElonFortune from '@/components/games/ElonFortune';
import MusicQuiz from '@/components/games/MusicQuiz';
import WeirdBooks from '@/components/games/WeirdBooks';
import PacMan from '@/components/games/PacMan';
import NeonFlames from '@/components/games/NeonFlames';
import SuperstarRacing from '@/components/games/SuperstarRacing';
import Blobmixer from '@/components/games/Blobmixer';

const GAMES_DATA: Record<number, any> = {
  1: {
    id: 1,
    title: 'The Pointing Pointer',
    description: 'A site that tracks your cursor and displays a random photo of someone pointing exactly where it is.',
    fullDescription: 'Move your cursor around and watch as a random person appears on screen, pointing directly at your cursor position. An absurdly entertaining experience that turns mouse movement into an interactive game of "who\'s watching you now?"',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
    genre: 'Interactive & Useless Fun',
    rating: 4.3,
    players: 'Solo',
    releaseDate: 'Mar 2026',
    developer: 'Pointer Studios',
    features: ['Cursor Tracking', 'Random Photos', 'Hilarious Reactions', 'Endless Entertainment'],
  },
  2: {
    id: 2,
    title: 'Endless Horse',
    description: 'A page with a pixelated horse whose legs get longer and longer as you scroll infinitely.',
    fullDescription: 'Scroll down and watch in amazement as a simple pixelated horse\'s legs stretch infinitely. There\'s no end, no goal—just an infinitely tall horse that defies physics. Pure chaos and weirdly relaxing.',
    imageUrl: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&h=600&fit=crop',
    genre: 'Interactive & Useless Fun',
    rating: 4.5,
    players: 'Solo',
    releaseDate: 'Feb 2026',
    developer: 'Pixel Dreams Inc',
    features: ['Infinite Scrolling', 'Pixelated Art', 'No Purpose', 'Weirdly Addictive'],
  },
  3: {
    id: 3,
    title: 'Find the Invisible Cow',
    description: 'A digital "Marco Polo" game where audio gets louder as your mouse gets closer to a hidden cow.',
    fullDescription: 'Hunt for an invisible cow using only sound! Move your mouse around the screen and listen as the audio intensifies when you get closer. A sensory-based treasure hunt that\'s surprisingly challenging and entertaining.',
    imageUrl: 'https://media.istockphoto.com/id/496397741/photo/typical-dutch-red-and-white-milk-cow.jpg?s=612x612&w=0&k=20&c=juTog_zRhJIQa0sOUcwk5WH1AM3PRxhlvsIm4dywzK8=',
    genre: 'Interactive & Useless Fun',
    rating: 4.6,
    players: 'Solo',
    releaseDate: 'Jan 2026',
    developer: 'Audio Explorers',
    features: ['Sound-Based', 'Hidden Mechanics', 'Quirky Theme', 'Quick Gameplay'],
  },
  4: {
    id: 4,
    title: 'Passive-Aggressive Password Tester',
    description: 'A tool that critiques your password strength in the voice of a judgmental in-law.',
    fullDescription: 'Test your password while receiving brutally honest feedback from a condescending voice. Watch as your password is judged and mocked in the most passive-aggressive way possible. Hilarious and educational.',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
    genre: 'Interactive & Useless Fun',
    rating: 4.7,
    players: 'Solo',
    releaseDate: 'Mar 2026',
    developer: 'Sarcasm Labs',
    features: ['Voice Acting', 'Password Analysis', 'Dark Humor', 'Surprisingly Useful'],
  },
  5: {
    id: 5,
    title: 'Cat Bounce',
    description: 'A page where images of cats bounce around; clicking a button makes it "rain" cats.',
    fullDescription: 'Watch adorable cat images bounce around your screen in a chaotic, joyful display. Click the "make it rain" button and witness a downpour of bouncing cats. Pure feline chaos and happiness.',
    imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=600&fit=crop',
    genre: 'Interactive & Useless Fun',
    rating: 4.9,
    players: 'Solo',
    releaseDate: 'Dec 2025',
    developer: 'Feline Dynamics',
    features: ['Bouncing Cats', 'Rain Effect', 'Cute Overload', 'Stress Relief'],
  },
  6: {
    id: 6,
    title: 'Hacker Typer',
    description: 'A simulator where typing random keys on your keyboard generates high-speed "green code" like a 90s hacker movie.',
    fullDescription: 'Become a movie hacker! Just start typing and watch as your keyboard input generates realistic-looking cascading code filled with technical jargon and green terminal text. Look like a Hollywood hacker without actually doing anything illegal.',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop',
    genre: 'Interactive & Useless Fun',
    rating: 4.4,
    players: 'Solo',
    releaseDate: 'Nov 2025',
    developer: 'Cyberpunk Studios',
    features: ['Matrix Style Code', 'Keyboard Input', 'Terminal Aesthetic', 'Spy Feel'],
  },
  7: {
    id: 7,
    title: 'Elon Musk\'s Fortune',
    description: 'A simulator that lets you try to spend a billionaire\'s entire net worth on ridiculous items.',
    fullDescription: 'Try to spend $250+ billion on the most absurd, ridiculous, and hilarious items imaginable. From diamond-encrusted toilet seats to buying every pizza in the world, watch your balance deplete in the most entertaining way possible.',
    imageUrl: 'https://images.unsplash.com/photo-1553729784-e91953dec042?w=800&h=600&fit=crop',
    genre: 'Humorous & Absurd Concepts',
    rating: 4.6,
    players: 'Solo',
    releaseDate: 'Apr 2026',
    developer: 'Satire Studios',
    features: ['Wealth Simulator', 'Absurd Items', 'Dark Humor', 'Endless Fun'],
  },
  8: {
    id: 8,
    title: 'Who is Pissed Off At Your Music?',
    description: 'A quiz that takes your music taste and tells you which demographic you\'re most likely annoying.',
    fullDescription: 'Answer ridiculous questions about your music preferences and discover exactly which group of people you\'re probably annoying with your taste. From parents to rival fandoms, find out who can\'t stand what you listen to.',
    imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800&h=600&fit=crop',
    genre: 'Humorous & Absurd Concepts',
    rating: 4.8,
    players: 'Solo',
    releaseDate: 'Mar 2026',
    developer: 'Humor Labs',
    features: ['Music Quiz', 'Personality Analysis', 'Sarcastic Results', 'Shareable'],
  },
  9: {
    id: 9,
    title: 'Always Judge a Book by its Cover',
    description: 'A curated collection of the weirdest and most confusing real book titles ever published.',
    fullDescription: 'Explore a hilarious collection of real books with the strangest, most confusing, and downright bizarre titles ever published. From academic papers to self-help guides, witness titles so weird they\'re hard to believe are real.',
    imageUrl: 'https://images.unsplash.com/photo-1507842217343-583f7270bfbb?w=800&h=600&fit=crop',
    genre: 'Humorous & Absurd Concepts',
    rating: 4.7,
    players: 'Solo',
    releaseDate: 'Feb 2026',
    developer: 'Literary Labs',
    features: ['Real Books', 'Hilarious Titles', 'Educational', 'Endless Laughs'],
  },
  10: {
    id: 10,
    title: 'Space Explorer 3D',
    description: 'Navigate through stunning 3D space, collecting stars while avoiding asteroids in this immersive space adventure.',
    fullDescription: 'Embark on an epic space journey in full 3D! Pilot your spaceship through asteroid fields, collect glowing stars, and experience the thrill of space exploration. With realistic physics, beautiful particle effects, and challenging gameplay, this is space adventure like you\'ve never seen before.',
    imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop',
    genre: '3D Action & Adventure',
    rating: 4.9,
    players: 'Solo',
    releaseDate: 'Apr 2026',
    developer: 'Cosmic Studios',
    features: ['3D Graphics', 'Realistic Physics', 'Particle Effects', 'Space Exploration', 'Mouse Controls'],
  },
  11: {
    id: 11,
    title: 'Maze Runner 3D',
    description: 'Navigate through complex 3D mazes, collect coins, and race against time in this thrilling maze adventure.',
    fullDescription: 'Challenge yourself in fully 3D maze environments! Use keyboard controls to navigate through intricate mazes, collect golden coins, and reach the finish before time runs out. Each level gets more challenging with bigger mazes and faster timers. Perfect for puzzle lovers and speed runners!',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    genre: '3D Puzzle & Action',
    rating: 4.8,
    players: 'Solo',
    releaseDate: 'Apr 2026',
    developer: 'Labyrinth Games',
    features: ['3D Mazes', 'Keyboard Controls', 'Time Pressure', 'Progressive Difficulty', 'Coin Collection'],
  },
  12: {
    id: 12,
    title: 'Bubble Popper 3D',
    description: 'Pop colorful 3D bubbles in this relaxing yet challenging bubble-popping extravaganza with combo system.',
    fullDescription: 'Dive into a world of floating, colorful bubbles in stunning 3D! Pop bubbles of different sizes and colors to score points, build massive combos, and clear levels before time runs out. With beautiful particle effects, smooth animations, and addictive gameplay, this is the ultimate bubble-popping experience.',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
    genre: '3D Casual & Relaxing',
    rating: 4.9,
    players: 'Solo',
    releaseDate: 'Apr 2026',
    developer: 'Bubble Dynamics',
    features: ['3D Bubbles', 'Combo System', 'Particle Effects', 'Mouse Controls', 'Progressive Levels'],
  },
  13: {
    id: 13,
    title: 'Pac-Man',
    description: 'A classic maze game where you navigate Pac-Man through a two-line pathway maze while avoiding colorful ghosts.',
    fullDescription: 'Navigate the classic Pac-Man through a perfectly designed maze filled with pellets. Collect all pellets to win while avoiding four intelligent ghosts with unique AI behaviors. Arrow keys or WASD to move. A nostalgic return to arcade gaming.',
    imageUrl: 'https://images.unsplash.com/photo-1535371579214-d6a72b3b5c47?w=800&h=600&fit=crop',
    genre: 'Classic Arcade Game',
    rating: 4.9,
    players: 'Solo',
    releaseDate: 'Apr 2026',
    developer: 'Arcade Legends',
    features: ['Maze Navigation', 'AI Ghosts', 'Pellet Collection', 'Arcade Classic'],
  },
  14: {
    id: 14,
    title: 'Neon Flames',
    description: 'A paint-your-own-nebula experience where your cursor leaves glowing, cosmic trails in a drifting starfield.',
    fullDescription: 'Step into a cosmic studio and paint a neon nebula with a trail of glowing particles. Your cursor leaves shimmering space dust and bright auroras while a slowly moving starfield shimmers behind the scene. The result is a meditative interactive art piece with vivid color and cosmic motion.',
    imageUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&h=600&fit=crop',
    genre: 'Interactive & Useless Fun',
    rating: 4.9,
    players: 'Solo',
    releaseDate: 'May 2026',
    developer: 'Cosmic Canvas',
    features: ['Neon Trail Painting', 'Cosmic Space Background', 'Glowing Particle Effects', 'Interactive Nebula Art'],
  },
  15: {
    id: 15,
    title: 'Superstar Racing',
    description: 'A hill climb-style racing adventure with hills, coins, fuel, and physics-driven controls.',
    fullDescription: 'Rev up your engine and conquer twisting hills in Superstar Racing. Use acceleration, braking, and tilt control to keep the car balanced, collect coins, and stay fueled while climbing to new distance records.',
    imageUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&h=600&fit=crop',
    genre: 'Racing',
    rating: 4.9,
    players: 'Solo',
    releaseDate: 'May 2026',
    developer: 'Superstar Studios',
    features: ['Hill Climb Physics', 'Fuel Management', 'Coin Collection', 'Tilt Control'],
  },
  16: {
    id: 16,
    title: 'Blobmixer',
    description: 'A dreamy 3D blob playground where you can tap, squish, and shape floating liquid forms in mid-air.',
    fullDescription: 'Step into Blobmixer, a calm 3D playground where translucent blobs float in space and respond to your pointer. Click and drag to squish, stretch, and bounce each blob while soft lighting and slow motion create a relaxing sensory experience.',
    imageUrl: 'https://images.unsplash.com/photo-1612831205498-89a5d8c7f3a6?w=800&h=600&fit=crop',
    genre: '3D Playground',
    rating: 4.9,
    players: 'Solo',
    releaseDate: 'May 2026',
    developer: 'PlayLab Studio',
    features: ['Interactive 3D Blobs', 'Drag-to-Squish', 'Soft Lighting', 'Relaxing Physics'],
  },
};

export const GAME_IDS = Object.keys(GAMES_DATA).map(Number);

export default function GameDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameId = parseInt(id);
  const game = GAMES_DATA[gameId];
  const [scrolled, setScrolled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-start game if play=true in query params
  useEffect(() => {
    if (searchParams.get('play') === 'true') {
      setIsPlaying(true);
    }
  }, [searchParams]);

  const renderGame = () => {
    switch (gameId) {
      case 1:
        return <ThePointingPointer onClose={() => setIsPlaying(false)} />;
      case 2:
        return <EndlessHorse onClose={() => setIsPlaying(false)} />;
      case 3:
        return <FindTheInvisibleCow onClose={() => setIsPlaying(false)} />;
      case 4:
        return <PasswordTester onClose={() => setIsPlaying(false)} />;
      case 5:
        return <CatBounce onClose={() => setIsPlaying(false)} />;
      case 6:
        return <HackerTyper onClose={() => setIsPlaying(false)} />;
      case 7:
        return <ElonFortune onClose={() => setIsPlaying(false)} />;
      case 8:
        return <MusicQuiz onClose={() => setIsPlaying(false)} />;
      case 9:
        return <WeirdBooks onClose={() => setIsPlaying(false)} />;
      case 10:
        return <SpaceExplorerGame />;
      case 11:
        return <MazeRunnerGame />;
      case 12:
        return <BubblePopperGame />;
      case 13:
        return <NeonFlames onClose={() => setIsPlaying(false)} />;
      case 14:
        return <SuperstarRacing onClose={() => setIsPlaying(false)} />;
      case 15:
        return <Blobmixer onClose={() => setIsPlaying(false)} />;
      case 16:
        return <SpaceExplorerGame onClose={() => setIsPlaying(false)} />;
      default:
        return null;
    }
  };

  if (isPlaying) {
    return renderGame();
  }

  if (!game) {
    return (
      <div className="relative min-h-screen bg-[#080f1c] text-[#e8edf5] overflow-x-hidden flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="font-['Barlow_Condensed'] font-black text-4xl uppercase">Game Not Found</h1>
          <p className="text-[#7a93b4]">Sorry, we couldn't find this game.</p>
          <button
            onClick={() => router.push('/games')}
            className="bg-[#ffc105] text-[#080f1c] border-none px-6 py-2.5 rounded transition-all hover:bg-[#ffcf3a] font-['Barlow_Condensed'] font-bold uppercase tracking-[.08em] cursor-pointer"
          >
            Back to Games
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden text-[var(--text)]">
      {/* Noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-40 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Nav */}
      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative pb-12 pt-4">
          <div className="absolute inset-0 h-[500px] overflow-hidden">
            <img
              src={game.imageUrl}
              alt={game.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(8,15,28,.3)] via-[rgba(8,15,28,.6)] to-[#080f1c]" />
          </div>

          <div className="relative px-[5%] pt-32 pb-16">
            <div className="max-w-6xl mx-auto">
              <button
                onClick={() => router.back()}
                className="text-[#7a93b4] hover:text-[#ffc105] transition-colors mb-6 font-medium uppercase tracking-[.05em] text-sm"
              >
                ← Back to Games
              </button>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="inline-block rounded-full bg-[rgba(255,193,5,.15)] px-4 py-2 text-sm font-semibold uppercase tracking-[.05em] text-[#ffc105]">
                    {game.genre}
                  </span>
                  <span className="flex items-center gap-1 text-2xl font-bold text-[#ffc105]">
                    ★ {game.rating.toFixed(1)}
                  </span>
                </div>
                <h1 className="font-['Barlow_Condensed'] font-black text-6xl uppercase tracking-[.04em]">
                  {game.title}
                </h1>
                <p className="text-xl text-[#7a93b4] max-w-3xl">
                  {game.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Details Section */}
        <section className="px-[5%] py-16 bg-[rgba(73,122,182,.05)] border-y border-[rgba(73,122,182,.2)]">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <p className="text-[#7a93b4] text-sm uppercase tracking-[.05em] font-medium">Developer</p>
              <p className="font-semibold text-lg">{game.developer}</p>
            </div>
            <div className="space-y-2">
              <p className="text-[#7a93b4] text-sm uppercase tracking-[.05em] font-medium">Players</p>
              <p className="font-semibold text-lg">{game.players}</p>
            </div>
            <div className="space-y-2">
              <p className="text-[#7a93b4] text-sm uppercase tracking-[.05em] font-medium">Release Date</p>
              <p className="font-semibold text-lg">{game.releaseDate}</p>
            </div>

          </div>
        </section>

        {/* Full Description */}
        <section className="px-[5%] py-16">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h2 className="font-['Barlow_Condensed'] font-black text-3xl uppercase tracking-[.04em] mb-4">
                About This Game
              </h2>
              <p className="text-lg text-[#7a93b4] leading-relaxed">
                {game.fullDescription}
              </p>
            </div>

            {/* Features */}
            <div>
              <h2 className="font-['Barlow_Condensed'] font-black text-3xl uppercase tracking-[.04em] mb-6">
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {game.features.map((feature: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-4 bg-[rgba(255,193,5,.1)] border border-[rgba(255,193,5,.2)] rounded"
                  >
                    <span className="text-[#ffc105] text-xl">✓</span>
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-[5%] py-16 bg-gradient-to-r from-[rgba(255,193,5,.1)] to-[rgba(73,122,182,.1)] border-y border-[rgba(255,193,5,.1)]">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="font-['Barlow_Condensed'] font-black text-4xl uppercase tracking-[.04em]">
              Ready to Play {game.title}?
            </h2>
            {game.id === 5 ? (
              <>
                <p className="text-lg text-[#7a93b4]">
                  Click anywhere in the game area below to spawn bouncing cats! Use the "Make It Rain" button for a cat storm.
                </p>
                <div className="mt-8 h-[600px] rounded-lg overflow-hidden border-2 border-[#ffc105]/30">
                  <CatBounceGame />
                </div>
              </>
            ) : game.id === 10 ? (
              <>
                <p className="text-lg text-[#7a93b4]">
                  Use your mouse to pilot your spaceship through space! Collect stars while avoiding asteroids. Good luck, space explorer!
                </p>
                <div className="mt-8 h-[600px] rounded-lg overflow-hidden border-2 border-[#ffc105]/30">
                  <SpaceExplorerGame />
                </div>
              </>
            ) : game.id === 11 ? (
              <>
                <p className="text-lg text-[#7a93b4]">
                  Use WASD keys to navigate through the 3D maze! Collect all coins and reach the exit before time runs out.
                </p>
                <div className="mt-8 h-[600px] rounded-lg overflow-hidden border-2 border-[#ffc105]/30">
                  <MazeRunnerGame />
                </div>
              </>
            ) : game.id === 12 ? (
              <>
                <p className="text-lg text-[#7a93b4]">
                  Click on bubbles to pop them! Build combos by popping multiple bubbles quickly. Clear all bubbles before time runs out!
                </p>
                <div className="mt-8 h-[600px] rounded-lg overflow-hidden border-2 border-[#ffc105]/30">
                  <BubblePopperGame />
                </div>
              </>
            ) : (
              <button className="bg-[#ffc105] text-[#080f1c] border-none px-8 py-3 rounded font-['Barlow_Condensed'] font-bold uppercase tracking-[.08em] transition-all hover:bg-[#ffcf3a] hover:translate-y-[-2px] hover:shadow-[0_6px_24px_rgba(255,193,5,.4)] cursor-pointer text-lg">
                Play Now
              </button>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[rgba(73,122,182,.2)] bg-[rgba(8,15,28,.6)] px-[5%] py-12">
        <div className="max-w-6xl mx-auto text-center text-[#497ab6] text-sm">
          <p>&copy; 2026 Sahara Games. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
