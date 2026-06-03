'use client';

import Link from 'next/link';
import { ArrowLeft, Gamepad2, Calculator, BookOpen, Brain, TrendingUp } from 'lucide-react';

export default function MathELAGamesPage() {
  const mathGames = [
    { title: 'Math Blaster', description: 'Blast through math problems in this exciting arcade game', difficulty: 'Easy', icon: '🚀' },
    { title: 'Fraction Quest', description: 'Master fractions through adventure gameplay', difficulty: 'Medium', icon: '⚔️' },
    { title: 'Geometry Builder', description: 'Create and explore geometric shapes', difficulty: 'Easy', icon: '📐' },
    { title: 'Algebra Challenge', description: 'Solve algebraic equations to progress', difficulty: 'Hard', icon: '🧮' },
  ];

  const elaGames = [
    { title: 'Word Hunter', description: 'Find hidden words in challenging puzzles', difficulty: 'Easy', icon: '🔍' },
    { title: 'Grammar Galaxy', description: 'Travel through space fixing grammar errors', difficulty: 'Medium', icon: '🌟' },
    { title: 'Story Builder', description: 'Create your own stories with guided prompts', difficulty: 'Medium', icon: '📖' },
    { title: 'Vocabulary Voyage', description: 'Expand your vocabulary through word games', difficulty: 'Easy', icon: '🎯' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a2e1a] to-[#0f5132]">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Home
        </Link>

        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Math & ELA Games</h1>
          <p className="text-green-200 text-lg">Interactive games for math and English language arts practice</p>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Calculator className="h-8 w-8 text-green-400" />
            Mathematics Games
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mathGames.map((game) => (
              <div
                key={game.title}
                className="bg-green-900/30 backdrop-blur-sm border border-green-400/20 rounded-2xl p-6 hover:border-green-400/40 transition-all hover:scale-105 cursor-pointer group"
              >
                <div className="text-5xl mb-4">{game.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{game.title}</h3>
                <p className="text-green-200 text-sm mb-4">{game.description}</p>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    game.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300' :
                    game.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {game.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-green-400" />
            English Language Arts Games
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {elaGames.map((game) => (
              <div
                key={game.title}
                className="bg-green-900/30 backdrop-blur-sm border border-green-400/20 rounded-2xl p-6 hover:border-green-400/40 transition-all hover:scale-105 cursor-pointer group"
              >
                <div className="text-5xl mb-4">{game.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{game.title}</h3>
                <p className="text-green-200 text-sm mb-4">{game.description}</p>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    game.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300' :
                    game.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {game.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 bg-green-900/20 backdrop-blur-sm border border-green-400/20 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-4">
            <TrendingUp className="h-8 w-8 text-green-400" />
            <h3 className="text-2xl font-bold text-white">Track Your Progress</h3>
          </div>
          <p className="text-green-200 mb-6">Monitor your learning journey with detailed statistics and achievements</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-950/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">24</div>
              <div className="text-green-200 text-sm">Games Played</div>
            </div>
            <div className="bg-green-950/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">85%</div>
              <div className="text-green-200 text-sm">Accuracy</div>
            </div>
            <div className="bg-green-950/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">12</div>
              <div className="text-green-200 text-sm">Badges Earned</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
