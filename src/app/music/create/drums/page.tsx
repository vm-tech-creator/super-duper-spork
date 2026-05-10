'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export default function DrumMachine() {
  const router = useRouter();
  const audioContextRef = useRef<AudioContext | null>(null);
  const [tempo, setTempo] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const playTapSound = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    
    // Resume audio context if suspended (for browser autoplay policies)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  };

  const playDrumSound = (frequency: number, duration: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    
    // Resume audio context if suspended (for browser autoplay policies)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    gain.gain.setValueAtTime(1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  };

  const playKick = () => playDrumSound(150, 0.5);
  const playSnare = () => playDrumSound(200, 0.2);
  const playHiHat = () => playDrumSound(300, 0.1);
  const playTom = () => playDrumSound(250, 0.15);

  const togglePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      const beatInterval = (60 / tempo) * 1000; // Convert BPM to milliseconds
      
      intervalRef.current = setInterval(() => {
        playTapSound();
      }, beatInterval);
    } else {
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const handleTempoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTempo = parseInt(e.target.value);
    setTempo(newTempo);

    // If tempo is 0, stop the metronome
    if (newTempo === 0) {
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // If playing, update the interval
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      const beatInterval = (60 / newTempo) * 1000;
      intervalRef.current = setInterval(() => {
        playTapSound();
      }, beatInterval);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const drums = [
    { name: 'Kick', emoji: '🥾', onClick: playKick, color: 'from-red-500 to-orange-600' },
    { name: 'Snare', emoji: '🎯', onClick: playSnare, color: 'from-blue-500 to-cyan-600' },
    { name: 'Hi-Hat', emoji: '✨', onClick: playHiHat, color: 'from-yellow-500 to-orange-600' },
    { name: 'Tom', emoji: '🥁', onClick: playTom, color: 'from-purple-500 to-pink-600' },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Header */}
        <nav className="flex items-center justify-between p-6 border-b border-slate-700">
          <Link href="/" className="text-2xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors">
            🌍 Sahara Supersite
          </Link>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            ← Back
          </button>
        </nav>

        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                🥁 Drum Machine
              </h1>
              <p className="text-xl text-gray-300">
                Create rhythmic beats and patterns
              </p>
              <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto mt-6"></div>
            </div>
          </div>
        </section>

        {/* Drum Pads */}
        <section className="py-12 px-4 mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-cyan-500/30 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-8">Drum Pads</h2>

              {/* Tempo Control with Play Button */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-300 mb-4">
                  Tempo: {tempo === 0 ? 'Off' : `${tempo} BPM`}
                </label>
                <div className="flex gap-4 mb-4">
                  <input
                    type="range"
                    min="0"
                    max="240"
                    value={tempo}
                    onChange={handleTempoChange}
                    className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <button
                    onClick={togglePlay}
                    className={`px-6 py-2 rounded-lg font-bold transition-all transform hover:scale-105 whitespace-nowrap ${
                      isPlaying
                        ? 'bg-red-500 hover:bg-red-400 text-white'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white'
                    }`}
                  >
                    {isPlaying ? '⏹ Stop' : '▶ Play'}
                  </button>
                </div>
              </div>

              {/* Drum Pads Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {drums.map((drum) => (
                  <button
                    key={drum.name}
                    onClick={drum.onClick}
                    className={`px-4 py-8 rounded-lg font-bold text-lg transition-all transform active:scale-90 hover:shadow-lg bg-gradient-to-br ${drum.color}`}
                  >
                    <div className="text-3xl mb-2">{drum.emoji}</div>
                    <div>{drum.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-700 py-8 px-4 mt-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-gray-500 text-sm">
                © 2026 Sahara Supersite. All rights reserved.
              </div>
              <div className="flex items-center gap-6">
                <Link href="/" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Privacy Policy</Link>
                <Link href="/" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Terms of Service</Link>
                <Link href="/" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">Contact Us</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
