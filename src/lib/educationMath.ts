export type GradeLevel = 'Elementary' | 'Middle' | 'High' | 'College';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface MathProblem {
  question: string;
  answer: string;
  options: string[];
  correctIndex: number;
}

export interface MathGame {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: string;
  icon: string;
  timeLimit: number;
  pointsPerCorrect: number;
}

export interface MathPractice {
  id: string;
  title: string;
  description: string;
  topic: string;
  gradeLevel: GradeLevel;
  difficulty: Difficulty;
  problemCount: number;
  icon: string;
  estimatedTime: number;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

function makeMultipleChoice(correctAnswer: string | number): Pick<MathProblem, 'options' | 'correctIndex'> {
  const correct = String(correctAnswer);
  const numeric = Number(correctAnswer);
  const distractors = new Set<string>();

  if (!Number.isNaN(numeric)) {
    while (distractors.size < 3) {
      const offset = randInt(-8, 8) || randInt(1, 4);
      distractors.add(String(numeric + offset));
    }
  } else {
    const fallbacks = ['10', '12', '15', '20', '25', '30'];
    while (distractors.size < 3) {
      distractors.add(fallbacks[randInt(0, fallbacks.length - 1)]);
    }
  }

  distractors.delete(correct);
  const options = shuffle([correct, ...Array.from(distractors).slice(0, 3)]);
  return { options, correctIndex: options.indexOf(correct) };
}

function buildProblem(question: string, answer: string | number): MathProblem {
  const { options, correctIndex } = makeMultipleChoice(answer);
  return { question, answer: String(answer), options, correctIndex };
}

function generateAddition(): MathProblem {
  const a = randInt(1, 50);
  const b = randInt(1, 50);
  return buildProblem(`What is ${a} + ${b}?`, a + b);
}

function generateSubtraction(): MathProblem {
  const a = randInt(10, 99);
  const b = randInt(1, a);
  return buildProblem(`What is ${a} − ${b}?`, a - b);
}

function generateMultiplication(): MathProblem {
  const a = randInt(2, 12);
  const b = randInt(2, 12);
  return buildProblem(`What is ${a} × ${b}?`, a * b);
}

function generateDivision(): MathProblem {
  const b = randInt(2, 12);
  const quotient = randInt(2, 12);
  const a = b * quotient;
  return buildProblem(`What is ${a} ÷ ${b}?`, quotient);
}

function generateFraction(): MathProblem {
  const num = randInt(1, 9);
  const den = randInt(num + 1, 12);
  const whole = randInt(1, 5);
  const answer = Number((whole + num / den).toFixed(2));
  return buildProblem(`What is ${whole} + ${num}/${den}? (round to 2 decimals)`, answer);
}

function generatePreAlgebra(): MathProblem {
  const x = randInt(2, 15);
  const coeff = randInt(2, 9);
  const result = coeff * x;
  return buildProblem(`Solve for x: ${coeff}x = ${result}`, x);
}

function generateRatio(): MathProblem {
  const a = randInt(2, 8);
  const b = randInt(2, 8);
  const multiplier = randInt(2, 6);
  return buildProblem(`If the ratio is ${a}:${b}, what is ${a * multiplier}?`, a * multiplier);
}

function generateGeometry(): MathProblem {
  const side = randInt(3, 12);
  return buildProblem(`What is the area of a square with side ${side}?`, side * side);
}

function generateAlgebra(): MathProblem {
  const x = randInt(2, 12);
  const b = randInt(1, 20);
  const result = 2 * x + b;
  return buildProblem(`Solve for x: 2x + ${b} = ${result}`, x);
}

function generateTrigonometry(): MathProblem {
  const problems = [
    buildProblem('What is sin(30°)? (decimal)', 0.5),
    buildProblem('What is cos(60°)? (decimal)', 0.5),
    buildProblem('What is tan(45°)? (decimal)', 1),
  ];
  return problems[randInt(0, problems.length - 1)];
}

function generateCalculus(): MathProblem {
  const problems = [
    buildProblem('What is the derivative of x³?', '3x²'),
    buildProblem('What is the derivative of 5x?', 5),
    buildProblem('What is ∫ 1 dx?', 'x'),
  ];
  return problems[randInt(0, problems.length - 1)];
}

function generateLinearAlgebra(): MathProblem {
  const problems = [
    buildProblem('What is the determinant of [[2,0],[0,3]]?', 6),
    buildProblem('How many rows does a 3×2 matrix have?', 3),
    buildProblem('What is 2 × [[1,2],[3,4]] entry (1,1)?', 2),
  ];
  return problems[randInt(0, problems.length - 1)];
}

const practiceGenerators: Record<string, () => MathProblem> = {
  'elem-addition': generateAddition,
  'elem-subtraction': generateSubtraction,
  'elem-multiplication': generateMultiplication,
  'elem-division': generateDivision,
  'middle-fractions': generateFraction,
  'middle-prealgebra': generatePreAlgebra,
  'middle-ratios': generateRatio,
  'middle-geometry': generateGeometry,
  'high-algebra1': generateAlgebra,
  'high-geometry': generateGeometry,
  'high-trigonometry': generateTrigonometry,
  'college-calculus': generateCalculus,
  'college-linearalgebra': generateLinearAlgebra,
};

const gameGenerators: Record<string, () => MathProblem> = {
  'math-blaster': () => (Math.random() > 0.5 ? generateAddition() : generateSubtraction()),
  'number-ninja': generateMultiplication,
  'fraction-quest': generateFraction,
  'geometry-builder': generateGeometry,
  'algebra-quest': generateAlgebra,
  'calculus-challenge': generateCalculus,
};

export const educationMathGames: MathGame[] = [
  {
    id: 'math-blaster',
    title: 'Math Blaster',
    description: 'Blast through math problems in an arcade-style game',
    difficulty: 'Easy',
    category: 'Arithmetic',
    icon: '🚀',
    timeLimit: 60,
    pointsPerCorrect: 100,
  },
  {
    id: 'number-ninja',
    title: 'Number Ninja',
    description: 'Quick-fire math challenges to test your speed',
    difficulty: 'Medium',
    category: 'Speed Challenge',
    icon: '🥋',
    timeLimit: 45,
    pointsPerCorrect: 150,
  },
  {
    id: 'fraction-quest',
    title: 'Fraction Quest',
    description: 'Master fractions through adventure gameplay',
    difficulty: 'Medium',
    category: 'Fractions',
    icon: '⚔️',
    timeLimit: 50,
    pointsPerCorrect: 125,
  },
  {
    id: 'geometry-builder',
    title: 'Geometry Builder',
    description: 'Create and explore geometric shapes and patterns',
    difficulty: 'Easy',
    category: 'Geometry',
    icon: '📐',
    timeLimit: 55,
    pointsPerCorrect: 100,
  },
  {
    id: 'algebra-quest',
    title: 'Algebra Quest',
    description: 'Solve algebraic equations to progress through levels',
    difficulty: 'Hard',
    category: 'Algebra',
    icon: '🧮',
    timeLimit: 60,
    pointsPerCorrect: 200,
  },
  {
    id: 'calculus-challenge',
    title: 'Calculus Challenge',
    description: 'Advanced math puzzle for the most dedicated learners',
    difficulty: 'Hard',
    category: 'Advanced Math',
    icon: '∑',
    timeLimit: 60,
    pointsPerCorrect: 250,
  },
];

export const educationMathPractices: MathPractice[] = [
  {
    id: 'elem-addition',
    title: 'Addition Basics',
    description: 'Practice addition with single and double-digit numbers',
    topic: 'Arithmetic',
    gradeLevel: 'Elementary',
    difficulty: 'Easy',
    problemCount: 10,
    icon: '➕',
    estimatedTime: 10,
  },
  {
    id: 'elem-subtraction',
    title: 'Subtraction Practice',
    description: 'Master subtraction with regrouping',
    topic: 'Arithmetic',
    gradeLevel: 'Elementary',
    difficulty: 'Easy',
    problemCount: 10,
    icon: '➖',
    estimatedTime: 10,
  },
  {
    id: 'elem-multiplication',
    title: 'Multiplication Times Tables',
    description: 'Build fluency with multiplication facts',
    topic: 'Multiplication',
    gradeLevel: 'Elementary',
    difficulty: 'Medium',
    problemCount: 10,
    icon: '✖️',
    estimatedTime: 15,
  },
  {
    id: 'elem-division',
    title: 'Division Practice',
    description: 'Learn division as inverse of multiplication',
    topic: 'Division',
    gradeLevel: 'Elementary',
    difficulty: 'Medium',
    problemCount: 10,
    icon: '➗',
    estimatedTime: 12,
  },
  {
    id: 'middle-fractions',
    title: 'Fractions & Decimals',
    description: 'Work with fractions, decimals, and percentages',
    topic: 'Fractions',
    gradeLevel: 'Middle',
    difficulty: 'Medium',
    problemCount: 10,
    icon: '⅝',
    estimatedTime: 15,
  },
  {
    id: 'middle-prealgebra',
    title: 'Pre-Algebra Fundamentals',
    description: 'Introduction to variables and simple equations',
    topic: 'Algebra',
    gradeLevel: 'Middle',
    difficulty: 'Medium',
    problemCount: 10,
    icon: '🔤',
    estimatedTime: 12,
  },
  {
    id: 'middle-ratios',
    title: 'Ratios & Proportions',
    description: 'Understand relationships between quantities',
    topic: 'Ratios',
    gradeLevel: 'Middle',
    difficulty: 'Medium',
    problemCount: 10,
    icon: '⚖️',
    estimatedTime: 14,
  },
  {
    id: 'middle-geometry',
    title: 'Geometry Basics',
    description: 'Learn about shapes, angles, and area',
    topic: 'Geometry',
    gradeLevel: 'Middle',
    difficulty: 'Medium',
    problemCount: 10,
    icon: '📐',
    estimatedTime: 13,
  },
  {
    id: 'high-algebra1',
    title: 'Algebra I',
    description: 'Equations, inequalities, and functions',
    topic: 'Algebra',
    gradeLevel: 'High',
    difficulty: 'Hard',
    problemCount: 10,
    icon: '🧮',
    estimatedTime: 20,
  },
  {
    id: 'high-geometry',
    title: 'Geometry Proofs',
    description: 'Master geometric theorems and proofs',
    topic: 'Geometry',
    gradeLevel: 'High',
    difficulty: 'Hard',
    problemCount: 10,
    icon: '△',
    estimatedTime: 18,
  },
  {
    id: 'high-trigonometry',
    title: 'Trigonometry',
    description: 'Sine, cosine, tangent, and applications',
    topic: 'Trigonometry',
    gradeLevel: 'High',
    difficulty: 'Hard',
    problemCount: 10,
    icon: '〰️',
    estimatedTime: 22,
  },
  {
    id: 'college-calculus',
    title: 'Calculus I',
    description: 'Limits, derivatives, and integrals',
    topic: 'Calculus',
    gradeLevel: 'College',
    difficulty: 'Hard',
    problemCount: 10,
    icon: '∫',
    estimatedTime: 25,
  },
  {
    id: 'college-linearalgebra',
    title: 'Linear Algebra',
    description: 'Matrices, vectors, and linear transformations',
    topic: 'Linear Algebra',
    gradeLevel: 'College',
    difficulty: 'Hard',
    problemCount: 10,
    icon: '⬚',
    estimatedTime: 24,
  },
];

export function getMathGameById(id: string): MathGame | undefined {
  return educationMathGames.find((game) => game.id === id);
}

export function getMathPracticeById(id: string): MathPractice | undefined {
  return educationMathPractices.find((practice) => practice.id === id);
}

export function generateGameProblem(gameId: string): MathProblem {
  const generator = gameGenerators[gameId] ?? generateAddition;
  return generator();
}

export function generatePracticeProblems(practiceId: string, count: number): MathProblem[] {
  const generator = practiceGenerators[practiceId] ?? generateAddition;
  return Array.from({ length: count }, () => generator());
}

export function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '');
}

export function isAnswerCorrect(userAnswer: string, correctAnswer: string): boolean {
  const normalizedUser = normalizeAnswer(userAnswer);
  const normalizedCorrect = normalizeAnswer(correctAnswer);

  if (normalizedUser === normalizedCorrect) {
    return true;
  }

  const userNumber = Number(normalizedUser);
  const correctNumber = Number(normalizedCorrect);

  if (!Number.isNaN(userNumber) && !Number.isNaN(correctNumber)) {
    return Math.abs(userNumber - correctNumber) < 0.01;
  }

  return false;
}
