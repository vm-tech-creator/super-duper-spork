export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export interface EducationQuiz {
  id: string;
  title: string;
  description: string;
  subject: 'math' | 'ela' | 'science' | 'history';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration: number;
  icon: string;
  questions: QuizQuestion[];
}

export const educationQuizzes: EducationQuiz[] = [
  {
    id: 'math-algebra',
    title: 'Algebra Fundamentals',
    description: 'Master basic algebraic equations and expressions',
    subject: 'math',
    difficulty: 'Medium',
    duration: 15,
    icon: '🧮',
    questions: [
      { question: 'Solve for x: x + 7 = 15', options: ['6', '7', '8', '9'], correct: 2 },
      { question: 'What is 3x when x = 4?', options: ['7', '10', '12', '16'], correct: 2 },
      { question: 'Simplify: 2x + 3x', options: ['5x', '6x', '5x²', '6'], correct: 0 },
      { question: 'Solve for x: 2x = 18', options: ['6', '8', '9', '10'], correct: 2 },
      { question: 'What is the value of x² when x = 5?', options: ['10', '15', '20', '25'], correct: 3 },
    ],
  },
  {
    id: 'math-geometry',
    title: 'Geometry Basics',
    description: 'Test your knowledge of shapes, angles, and areas',
    subject: 'math',
    difficulty: 'Easy',
    duration: 12,
    icon: '📐',
    questions: [
      { question: 'How many sides does a hexagon have?', options: ['5', '6', '7', '8'], correct: 1 },
      { question: 'What is the sum of angles in a triangle?', options: ['90°', '180°', '270°', '360°'], correct: 1 },
      { question: 'What is the area of a rectangle 4 × 6?', options: ['10', '20', '24', '28'], correct: 2 },
      { question: 'A right angle measures how many degrees?', options: ['45°', '60°', '90°', '180°'], correct: 2 },
      { question: 'How many vertices does a cube have?', options: ['6', '8', '10', '12'], correct: 1 },
    ],
  },
  {
    id: 'math-fractions',
    title: 'Fractions & Decimals',
    description: 'Practice working with fractions and decimal operations',
    subject: 'math',
    difficulty: 'Medium',
    duration: 18,
    icon: '➗',
    questions: [
      { question: 'What is 1/2 + 1/4?', options: ['1/6', '2/6', '3/4', '1'], correct: 2 },
      { question: 'Convert 0.75 to a fraction', options: ['1/4', '2/3', '3/4', '4/5'], correct: 2 },
      { question: 'What is 3/5 as a decimal?', options: ['0.3', '0.5', '0.6', '0.75'], correct: 2 },
      { question: 'Which is larger: 2/3 or 3/5?', options: ['2/3', '3/5', 'They are equal', 'Cannot tell'], correct: 0 },
      { question: 'What is 1/3 of 12?', options: ['3', '4', '6', '9'], correct: 1 },
    ],
  },
  {
    id: 'math-advanced',
    title: 'Advanced Calculus',
    description: 'Challenge yourself with advanced mathematical concepts',
    subject: 'math',
    difficulty: 'Hard',
    duration: 25,
    icon: '∫',
    questions: [
      { question: 'What is the derivative of x²?', options: ['x', '2x', 'x²', '2'], correct: 1 },
      { question: 'What is the limit of (x² - 1)/(x - 1) as x → 1?', options: ['0', '1', '2', 'Undefined'], correct: 2 },
      { question: 'What is ∫ 2x dx?', options: ['x', 'x²', 'x² + C', '2x²'], correct: 2 },
      { question: 'What is the derivative of sin(x)?', options: ['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'], correct: 0 },
      { question: 'What is the slope of y = 3x + 2?', options: ['2', '3', '5', 'x'], correct: 1 },
    ],
  },
  {
    id: 'ela-grammar',
    title: 'Grammar Mastery',
    description: 'Improve your grammar skills with comprehensive questions',
    subject: 'ela',
    difficulty: 'Easy',
    duration: 14,
    icon: '✏️',
    questions: [
      { question: 'Which sentence is correct?', options: ['She go to school', 'She goes to school', 'She going to school', 'She gone to school'], correct: 1 },
      { question: 'What is the plural of "child"?', options: ['childs', 'children', 'childes', 'childrens'], correct: 1 },
      { question: 'Which word is an adjective?', options: ['Quickly', 'Beautiful', 'Run', 'Happiness'], correct: 1 },
      { question: 'Choose the correct punctuation:', options: ['Its a nice day', "It's a nice day", 'Its\' a nice day', 'It is a nice day.'], correct: 1 },
      { question: 'What is the past tense of "write"?', options: ['writed', 'wrote', 'written', 'writing'], correct: 1 },
    ],
  },
  {
    id: 'ela-vocab',
    title: 'Vocabulary Builder',
    description: 'Expand your vocabulary with challenging word problems',
    subject: 'ela',
    difficulty: 'Medium',
    duration: 20,
    icon: '📖',
    questions: [
      { question: 'What does "benevolent" mean?', options: ['Cruel', 'Kind and generous', 'Confused', 'Lazy'], correct: 1 },
      { question: 'Which is a synonym for "enormous"?', options: ['Tiny', 'Gigantic', 'Average', 'Narrow'], correct: 1 },
      { question: 'What does "ambiguous" mean?', options: ['Very clear', 'Open to interpretation', 'Extremely loud', 'Completely false'], correct: 1 },
      { question: 'Which word means "to make worse"?', options: ['Alleviate', 'Exacerbate', 'Illuminate', 'Celebrate'], correct: 1 },
      { question: 'What is an antonym of "ancient"?', options: ['Old', 'Modern', 'Historic', 'Traditional'], correct: 1 },
    ],
  },
  {
    id: 'science-biology',
    title: 'Biology Essentials',
    description: 'Learn about living organisms and life processes',
    subject: 'science',
    difficulty: 'Medium',
    duration: 16,
    icon: '🧬',
    questions: [
      { question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Cell wall'], correct: 2 },
      { question: 'Which organ pumps blood through the body?', options: ['Lungs', 'Liver', 'Heart', 'Kidney'], correct: 2 },
      { question: 'What do plants release during photosynthesis?', options: ['Carbon dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'], correct: 2 },
      { question: 'DNA stands for:', options: ['Deoxyribonucleic acid', 'Dynamic nuclear acid', 'Dual nucleotide array', 'Dense nucleic atom'], correct: 0 },
      { question: 'Which blood type is known as the universal donor?', options: ['A', 'B', 'AB', 'O negative'], correct: 3 },
    ],
  },
  {
    id: 'history-world',
    title: 'World History',
    description: 'Test your knowledge of major historical events',
    subject: 'history',
    difficulty: 'Hard',
    duration: 30,
    icon: '🌍',
    questions: [
      { question: 'When did World War I begin?', options: ['1912', '1914', '1916', '1918'], correct: 1 },
      { question: 'Who discovered America in 1492?', options: ['Magellan', 'Columbus', 'Vespucci', 'Cook'], correct: 1 },
      { question: 'The Great Wall is located in which country?', options: ['Japan', 'India', 'China', 'Korea'], correct: 2 },
      { question: 'Who was the first person to walk on the Moon?', options: ['Buzz Aldrin', 'Neil Armstrong', 'Yuri Gagarin', 'John Glenn'], correct: 1 },
      { question: 'The Renaissance began in which country?', options: ['France', 'England', 'Italy', 'Germany'], correct: 2 },
    ],
  },
];

export function getEducationQuizById(id: string): EducationQuiz | undefined {
  return educationQuizzes.find((quiz) => quiz.id === id);
}
