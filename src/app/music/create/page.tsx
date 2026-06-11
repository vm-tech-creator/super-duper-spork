'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateMusic() {
  const router = useRouter();

  return (
    <main className="min-h-screen text-[var(--text)]">
      <div className="max-w-7xl mx-auto px-4">
        <Link
          href="/music"
          className="t-btn-primary mb-6 inline-flex rounded-xl px-4 py-2 text-sm font-semibold no-underline"
        >
          Back to Music
        </Link>

        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-sahara-secondary to-sahara-primary bg-clip-text text-transparent">
                Create Your Own Music
              </h1>
              <p className="text-xl text-gray-300">
                Compose, synthesize, and produce your own unique sounds
              </p>
              <div className="h-1 w-32 bg-gradient-to-r from-sahara-secondary to-sahara-primary rounded-full mx-auto mt-6"></div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 px-4 mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Synthesizer */}
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-cyan-500/30 rounded-xl p-8 hover:border-cyan-400/60 transition-all duration-300">
                <div className="text-4xl mb-4">🎹</div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-3">Synthesizer</h2>
                <p className="text-gray-300 mb-6">
                  Create sounds using oscillators, filters, and effects. Build anything from classic synth leads to experimental pads.
                </p>
                <button onClick={() => router.push('/music/create/synthesizer')} className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-lg transition-all transform hover:scale-105">
                  Open Synthesizer
                </button>
              </div>

              {/* Drum Machine */}
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-purple-500/30 rounded-xl p-8 hover:border-purple-400/60 transition-all duration-300">
                <div className="text-4xl mb-4">🥁</div>
                <h2 className="text-2xl font-bold text-purple-400 mb-3">Drum Machine</h2>
                <p className="text-gray-300 mb-6">
                  Create rhythmic beats with samples and drum synthesizers. Mix and match sounds to craft the perfect groove.
                </p>
                <button onClick={() => router.push('/music/create/drums')} className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-semibold rounded-lg transition-all transform hover:scale-105">
                  Open Drum Machine
                </button>
              </div>

              {/* Sequencer */}
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-yellow-500/30 rounded-xl p-8 hover:border-yellow-400/60 transition-all duration-300">
                <div className="text-4xl mb-4">📝</div>
                <h2 className="text-2xl font-bold text-yellow-400 mb-3">Sequencer</h2>
                <p className="text-gray-300 mb-6">
                  Arrange notes and patterns. Build melodies and harmonies with our intuitive step sequencer interface.
                </p>
                <button onClick={() => router.push('/music/create/sequencer')} className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-400 hover:to-orange-500 text-white font-semibold rounded-lg transition-all transform hover:scale-105">
                  Open Sequencer
                </button>
              </div>

              {/* Effects Rack */}
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-pink-500/30 rounded-xl p-8 hover:border-pink-400/60 transition-all duration-300">
                <div className="text-4xl mb-4">✨</div>
                <h2 className="text-2xl font-bold text-pink-400 mb-3">Effects Rack</h2>
                <p className="text-gray-300 mb-6">
                  Add reverb, delay, distortion, and more. Polish your sound with professional audio effects.
                </p>
                <button onClick={() => router.push('/music/create/effects')} className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-400 hover:to-red-500 text-white font-semibold rounded-lg transition-all transform hover:scale-105">
                  Open Effects Rack
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 px-4 mb-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-cyan-400 flex items-center gap-3">
              <span className="text-4xl">⚡</span>
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                <span className="text-2xl flex-shrink-0">🎛️</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">Professional Controls</h3>
                  <p className="text-gray-400 text-sm">Fine-tune every aspect of your sound</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                <span className="text-2xl flex-shrink-0">🔊</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">Real-time Playback</h3>
                  <p className="text-gray-400 text-sm">Hear your changes instantly</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                <span className="text-2xl flex-shrink-0">💾</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">Save & Export</h3>
                  <p className="text-gray-400 text-sm">Save your creations and download as audio</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                <span className="text-2xl flex-shrink-0">🎵</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">Audio Library</h3>
                  <p className="text-gray-400 text-sm">Access thousands of sounds and samples</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-700 py-8 px-4 mt-12">
          <div className="max-w-6xl mx-auto">
            <div className="border-t border-slate-700 pt-8">
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
          </div>
        </footer>
      </div>
    </main>
  );
}
