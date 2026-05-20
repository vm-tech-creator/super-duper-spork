'use client';

import { useState, useEffect } from 'react';

export default function PasswordTester({ onClose }: { onClose: () => void }) {
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');
  const [strength, setStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [crackTime, setCrackTime] = useState('');

  const passiveAggressiveComments = [
    "Oh honey, that's... a choice.",
    "I mean, if you like getting hacked, sure!",
    "Your mother would approve. That's not a compliment.",
    "It's like you WANT someone to steal your passwords.",
    "Bless your heart, that's adorable.",
    "Did a toddler pick this?",
    "I've seen better security on a cardboard box.",
    "Well, at least it's memorable... to hackers.",
    "That's not a password, that's a cry for help.",
    "You're making my job very easy.",
    "Is this your first Internet?",
    "I can crack this faster than you can say 'data breach'.",
    "My grandmother types faster than this password is strong.",
    "I hope you have good insurance for identity theft.",
    "This password is about as secure as a paper bag.",
    "Even my cat could guess this one.",
  ];

  const analyzePassword = (pwd: string) => {
    setPassword(pwd);
    let score = 0;

    if (pwd.length >= 8) score += 20;
    if (pwd.length >= 12) score += 20;
    if (pwd.length >= 16) score += 10;
    if (/[a-z]/.test(pwd)) score += 10;
    if (/[A-Z]/.test(pwd)) score += 10;
    if (/\d/.test(pwd)) score += 15;
    if (/[!@#$%^&*]/.test(pwd)) score += 15;

    const finalScore = Math.min(score, 100);
    setStrength(finalScore);

    // Calculate crack time
    if (pwd.length === 0) {
      setFeedback('');
      setCrackTime('');
    } else {
      const randomComment = passiveAggressiveComments[Math.floor(Math.random() * passiveAggressiveComments.length)];
      setFeedback(randomComment);
      
      // Simple crack time estimation
      const combinations = Math.pow(94, pwd.length);
      const guessesPerSecond = 10000000000; // 10 billion guesses/sec
      const seconds = combinations / guessesPerSecond;
      
      let timeStr = '';
      if (seconds < 1) {
        timeStr = 'Instantly';
      } else if (seconds < 60) {
        timeStr = `${Math.round(seconds)} seconds`;
      } else if (seconds < 3600) {
        timeStr = `${Math.round(seconds / 60)} minutes`;
      } else if (seconds < 86400) {
        timeStr = `${Math.round(seconds / 3600)} hours`;
      } else if (seconds < 31536000) {
        timeStr = `${Math.round(seconds / 86400)} days`;
      } else if (seconds < 3153600000) {
        timeStr = `${Math.round(seconds / 31536000)} years`;
      } else {
        timeStr = 'Centuries';
      }
      setCrackTime(timeStr);
    }
  };

  const getStrengthColor = () => {
    if (strength < 30) return 'bg-red-500';
    if (strength < 50) return 'bg-orange-500';
    if (strength < 70) return 'bg-yellow-500';
    if (strength < 90) return 'bg-green-500';
    return 'bg-emerald-500';
  };

  const getStrengthLabel = () => {
    if (strength < 30) return 'WEAK';
    if (strength < 50) return 'FAIR';
    if (strength < 70) return 'GOOD';
    if (strength < 90) return 'STRONG';
    return 'EXCELLENT';
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-[#080f1c] to-[#001a4d] flex items-center justify-center p-8">
      {/* Background particles */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#ffc105] rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Main Card */}
      <div className="relative z-10 bg-[#101e34]/90 backdrop-blur-xl rounded-2xl border border-[#497ab6]/30 p-8 max-w-2xl w-full shadow-2xl">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[#ffc105] font-bold text-3xl mb-1">🔐 Password Tester</h1>
            <p className="text-[#7a93b4] text-sm">Let's see how bad this will be...</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.href = '/games'}
              className="bg-[#497ab6] text-[#e8edf5] border-none px-3 py-1 rounded text-xs font-bold uppercase tracking-[.08em] cursor-pointer hover:bg-[#2b4c7d] transition-all"
            >
              ← Games
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-[#497ab6] text-[#e8edf5] border-none px-3 py-1 rounded text-xs font-bold uppercase tracking-[.08em] cursor-pointer hover:bg-[#2b4c7d] transition-all"
            >
              🏠 Home
            </button>
          </div>
        </div>

        {/* Password Input */}
        <div className="relative mb-6">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => analyzePassword(e.target.value)}
            placeholder="Enter your password..."
            className="w-full bg-[#080f1c] border-2 border-[#497ab6]/30 rounded-lg px-4 py-3 text-[#e8edf5] placeholder-[#7a93b4] focus:outline-none focus:border-[#ffc105] transition-colors"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7a93b4] hover:text-[#ffc105] transition-colors"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {/* Strength Meter */}
        {password && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#7a93b4] text-sm font-semibold">Strength</span>
              <span className={`${getStrengthColor().replace('bg-', 'text-')} text-sm font-bold`}>
                {getStrengthLabel()} - {strength}%
              </span>
            </div>
            <div className="h-3 bg-[#080f1c] rounded-full overflow-hidden">
              <div
                className={`h-full ${getStrengthColor()} transition-all duration-300`}
                style={{ width: `${strength}%` }}
              />
            </div>
          </div>
        )}

        {/* Passive-Aggressive Feedback */}
        {feedback && (
          <div className="mb-6 bg-[#ffc105]/10 border border-[#ffc105]/30 rounded-lg p-4">
            <p className="text-[#ffc105] font-bold text-lg text-center italic">
              "{feedback}"
            </p>
            <p className="text-[#7a93b4] text-xs text-center mt-2">
              — Judgmental Password AI
            </p>
          </div>
        )}

        {/* Crack Time */}
        {crackTime && (
          <div className="mb-6 bg-[#e74c3c]/10 border border-[#e74c3c]/30 rounded-lg p-4">
            <p className="text-[#e74c3c] font-bold text-center">
              ⚠️ Time to crack: {crackTime}
            </p>
          </div>
        )}

        {/* Tips */}
        <div className="bg-[#497ab6]/10 border border-[#497ab6]/20 rounded-lg p-4">
          <p className="text-[#497ab6] font-bold mb-3">💡 Tips:</p>
          <ul className="text-[#7a93b4] text-sm space-y-2">
            <li>• Use at least 12 characters</li>
            <li>• Mix uppercase and lowercase</li>
            <li>• Include numbers and symbols</li>
            <li>• Avoid common words/phrases</li>
            <li>• Don't reuse passwords</li>
          </ul>
        </div>

        {/* Back Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full bg-[#ffc105] text-[#080f1c] border-none px-6 py-3 rounded font-bold uppercase tracking-[.08em] cursor-pointer hover:bg-[#ffcf3a] transition-all"
          >
            ← Back to Game Details
          </button>
        </div>
      </div>
    </div>
  );
}
