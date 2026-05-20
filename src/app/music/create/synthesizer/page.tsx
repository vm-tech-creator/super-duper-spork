'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export default function Synthesizer() {
  const router = useRouter();
  const [frequency, setFrequency] = useState(440);
  const [waveform, setWaveform] = useState('sine');
  const [tempo, setTempo] = useState(120);
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const metronomeIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  const playSound = () => {
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

    osc.type = waveform as OscillatorType;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    oscillatorRef.current = osc;
    gainRef.current = gain;
  };

  const stopSound = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
  };

  const toggleMetronome = () => {
    if (!isMetronomeActive) {
      setIsMetronomeActive(true);
      const beatInterval = (60 / tempo) * 1000;
      
      metronomeIntervalRef.current = setInterval(() => {
        playTapSound();
      }, beatInterval);
    } else {
      setIsMetronomeActive(false);
      if (metronomeIntervalRef.current) {
        clearInterval(metronomeIntervalRef.current);
        metronomeIntervalRef.current = null;
      }
    }
  };

  const handleTempoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTempo = parseInt(e.target.value);
    setTempo(newTempo);

    // If tempo is 0, stop the metronome
    if (newTempo === 0) {
      setIsMetronomeActive(false);
      if (metronomeIntervalRef.current) {
        clearInterval(metronomeIntervalRef.current);
        metronomeIntervalRef.current = null;
      }
      return;
    }

    if (isMetronomeActive) {
      if (metronomeIntervalRef.current) {
        clearInterval(metronomeIntervalRef.current);
      }
      const beatInterval = (60 / newTempo) * 1000;
      metronomeIntervalRef.current = setInterval(() => {
        playTapSound();
      }, beatInterval);
    }
  };

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch (e) {
          // Already stopped
        }
      }
      if (metronomeIntervalRef.current) {
        clearInterval(metronomeIntervalRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Header */}
        <nav className="flex items-center justify-between p-6 border-b border-slate-700">
          <Link href="/" className="text-2xl font-bebas-neue font-bold text-yellow-400 hover:text-yellow-300 transition-colors">
            🌍 Sahara Supersite
          </Link>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-barlow font-semibold transition-all transform hover:scale-105"
          >
            ← Back
          </button>
        </nav>

        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bebas-neue font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                🎹 Synthesizer
              </h1>
              <p className="text-xl text-gray-300">
                Create custom sounds with oscillators and controls
              </p>
              <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto mt-6"></div>
            </div>
          </div>
        </section>

        {/* Synthesizer Controls */}
        <section className="py-12 px-4 mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-cyan-500/30 rounded-xl p-8">
              <h2 className="text-2xl font-bebas-neue font-bold text-cyan-400 mb-8">Synthesizer Controls</h2>

              {/* Tempo Control */}
              <div className="mb-8">
                <label className="block text-lg font-barlow font-semibold text-gray-300 mb-4">
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
                    onClick={toggleMetronome}
                    className={`px-6 py-2 rounded-lg font-barlow font-bold transition-all transform hover:scale-105 whitespace-nowrap ${
                      isMetronomeActive
                        ? 'bg-red-500 hover:bg-red-400 text-white'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white'
                    }`}
                  >
                    {isMetronomeActive ? '⏹ Stop' : '▶ Play'}
                  </button>
                </div>
              </div>

              {/* Waveform Selection */}
              <div className="mb-8">
                <label className="block text-lg font-barlow font-semibold text-gray-300 mb-4">Waveform</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['sine', 'square', 'sawtooth', 'triangle'].map((wave) => (
                    <button
                      key={wave}
                      onClick={() => setWaveform(wave)}
                      className={`px-4 py-3 rounded-lg font-barlow font-semibold transition-all capitalize ${
                        waveform === wave
                          ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                          : 'bg-slate-600 hover:bg-slate-500 text-gray-300'
                      }`}
                    >
                      {wave}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency Control */}
              <div className="mb-8">
                <label className="block text-lg font-barlow font-semibold text-gray-300 mb-4">
                  Frequency: {frequency} Hz
                </label>
                <input
                  type="range"
                  min="20"
                  max="2000"
                  value={frequency}
                  onChange={(e) => setFrequency(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                  <span>20 Hz</span>
                  <span>2000 Hz</span>
                </div>
              </div>

              {/* Play/Stop Button */}
              <div className="flex gap-4">
                <button
                  onMouseDown={playSound}
                  onMouseUp={stopSound}
                  onMouseLeave={stopSound}
                  onTouchStart={playSound}
                  onTouchEnd={stopSound}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-barlow font-bold text-lg rounded-lg transition-all transform hover:scale-105 active:scale-95"
                >
                  ▶ Play (Click & Hold)
                </button>
              </div>

              {/* Info Box */}
              <div className="mt-8 p-4 bg-slate-900/50 rounded-lg border border-cyan-500/20">
                <p className="text-gray-400 text-sm">
                  <strong>Tip:</strong> Click and hold the Play button to hear the sound. Adjust the frequency and waveform to create different tones.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Information Section */}
        <section className="py-12 px-4 mb-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bebas-neue font-bold mb-8 text-cyan-400 flex items-center gap-3">
              <span className="text-4xl">ℹ️</span>
              About Synthesizers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                <h3 className="text-xl font-bold text-cyan-400 mb-3">Waveforms</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li><strong>Sine:</strong> Pure, smooth tone</li>
                  <li><strong>Square:</strong> Hollow, bright sound</li>
                  <li><strong>Sawtooth:</strong> Harsh, buzzy sound</li>
                  <li><strong>Triangle:</strong> Warm, mellow tone</li>
                </ul>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                <h3 className="text-xl font-bold text-cyan-400 mb-3">Frequency Ranges</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li><strong>Bass:</strong> 20-250 Hz</li>
                  <li><strong>Midrange:</strong> 250-2000 Hz</li>
                  <li><strong>Treble:</strong> 2000+ Hz</li>
                </ul>
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
