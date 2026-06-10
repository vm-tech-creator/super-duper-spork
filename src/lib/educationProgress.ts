/**
 * Education Progress Tracking
 * Manages user progress in learning mode with local storage backup
 */

export interface EducationProgress {
  mode: 'learning';
  enrollmentDate: string;
  lastAccessDate: string;
  completedCourses: string[];
  coursesInProgress: string[];
  totalHoursSpent: number;
  quizzesTaken: number;
  quizzesAverage: number;
  achievements: string[];
  bookmarkedResources: string[];
}

const STORAGE_KEY = 'sahara_education_progress';

export function getEducationProgress(): EducationProgress {
  if (typeof window === 'undefined') return getDefaultProgress();
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : getDefaultProgress();
  } catch (error) {
    console.error('Failed to load education progress:', error);
    return getDefaultProgress();
  }
}

export function saveEducationProgress(progress: EducationProgress): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save education progress:', error);
  }
}

export function initializeEducationProgress(): EducationProgress {
  const progress: EducationProgress = {
    mode: 'learning',
    enrollmentDate: new Date().toISOString(),
    lastAccessDate: new Date().toISOString(),
    completedCourses: [],
    coursesInProgress: [],
    totalHoursSpent: 0,
    quizzesTaken: 0,
    quizzesAverage: 0,
    achievements: [],
    bookmarkedResources: [],
  };
  
  saveEducationProgress(progress);
  return progress;
}

export function updateLastAccessDate(): void {
  const progress = getEducationProgress();
  progress.lastAccessDate = new Date().toISOString();
  saveEducationProgress(progress);
}

export function addCompletedCourse(courseId: string): void {
  const progress = getEducationProgress();
  if (!progress.completedCourses.includes(courseId)) {
    progress.completedCourses.push(courseId);
    progress.coursesInProgress = progress.coursesInProgress.filter(id => id !== courseId);
  }
  saveEducationProgress(progress);
}

export function addCourseInProgress(courseId: string): void {
  const progress = getEducationProgress();
  if (!progress.coursesInProgress.includes(courseId)) {
    progress.coursesInProgress.push(courseId);
  }
  saveEducationProgress(progress);
}

export function updateQuizScore(score: number): void {
  const progress = getEducationProgress();
  progress.quizzesTaken += 1;
  progress.quizzesAverage = 
    (progress.quizzesAverage * (progress.quizzesTaken - 1) + score) / progress.quizzesTaken;
  saveEducationProgress(progress);
}

export function addAchievement(achievementId: string): void {
  const progress = getEducationProgress();
  if (!progress.achievements.includes(achievementId)) {
    progress.achievements.push(achievementId);
  }
  saveEducationProgress(progress);
}

export function addBookmarkedResource(resourceId: string): void {
  const progress = getEducationProgress();
  if (!progress.bookmarkedResources.includes(resourceId)) {
    progress.bookmarkedResources.push(resourceId);
  }
  saveEducationProgress(progress);
}

export function removeBookmarkedResource(resourceId: string): void {
  const progress = getEducationProgress();
  progress.bookmarkedResources = progress.bookmarkedResources.filter(id => id !== resourceId);
  saveEducationProgress(progress);
}

export function addHoursSpent(hours: number): void {
  const progress = getEducationProgress();
  progress.totalHoursSpent += hours;
  saveEducationProgress(progress);
}

export function resetEducationProgress(): void {
  localStorage.removeItem(STORAGE_KEY);
}

function getDefaultProgress(): EducationProgress {
  return {
    mode: 'learning',
    enrollmentDate: new Date().toISOString(),
    lastAccessDate: new Date().toISOString(),
    completedCourses: [],
    coursesInProgress: [],
    totalHoursSpent: 0,
    quizzesTaken: 0,
    quizzesAverage: 0,
    achievements: [],
    bookmarkedResources: [],
  };
}
