// Sand Dollars utility functions
export const SAND_DOLLARS_KEY = 'sandDollars';

export const getSandDollars = (): number => {
  if (typeof window === 'undefined') return 500; // Default for SSR
  const stored = localStorage.getItem(SAND_DOLLARS_KEY);
  return stored ? parseInt(stored) : 500; // Start with 500
};

export const setSandDollars = (amount: number): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SAND_DOLLARS_KEY, Math.max(0, amount).toString());
};

export const addSandDollars = (amount: number): number => {
  const current = getSandDollars();
  const newAmount = current + amount;
  setSandDollars(newAmount);
  return newAmount;
};

export const spendSandDollars = (amount: number): boolean => {
  const current = getSandDollars();
  if (current >= amount) {
    setSandDollars(current - amount);
    return true;
  }
  return false;
};

// Game-specific coin earning functions
export const calculatePacManCoins = (score: number, won: boolean): number => {
  if (won) {
    // Bonus for winning
    return Math.floor(score / 10) + 50; // Base score bonus + win bonus
  }
  // Partial score for losing
  return Math.floor(score / 20); // Half the normal rate
};

export const calculateSpaceCoins = (mission: string, success: boolean): number => {
  const baseRewards = {
    'launch': success ? 100 : 25,
    'orbit': success ? 150 : 50,
    'landing': success ? 200 : 75,
    'return': success ? 250 : 100,
  };
  return baseRewards[mission as keyof typeof baseRewards] || 50;
};

export const calculateCatBounceCoins = (score: number): number => {
  return Math.floor(score / 5); // 1 coin per 5 points
};

export const calculateElonFortuneCoins = (correctAnswers: number, totalQuestions: number): number => {
  const percentage = correctAnswers / totalQuestions;
  if (percentage >= 0.8) return 100; // Excellent
  if (percentage >= 0.6) return 75; // Good
  if (percentage >= 0.4) return 50; // Okay
  return 25; // Needs improvement
};

export const calculateEndlessHorseCoins = (distance: number): number => {
  return Math.floor(distance / 10); // 1 coin per 10 units
};

export const calculateFindCowCoins = (timeTaken: number): number => {
  // Faster = more coins, max 100, min 10
  const baseTime = 30; // seconds
  const timeBonus = Math.max(0, baseTime - timeTaken);
  return Math.min(100, Math.max(10, 50 + timeBonus * 2));
};

export const calculateHackerTyperCoins = (wpm: number): number => {
  return Math.floor(wpm * 2); // 2 coins per WPM
};

export const calculateMusicQuizCoins = (correctAnswers: number, totalQuestions: number): number => {
  const percentage = correctAnswers / totalQuestions;
  return Math.floor(percentage * 100); // Direct percentage
};

export const calculatePasswordTesterCoins = (score: number): number => {
  return Math.floor(score / 10); // 1 coin per 10 points
};

export const calculatePointingPointerCoins = (accuracy: number): number => {
  return Math.floor(accuracy * 2); // 2 coins per percentage point
};

export const calculateWeirdBooksCoins = (booksRead: number): number => {
  return booksRead * 25; // 25 coins per book
};

export const calculateRocketCoins = (success: boolean, parts: number): number => {
  if (success) {
    return 75 + (parts * 10); // Base + bonus per part used
  }
  return 25; // Small reward for trying
};

export const calculateInteractiveCoins = (gameType: string): number => {
  const rewards = {
    'pointing': 25,
    'horse': 25,
    'cow': 25,
    'password': 25,
    'cat': 25,
    'hacker': 25,
    'elon': 50, // More complex
    'music': 50,
    'books': 25,
  };
  return rewards[gameType as keyof typeof rewards] || 25;
};