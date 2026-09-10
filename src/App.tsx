import { useState, useEffect } from 'react';
import Header from './components/Header';
import SetupScreen from './components/SetupScreen';
import PracticeScreen from './components/PracticeScreen';
import ResultsScreen from './components/ResultsScreen';
import HistoryModal from './components/HistoryModal';
import { Question, QuizSettings, TrainingHistoryItem } from './types';
import { generateQuizQuestions } from './utils/mathGenerator';
import { sounds } from './utils/audio';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'setup' | 'practice' | 'results'>('setup');
  const [settings, setSettings] = useState<QuizSettings>({
    operations: ['addition', 'subtraction', 'multiplication', 'division'],
    questionCount: 50,
    difficultyPreset: '1-digit',
    customMin: 1,
    customMax: 1000,
    soundEnabled: true,
    showTimer: true,
    allowNegative: false,
    autoAdvanceOnCorrect: false,
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [completedQuestions, setCompletedQuestions] = useState<Question[]>([]);
  const [totalTimeMs, setTotalTimeMs] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // History modal
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<TrainingHistoryItem[]>([]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('numeric_reasoning_history_v1');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Sync sound settings with audio engine
  useEffect(() => {
    sounds.setMuted(!settings.soundEnabled);
  }, [settings.soundEnabled]);

  const toggleSound = () => {
    setSettings((prev) => {
      const next = !prev.soundEnabled;
      sounds.setMuted(!next);
      return { ...prev, soundEnabled: next };
    });
  };

  // Start new quiz
  const handleStartQuiz = (newSettings: QuizSettings) => {
    setSettings(newSettings);
    const newQuestions = generateQuizQuestions(newSettings);
    setQuestions(newQuestions);
    setCompletedQuestions([]);
    setTotalTimeMs(0);
    setMaxStreak(0);
    setIsPaused(false);
    setCurrentScreen('practice');
  };

  // Finish quiz
  const handleFinishQuiz = (
    answered: Question[],
    elapsedMs: number,
    streak: number
  ) => {
    setCompletedQuestions(answered);
    setTotalTimeMs(elapsedMs);
    setMaxStreak(streak);
    setCurrentScreen('results');

    // Save to history
    if (answered.length > 0) {
      const correctCount = answered.filter((q) => q.isCorrect).length;
      const accuracy = Math.round((correctCount / answered.length) * 100);
      const avgTime = Math.round(elapsedMs / answered.length);

      const historyEntry: TrainingHistoryItem = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        totalQuestions: answered.length,
        correctCount,
        accuracy,
        totalTimeMs: elapsedMs,
        avgTimePerQuestionMs: avgTime,
        operations: settings.operations,
        difficultyPreset: settings.difficultyPreset,
        maxNumber: settings.customMax,
      };

      const updatedHistory = [historyEntry, ...history].slice(0, 50); // keep last 50
      setHistory(updatedHistory);
      try {
        localStorage.setItem(
          'numeric_reasoning_history_v1',
          JSON.stringify(updatedHistory)
        );
      } catch {
        // ignore storage errors
      }
    }
  };

  // Restart with identical configuration
  const handleRestartSame = () => {
    const newQuestions = generateQuizQuestions(settings);
    setQuestions(newQuestions);
    setCompletedQuestions([]);
    setTotalTimeMs(0);
    setMaxStreak(0);
    setIsPaused(false);
    setCurrentScreen('practice');
  };

  // Retry only mistakes
  const handleRetryMistakes = (wrongQuestions: Question[]) => {
    // Fresh clone with reset answers
    const resetQuestions: Question[] = wrongQuestions.map((q, idx) => ({
      ...q,
      id: idx + 1,
      userAnswer: undefined,
      isCorrect: undefined,
      timeSpentMs: undefined,
    }));

    setQuestions(resetQuestions);
    setCompletedQuestions([]);
    setTotalTimeMs(0);
    setMaxStreak(0);
    setIsPaused(false);
    setCurrentScreen('practice');
  };

  // Back to setup
  const handleNewSetup = () => {
    setCurrentScreen('setup');
    setIsPaused(false);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('numeric_reasoning_history_v1');
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      <Header
        isPlaying={currentScreen === 'practice'}
        isPaused={isPaused}
        soundEnabled={settings.soundEnabled}
        onToggleSound={toggleSound}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onTogglePause={() => setIsPaused((prev) => !prev)}
        onExitToHome={handleNewSetup}
      />

      <main className="flex-1">
        {currentScreen === 'setup' && (
          <SetupScreen onStart={handleStartQuiz} />
        )}

        {currentScreen === 'practice' && questions.length > 0 && (
          <PracticeScreen
            questions={questions}
            settings={settings}
            onFinish={handleFinishQuiz}
            onExit={handleNewSetup}
            isPaused={isPaused}
            onTogglePause={() => setIsPaused((prev) => !prev)}
          />
        )}

        {currentScreen === 'results' && (
          <ResultsScreen
            completedQuestions={completedQuestions}
            totalTimeMs={totalTimeMs}
            maxStreak={maxStreak}
            settings={settings}
            onRestartSame={handleRestartSame}
            onRetryMistakes={handleRetryMistakes}
            onNewSetup={handleNewSetup}
          />
        )}
      </main>

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
