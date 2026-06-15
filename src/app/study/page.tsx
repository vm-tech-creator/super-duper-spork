'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, CheckCircle, Clock, Target, GraduationCap } from 'lucide-react';

export default function StudyPage() {
  const [gradeLevel, setGradeLevel] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const subjects = [
    { id: 'math', name: 'Mathematics', icon: '📐', color: '#4ade80' },
    { id: 'ela', name: 'English Language Arts', icon: '📚', color: '#60a5fa' },
    { id: 'science', name: 'Science', icon: '🔬', color: '#f472b6' },
    { id: 'social', name: 'Social Studies', icon: '🌍', color: '#fbbf24' },
  ];

  const gradeLevels = [
    { id: 'k-2', name: 'Grades K-2', description: 'Early elementary - ages 5-8' },
    { id: '3-5', name: 'Grades 3-5', description: 'Upper elementary - ages 8-11' },
    { id: '6-8', name: 'Grades 6-8', description: 'Middle school - ages 11-14' },
    { id: '9-12', name: 'Grades 9-12', description: 'High school - ages 14-18' },
  ];

  const assignments = {
    'k-2': {
      math: [
        {
          id: 'math1',
          title: 'Counting & Numbers',
          description: 'Practice counting and basic number recognition',
          questions: [
            { id: 'm1q1', question: 'What comes after 5?', answer: '6' },
            { id: 'm1q2', question: 'Count the fingers on one hand. How many?', answer: '5' },
            { id: 'm1q3', question: 'What is 2 + 3?', answer: '5' },
            { id: 'm1q4', question: 'What number comes before 10?', answer: '9' },
            { id: 'm1q5', question: 'How many sides does a square have?', answer: '4' },
          ],
          time: '10 min',
          points: 25,
        },
        {
          id: 'math2',
          title: 'Shapes & Patterns',
          description: 'Identify shapes and complete patterns',
          questions: [
            { id: 'm2q1', question: 'What shape is a ball?', answer: 'circle' },
            { id: 'm2q2', question: 'How many corners does a triangle have?', answer: '3' },
            { id: 'm2q3', question: 'What comes next: 2, 4, 6, ?', answer: '8' },
            { id: 'm2q4', question: 'What shape has 4 equal sides?', answer: 'square' },
            { id: 'm2q5', question: 'What is 10 - 5?', answer: '5' },
          ],
          time: '12 min',
          points: 25,
        },
      ],
      ela: [
        {
          id: 'ela1',
          title: 'Letter Recognition',
          description: 'Practice identifying letters and sounds',
          questions: [
            { id: 'e1q1', question: 'What letter makes the "buh" sound?', answer: 'b' },
            { id: 'e1q2', question: 'How many letters in the word "cat"?', answer: '3' },
            { id: 'e1q3', question: 'What letter starts the word "apple"?', answer: 'a' },
            { id: 'e1q4', question: 'What letter makes the "sss" sound?', answer: 's' },
            { id: 'e1q5', question: 'What letter ends the word "dog"?', answer: 'g' },
          ],
          time: '10 min',
          points: 25,
        },
        {
          id: 'ela2',
          title: 'Simple Words',
          description: 'Read and spell simple words',
          questions: [
            { id: 'e2q1', question: 'Spell the word for a pet that says "meow"', answer: 'cat' },
            { id: 'e2q2', question: 'What rhymes with "cat"?', answer: 'hat' },
            { id: 'e2q3', question: 'Spell the word for a red fruit', answer: 'apple' },
            { id: 'e2q4', question: 'What word starts with "d" and is a pet?', answer: 'dog' },
            { id: 'e2q5', question: 'Spell the word for the number 3', answer: 'three' },
          ],
          time: '12 min',
          points: 25,
        },
      ],
      science: [
        {
          id: 'sci1',
          title: 'Animals & Nature',
          description: 'Learn about animals and the natural world',
          questions: [
            { id: 's1q1', question: 'What animal says "moo"?', answer: 'cow' },
            { id: 's1q2', question: 'What do plants need to grow?', answer: 'water' },
            { id: 's1q3', question: 'What animal has a long trunk?', answer: 'elephant' },
            { id: 's1q4', question: 'What color is the sun?', answer: 'yellow' },
            { id: 's1q5', question: 'What animal says "woof"?', answer: 'dog' },
          ],
          time: '10 min',
          points: 25,
        },
        {
          id: 'sci2',
          title: 'Weather & Seasons',
          description: 'Understand weather and seasons',
          questions: [
            { id: 's2q1', question: 'What falls from the sky when it rains?', answer: 'rain' },
            { id: 's2q2', question: 'What season is cold and snowy?', answer: 'winter' },
            { id: 's2q3', question: 'What gives us light during the day?', answer: 'sun' },
            { id: 's2q4', question: 'What season is hot?', answer: 'summer' },
            { id: 's2q5', question: 'What appears in the sky at night?', answer: 'moon' },
          ],
          time: '12 min',
          points: 25,
        },
      ],
      social: [
        {
          id: 'soc1',
          title: 'Community Helpers',
          description: 'Learn about people who help us',
          questions: [
            { id: 'so1q1', question: 'Who helps us when we are sick?', answer: 'doctor' },
            { id: 'so1q2', question: 'Who puts out fires?', answer: 'firefighter' },
            { id: 'so1q3', question: 'Who teaches us at school?', answer: 'teacher' },
            { id: 'so1q4', question: 'Who delivers mail?', answer: 'mailman' },
            { id: 'so1q5', question: 'Who helps us cross the street safely?', answer: 'police' },
          ],
          time: '10 min',
          points: 25,
        },
        {
          id: 'soc2',
          title: 'Family & Home',
          description: 'Learn about family and where we live',
          questions: [
            { id: 'so2q1', question: 'Who are your parents?', answer: 'mom and dad' },
            { id: 'so2q2', question: 'Where do you sleep?', answer: 'bed' },
            { id: 'so2q3', question: 'Who cooks food at home?', answer: 'mom' },
            { id: 'so2q4', question: 'What is a house made of?', answer: 'walls' },
            { id: 'so2q5', question: 'Who takes care of you?', answer: 'family' },
          ],
          time: '12 min',
          points: 25,
        },
      ],
    },
    '3-5': {
      math: [
        {
          id: 'math1',
          title: 'Multiplication & Division',
          description: 'Practice multiplication and division facts',
          questions: [
            { id: 'm1q1', question: 'What is 7 × 8?', answer: '56' },
            { id: 'm1q2', question: 'What is 12 × 3?', answer: '36' },
            { id: 'm1q3', question: 'What is 45 ÷ 5?', answer: '9' },
            { id: 'm1q4', question: 'What is 9 × 9?', answer: '81' },
            { id: 'm1q5', question: 'What is 72 ÷ 8?', answer: '9' },
          ],
          time: '15 min',
          points: 25,
        },
        {
          id: 'math2',
          title: 'Fractions & Decimals',
          description: 'Introduction to fractions and decimals',
          questions: [
            { id: 'm2q1', question: 'What is 1/2 + 1/2?', answer: '1' },
            { id: 'm2q2', question: 'What is 0.5 as a fraction?', answer: '1/2' },
            { id: 'm2q3', question: 'What is 3/4 + 1/4?', answer: '1' },
            { id: 'm2q4', question: 'What is 0.25 as a fraction?', answer: '1/4' },
            { id: 'm2q5', question: 'What is 1/3 + 1/3?', answer: '2/3' },
          ],
          time: '18 min',
          points: 25,
        },
      ],
      ela: [
        {
          id: 'ela1',
          title: 'Grammar Basics',
          description: 'Learn about nouns, verbs, and adjectives',
          questions: [
            { id: 'e1q1', question: 'What is a person, place, or thing called?', answer: 'noun' },
            { id: 'e1q2', question: 'What is an action word called?', answer: 'verb' },
            { id: 'e1q3', question: 'What describes a noun?', answer: 'adjective' },
            { id: 'e1q4', question: 'What word replaces a noun?', answer: 'pronoun' },
            { id: 'e1q5', question: 'What connects words or sentences?', answer: 'conjunction' },
          ],
          time: '15 min',
          points: 25,
        },
        {
          id: 'ela2',
          title: 'Reading Skills',
          description: 'Practice reading comprehension and vocabulary',
          questions: [
            { id: 'e2q1', question: 'What is the opposite of "happy"?', answer: 'sad' },
            { id: 'e2q2', question: 'What is a synonym for "big"?', answer: 'large' },
            { id: 'e2q3', question: 'What does "prefix" mean?', answer: 'beginning' },
            { id: 'e2q4', question: 'What is the plural of "child"?', answer: 'children' },
            { id: 'e2q5', question: 'What word means "very small"?', answer: 'tiny' },
          ],
          time: '18 min',
          points: 25,
        },
      ],
      science: [
        {
          id: 'sci1',
          title: 'Plants & Animals',
          description: 'Learn about plant and animal life cycles',
          questions: [
            { id: 's1q1', question: 'What do plants need to make food?', answer: 'sunlight' },
            { id: 's1q2', question: 'What is the process of plants making food called?', answer: 'photosynthesis' },
            { id: 's1q3', question: 'What do animals eat to get energy?', answer: 'food' },
            { id: 's1q4', question: 'What is the life cycle of a butterfly?', answer: 'metamorphosis' },
            { id: 's1q5', question: 'What part of a plant absorbs water?', answer: 'roots' },
          ],
          time: '15 min',
          points: 25,
        },
        {
          id: 'sci2',
          title: 'Earth & Space',
          description: 'Explore Earth and space science',
          questions: [
            { id: 's2q1', question: 'How many planets in our solar system?', answer: '8' },
            { id: 's2q2', question: 'What planet do we live on?', answer: 'earth' },
            { id: 's2q3', question: 'What causes day and night?', answer: 'rotation' },
            { id: 's2q4', question: 'What is the center of our solar system?', answer: 'sun' },
            { id: 's2q5', question: 'What causes seasons?', answer: 'tilt' },
          ],
          time: '18 min',
          points: 25,
        },
      ],
      social: [
        {
          id: 'soc1',
          title: 'Geography Basics',
          description: 'Learn about maps and locations',
          questions: [
            { id: 'so1q1', question: 'What shows locations on a flat surface?', answer: 'map' },
            { id: 'so1q2', question: 'What are the 7 large land masses called?', answer: 'continents' },
            { id: 'so1q3', question: 'What is the largest ocean?', answer: 'pacific' },
            { id: 'so1q4', question: 'What direction is the sun in the morning?', answer: 'east' },
            { id: 'so1q5', question: 'What country do we live in?', answer: 'usa' },
          ],
          time: '15 min',
          points: 25,
        },
        {
          id: 'soc2',
          title: 'American History',
          description: 'Learn about early American history',
          questions: [
            { id: 'so2q1', question: 'Who discovered America?', answer: 'columbus' },
            { id: 'so2q2', question: 'What were the first settlements called?', answer: 'colonies' },
            { id: 'so2q3', question: 'What holiday celebrates independence?', answer: '4th of july' },
            { id: 'so2q4', question: 'Who was the first president?', answer: 'washington' },
            { id: 'so2q5', question: 'What document declared independence?', answer: 'declaration' },
          ],
          time: '18 min',
          points: 25,
        },
      ],
    },
    '6-8': {
      math: [
        {
          id: 'math1',
          title: 'Pre-Algebra',
          description: 'Introduction to algebraic thinking',
          questions: [
            { id: 'm1q1', question: 'Solve: 2x + 5 = 15', answer: '5' },
            { id: 'm1q2', question: 'Solve: 3x - 7 = 14', answer: '7' },
            { id: 'm1q3', question: 'Solve: x/4 + 3 = 7', answer: '16' },
            { id: 'm1q4', question: 'Solve: 5x = 25', answer: '5' },
            { id: 'm1q5', question: 'Solve: 2x + 3 = 11', answer: '4' },
          ],
          time: '20 min',
          points: 25,
        },
        {
          id: 'math2',
          title: 'Geometry',
          description: 'Area, perimeter, and volume',
          questions: [
            { id: 'm2q1', question: 'Area of rectangle: 8 × 5', answer: '40' },
            { id: 'm2q2', question: 'Perimeter of square: side 6', answer: '24' },
            { id: 'm2q3', question: 'Area of triangle: base 10, height 6', answer: '30' },
            { id: 'm2q4', question: 'Volume of cube: side 3', answer: '27' },
            { id: 'm2q5', question: 'Circumference: radius 7 (use π=22/7)', answer: '44' },
          ],
          time: '25 min',
          points: 25,
        },
      ],
      ela: [
        {
          id: 'ela1',
          title: 'Advanced Grammar',
          description: 'Complex grammar and sentence structure',
          questions: [
            { id: 'e1q1', question: 'What is a clause that can stand alone?', answer: 'independent' },
            { id: 'e1q2', question: 'What shows possession?', answer: 'apostrophe' },
            { id: 'e1q3', question: 'What joins two independent clauses?', answer: 'semicolon' },
            { id: 'e1q4', question: 'What modifies a verb?', answer: 'adverb' },
            { id: 'e1q5', question: 'What is the subject-verb agreement rule?', answer: 'match' },
          ],
          time: '20 min',
          points: 25,
        },
        {
          id: 'ela2',
          title: 'Literary Analysis',
          description: 'Analyze literary elements and themes',
          questions: [
            { id: 'e2q1', question: 'What is the central message of a story?', answer: 'theme' },
            { id: 'e2q2', question: 'What is the struggle in a story called?', answer: 'conflict' },
            { id: 'e2q3', question: 'What is the time and place of a story?', answer: 'setting' },
            { id: 'e2q4', question: 'What is the perspective of the story?', answer: 'point of view' },
            { id: 'e2q5', question: 'What is a comparison using "like" or "as"?', answer: 'simile' },
          ],
          time: '25 min',
          points: 25,
        },
      ],
      science: [
        {
          id: 'sci1',
          title: 'Life Science',
          description: 'Cells, genetics, and ecosystems',
          questions: [
            { id: 's1q1', question: 'What is the basic unit of life?', answer: 'cell' },
            { id: 's1q2', question: 'What carries genetic information?', answer: 'dna' },
            { id: 's1q3', question: 'What is the process of cell division?', answer: 'mitosis' },
            { id: 's1q4', question: 'What do you call a community of organisms?', answer: 'ecosystem' },
            { id: 's1q5', question: 'What is the study of heredity?', answer: 'genetics' },
          ],
          time: '20 min',
          points: 25,
        },
        {
          id: 'sci2',
          title: 'Physical Science',
          description: 'Matter, energy, and forces',
          questions: [
            { id: 's2q1', question: 'What is anything that has mass and volume?', answer: 'matter' },
            { id: 's2q2', question: 'What is the ability to do work?', answer: 'energy' },
            { id: 's2q3', question: 'What is the force that pulls objects down?', answer: 'gravity' },
            { id: 's2q4', question: 'What are the three states of matter?', answer: 'solid liquid gas' },
            { id: 's2q5', question: 'What is the speed of light?', answer: '300000' },
          ],
          time: '25 min',
          points: 25,
        },
      ],
      social: [
        {
          id: 'soc1',
          title: 'World Geography',
          description: 'Global geography and cultures',
          questions: [
            { id: 'so1q1', question: 'What is the largest continent?', answer: 'asia' },
            { id: 'so1q2', question: 'What is the longest river?', answer: 'nile' },
            { id: 'so1q3', question: 'What is the most populous country?', answer: 'china' },
            { id: 'so1q4', question: 'What are the 5 oceans?', answer: 'pacific atlantic indian arctic southern' },
            { id: 'so1q5', question: 'What is the equator?', answer: 'line' },
          ],
          time: '20 min',
          points: 25,
        },
        {
          id: 'soc2',
          title: 'World History',
          description: 'Major world civilizations and events',
          questions: [
            { id: 'so2q1', question: 'Where did civilization begin?', answer: 'mesopotamia' },
            { id: 'so2q2', question: 'What were the pyramids built for?', answer: 'tombs' },
            { id: 'so2q3', question: 'What empire was led by Alexander?', answer: 'greek' },
            { id: 'so2q4', question: 'What was the Renaissance?', answer: 'rebirth' },
            { id: 'so2q5', question: 'What started World War I?', answer: 'assassination' },
          ],
          time: '25 min',
          points: 25,
        },
      ],
    },
    '9-12': {
      math: [
        {
          id: 'math1',
          title: 'Algebra II',
          description: 'Advanced algebraic concepts',
          questions: [
            { id: 'm1q1', question: 'Solve: x² - 5x + 6 = 0', answer: '2,3' },
            { id: 'm1q2', question: 'What is the quadratic formula?', answer: 'x=-b±√(b²-4ac)/2a' },
            { id: 'm1q3', question: 'Simplify: (x³)²', answer: 'x^6' },
            { id: 'm1q4', question: 'Factor: x² - 9', answer: '(x-3)(x+3)' },
            { id: 'm1q5', question: 'Solve: 2^x = 16', answer: '4' },
          ],
          time: '25 min',
          points: 25,
        },
        {
          id: 'math2',
          title: 'Trigonometry',
          description: 'Trigonometric functions and identities',
          questions: [
            { id: 'm2q1', question: 'What is sin(90°)?', answer: '1' },
            { id: 'm2q2', question: 'What is cos(0°)?', answer: '1' },
            { id: 'm2q3', question: 'What is tan(45°)?', answer: '1' },
            { id: 'm2q4', question: 'What is sin² + cos²?', answer: '1' },
            { id: 'm2q5', question: 'What is the Pythagorean identity?', answer: 'sin²+cos²=1' },
          ],
          time: '30 min',
          points: 25,
        },
      ],
      ela: [
        {
          id: 'ela1',
          title: 'Rhetorical Analysis',
          description: 'Analyze rhetoric and argumentation',
          questions: [
            { id: 'e1q1', question: 'What is ethos?', answer: 'credibility' },
            { id: 'e1q2', question: 'What is pathos?', answer: 'emotion' },
            { id: 'e1q3', question: 'What is logos?', answer: 'logic' },
            { id: 'e1q4', question: 'What is a fallacy?', answer: 'error' },
            { id: 'e1q5', question: 'What is the thesis statement?', answer: 'main argument' },
          ],
          time: '25 min',
          points: 25,
        },
        {
          id: 'ela2',
          title: 'Research & Writing',
          description: 'Academic writing and research skills',
          questions: [
            { id: 'e2q1', question: 'What is MLA?', answer: 'citation style' },
            { id: 'e2q2', question: 'What is a primary source?', answer: 'original' },
            { id: 'e2q3', question: 'What is peer review?', answer: 'evaluation' },
            { id: 'e2q4', question: 'What is plagiarism?', answer: 'stealing' },
            { id: 'e2q5', question: 'What is a thesis?', answer: 'argument' },
          ],
          time: '30 min',
          points: 25,
        },
      ],
      science: [
        {
          id: 'sci1',
          title: 'Chemistry',
          description: 'Atomic structure and chemical reactions',
          questions: [
            { id: 's1q1', question: 'What is the smallest unit of matter?', answer: 'atom' },
            { id: 's1q2', question: 'What is the center of an atom?', answer: 'nucleus' },
            { id: 's1q3', question: 'What are positively charged particles?', answer: 'protons' },
            { id: 's1q4', question: 'What is pH scale range?', answer: '0-14' },
            { id: 's1q5', question: 'What is a chemical bond?', answer: 'connection' },
          ],
          time: '25 min',
          points: 25,
        },
        {
          id: 'sci2',
          title: 'Physics',
          description: 'Motion, forces, and energy',
          questions: [
            { id: 's2q1', question: 'What is Newton\'s first law?', answer: 'inertia' },
            { id: 's2q2', question: 'What is F = ma?', answer: 'force' },
            { id: 's2q3', question: 'What is kinetic energy?', answer: 'motion' },
            { id: 's2q4', question: 'What is potential energy?', answer: 'stored' },
            { id: 's2q5', question: 'What is the law of conservation of energy?', answer: 'constant' },
          ],
          time: '30 min',
          points: 25,
        },
      ],
      social: [
        {
          id: 'soc1',
          title: 'US Government',
          description: 'Structure and function of US government',
          questions: [
            { id: 'so1q1', question: 'How many branches of government?', answer: '3' },
            { id: 'so1q2', question: 'What makes laws?', answer: 'legislative' },
            { id: 'so1q3', question: 'What enforces laws?', answer: 'executive' },
            { id: 'so1q4', question: 'What interprets laws?', answer: 'judicial' },
            { id: 'so1q5', question: 'What is the Bill of Rights?', answer: 'amendments' },
          ],
          time: '25 min',
          points: 25,
        },
        {
          id: 'soc2',
          title: 'Economics',
          description: 'Basic economic principles',
          questions: [
            { id: 'so2q1', question: 'What is supply and demand?', answer: 'market' },
            { id: 'so2q2', question: 'What is inflation?', answer: 'prices rising' },
            { id: 'so2q3', question: 'What is GDP?', answer: 'output' },
            { id: 'so2q4', question: 'What is a recession?', answer: 'decline' },
            { id: 'so2q5', question: 'What is opportunity cost?', answer: 'tradeoff' },
          ],
          time: '30 min',
          points: 25,
        },
      ],
    },
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = (assignmentId: string) => {
    setSubmitted({ ...submitted, [assignmentId]: true });
  };

  const getScore = (assignmentId: string) => {
    if (!gradeLevel || !selectedSubject) return 0;
    const gradeAssignments = assignments[gradeLevel as keyof typeof assignments];
    if (!gradeAssignments) return 0;
    const subjectAssignments = gradeAssignments[selectedSubject as keyof typeof gradeAssignments] as any[];
    const assignment = subjectAssignments.find((a: any) => a.id === assignmentId);
    if (!assignment) return 0;

    let correct = 0;
    assignment.questions.forEach((q: any) => {
      if (answers[q.id]?.toLowerCase().trim() === q.answer.toLowerCase()) {
        correct++;
      }
    });
    return Math.round((correct / assignment.questions.length) * 100);
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Show grade selection survey first
  if (!gradeLevel) {
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

          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6">
                <GraduationCap className="h-10 w-10 text-green-400" />
              </div>
              <h1 className="text-5xl font-bold text-white mb-4">Welcome to Study Center</h1>
              <p className="text-green-200 text-lg">Select your grade level to get personalized assignments</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {gradeLevels.map((level) => (
                <button
                  key={level.id}
                  onClick={() => setGradeLevel(level.id)}
                  className="bg-green-900/30 backdrop-blur-sm border border-green-400/20 rounded-2xl p-8 hover:border-green-400/40 transition-all hover:scale-105 cursor-pointer text-left"
                >
                  <h3 className="text-2xl font-semibold text-white mb-2">{level.name}</h3>
                  <p className="text-green-200 text-sm">{level.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedSubject) {
    const gradeAssignments = assignments[gradeLevel as keyof typeof assignments];
    const subjectAssignments = gradeAssignments ? (gradeAssignments[selectedSubject as keyof typeof gradeAssignments] as any[]) : [];

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

          <button
            onClick={() => setSelectedSubject(null)}
            className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Subjects
          </button>

          <div className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              {subjects.find(s => s.id === selectedSubject)?.name}
            </h1>
            <p className="text-green-200 text-lg">Complete assignments to test your knowledge</p>
          </div>

          <div className="space-y-8">
            {subjectAssignments.map((assignment: any) => (
              <div key={assignment.id} className="bg-green-900/20 backdrop-blur-sm border border-green-400/20 rounded-2xl p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{assignment.title}</h2>
                    <p className="text-green-200 mb-4">{assignment.description}</p>
                    <div className="flex items-center gap-4 text-sm text-green-300">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {assignment.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        {assignment.points} points
                      </div>
                    </div>
                  </div>
                  {!submitted[assignment.id] && (
                    <button
                      onClick={() => handleSubmit(assignment.id)}
                      className="px-6 py-2 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl transition-colors"
                    >
                      Submit
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {shuffleArray(assignment.questions).map((question: any) => (
                    <div key={question.id} className="bg-green-950/30 rounded-xl p-4">
                      <label className="block text-white font-medium mb-2">{question.question}</label>
                      <input
                        type="text"
                        value={answers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        disabled={submitted[assignment.id]}
                        placeholder="Type your answer here..."
                        className="w-full px-4 py-2 rounded-lg bg-green-900/50 border border-green-400/30 text-white placeholder-green-300/50 focus:outline-none focus:border-green-400 disabled:opacity-50"
                      />
                      {submitted[assignment.id] && (
                        <div className={`mt-2 text-sm ${answers[question.id]?.toLowerCase().trim() === question.answer.toLowerCase() ? 'text-green-400' : 'text-red-400'}`}>
                          {answers[question.id]?.toLowerCase().trim() === question.answer.toLowerCase() ? (
                            <span className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              Correct!
                            </span>
                          ) : (
                            <span>Incorrect. Answer: {question.answer}</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {submitted[assignment.id] && (
                  <div className="mt-6 p-4 bg-green-500/20 rounded-xl border border-green-400/30">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold">Your Score:</span>
                      <span className={`text-2xl font-bold ${getScore(assignment.id) >= 70 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {getScore(assignment.id)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
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
          <h1 className="text-5xl font-bold text-white mb-4">Study Center</h1>
          <p className="text-green-200 text-lg">Select a subject to start your assignments</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              onClick={() => setSelectedSubject(subject.id)}
              className="bg-green-900/30 backdrop-blur-sm border border-green-400/20 rounded-2xl p-8 hover:border-green-400/40 transition-all hover:scale-105 cursor-pointer"
            >
              <div className="text-5xl mb-4">{subject.icon}</div>
              <h3 className="text-2xl font-semibold text-white mb-2">{subject.name}</h3>
              <p className="text-green-200 text-sm mb-4">
                {(assignments[gradeLevel as keyof typeof assignments] as any)?.[subject.id]?.length || 0} assignments available
              </p>
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <BookOpen className="h-4 w-4" />
                Start Learning
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
