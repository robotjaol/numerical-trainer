import { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import { QuizSettings } from '../types';
import { sounds } from '../utils/audio';

interface CheerfulTransitionScreenProps {
  settings: QuizSettings;
  onComplete: () => void;
  onCancel: () => void;
}

const CHEERFUL_SYMBOLS = [
  { char: '+', color: 'text-emerald-500 bg-emerald-50 border-emerald-200', top: '15%', left: '10%', delay: '0s' },
  { char: '×', color: 'text-purple-500 bg-purple-50 border-purple-200', top: '22%', right: '12%', delay: '0.4s' },
  { char: '÷', color: 'text-amber-500 bg-amber-50 border-amber-200', bottom: '20%', left: '14%', delay: '0.8s' },
  { char: '−', color: 'text-sky-500 bg-sky-50 border-sky-200', bottom: '25%', right: '10%', delay: '0.2s' },
  { char: '=', color: 'text-pink-500 bg-pink-50 border-pink-200', top: '50%', left: '6%', delay: '0.6s' },
  { char: '9', color: 'text-indigo-500 bg-indigo-50 border-indigo-200', top: '48%', right: '7%', delay: '1s' },
  { char: '★', color: 'text-yellow-500 bg-yellow-50 border-yellow-200', top: '8%', right: '35%', delay: '0.3s' },
  { char: '✦', color: 'text-rose-500 bg-rose-50 border-rose-200', bottom: '10%', left: '40%', delay: '0.7s' },
];

const ENCOURAGING_TIPS = [
  'Pemanasan jari dan konsentrasi pikiran...',
  'Akurasi nomor satu, kecepatan akan mengikuti!',
  'Fokus pada pola angka & kalkulasi kilat...',
  'Tarik napas santai, kamu pasti bisa!',
];

export function CheerfulTransitionScreen({
  settings,
  onComplete,
  onCancel,
}: CheerfulTransitionScreenProps) {
  const [count, setCount] = useState<number>(3);
  const [tipIndex] = useState(() => Math.floor(Math.random() * ENCOURAGING_TIPS.length));

  useEffect(() => {
    // Play tick on start if sound enabled
    if (settings.soundEnabled) {
      sounds.playCountdownTick();
    }

    const timer3 = setTimeout(() => {
      setCount(2);
      if (settings.soundEnabled) sounds.playCountdownTick();
    }, 800);

    const timer2 = setTimeout(() => {
      setCount(1);
      if (settings.soundEnabled) sounds.playCountdownTick();
    }, 1600);

    const timer1 = setTimeout(() => {
      setCount(0); // 0 = "GO!"
      if (settings.soundEnabled) sounds.playCountdownGo();
    }, 2400);

    const timerGo = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(timer3);
      clearTimeout(timer2);
      clearTimeout(timer1);
      clearTimeout(timerGo);
    };
  }, [settings.soundEnabled, onComplete]);

  // Stage details based on countdown
  const getStageInfo = () => {
    switch (count) {
      case 3:
        return {
          label: '3',
          subtext: 'Bersiaplah!',
          badgeColor: 'from-amber-400 to-orange-500 text-white shadow-amber-300/50',
          ringColor: 'border-amber-400',
        };
      case 2:
        return {
          label: '2',
          subtext: 'Fokus & Tenang...',
          badgeColor: 'from-sky-400 to-blue-600 text-white shadow-sky-300/50',
          ringColor: 'border-sky-400',
        };
      case 1:
        return {
          label: '1',
          subtext: 'Konsentrasi Penuh!',
          badgeColor: 'from-purple-500 to-indigo-600 text-white shadow-purple-300/50',
          ringColor: 'border-purple-400',
        };
      default:
        return {
          label: 'GO!',
          subtext: 'Mulai Latihan!',
          badgeColor: 'from-emerald-400 to-teal-600 text-white shadow-emerald-300/50',
          ringColor: 'border-emerald-400',
        };
    }
  };

  const stage = getStageInfo();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-slate-50">
      {/* Playful Floating Math Particles */}
      {CHEERFUL_SYMBOLS.map((item, index) => (
        <div
          key={index}
          className={`absolute select-none font-bold text-lg sm:text-2xl w-10 h-10 sm:w-12 sm:h-12 rounded-2xl border flex items-center justify-center shadow-xs animate-joyful-float ${item.color}`}
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            bottom: item.bottom,
            animationDelay: item.delay,
          }}
        >
          {item.char}
        </div>
      ))}

      {/* Main Cheerful Card */}
      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl p-8 border-2 border-indigo-100 shadow-xl text-center">
        {/* Header tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Menyiapkan Lembar Latihan</span>
        </div>

        {/* Big Cheerful Countdown Number / Badge */}
        <div className="flex justify-center my-3">
          <div
            key={count}
            className={`w-32 h-32 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr ${stage.badgeColor} flex flex-col items-center justify-center shadow-xl animate-joyful-pop transition-all`}
          >
            <span className="font-mono-numbers text-5xl sm:text-6xl font-black tracking-tight drop-shadow-sm">
              {stage.label}
            </span>
            <span className="text-xs font-bold mt-1 text-white/90 uppercase tracking-wider">
              {stage.subtext}
            </span>
          </div>
        </div>

        {/* Cheerful Progress bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-6 mb-3 p-0.5 border border-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-purple-500 to-emerald-500 transition-all duration-700 ease-linear"
            style={{
              width: count === 3 ? '25%' : count === 2 ? '55%' : count === 1 ? '85%' : '100%',
            }}
          />
        </div>

        {/* Friendly motivational tip */}
        <p className="text-xs sm:text-sm text-slate-600 font-medium min-h-[2.5rem] flex items-center justify-center italic">
          "{ENCOURAGING_TIPS[tipIndex]}"
        </p>

        {/* Session details overview */}
        <div className="mt-5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-center justify-around font-medium">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>
              <strong>{settings.questionCount}</strong> Soal
            </span>
          </div>
          <span className="text-slate-300">•</span>
          <span>
            {settings.difficultyPreset === '1-digit'
              ? '1 Digit (1-9)'
              : settings.difficultyPreset === '2-digit'
              ? '2 Digit (10-99)'
              : settings.difficultyPreset === 'up-to-1000'
              ? 'Hingga 1000'
              : settings.difficultyPreset === 'progressive'
              ? 'Bertahap 1-1000'
              : 'Kustom'}
          </span>
          <span className="text-slate-300">•</span>
          <span className="font-bold text-indigo-600">
            {settings.operations
              .map((op) =>
                op === 'addition'
                  ? '+'
                  : op === 'subtraction'
                  ? '−'
                  : op === 'multiplication'
                  ? '×'
                  : '÷'
              )
              .join(' ')}
          </span>
        </div>

        {/* Action button to immediately jump in or cancel */}
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            id="btn-transition-cancel"
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all active:scale-95"
          >
            Batal
          </button>

          <button
            type="button"
            id="btn-transition-skip"
            onClick={onComplete}
            className="flex-2 inline-flex items-center justify-center gap-2 py-2.5 px-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md hover:shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <span>Langsung Mulai</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
