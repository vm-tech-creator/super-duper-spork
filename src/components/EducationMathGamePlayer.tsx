'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, Trophy, XCircle } from 'lucide-react';
import {
  generateGameProblem,
  type MathGame,
} from '@/lib/educationMath';

export interface MathGameResult {
  gameId: string;
  score: number;
  correctCount: number;
  totalAttempts: number;
}

interface EducationMathGamePlayerProps {
  game: MathGame;
  highScore?: number;
  onComplete: (result: MathGameResult) => void;
  onExit: () => void;
}

export default function EducationMathGamePlayer({
  game,
  highScore = 0,
  onComplete,
  onExit,
}: EducationMathGamePlayerProps) {
  const [timeLeft, setTimeLeft] = useState(game.timeLimit);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [problem, setProblem] = useState(() => generateGameProblem(game.id));
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const nextProblem = useCallback(() => {
    setProblem(generateGameProblem(game.id));
    setSelectedAnswer(null);
  }, [game.id]);

  useEffect(() => {
    if (!gameStarted || showResult) return;

    if (timeLeft <= 0) {
      setShowResult(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, showResult, timeLeft]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || !gameStarted) return;

    setSelectedAnswer(answerIndex);
    setTotalAttempts((prev) => prev + 1);

    const isCorrect = answerIndex === problem.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + game.pointsPerCorrect);
      setCorrectCount((prev) => prev + 1);
    }

    setTimeout(nextProblem, 600);
  };

  const handleFinish = () => {
    onComplete({
      gameId: game.id,
      score,
      correctCount,
      totalAttempts,
    });
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#080f1c] via-[#0f1929] to-[#080f1c]">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <button
            onClick={onExit}
            className="inline-flex items-center gap-2 text-[#7a93b4] hover:text-[#ffc105] transition-colors mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Games
          </button>

          <div className="bg-[rgba(255,193,5,.08)] border border-[rgba(255,193,5,.2)] rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">{game.icon}</div>
            <h2 className="text-3xl font-bold text-white mb-2">{game.title}</h2>
            <p className="text-[#7a93b4] mb-6">{game.description}</p>
            <div className="flex justify-center gap-6 mb-8 text-sm text-[#7a93b4]">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {game.timeLimit}s
              </span>
              <span>{game.pointsPerCorrect} pts per correct</span>
              {highScore > 0 && (
                <span className="flex items-center gap-1 text-[#ffc105]">
                  <Trophy className="h-4 w-4" /> Best: {highScore}
                </span>
              )}
            </div>
            <button
              onClick={() => setGameStarted(true)}
              className="bg-[#ffc105] hover:bg-[#ffcf3a] text-[#080f1c] px-8 py-4 rounded-lg font-bold uppercase tracking-[.05em] transition-all"
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResult) {
    const isNewHighScore = score > highScore;

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#080f1c] via-[#0f1929] to-[#080f1c]">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <div className="bg-[rgba(255,193,5,.08)] border border-[rgba(255,193,5,.2)] rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">{isNewHighScore ? '🏆' : '🎮'}</div>
            <h2 className="text-3xl font-bold text-white mb-2">Time&apos;s Up!</h2>
            <p className="text-[#7a93b4] mb-6">{game.title}</p>
            <div className="text-5xl font-black text-[#ffc105] mb-2">{score}</div>
            <p className="text-[#7a93b4] mb-2">Total Points</p>
            <p className="text-white mb-8">
              {correctCount} correct out of {totalAttempts} attempts
            </p>
            {isNewHighScore && (
              <p className="text-green-400 font-semibold mb-6">New high score!</p>
            )}
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={handleFinish}
                className="bg-[#ffc105] hover:bg-[#ffcf3a] text-[#080f1c] px-6 py-3 rounded-lg font-bold uppercase tracking-[.05em] transition-all"
              >
                Save Score
              </button>
              <button
                onClick={() => {
                  setTimeLeft(game.timeLimit);
                  setScore(0);
                  setCorrectCount(0);
                  setTotalAttempts(0);
                  setShowResult(false);
                  nextProblem();
                }}
                className="border-2 border-[#ffc105] text-[#ffc105] hover:bg-[rgba(255,193,5,.1)] px-6 py-3 rounded-lg font-bold uppercase tracking-[.05em] transition-all"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#080f1c] via-[#0f1929] to-[#080f1c]">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <button
          onClick={onExit}
          className="inline-flex items-center gap-2 text-[#7a93b4] hover:text-[#ffc105] transition-colors mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          Exit Game
        </button>

        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{game.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-white">{game.title}</h2>
              <p className="text-[#ffc105] font-semibold">{score} pts</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 font-bold text-2xl ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
            <Clock className="h-6 w-6" />
            {timeLeft}s
          </div>
        </div>

        <div className="bg-[rgba(255,193,5,.08)] border border-[rgba(255,193,5,.15)] rounded-2xl p-8">
          <h3 className="text-2xl font-semibold text-white mb-8 text-center">{problem.question}</h3>
          <div className="grid grid-cols-2 gap-4">
            {problem.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                className={`p-4 rounded-xl font-semibold text-lg transition-all ${
                  selectedAnswer === null
                    ? 'bg-[rgba(255,193,5,.05)] hover:bg-[rgba(255,193,5,.12)] border border-[rgba(255,193,5,.15)] hover:border-[rgba(255,193,5,.3)] text-white'
                    : selectedAnswer === index
                    ? index === problem.correctIndex
                      ? 'bg-green-500/20 border-2 border-green-400 text-white'
                      : 'bg-red-500/20 border-2 border-red-400 text-white'
                    : index === problem.correctIndex
                    ? 'bg-green-500/20 border-2 border-green-400 text-white'
                    : 'bg-[rgba(255,193,5,.05)] border border-[rgba(255,193,5,.1)] opacity-50 text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  {option}
                  {selectedAnswer !== null && index === problem.correctIndex && (
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                  )}
                  {selectedAnswer !== null && selectedAnswer === index && index !== problem.correctIndex && (
                    <XCircle className="h-5 w-5 text-red-400" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
