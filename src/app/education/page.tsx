'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Brain, Gamepad2, Trophy, Clock, Target, BookOpen, 
  ArrowRight, CheckCircle2, Flame, Filter, BarChart3
} from 'lucide-react';
import EducationQuizPlayer from '@/components/EducationQuizPlayer';
import EducationMathGamePlayer from '@/components/EducationMathGamePlayer';
import EducationMathPracticePlayer from '@/components/EducationMathPracticePlayer';
import { educationQuizzes, getEducationQuizById } from '@/lib/educationQuizzes';
import {
  educationMathGames,
  educationMathPractices,
  getMathGameById,
  getMathPracticeById,
  type GradeLevel,
} from '@/lib/educationMath';
import { updateQuizScore } from '@/lib/educationProgress';
import { useEducationTracking } from '@/hooks/useEducationTracking';

const QUIZ_RESULTS_KEY = 'sahara_education_quiz_results';
const GAME_SCORES_KEY = 'sahara_education_game_scores';
const PRACTICE_RESULTS_KEY = 'sahara_education_practice_results';

interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

interface PracticeResult {
  practiceId: string;
  score: number;
  totalProblems: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

interface GameScores {
  [gameId: string]: number;
}

export default function EducationPage() {
  useEducationTracking();
  const [activeTab, setActiveTab] = useState<'quizzes' | 'games' | 'math-practice' | 'progress'>('quizzes');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('Middle');
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [activePracticeId, setActivePracticeId] = useState<string | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [practiceResults, setPracticeResults] = useState<PracticeResult[]>([]);
  const [gameScores, setGameScores] = useState<GameScores>({});
  const [gamesPlayed, setGamesPlayed] = useState(0);

  useEffect(() => {
    try {
      const storedQuizzes = localStorage.getItem(QUIZ_RESULTS_KEY);
      if (storedQuizzes) {
        setQuizResults(JSON.parse(storedQuizzes));
      }

      const storedPractice = localStorage.getItem(PRACTICE_RESULTS_KEY);
      if (storedPractice) {
        setPracticeResults(JSON.parse(storedPractice));
      }

      const storedGames = localStorage.getItem(GAME_SCORES_KEY);
      if (storedGames) {
        const parsed = JSON.parse(storedGames) as { scores: GameScores; played: number };
        setGameScores(parsed.scores ?? {});
        setGamesPlayed(parsed.played ?? 0);
      }
    } catch (error) {
      console.error('Failed to load education progress:', error);
    }
  }, []);

  const grades: GradeLevel[] = ['Elementary', 'Middle', 'High', 'College'];

  const quizzes = educationQuizzes;
  const mathGames = educationMathGames.map((game) => ({
    ...game,
    highScore: gameScores[game.id],
  }));
  const mathPractices = educationMathPractices;

  const filteredQuizzes = selectedDifficulty === 'All' 
    ? quizzes 
    : quizzes.filter(q => q.difficulty === selectedDifficulty);

  const filteredGames = selectedDifficulty === 'All'
    ? mathGames
    : mathGames.filter(g => g.difficulty === selectedDifficulty);

  const filteredMathPractices = mathPractices.filter(p => p.gradeLevel === selectedGrade);

  const difficulties: Array<'All' | 'Easy' | 'Medium' | 'Hard'> = ['All', 'Easy', 'Medium', 'Hard'];

  const userStats = {
    quizzesCompleted: quizResults.length,
    gamesPlayed,
    totalPoints:
      quizResults.reduce((sum, r) => sum + Math.round((r.score / r.totalQuestions) * 100), 0) +
      Object.values(gameScores).reduce((sum, score) => sum + score, 0),
    currentStreak: quizResults.length + practiceResults.length + gamesPlayed > 0 ? 1 : 0,
  };

  const handleQuizComplete = (result: QuizResult) => {
    const percentage = Math.round((result.score / result.totalQuestions) * 100);
    updateQuizScore(percentage);

    setQuizResults((prev) => {
      const updated = [result, ...prev.filter((r) => r.quizId !== result.quizId)];
      localStorage.setItem(QUIZ_RESULTS_KEY, JSON.stringify(updated));
      return updated;
    });
    setActiveQuizId(null);
    setActiveTab('progress');
  };

  const handleGameComplete = (result: { gameId: string; score: number }) => {
    const updatedScores = {
      ...gameScores,
      [result.gameId]: Math.max(gameScores[result.gameId] ?? 0, result.score),
    };
    const updatedPlayed = gamesPlayed + 1;

    setGameScores(updatedScores);
    setGamesPlayed(updatedPlayed);
    localStorage.setItem(
      GAME_SCORES_KEY,
      JSON.stringify({ scores: updatedScores, played: updatedPlayed }),
    );
    setActiveGameId(null);
    setActiveTab('games');
  };

  const handlePracticeComplete = (result: PracticeResult) => {
    const percentage = Math.round((result.score / result.totalProblems) * 100);
    updateQuizScore(percentage);

    setPracticeResults((prev) => {
      const updated = [result, ...prev.filter((r) => r.practiceId !== result.practiceId)];
      localStorage.setItem(PRACTICE_RESULTS_KEY, JSON.stringify(updated));
      return updated;
    });
    setActivePracticeId(null);
    setActiveTab('progress');
  };

  const activeQuiz = activeQuizId ? getEducationQuizById(activeQuizId) : null;
  const activeGame = activeGameId ? getMathGameById(activeGameId) : null;
  const activePractice = activePracticeId ? getMathPracticeById(activePracticeId) : null;

  if (activeQuiz) {
    return (
      <EducationQuizPlayer
        quiz={activeQuiz}
        onComplete={handleQuizComplete}
        onExit={() => setActiveQuizId(null)}
      />
    );
  }

  if (activeGame) {
    return (
      <EducationMathGamePlayer
        game={activeGame}
        highScore={gameScores[activeGame.id]}
        onComplete={handleGameComplete}
        onExit={() => setActiveGameId(null)}
      />
    );
  }

  if (activePractice) {
    return (
      <EducationMathPracticePlayer
        practice={activePractice}
        onComplete={handlePracticeComplete}
        onExit={() => setActivePracticeId(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#080f1c] via-[#0f1929] to-[#080f1c]">
      {/* Navigation */}
      <nav className="border-b border-[rgba(255,193,5,.1)] sticky top-0 z-50 bg-[rgba(8,15,28,.95)] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/games" className="text-2xl font-bold hover:text-[#ffc105] transition-colors">
              <span className="text-[#ffc105]">📚</span> Education Hub
            </Link>
            <Link 
              href="/games" 
              className="text-[#7a93b4] hover:text-[#ffc105] transition-colors font-bold uppercase tracking-[.05em]"
            >
              ← Back to Games
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#497ab6] rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#ffc105] rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[rgba(255,193,5,.15)] border border-[rgba(255,193,5,.3)]">
            <span className="text-[#ffc105] font-bold text-sm uppercase tracking-widest">🎓 Interactive Learning</span>
          </div>
          <h1 className="font-['Barlow_Condensed'] font-black text-6xl uppercase tracking-[.04em] leading-tight">
            Master Your Skills with{' '}
            <span className="text-[#ffc105] drop-shadow-[0_0_30px_rgba(255,193,5,.5)]">
              Quizzes & Games
            </span>
          </h1>
          <p className="text-xl text-[#7a93b4] leading-relaxed max-w-2xl mx-auto">
            Engage in interactive quizzes and exciting games to boost your learning. Track progress, earn points, and climb the leaderboards!
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: 'Quizzes Completed', value: userStats.quizzesCompleted, icon: <CheckCircle2 className="h-6 w-6 text-green-400" /> },
          { label: 'Games Played', value: userStats.gamesPlayed, icon: <Gamepad2 className="h-6 w-6 text-blue-400" /> },
          { label: 'Total Points', value: userStats.totalPoints, icon: <Trophy className="h-6 w-6 text-yellow-400" /> },
          { label: 'Streak Days', value: userStats.currentStreak, icon: <Flame className="h-6 w-6 text-orange-400" /> },
        ].map((stat, idx) => (
          <div key={idx} className="bg-[rgba(255,193,5,.08)] border border-[rgba(255,193,5,.15)] rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#7a93b4] text-sm font-medium uppercase tracking-widest">{stat.label}</span>
              {stat.icon}
            </div>
            <p className="text-3xl font-black text-white">{stat.value}</p>
          </div>
        ))}
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        {/* Tabs */}
        <div className="flex gap-4 mb-12 border-b border-[rgba(255,193,5,.1)]">
          {[
            { id: 'quizzes', label: '📝 Practice Quizzes', icon: Brain },
            { id: 'games', label: '🎮 Math Games', icon: Gamepad2 },
            { id: 'math-practice', label: '📊 Math Practice', icon: Target },
            { id: 'progress', label: '📈 Your Progress', icon: BarChart3 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-6 py-4 font-bold uppercase tracking-[.05em] transition-all relative ${
                activeTab === tab.id
                  ? 'text-[#ffc105] border-b-2 border-[#ffc105]'
                  : 'text-[#7a93b4] hover:text-[#ffc105]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grade Level Selector - Show for Math Practice tab */}
        {activeTab === 'math-practice' && (
          <div className="mb-8 flex flex-wrap gap-3 items-center">
            <span className="text-[#7a93b4] font-semibold uppercase tracking-widest">Grade Level:</span>
            {grades.map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedGrade === grade
                    ? 'bg-[#ffc105] text-[#080f1c]'
                    : 'bg-[rgba(255,193,5,.1)] text-[#ffc105] hover:bg-[rgba(255,193,5,.2)]'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        )}

        {/* Filter Bar */}
        {activeTab !== 'progress' && activeTab !== 'math-practice' && (
          <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
            <Filter className="h-5 w-5 text-[#7a93b4] shrink-0" />
            {difficulties.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-[#ffc105] text-[#080f1c]'
                    : 'bg-[rgba(255,193,5,.1)] text-[#ffc105] hover:bg-[rgba(255,193,5,.2)]'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        )}

        {/* Quizzes Tab */}
        {activeTab === 'quizzes' && (
          <div className="space-y-6">
            <div className="grid gap-6">
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="group relative bg-gradient-to-r from-[rgba(255,193,5,.08)] to-[rgba(73,122,182,.08)] border border-[rgba(255,193,5,.15)] rounded-xl p-6 hover:border-[rgba(255,193,5,.3)] transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[rgba(255,193,5,.05)] to-transparent" />
                  
                  <div className="relative flex items-start justify-between gap-6">
                    <div className="flex gap-6 flex-1">
                      <div className="text-5xl pt-1 flex-shrink-0">{quiz.icon}</div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">{quiz.title}</h3>
                          <p className="text-[#7a93b4]">{quiz.description}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span className={`px-3 py-1 rounded-full font-semibold ${
                            quiz.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300' :
                            quiz.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-red-500/20 text-red-300'
                          }`}>
                            {quiz.difficulty}
                          </span>
                          <span className="flex items-center gap-1 text-[#7a93b4]">
                            <BookOpen className="h-4 w-4" /> {quiz.questions.length} Questions
                          </span>
                          <span className="flex items-center gap-1 text-[#7a93b4]">
                            <Clock className="h-4 w-4" /> {quiz.duration} min
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveQuizId(quiz.id)}
                      className="flex-shrink-0 bg-[#ffc105] hover:bg-[#ffcf3a] text-[#080f1c] rounded-lg px-6 py-3 font-bold uppercase tracking-[.05em] transition-all hover:-translate-y-1 flex items-center gap-2 group/btn"
                    >
                      Start
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Games Tab */}
        {activeTab === 'games' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="group relative bg-gradient-to-br from-[rgba(73,122,182,.15)] to-[rgba(255,193,5,.05)] border border-[rgba(255,193,5,.2)] rounded-xl p-6 hover:border-[rgba(255,193,5,.4)] transition-all cursor-pointer overflow-hidden hover:-translate-y-2"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[rgba(255,193,5,.1)] to-transparent" />
                
                <div className="relative space-y-4">
                  <div className="text-5xl">{game.icon}</div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                    <p className="text-[#7a93b4] text-sm mb-3">{game.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      game.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300' :
                      game.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {game.difficulty}
                    </span>
                    <span className="text-xs text-[#7a93b4] bg-[rgba(255,193,5,.1)] px-2 py-1 rounded">
                      {game.category}
                    </span>
                  </div>

                  {game.highScore ? (
                    <div className="flex items-center gap-2 pt-3 border-t border-[rgba(255,193,5,.1)]">
                      <Trophy className="h-4 w-4 text-[#ffc105]" />
                      <span className="text-sm text-[#ffc105] font-semibold">
                        High Score: {game.highScore}
                      </span>
                    </div>
                  ) : null}

                  <button
                    onClick={() => setActiveGameId(game.id)}
                    className="w-full mt-4 bg-[#ffc105] hover:bg-[#ffcf3a] text-[#080f1c] rounded-lg px-4 py-2 font-bold uppercase tracking-[.05em] transition-all hover:shadow-[0_0_20px_rgba(255,193,5,.4)]"
                  >
                    Play Game
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Math Practice Tab */}
        {activeTab === 'math-practice' && (
          <div className="space-y-6">
            <div className="grid gap-6">
              {filteredMathPractices.map((practice) => (
                <div
                  key={practice.id}
                  className="group relative bg-gradient-to-r from-[rgba(255,193,5,.08)] to-[rgba(73,122,182,.08)] border border-[rgba(255,193,5,.15)] rounded-xl p-6 hover:border-[rgba(255,193,5,.3)] transition-all cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-[rgba(255,193,5,.05)] to-transparent" />
                  
                  <div className="relative flex items-start justify-between gap-6">
                    <div className="flex gap-6 flex-1">
                      <div className="text-5xl pt-1 flex-shrink-0">{practice.icon}</div>
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">{practice.title}</h3>
                          <p className="text-[#7a93b4]">{practice.description}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span className={`px-3 py-1 rounded-full font-semibold ${
                            practice.difficulty === 'Easy' ? 'bg-green-500/20 text-green-300' :
                            practice.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-red-500/20 text-red-300'
                          }`}>
                            {practice.difficulty}
                          </span>
                          <span className="flex items-center gap-1 text-[#7a93b4]">
                            <BookOpen className="h-4 w-4" /> {practice.problemCount} Problems
                          </span>
                          <span className="flex items-center gap-1 text-[#7a93b4]">
                            <Clock className="h-4 w-4" /> {practice.estimatedTime} min
                          </span>
                          <span className="text-xs text-[#ffc105] bg-[rgba(255,193,5,.1)] px-2 py-1 rounded">
                            {practice.topic}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setActivePracticeId(practice.id)}
                      className="flex-shrink-0 bg-[#ffc105] hover:bg-[#ffcf3a] text-[#080f1c] rounded-lg px-6 py-3 font-bold uppercase tracking-[.05em] transition-all hover:-translate-y-1 flex items-center gap-2 group/btn"
                    >
                      Start
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Learning Stats */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Your Learning Stats</h2>
              
              {[
                { label: 'Quiz Completion Rate', value: '85%', color: 'from-green-500 to-emerald-500' },
                { label: 'Game Performance', value: '92%', color: 'from-blue-500 to-cyan-500' },
                { label: 'Topics Mastered', value: '12/20', color: 'from-purple-500 to-pink-500' },
                { label: 'Study Consistency', value: '78%', color: 'from-orange-500 to-red-500' },
              ].map((stat, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#7a93b4] font-semibold">{stat.label}</span>
                    <span className="text-white font-bold">{stat.value}</span>
                  </div>
                  <div className="h-2 bg-[rgba(255,193,5,.1)] rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                      style={{
                        width: `${parseInt(stat.value.match(/\d+/)?.[0] || '0')}%`,
                        transition: 'width 1s ease-in-out',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Quiz & Practice Results */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Quiz & Practice Results</h2>
              
              <div className="space-y-3">
                {quizResults.length === 0 && practiceResults.length === 0 ? (
                  <p className="text-[#7a93b4] text-center py-8">
                    No results yet. Complete a quiz or practice session to see your grades here!
                  </p>
                ) : (
                  <>
                    {quizResults.map((result, idx) => {
                      const quizData = quizzes.find(q => q.id === result.quizId);
                      const gradeColor = 
                        result.grade === 'A' ? 'text-green-400' :
                        result.grade === 'B' ? 'text-blue-400' :
                        result.grade === 'C' ? 'text-yellow-400' :
                        result.grade === 'D' ? 'text-orange-400' :
                        'text-red-400';
                      
                      return (
                        <div
                          key={`quiz-${idx}`}
                          className="flex items-center justify-between p-4 bg-[rgba(255,193,5,.08)] border border-[rgba(255,193,5,.15)] rounded-lg hover:border-[rgba(255,193,5,.3)] transition-all"
                        >
                          <div>
                            <p className="text-white font-semibold">{quizData?.title || 'Quiz'}</p>
                            <p className="text-[#7a93b4] text-sm">Quiz · {result.score}/{result.totalQuestions}</p>
                          </div>
                          <div className="text-center">
                            <div className={`text-3xl font-black ${gradeColor}`}>
                              {result.grade}
                            </div>
                            <div className="text-[#7a93b4] text-xs font-semibold mt-1">
                              {Math.round((result.score / result.totalQuestions) * 100)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {practiceResults.map((result, idx) => {
                      const practiceData = mathPractices.find(p => p.id === result.practiceId);
                      const gradeColor = 
                        result.grade === 'A' ? 'text-green-400' :
                        result.grade === 'B' ? 'text-blue-400' :
                        result.grade === 'C' ? 'text-yellow-400' :
                        result.grade === 'D' ? 'text-orange-400' :
                        'text-red-400';
                      
                      return (
                        <div
                          key={`practice-${idx}`}
                          className="flex items-center justify-between p-4 bg-[rgba(255,193,5,.08)] border border-[rgba(255,193,5,.15)] rounded-lg hover:border-[rgba(255,193,5,.3)] transition-all"
                        >
                          <div>
                            <p className="text-white font-semibold">{practiceData?.title || 'Practice'}</p>
                            <p className="text-[#7a93b4] text-sm">Practice · {result.score}/{result.totalProblems}</p>
                          </div>
                          <div className="text-center">
                            <div className={`text-3xl font-black ${gradeColor}`}>
                              {result.grade}
                            </div>
                            <div className="text-[#7a93b4] text-xs font-semibold mt-1">
                              {Math.round((result.score / result.totalProblems) * 100)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="relative bg-gradient-to-r from-[rgba(255,193,5,.15)] to-[rgba(73,122,182,.15)] border border-[rgba(255,193,5,.2)] rounded-2xl p-12 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#ffc105] rounded-full mix-blend-screen filter blur-3xl" />
          </div>
          
          <div className="relative space-y-6">
            <h2 className="text-4xl font-bold text-white">
              Ready to <span className="text-[#ffc105]">Level Up</span> Your Learning?
            </h2>
            <p className="text-lg text-[#7a93b4] max-w-2xl mx-auto">
              Start with a quiz or jump into a game. Track your progress and climb the leaderboards!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => setActiveTab('quizzes')}
                className="bg-[#ffc105] hover:bg-[#ffcf3a] text-[#080f1c] px-8 py-4 rounded-lg font-bold uppercase tracking-[.05em] transition-all hover:shadow-[0_0_30px_rgba(255,193,5,.4)]"
              >
                Start a Quiz
              </button>
              <button
                onClick={() => setActiveTab('games')}
                className="border-2 border-[#ffc105] text-[#ffc105] hover:bg-[rgba(255,193,5,.1)] px-8 py-4 rounded-lg font-bold uppercase tracking-[.05em] transition-all"
              >
                Play a Game
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
