'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Sequencer() {
  const [bpm, setBpm] = useState(120);
  const [selectedStep, setSelectedStep] = useState(0);
  const steps = 16;
  const tracks = 4;

  const stepGrid = Array.from({ length: tracks }, (_, track) =>
    Array.from({ length: steps }, (_, step) => ({
      track,
      step,
      id: `${track}-${step}`,
      active: false,
    }))
  );

  return (
    <main className="min-h-screen text-[var(--text)]">
      <div className="mx-auto max-w-7xl px-4">
        <Link href="/music" className="t-btn-primary mb-6 inline-flex rounded-xl px-4 py-2 text-sm font-semibold no-underline">
          Back to Music
        </Link>

        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-sahara-secondary to-sahara-primary bg-clip-text text-transparent">
                📝 Sequencer
              </h1>
              <p className="text-xl text-gray-300">
                Arrange notes and create patterns step by step
              </p>
              <div className="h-1 w-32 bg-gradient-to-r from-sahara-secondary to-sahara-primary rounded-full mx-auto mt-6"></div>
            </div>
          </div>
        </section>

        {/* Sequencer Controls */}
        <section className="py-12 px-4 mb-12">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-cyan-500/30 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-8">Step Sequencer</h2>

              {/* BPM Control */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-300 mb-4">
                  Tempo: {bpm === 0 ? 'Off' : `${bpm} BPM`}
                </label>
                <input
                  type="range"
                  min="60"
                  max="240"
                  value={bpm}
                  onChange={(e) => setBpm(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Step Grid */}
              <div className="mb-8">
                <div className="space-y-4">
                  {stepGrid.map((track, trackIdx) => (
                    <div key={trackIdx} className="flex items-center gap-4">
                      <span className="text-cyan-400 font-semibold w-12">Track {trackIdx + 1}</span>
                      <div className="flex gap-2 flex-wrap">
                        {track.map((cell) => (
                          <button
                            key={cell.id}
                            onClick={() => setSelectedStep(cell.step)}
                            className={`w-10 h-10 rounded-lg font-bold transition-all transform hover:scale-110 ${
                              selectedStep === cell.step
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50'
                                : 'bg-slate-600 hover:bg-slate-500'
                            }`}
                          >
                            {cell.step + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transport Controls */}
              <div className="flex gap-4">
                <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-lg transition-all transform hover:scale-105">
                  ▶ Play
                </button>
                <button className="px-8 py-3 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-lg transition-all transform hover:scale-105">
                  ⏸ Stop
                </button>
                <button className="px-8 py-3 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-lg transition-all transform hover:scale-105">
                  🔄 Reset
                </button>
              </div>

              {/* Info Box */}
              <div className="mt-8 p-4 bg-slate-900/50 rounded-lg border border-cyan-500/20">
                <p className="text-gray-400 text-sm">
                  <strong>Tip:</strong> Click on steps to add notes to different tracks. Each column represents a beat in your pattern.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 px-4 mb-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-cyan-400 flex items-center gap-3">
              <span className="text-4xl">⚡</span>
              Sequencer Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                <span className="text-2xl flex-shrink-0">🎼</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">Pattern Recording</h3>
                  <p className="text-gray-400 text-sm">Record and save custom patterns</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                <span className="text-2xl flex-shrink-0">🔁</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">Loop Control</h3>
                  <p className="text-gray-400 text-sm">Create seamless repeating patterns</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                <span className="text-2xl flex-shrink-0">🎵</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">Multi-track</h3>
                  <p className="text-gray-400 text-sm">Arrange multiple tracks together</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                <span className="text-2xl flex-shrink-0">💾</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">Save & Export</h3>
                  <p className="text-gray-400 text-sm">Export your sequences as audio</p>
                </div>
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
