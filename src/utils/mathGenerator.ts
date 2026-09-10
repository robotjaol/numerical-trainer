import { Operation, DifficultyPreset, Question, QuizSettings } from '../types';

export const OPERATION_CONFIGS = [
  {
    id: 'addition' as Operation,
    name: 'Penambahan',
    symbol: '+',
    description: 'Menjumlahkan dua bilangan',
  },
  {
    id: 'subtraction' as Operation,
    name: 'Pengurangan',
    symbol: '−',
    description: 'Mengurangkan bilangan pertama dengan kedua',
  },
  {
    id: 'multiplication' as Operation,
    name: 'Perkalian',
    symbol: '×',
    description: 'Mengalikan dua bilangan',
  },
  {
    id: 'division' as Operation,
    name: 'Pembagian',
    symbol: '÷',
    description: 'Membagi bilangan bulat tanpa sisa',
  },
];

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Get range based on preset and current question progress (for progressive mode)
function getRangeForPreset(
  preset: DifficultyPreset,
  progressRatio: number, // 0.0 to 1.0
  customMin: number,
  customMax: number
): { min: number; max: number } {
  switch (preset) {
    case '1-digit':
      return { min: 1, max: 9 };
    case '2-digit':
      return { min: 10, max: 99 };
    case 'up-to-1000':
      return { min: 1, max: 1000 };
    case 'progressive': {
      // Starts at 1-digit (1-9), progressively scales up to 1000
      if (progressRatio < 0.25) {
        return { min: 1, max: 9 }; // Phase 1: 1-digit (1-9)
      } else if (progressRatio < 0.5) {
        return { min: 5, max: 50 }; // Phase 2: low 2-digit (5-50)
      } else if (progressRatio < 0.75) {
        return { min: 10, max: 250 }; // Phase 3: mid range (10-250)
      } else {
        return { min: 25, max: 1000 }; // Phase 4: full range up to 1000
      }
    }
    case 'custom':
      return {
        min: Math.min(customMin, customMax),
        max: Math.max(customMin, customMax),
      };
    default:
      return { min: 1, max: 9 };
  }
}

export function generateSingleQuestion(
  id: number,
  operation: Operation,
  preset: DifficultyPreset,
  progressRatio: number,
  customMin: number,
  customMax: number,
  allowNegative: boolean = false
): Question {
  const { min, max } = getRangeForPreset(preset, progressRatio, customMin, customMax);

  let num1 = 1;
  let num2 = 1;
  let symbol = '+';
  let correctAnswer = 0;

  switch (operation) {
    case 'addition': {
      symbol = '+';
      num1 = getRandomInt(min, max);
      num2 = getRandomInt(min, max);
      correctAnswer = num1 + num2;
      break;
    }

    case 'subtraction': {
      symbol = '−';
      const a = getRandomInt(min, max);
      const b = getRandomInt(min, max);
      if (!allowNegative) {
        num1 = Math.max(a, b);
        num2 = Math.min(a, b);
      } else {
        num1 = a;
        num2 = b;
      }
      correctAnswer = num1 - num2;
      break;
    }

    case 'multiplication': {
      symbol = '×';
      if (preset === '1-digit' || (preset === 'progressive' && progressRatio < 0.25)) {
        num1 = getRandomInt(1, 9);
        num2 = getRandomInt(1, 9);
      } else if (preset === '2-digit' || (preset === 'progressive' && progressRatio < 0.5)) {
        // e.g. 12 x 7, 24 x 6, 15 x 15 (realistic numeric reasoning)
        num1 = getRandomInt(10, 50);
        num2 = getRandomInt(2, 12);
      } else {
        // Max up to 1000
        // Pick factors such that product is within reasonable mental reasoning range (up to 1000)
        // or one factor up to 1000 and the other single-digit
        const style = Math.random();
        if (style < 0.4) {
          // Double digit x single digit (e.g. 84 x 7 = 588)
          num1 = getRandomInt(11, 99);
          num2 = getRandomInt(2, 9);
        } else if (style < 0.7) {
          // Round-ish mental math (e.g. 25 x 30, 40 x 15, 120 x 5)
          const base = [10, 12, 15, 20, 25, 30, 40, 50, 60, 75, 100, 125, 150, 200, 250];
          num1 = base[Math.floor(Math.random() * base.length)];
          const maxMult = Math.min(20, Math.floor(1000 / num1));
          num2 = getRandomInt(2, Math.max(2, maxMult));
        } else {
          // Standard range bounded by max
          const limit = Math.min(max, 1000);
          num1 = getRandomInt(2, Math.floor(Math.sqrt(limit)));
          num2 = getRandomInt(2, Math.floor(limit / num1));
        }
      }
      // Swap randomly so smaller isn't always second
      if (Math.random() > 0.5) {
        const temp = num1;
        num1 = num2;
        num2 = temp;
      }
      correctAnswer = num1 * num2;
      break;
    }

    case 'division': {
      symbol = '÷';
      // Clean integer division: num1 / num2 = quotient, meaning num1 = num2 * quotient
      if (preset === '1-digit' || (preset === 'progressive' && progressRatio < 0.25)) {
        const quotient = getRandomInt(1, 9);
        const divisor = getRandomInt(2, 9);
        num1 = quotient * divisor;
        num2 = divisor;
        correctAnswer = quotient;
      } else if (preset === '2-digit' || (preset === 'progressive' && progressRatio < 0.5)) {
        // Divisor 2-12, dividend up to 99
        const divisor = getRandomInt(2, 12);
        const maxQuotient = Math.floor(99 / divisor);
        const quotient = getRandomInt(2, Math.max(2, maxQuotient));
        num1 = divisor * quotient;
        num2 = divisor;
        correctAnswer = quotient;
      } else {
        // Up to 1000 dividend
        const style = Math.random();
        if (style < 0.5) {
          // 2-digit divisor, e.g. 600 / 25 = 24
          const divisors = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20, 25, 30, 50];
          const divisor = divisors[Math.floor(Math.random() * divisors.length)];
          const maxQuotient = Math.floor(Math.min(max, 1000) / divisor);
          const quotient = getRandomInt(2, Math.max(2, maxQuotient));
          num1 = divisor * quotient;
          num2 = divisor;
          correctAnswer = quotient;
        } else {
          // Single digit divisor into 3-digit dividend (e.g. 728 / 7 = 104)
          const divisor = getRandomInt(2, 9);
          const minDividend = Math.min(100, max);
          const maxDividend = Math.min(max, 1000);
          const quotient = getRandomInt(Math.floor(minDividend / divisor), Math.floor(maxDividend / divisor));
          num1 = divisor * quotient;
          num2 = divisor;
          correctAnswer = quotient;
        }
      }
      break;
    }
  }

  return {
    id,
    num1,
    num2,
    operation,
    symbol,
    correctAnswer,
  };
}

export function generateQuizQuestions(settings: QuizSettings): Question[] {
  const {
    operations,
    questionCount,
    difficultyPreset,
    customMin,
    customMax,
    allowNegative,
  } = settings;

  if (!operations || operations.length === 0) {
    throw new Error('Pilih minimal satu jenis operasi matematika.');
  }

  const questions: Question[] = [];
  const safeCount = Math.max(1, Math.min(questionCount, 1000));

  for (let i = 0; i < safeCount; i++) {
    // Pick operation cyclically or randomly with balanced distribution
    const op = operations[i % operations.length];
    const progressRatio = safeCount > 1 ? i / (safeCount - 1) : 0;

    const question = generateSingleQuestion(
      i + 1,
      op,
      difficultyPreset,
      progressRatio,
      customMin,
      customMax,
      allowNegative
    );
    questions.push(question);
  }

  // Shuffle the question order slightly if multiple operations so it feels dynamic
  if (operations.length > 1 && difficultyPreset !== 'progressive') {
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = questions[i];
      questions[i] = questions[j];
      questions[j] = temp;
      questions[i].id = i + 1;
      questions[j].id = j + 1;
    }
  }

  return questions;
}
