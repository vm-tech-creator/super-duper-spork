'use client';

import { useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, XCircle } from 'lucide-react';
import type { EducationQuiz } from '@/lib/educationQuizzes';

export interface QuizPlayerResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

interface EducationQuizPlayerProps {
  quiz: EducationQuiz;
  onComplete: (result: QuizPlayerResult) => void;
  onExit: () => void;
}

function calculateGrade(score: number, total: number): QuizPlayerResult['grade'] {
  const percentage = (score / total) * 100;
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
}

export default function EducationQuizPlayer({ quiz, onComplete, onExit }: EducationQuizPlayerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const totalQuestions = quiz.questions.length;
  const question = quiz.questions[currentQuestion];

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === question.correct;
    const nextScore = isCorrect ? score + 1 : score;

    if (isCorrect) {
      setScore(nextScore);
    }

    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
      } else {
        setScore(nextScore);
        setShowResult(true);
      }
    }, 1000);
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
  };

  const handleFinish = () => {
    onComplete({
      quizId: quiz.id,
      score,
      totalQuestions,
      grade: calculateGrade(score, totalQuestions),
    });
  };

  if (showResult) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const grade = calculateGrade(score, totalQuestions);
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
            Back to Quizzes
          </button>

          <div className="bg-[rgba(255,193,5,.08)] border border-[rgba(255,193,5,.2)] rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">{quiz.icon}</div>
            <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
            <p className="text-[#7a93b4] mb-6">{quiz.title}</p>
            <div className={`text-6xl font-black mb-2 ${gradeColor}`}>{grade}</div>
            <div className="text-4xl font-bold text-[#ffc105] mb-4">{percentage}%</div>
            <p className="text-[#7a93b4] text-lg mb-8">
              You got {score} out of {totalQuestions} questions correct
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
                Retake Quiz
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
          Back to Quizzes
        </button>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{quiz.icon}</span>
              <h2 className="text-2xl font-bold text-white">{quiz.title}</h2>
            </div>
            <div className="flex items-center gap-2 text-[#7a93b4]">
              <Clock className="h-5 w-5" />
              <span>{currentQuestion + 1} / {totalQuestions}</span>
            </div>
          </div>
          <div className="w-full bg-[rgba(255,193,5,.1)] rounded-full h-2">
            <div
              className="bg-[#ffc105] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-[rgba(255,193,5,.08)] border border-[rgba(255,193,5,.15)] rounded-2xl p-8">
          <h3 className="text-2xl font-semibold text-white mb-8">{question.question}</h3>
          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  selectedAnswer === null
                    ? 'bg-[rgba(255,193,5,.05)] hover:bg-[rgba(255,193,5,.12)] border border-[rgba(255,193,5,.15)] hover:border-[rgba(255,193,5,.3)]'
                    : selectedAnswer === index
                    ? index === question.correct
                      ? 'bg-green-500/20 border-2 border-green-400'
                      : 'bg-red-500/20 border-2 border-red-400'
                    : index === question.correct
                    ? 'bg-green-500/20 border-2 border-green-400'
                    : 'bg-[rgba(255,193,5,.05)] border border-[rgba(255,193,5,.1)] opacity-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-[rgba(255,193,5,.15)] flex items-center justify-center text-[#ffc105] font-semibold">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-white">{option}</span>
                  {selectedAnswer !== null && index === question.correct && (
                    <CheckCircle2 className="h-6 w-6 text-green-400 ml-auto" />
                  )}
                  {selectedAnswer !== null && selectedAnswer === index && index !== question.correct && (
                    <XCircle className="h-6 w-6 text-red-400 ml-auto" />
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
