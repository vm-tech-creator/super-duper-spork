'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function EffectsRack() {
  const router = useRouter();
  const [dryWet, setDryWet] = useState(50);
  const [selectedEffect, setSelectedEffect] = useState('reverb');

  const effects = [
    {
      name: 'Reverb',
      icon: '🏛️',
      description: 'Add space and depth to your sound',
      params: ['Decay', 'Predelay', 'Wet/Dry']
    },
    {
      name: 'Delay',
      icon: '⏱️',
      description: 'Create echoing repeats',
      params: ['Time', 'Feedback', 'Wet/Dry']
    },
    {
      name: 'Distortion',
      icon: '⚡',
      description: 'Add aggression and character',
      params: ['Drive', 'Tone', 'Output']
    },
    {
      name: 'Chorus',
      icon: '👥',
      description: 'Thicken your sound with layers',
      params: ['Rate', 'Depth', 'Wet/Dry']
    },
    {
      name: 'Flanger',
      icon: '✈️',
      description: 'Create swooshing metallic effects',
      params: ['Rate', 'Depth', 'Feedback']
    },
    {
      name: 'Compressor',
      icon: '📊',
      description: 'Control dynamic range',
      params: ['Threshold', 'Ratio', 'Release']
    },
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
                ✨ Effects Rack
              </h1>
              <p className="text-xl text-gray-300">
                Polish your sound with professional audio effects
              </p>
              <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mx-auto mt-6"></div>
            </div>
          </div>
        </section>

        {/* Effects Selection */}
        <section className="py-12 px-4 mb-12">
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-cyan-500/30 rounded-xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-8">Available Effects</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {effects.map((effect) => (
                  <button
                    key={effect.name}
                    onClick={() => setSelectedEffect(effect.name.toLowerCase())}
                    className={`p-4 rounded-lg text-left transition-all transform hover:scale-105 ${
                      selectedEffect === effect.name.toLowerCase()
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50'
                        : 'bg-slate-600 hover:bg-slate-500'
                    }`}
                  >
                    <div className="text-3xl mb-2">{effect.icon}</div>
                    <h3 className="font-semibold text-white mb-1">{effect.name}</h3>
                    <p className="text-sm text-gray-200">{effect.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Effect Controls */}
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-cyan-500/30 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-8">
                {effects.find(e => e.name.toLowerCase() === selectedEffect)?.name || 'Effect'} Controls
              </h2>

              {/* Dry/Wet Control */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-300 mb-4">
                  Dry/Wet Mix: {dryWet}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={dryWet}
                  onChange={(e) => setDryWet(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Effect Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {effects.find(e => e.name.toLowerCase() === selectedEffect)?.params.map((param) => (
                  <div key={param}>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">{param}</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="50"
                      className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                  </div>
                ))}
              </div>

              {/* Control Buttons */}
              <div className="flex gap-4">
                <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-lg transition-all transform hover:scale-105">
                  ✓ Apply Effect
                </button>
                <button className="px-8 py-3 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-lg transition-all transform hover:scale-105">
                  ↻ Reset
                </button>
              </div>

              {/* Info Box */}
              <div className="mt-8 p-4 bg-slate-900/50 rounded-lg border border-cyan-500/20">
                <p className="text-gray-400 text-sm">
                  <strong>Tip:</strong> Adjust the parameters to fine-tune each effect. Use Dry/Wet to blend the effect with the original signal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Effects Guide */}
        <section className="py-12 px-4 mb-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-cyan-400 flex items-center gap-3">
              <span className="text-4xl">📚</span>
              Effects Guide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {effects.map((effect) => (
                <div key={effect.name} className="bg-slate-700/30 rounded-lg p-6 border border-slate-600">
                  <h3 className="text-xl font-bold text-cyan-400 mb-3">{effect.icon} {effect.name}</h3>
                  <p className="text-gray-300 text-sm mb-3">{effect.description}</p>
                  <div className="text-sm text-gray-400">
                    <strong>Parameters:</strong>
                    <div className="mt-2 space-y-1">
                      {effect.params.map((p) => (
                        <div key={p}>• {p}</div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
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
