'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, XCircle } from 'lucide-react';
import {
  generatePracticeProblems,
  isAnswerCorrect,
  type MathPractice,
} from '@/lib/educationMath';

export interface MathPracticeResult {
  practiceId: string;
  score: number;
  totalProblems: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

interface EducationMathPracticePlayerProps {
  practice: MathPractice;
  onComplete: (result: MathPracticeResult) => void;
  onExit: () => void;
}

function calculateGrade(score: number, total: number): MathPracticeResult['grade'] {
  const percentage = (score / total) * 100;
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
}

export default function EducationMathPracticePlayer({
  practice,
  onComplete,
  onExit,
}: EducationMathPracticePlayerProps) {
  const [sessionKey, setSessionKey] = useState(0);
  const problems = useMemo(
    () => generatePracticeProblems(practice.id, practice.problemCount),
    [practice.id, practice.problemCount, sessionKey],
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);

  const problem = problems[currentIndex];
  const totalProblems = problems.length;

  const handleSubmit = () => {
    if (!userAnswer.trim() || submitted) return;

    const correct = isAnswerCorrect(userAnswer, problem.answer);
    setWasCorrect(correct);
    setSubmitted(true);

    if (correct) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex < totalProblems - 1) {
        setCurrentIndex((prev) => prev + 1);
        setUserAnswer('');
        setSubmitted(false);
        setWasCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const handleFinish = () => {
    onComplete({
      practiceId: practice.id,
      score,
      totalProblems,
      grade: calculateGrade(score, totalProblems),
    });
  };

  const handleRetake = () => {
    setSessionKey((prev) => prev + 1);
    setCurrentIndex(0);
    setUserAnswer('');
    setScore(0);
    setSubmitted(false);
    setWasCorrect(null);
    setShowResult(false);
  };

  if (showResult) {
    const percentage = Math.round((score / totalProblems) * 100);
    const grade = calculateGrade(score, totalProblems);
    const gradeColor =
      grade === 'A' ? 'text-green-400' :
      grade === 'B' ? 'text-blue-400' :
      grade === 'C' ? 'text-yellow-400' :
      grade === 'D' ? 'text-orange-400' :
      'text-red-400';

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#080f1c] via-[#0f1929] to-[#080f1c]">
        <div className="max-w-2xl mx-auto px-6 py-12">
          <button
            onClick={onExit}
            className="inline-flex items-center gap-2 text-[#7a93b4] hover:text-[#ffc105] transition-colors mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Practice
          </button>

          <div className="bg-[rgba(255,193,5,.08)] border border-[rgba(255,193,5,.2)] rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">{practice.icon}</div>
            <h2 className="text-3xl font-bold text-white mb-2">Practice Complete!</h2>
            <p className="text-[#7a93b4] mb-6">{practice.title}</p>
            <div className={`text-6xl font-black mb-2 ${gradeColor}`}>{grade}</div>
            <div className="text-4xl font-bold text-[#ffc105] mb-4">{percentage}%</div>
            <p className="text-[#7a93b4] text-lg mb-8">
              You got {score} out of {totalProblems} problems correct
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={handleFinish}
                className="bg-[#ffc105] hover:bg-[#ffcf3a] text-[#080f1c] px-6 py-3 rounded-lg font-bold uppercase tracking-[.05em] transition-all"
              >
                Save & Continue
              </button>
              <button
                onClick={handleRetake}
                className="border-2 border-[#ffc105] text-[#ffc105] hover:bg-[rgba(255,193,5,.1)] px-6 py-3 rounded-lg font-bold uppercase tracking-[.05em] transition-all"
              >
                Try Again
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
          Back to Practice
        </button>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{practice.icon}</span>
              <h2 className="text-2xl font-bold text-white">{practice.title}</h2>
            </div>
            <div className="flex items-center gap-2 text-[#7a93b4]">
              <Clock className="h-5 w-5" />
              <span>{currentIndex + 1} / {totalProblems}</span>
            </div>
          </div>
          <div className="w-full bg-[rgba(255,193,5,.1)] rounded-full h-2">
            <div
              className="bg-[#ffc105] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalProblems) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-[rgba(255,193,5,.08)] border border-[rgba(255,193,5,.15)] rounded-2xl p-8">
          <h3 className="text-2xl font-semibold text-white mb-8 text-center">{problem.question}</h3>

          <div className="space-y-4">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              disabled={submitted}
              placeholder="Type your answer..."
              className={`w-full p-4 rounded-xl bg-[rgba(255,193,5,.05)] border text-white text-lg placeholder-[#7a93b4] focus:outline-none transition-all ${
                submitted
                  ? wasCorrect
                    ? 'border-green-400'
                    : 'border-red-400'
                  : 'border-[rgba(255,193,5,.15)] focus:border-[#ffc105]'
              }`}
              autoFocus
            />

            {submitted && (
              <div className={`flex items-center gap-2 text-sm font-semibold ${wasCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {wasCorrect ? (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Correct!
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5" />
                    Correct answer: {problem.answer}
                  </>
                )}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!userAnswer.trim() || submitted}
              className="w-full bg-[#ffc105] hover:bg-[#ffcf3a] disabled:opacity-50 disabled:cursor-not-allowed text-[#080f1c] rounded-lg px-6 py-3 font-bold uppercase tracking-[.05em] transition-all"
            >
              Submit Answer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
