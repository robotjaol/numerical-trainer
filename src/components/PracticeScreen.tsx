import { useState, useEffect, useRef, useCallback } from 'react';
import { Question, QuizSettings, Operation } from '../types';
import { sounds } from '../utils/audio';
import { StreakCelebration } from './StreakCelebration';
import {
  Flame,
  Clock,
  CheckCircle2,
  Delete,
  CornerDownLeft,
  Pause,
  Play,
  Flag,
  RotateCcw,
} from 'lucide-react';

interface PracticeScreenProps {
  questions: Question[];
  settings: QuizSettings;
  onFinish: (
    completedQuestions: Question[],
    totalTimeMs: number,
    streakRecord: number
  ) => void;
  onExit: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
}

export default function PracticeScreen({
  questions,
  settings,
  onFinish,
  onExit,
  isPaused,
  onTogglePause,
}: PracticeScreenProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('');
  const [answeredList, setAnsweredList] = useState<Question[]>([]);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [streakTriggerKey, setStreakTriggerKey] = useState<number>(0);

  // Question timing
  const questionStartTimeRef = useRef<number>(Date.now());
  const [totalElapsedMs, setTotalElapsedMs] = useState<number>(0);

  // Feedback state: 'none' | 'correct' | 'wrong'
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [lastCorrectAnswer, setLastCorrectAnswer] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount & resume
  useEffect(() => {
    if (!isPaused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isPaused, currentIndex]);

  // Master Timer for total elapsed time
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTotalElapsedMs((prev) => prev + 100);
    }, 100);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Current active question
  const currentQuestion = questions[currentIndex];

  // Helper to format time (mm:ss)
  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Submit Answer Logic
  const handleSubmit = useCallback(() => {
    if (feedback !== 'none') return;
    if (inputValue.trim() === '' || isNaN(Number(inputValue))) return;

    const userNum = parseInt(inputValue.trim(), 10);
    const isCorrect = userNum === currentQuestion.correctAnswer;
    const timeSpent = Date.now() - questionStartTimeRef.current;

    const answeredQuestion: Question = {
      ...currentQuestion,
      userAnswer: userNum,
      isCorrect,
      timeSpentMs: timeSpent,
    };

    const newAnswered = [...answeredList, answeredQuestion];
    setAnsweredList(newAnswered);

    if (isCorrect) {
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      setFeedback('correct');
      setStreakTriggerKey(Date.now());

      if (settings.soundEnabled) {
        if (newStreak >= 15 && newStreak % 5 === 0) {
          sounds.playStreakReward('unstoppable');
        } else if (newStreak === 10) {
          sounds.playStreakReward('excellent');
        } else if (newStreak === 7 || newStreak === 5) {
          sounds.playStreakReward('great');
        } else if (newStreak === 3) {
          sounds.playStreakReward('good');
        } else {
          sounds.playCorrect();
        }
      }
    } else {
      if (settings.soundEnabled) sounds.playWrong();
      setCurrentStreak(0);
      setFeedback('wrong');
      setLastCorrectAnswer(currentQuestion.correctAnswer);
    }

    // Advance to next question after small visual feedback
    const delay = isCorrect ? 220 : 600; // Brief delay to see wrong answer if incorrect
    setTimeout(() => {
      setFeedback('none');
      setLastCorrectAnswer(null);
      setInputValue('');

      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
        questionStartTimeRef.current = Date.now();
        if (inputRef.current) inputRef.current.focus();
      } else {
        // Complete the quiz!
        if (settings.soundEnabled) sounds.playComplete();
        onFinish(newAnswered, totalElapsedMs, Math.max(maxStreak, isCorrect ? currentStreak + 1 : maxStreak));
      }
    }, delay);
  }, [
    feedback,
    inputValue,
    currentQuestion,
    answeredList,
    settings.soundEnabled,
    currentStreak,
    maxStreak,
    currentIndex,
    questions.length,
    onFinish,
    totalElapsedMs,
  ]);

  // Auto-advance check if enabled
  useEffect(() => {
    if (!settings.autoAdvanceOnCorrect) return;
    if (inputValue.trim() === '') return;

    const userNum = parseInt(inputValue.trim(), 10);
    if (currentQuestion && userNum === currentQuestion.correctAnswer) {
      handleSubmit();
    }
  }, [inputValue, settings.autoAdvanceOnCorrect, currentQuestion, handleSubmit]);

  // Handle Keyboard (physical)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onTogglePause();
        return;
      }

      if (isPaused) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, onTogglePause, handleSubmit]);

  // Virtual Keypad Button Click
  const handleKeypadPress = (val: string) => {
    if (isPaused || feedback !== 'none') return;
    if (settings.soundEnabled) sounds.playTap();

    if (val === 'BACK') {
      setInputValue((prev) => prev.slice(0, -1));
    } else if (val === 'CLEAR') {
      setInputValue('');
    } else if (val === 'MINUS') {
      if (inputValue === '') {
        setInputValue('-');
      } else if (inputValue === '-') {
        setInputValue('');
      }
    } else if (val === 'ENTER') {
      handleSubmit();
    } else {
      // Numbers
      if (inputValue.length < 8) {
        setInputValue((prev) => prev + val);
      }
    }
    if (inputRef.current) inputRef.current.focus();
  };

  // Skip question
  const handleSkip = () => {
    if (feedback !== 'none' || isPaused) return;
    const timeSpent = Date.now() - questionStartTimeRef.current;
    const answeredQuestion: Question = {
      ...currentQuestion,
      userAnswer: null,
      isCorrect: false,
      timeSpentMs: timeSpent,
    };
    const newAnswered = [...answeredList, answeredQuestion];
    setAnsweredList(newAnswered);
    setCurrentStreak(0);

    setInputValue('');
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      questionStartTimeRef.current = Date.now();
      if (inputRef.current) inputRef.current.focus();
    } else {
      onFinish(newAnswered, totalElapsedMs, maxStreak);
    }
  };

  // Early finish
  const handleEarlyFinish = () => {
    if (answeredList.length === 0) {
      onExit();
      return;
    }
    onFinish(answeredList, totalElapsedMs, maxStreak);
  };

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);
  const correctCount = answeredList.filter((q) => q.isCorrect).length;
  const currentAccuracy =
    answeredList.length > 0 ? Math.round((correctCount / answeredList.length) * 100) : 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6">
      {/* Top Metrics Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs mb-6">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              Soal {currentIndex + 1} / {questions.length}
            </span>
            {settings.showTimer && (
              <span className="flex items-center gap-1 text-xs font-mono font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                {formatTime(totalElapsedMs)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Streak */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
                currentStreak >= 10
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 ring-2 ring-purple-400 scale-110 shadow-xs'
                  : currentStreak >= 5
                  ? 'bg-amber-100 text-amber-900 ring-2 ring-amber-400 scale-105 shadow-2xs'
                  : currentStreak >= 2
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Flame
                className={`w-4 h-4 ${
                  currentStreak >= 10
                    ? 'text-pink-500 fill-pink-500 animate-bounce'
                    : currentStreak >= 5
                    ? 'text-amber-500 fill-amber-500 animate-bounce'
                    : currentStreak >= 2
                    ? 'text-amber-500 fill-amber-500'
                    : 'text-slate-400'
                }`}
              />
              <span className="font-mono-numbers">{currentStreak} Streak</span>
            </div>

            {/* Accuracy */}
            <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {currentAccuracy}% Benar
            </div>

            {/* Pause button */}
            <button
              type="button"
              id="btn-practice-pause"
              onClick={onTogglePause}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Jeda (Esc)"
            >
              <Pause className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Flashcard Arena */}
      <div
        className={`relative bg-white rounded-3xl p-6 sm:p-10 border-2 shadow-sm text-center transition-all duration-200 ${
          feedback === 'correct'
            ? 'border-emerald-500 bg-emerald-50/20 ring-4 ring-emerald-500/10'
            : feedback === 'wrong'
            ? 'border-rose-500 bg-rose-50/20 ring-4 ring-rose-500/10'
            : 'border-slate-200'
        }`}
      >
        {/* Animated Streak Celebration Badge (Good, Great, Excellent, Unstoppable) */}
        <StreakCelebration streak={currentStreak} triggerKey={streakTriggerKey} />

        {/* Math Question Expression */}
        <div className="font-mono-numbers text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight my-4 sm:my-6 select-none flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
          <span className="text-slate-900">{currentQuestion.num1}</span>
          <span className="text-indigo-600 font-bold px-1">{currentQuestion.symbol}</span>
          <span className="text-slate-900">{currentQuestion.num2}</span>
          <span className="text-slate-400">=</span>
          <span className="text-indigo-600 min-w-[1ch] text-left">
            {inputValue ? inputValue : <span className="text-slate-300 animate-pulse">?</span>}
          </span>
        </div>

        {/* Feedback Alert if wrong */}
        {feedback === 'wrong' && lastCorrectAnswer !== null && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-rose-100 text-rose-800 font-semibold text-sm animate-bounce mb-3">
            Jawaban benar: <span className="font-mono-numbers font-bold text-base">{lastCorrectAnswer}</span>
          </div>
        )}

        {/* Hidden or direct input box for desktop keyboard users */}
        <div className="max-w-xs mx-auto mb-4">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9\-]*"
            id="quiz-answer-input"
            value={inputValue}
            onChange={(e) => {
              const val = e.target.value;
              // Allow numbers and single optional leading minus
              if (/^-?\d*$/.test(val)) {
                setInputValue(val);
              }
            }}
            placeholder="Ketik jawaban..."
            autoFocus
            disabled={isPaused || feedback !== 'none'}
            className="w-full text-center font-mono-numbers text-2xl sm:text-3xl font-bold py-3 px-4 bg-slate-50 border-2 border-slate-300 rounded-2xl text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-hidden transition-all placeholder:text-slate-300 placeholder:text-base"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 max-w-xs mx-auto">
          <button
            type="button"
            id="btn-quiz-skip"
            onClick={handleSkip}
            disabled={feedback !== 'none'}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-150 cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            Lewati
          </button>

          <button
            type="button"
            id="btn-quiz-submit"
            onClick={handleSubmit}
            disabled={feedback !== 'none' || inputValue.trim() === ''}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-600 text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-purple-500/25 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
          >
            <span>Kirim</span>
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Touch Numeric Keypad */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs mt-6 max-w-sm mx-auto">
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              id={`btn-keypad-${num}`}
              onClick={() => handleKeypadPress(num)}
              className="py-3 sm:py-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-900 font-mono-numbers text-xl sm:text-2xl font-bold transition-all duration-150 cursor-pointer hover:scale-110 hover:-translate-y-1 hover:shadow-md hover:bg-indigo-50/80 hover:text-indigo-600 hover:border-indigo-300 active:scale-90 active:bg-indigo-100 shadow-2xs"
            >
              {num}
            </button>
          ))}

          {/* Bottom row: Clear / Minus, 0, Backspace */}
          <button
            type="button"
            id="btn-keypad-clear"
            onClick={() => handleKeypadPress('CLEAR')}
            className="py-3 sm:py-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-rose-600 font-semibold text-sm transition-all duration-150 cursor-pointer hover:scale-105 hover:-translate-y-0.5 hover:shadow-md hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 active:scale-90 active:bg-rose-100"
          >
            Hapus
          </button>

          <button
            type="button"
            id="btn-keypad-0"
            onClick={() => handleKeypadPress('0')}
            className="py-3 sm:py-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-900 font-mono-numbers text-xl sm:text-2xl font-bold transition-all duration-150 cursor-pointer hover:scale-110 hover:-translate-y-1 hover:shadow-md hover:bg-indigo-50/80 hover:text-indigo-600 hover:border-indigo-300 active:scale-90 active:bg-indigo-100 shadow-2xs"
          >
            0
          </button>

          <button
            type="button"
            id="btn-keypad-back"
            onClick={() => handleKeypadPress('BACK')}
            className="py-3 sm:py-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-700 flex items-center justify-center transition-all duration-150 cursor-pointer hover:scale-105 hover:-translate-y-0.5 hover:shadow-md hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 active:scale-90 active:bg-amber-100"
            aria-label="Backspace"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Enter Key on keypad */}
        <button
          type="button"
          id="btn-keypad-enter"
          onClick={() => handleKeypadPress('ENTER')}
          disabled={feedback !== 'none' || inputValue.trim() === ''}
          className="w-full mt-2.5 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-md hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-95 transition-all duration-150 cursor-pointer disabled:opacity-40"
        >
          <span>Jawab (Enter)</span>
          <CornerDownLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Option: Selesaikan lebih awal */}
      <div className="flex items-center justify-between text-xs text-slate-500 mt-6 px-2">
        <span>Tekan <kbd className="px-1.5 py-0.5 bg-slate-200 rounded font-mono text-[10px]">Enter</kbd> untuk menjawab cepat</span>

        <button
          type="button"
          id="btn-early-finish"
          onClick={handleEarlyFinish}
          className="inline-flex items-center gap-1 font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <Flag className="w-3.5 h-3.5" />
          Selesaikan Sekarang
        </button>
      </div>

      {/* Pause Modal Overlay */}
      {isPaused && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in duration-150">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4">
              <Pause className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Latihan Dijeda</h3>
            <p className="text-sm text-slate-500 mb-6">
              Ambil nafas sejenak. Stopwatch dihentikan sementara.
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 mb-6 grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xs text-slate-500">Selesai</div>
                <div className="font-mono-numbers font-bold text-slate-800 text-lg">
                  {currentIndex}/{questions.length}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Akurasi</div>
                <div className="font-mono-numbers font-bold text-emerald-600 text-lg">
                  {currentAccuracy}%
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Waktu</div>
                <div className="font-mono-numbers font-bold text-slate-800 text-lg">
                  {formatTime(totalElapsedMs)}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                id="btn-resume-quiz"
                onClick={onTogglePause}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-colors"
              >
                <Play className="w-4 h-4 fill-current" />
                Lanjutkan Latihan
              </button>
              <button
                type="button"
                id="btn-pause-finish-early"
                onClick={handleEarlyFinish}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-colors"
              >
                Lihat Hasil Sementara & Selesaikan
              </button>
              <button
                type="button"
                id="btn-pause-exit"
                onClick={onExit}
                className="w-full py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
              >
                Batal & Keluar ke Menu Awal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
