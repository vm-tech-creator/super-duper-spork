'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Brain, CheckCircle2, XCircle, Trophy, Clock } from 'lucide-react';

export default function QuizPage() {
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const quizzes = [
    {
      id: 'math',
      title: 'Mathematics Quiz',
      description: 'Test your math skills with arithmetic, algebra, and geometry questions',
      icon: '🧮',
      color: '#4ade80',
      questions: [
        { question: 'What is 15 × 7?', options: ['95', '105', '115', '125'], correct: 1 },
        { question: 'What is the square root of 144?', options: ['10', '11', '12', '13'], correct: 2 },
        { question: 'Solve for x: 2x + 5 = 15', options: ['4', '5', '6', '7'], correct: 1 },
        { question: 'What is 25% of 80?', options: ['15', '20', '25', '30'], correct: 1 },
        { question: 'What is the perimeter of a square with side length 8?', options: ['24', '28', '32', '36'], correct: 2 },
      ],
    },
    {
      id: 'ela',
      title: 'English Language Arts Quiz',
      description: 'Challenge yourself with grammar, vocabulary, and reading comprehension',
      icon: '📚',
      color: '#60a5fa',
      questions: [
        { question: 'Which word is a synonym for "happy"?', options: ['Sad', 'Joyful', 'Angry', 'Tired'], correct: 1 },
        { question: 'What is the past tense of "run"?', options: ['Runned', 'Running', 'Ran', 'Runs'], correct: 2 },
        { question: 'Which sentence uses correct grammar?', options: ['She don\'t like apples', 'She doesn\'t like apples', 'She not like apples', 'She no like apples'], correct: 1 },
        { question: 'What is a noun?', options: ['An action word', 'A describing word', 'A person, place, or thing', 'A connecting word'], correct: 2 },
        { question: 'Which word is spelled correctly?', options: ['Recieve', 'Receive', 'Receve', 'Recive'], correct: 1 },
      ],
    },
    {
      id: 'science',
      title: 'Science Quiz',
      description: 'Explore biology, chemistry, physics, and earth science concepts',
      icon: '🔬',
      color: '#f472b6',
      questions: [
        { question: 'What is the chemical symbol for water?', options: ['WA', 'H2O', 'O2H', 'HO2'], correct: 1 },
        { question: 'What planet is known as the Red Planet?', options: ['Venus', 'Jupiter', 'Mars', 'Saturn'], correct: 2 },
        { question: 'What is the largest organ in the human body?', options: ['Heart', 'Liver', 'Brain', 'Skin'], correct: 3 },
        { question: 'What gas do plants absorb from the atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'], correct: 2 },
        { question: 'What is the process by which plants make food?', options: ['Respiration', 'Photosynthesis', 'Digestion', 'Fermentation'], correct: 1 },
      ],
    },
    {
      id: 'history',
      title: 'History Quiz',
      description: 'Journey through time with questions about world history and civilizations',
      icon: '🌍',
      color: '#fbbf24',
      questions: [
        { question: 'In which year did World War II end?', options: ['1943', '1944', '1945', '1946'], correct: 2 },
        { question: 'Who was the first President of the United States?', options: ['Thomas Jefferson', 'John Adams', 'George Washington', 'Benjamin Franklin'], correct: 2 },
        { question: 'Which ancient wonder was located in Egypt?', options: ['Hanging Gardens', 'Colossus of Rhodes', 'Great Pyramid of Giza', 'Lighthouse of Alexandria'], correct: 2 },
        { question: 'What year did the Titanic sink?', options: ['1905', '1910', '1912', '1915'], correct: 2 },
        { question: 'Who painted the Mona Lisa?', options: ['Michelangelo', 'Raphael', 'Leonardo da Vinci', 'Donatello'], correct: 2 },
      ],
    },
  ];

  const activeQuiz = selectedQuiz ? quizzes.find(q => q.id === selectedQuiz) : null;

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    if (activeQuiz && answerIndex === activeQuiz.questions[currentQuestion].correct) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (currentQuestion < activeQuiz!.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
  };

  if (selectedQuiz && activeQuiz) {
    if (showResult) {
      const percentage = Math.round((score / activeQuiz.questions.length) * 100);
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

            <div className="max-w-2xl mx-auto">
              <div className="bg-green-900/30 backdrop-blur-sm border border-green-400/20 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-6">
                  {percentage >= 80 ? '🏆' : percentage >= 60 ? '👏' : '💪'}
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">Quiz Complete!</h2>
                <div className="text-6xl font-bold text-green-400 mb-4">{percentage}%</div>
                <p className="text-green-200 text-lg mb-6">
                  You got {score} out of {activeQuiz.questions.length} questions correct
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={resetQuiz}
                    className="px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl transition-colors"
                  >
                    Try Another Quiz
                  </button>
                  <button
                    onClick={() => {
                      setCurrentQuestion(0);
                      setSelectedAnswer(null);
                      setScore(0);
                      setShowResult(false);
                    }}
                    className="px-6 py-3 bg-green-900/50 hover:bg-green-900/70 text-white font-semibold rounded-xl transition-colors border border-green-400/30"
                  >
                    Retake Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const question = activeQuiz.questions[currentQuestion];

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

          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">{activeQuiz.title}</h2>
                <div className="flex items-center gap-2 text-green-300">
                  <Clock className="h-5 w-5" />
                  <span>{currentQuestion + 1} / {activeQuiz.questions.length}</span>
                </div>
              </div>
              <div className="w-full bg-green-900/30 rounded-full h-2">
                <div
                  className="bg-green-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / activeQuiz.questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-green-900/30 backdrop-blur-sm border border-green-400/20 rounded-2xl p-8">
              <h3 className="text-2xl font-semibold text-white mb-8">{question.question}</h3>
              <div className="space-y-4">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => selectedAnswer === null && handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      selectedAnswer === null
                        ? 'bg-green-950/30 hover:bg-green-950/50 border border-green-400/20 hover:border-green-400/40'
                        : selectedAnswer === index
                        ? index === question.correct
                          ? 'bg-green-500/20 border-2 border-green-400'
                          : 'bg-red-500/20 border-2 border-red-400'
                        : index === question.correct
                        ? 'bg-green-500/20 border-2 border-green-400'
                        : 'bg-green-950/30 border border-green-400/20 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-green-900/50 flex items-center justify-center text-green-300 font-semibold">
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
      </div>
    );
  }

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
          <h1 className="text-5xl font-bold text-white mb-4">Quiz Center</h1>
          <p className="text-green-200 text-lg">Test your knowledge with interactive quizzes across subjects</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              onClick={() => setSelectedQuiz(quiz.id)}
              className="bg-green-900/30 backdrop-blur-sm border border-green-400/20 rounded-2xl p-8 hover:border-green-400/40 transition-all hover:scale-105 cursor-pointer group"
            >
              <div className="text-6xl mb-6">{quiz.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-3">{quiz.title}</h3>
              <p className="text-green-200 mb-6">{quiz.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-green-300 text-sm">{quiz.questions.length} questions</span>
                <Brain className="h-6 w-6 text-green-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-green-900/20 backdrop-blur-sm border border-green-400/20 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-4">
            <Trophy className="h-8 w-8 text-green-400" />
            <h3 className="text-2xl font-bold text-white">Your Achievements</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-950/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">15</div>
              <div className="text-green-200 text-sm">Quizzes Completed</div>
            </div>
            <div className="bg-green-950/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">78%</div>
              <div className="text-green-200 text-sm">Average Score</div>
            </div>
            <div className="bg-green-950/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">8</div>
              <div className="text-green-200 text-sm">Perfect Scores</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
