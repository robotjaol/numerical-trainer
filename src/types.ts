export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';

export type DifficultyPreset = '1-digit' | '2-digit' | 'up-to-1000' | 'progressive' | 'custom';

export interface OperationConfig {
  id: Operation;
  name: string;
  symbol: string;
  description: string;
}

export interface Question {
  id: number;
  num1: number;
  num2: number;
  operation: Operation;
  symbol: string;
  correctAnswer: number;
  userAnswer?: number | null;
  isCorrect?: boolean;
  timeSpentMs?: number;
}

export interface QuizSettings {
  operations: Operation[];
  questionCount: number; // e.g. 50, 100, up to 1000
  difficultyPreset: DifficultyPreset;
  customMin: number; // 1 to 1000
  customMax: number; // 1 to 1000
  soundEnabled: boolean;
  showTimer: boolean;
  allowNegative: boolean;
  autoAdvanceOnCorrect: boolean;
}

export interface QuizStats {
  totalQuestions: number;
  completedQuestions: number;
  correctCount: number;
  incorrectCount: number;
  currentStreak: number;
  bestStreak: number;
  totalTimeMs: number;
  startTime: number;
  operationStats: Record<Operation, { total: number; correct: number; totalTimeMs: number }>;
}

export interface TrainingHistoryItem {
  id: string;
  date: string;
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  totalTimeMs: number;
  avgTimePerQuestionMs: number;
  operations: Operation[];
  difficultyPreset: DifficultyPreset;
  maxNumber: number;
}
