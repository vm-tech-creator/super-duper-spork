'use client';

import { useState, useRef, useEffect } from 'react';
import { Settings, Globe, BookOpen, Download, Trash2, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getEducationProgress, resetEducationProgress } from '@/lib/educationProgress';

export default function SettingsMenu() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showEducationStats, setShowEducationStats] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' },
    { code: 'ar', name: 'العربية' },
  ] as const;

  const educationProgress = getEducationProgress();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleExportProgress = () => {
    const dataStr = JSON.stringify(educationProgress, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sahara-education-progress-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all your education progress? This cannot be undone.')) {
      resetEducationProgress();
      setShowEducationStats(false);
      window.location.reload();
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition-all duration-300 hover:border-[var(--gold)] hover:bg-[var(--surface-elevated)]"
        aria-label="Settings menu"
        title="Settings & Languages"
      >
        <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-[var(--border)] bg-[var(--bg2)]/95 shadow-xl backdrop-blur-2xl z-50">
          {/* Languages Section */}
          <div className="border-b border-[var(--border)] p-4">
            <div className="mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4 text-[var(--gold)]" />
              <h3 className="text-xs font-bold uppercase text-[var(--text)]">Languages</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as any);
                    setIsOpen(false);
                  }}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                    language === lang.code
                      ? 'bg-[var(--gold)] text-[var(--bg)] shadow-md'
                      : 'bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-elevated)]'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Education Progress Section */}
          <div className="p-4">
            <button
              onClick={() => setShowEducationStats(!showEducationStats)}
              className="w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface)]"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[var(--gold)]" />
                Education Progress
              </span>
              <ChevronDown
                className="h-4 w-4 transition-transform"
                style={{ transform: showEducationStats ? 'rotate(180deg)' : 'rotate(0)' }}
              />
            </button>

            {showEducationStats && (
              <div className="mt-3 space-y-3 rounded-lg bg-[var(--surface)] p-3 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <p className="text-xs text-[var(--muted)]">Completed Courses</p>
                    <p className="text-lg font-bold text-[var(--gold)]">
                      {educationProgress.completedCourses.length}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-[var(--muted)]">In Progress</p>
                    <p className="text-lg font-bold text-[var(--gold)]">
                      {educationProgress.coursesInProgress.length}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-[var(--muted)]">Hours Spent</p>
                    <p className="text-lg font-bold text-[var(--gold)]">
                      {educationProgress.totalHoursSpent.toFixed(1)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-[var(--muted)]">Quizzes Taken</p>
                    <p className="text-lg font-bold text-[var(--gold)]">
                      {educationProgress.quizzesTaken}
                    </p>
                  </div>
                </div>

                {educationProgress.quizzesTaken > 0 && (
                  <div className="space-y-1 border-t border-[var(--border)] pt-3">
                    <p className="text-xs text-[var(--muted)]">Quiz Average</p>
                    <p className="text-lg font-bold text-[var(--gold)]">
                      {educationProgress.quizzesAverage.toFixed(1)}%
                    </p>
                  </div>
                )}

                <div className="flex gap-2 border-t border-[var(--border)] pt-3">
                  <button
                    onClick={handleExportProgress}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[var(--gold)] px-3 py-2 text-xs font-semibold text-[var(--bg)] transition-all hover:bg-[var(--gold-dim)]"
                  >
                    <Download className="h-3 w-3" />
                    Export
                  </button>
                  <button
                    onClick={handleResetProgress}
                    className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-500/20 px-3 py-2 text-xs font-semibold text-red-400 transition-all hover:bg-red-500/30"
                  >
                    <Trash2 className="h-3 w-3" />
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
