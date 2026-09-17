import { useEffect, useState, useRef } from 'react';
import { Sparkles, Zap, Brain, ArrowRight, Target, Flame, BarChart3, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/audio';

interface JoyfulInitialLoadingScreenProps {
  onComplete: () => void;
  soundEnabled?: boolean;
}

const FLOATING_MATH_ELEMENTS = [
  { char: '+', color: 'text-emerald-500 bg-emerald-50 border-emerald-200', top: '12%', left: '8%', delay: '0s', size: 'w-10 h-10 text-lg' },
  { char: '×', color: 'text-purple-500 bg-purple-50 border-purple-200', top: '18%', right: '10%', delay: '0.5s', size: 'w-11 h-11 text-xl' },
  { char: '÷', color: 'text-amber-500 bg-amber-50 border-amber-200', bottom: '16%', left: '10%', delay: '0.8s', size: 'w-10 h-10 text-lg' },
  { char: '−', color: 'text-sky-500 bg-sky-50 border-sky-200', bottom: '22%', right: '8%', delay: '0.3s', size: 'w-10 h-10 text-lg' },
  { char: '9', color: 'text-pink-500 bg-pink-50 border-pink-200', top: '45%', left: '5%', delay: '0.7s', size: 'w-9 h-9 text-base' },
  { char: '=', color: 'text-indigo-500 bg-indigo-50 border-indigo-200', top: '55%', right: '6%', delay: '1.1s', size: 'w-9 h-9 text-base' },
  { char: '★', color: 'text-yellow-500 bg-yellow-50 border-yellow-200', top: '8%', right: '32%', delay: '0.2s', size: 'w-9 h-9 text-sm' },
  { char: '✦', color: 'text-rose-500 bg-rose-50 border-rose-200', bottom: '12%', left: '36%', delay: '0.9s', size: 'w-8 h-8 text-xs' },
];

const LOADING_STAGES = [
  { threshold: 0, text: 'Menyiapkan mesin angka & generator kalkulasi...', emoji: '⚡' },
  { threshold: 30, text: 'Menghangatkan konsentrasi & refleks otak...', emoji: '🧠' },
  { threshold: 65, text: 'Menata kartu latihan & sistem combo streak...', emoji: '🎯' },
  { threshold: 92, text: 'Semua siap! Siapkan fokus terbaikmu!', emoji: '🚀' },
];

export function JoyfulInitialLoadingScreen({
  onComplete,
  soundEnabled = true,
}: JoyfulInitialLoadingScreenProps) {
  const [progress, setProgress] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [currentStageText, setCurrentStageText] = useState<string>(LOADING_STAGES[0].text);
  const [currentEmoji, setCurrentEmoji] = useState<string>(LOADING_STAGES[0].emoji);
  const hasPlayedSoundRef = useRef<boolean>(false);

  // Smooth progress increment
  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      // Accelerate naturally as it approaches 100
      const increment = Math.floor(Math.random() * 8) + 5;
      currentProgress += increment;

      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        setIsReady(true);
        clearInterval(interval);

        // Play friendly welcome chime
        if (soundEnabled && !hasPlayedSoundRef.current) {
          hasPlayedSoundRef.current = true;
          sounds.playJoyfulWelcome();
        }

        // Auto advance smoothly after brief victory pause
        setTimeout(() => {
          onComplete();
        }, 900);
      } else {
        setProgress(currentProgress);
      }

      // Update friendly stage status
      for (let i = LOADING_STAGES.length - 1; i >= 0; i--) {
        if (currentProgress >= LOADING_STAGES[i].threshold) {
          setCurrentStageText(LOADING_STAGES[i].text);
          setCurrentEmoji(LOADING_STAGES[i].emoji);
          break;
        }
      }
    }, 90);

    return () => clearInterval(interval);
  }, [onComplete, soundEnabled]);

  return (
    <div
      id="joyful-initial-loading-screen"
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-50/90 via-slate-50 to-purple-50/90 backdrop-blur-md p-4 sm:p-6 overflow-hidden select-none"
    >
      {/* Playful Floating Math Particles */}
      {FLOATING_MATH_ELEMENTS.map((item, idx) => (
        <div
          key={idx}
          className={`absolute ${item.size} rounded-2xl border-2 flex items-center justify-center font-black shadow-sm pointer-events-none animate-joyful-float ${item.color}`}
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            bottom: item.bottom,
            animationDelay: item.delay,
            animationDuration: '3.8s',
          }}
        >
          {item.char}
        </div>
      ))}

      {/* Skip Button at Top Right */}
      <button
        type="button"
        id="btn-skip-loading"
        onClick={onComplete}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-indigo-600 font-semibold text-xs sm:text-sm border border-slate-200/80 shadow-xs transition-all duration-150 cursor-pointer hover:scale-105 active:scale-95"
      >
        Lewati & Langsung Masuk →
      </button>

      {/* Central Joyful Card */}
      <div className="relative w-full max-w-lg bg-white/95 rounded-3xl border border-indigo-100/80 shadow-xl shadow-indigo-500/10 p-6 sm:p-10 text-center animate-joyful-fade-scale">
        {/* Top Decorative Shimmer Accent */}
        <div className="absolute top-0 left-8 right-8 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-b-full shadow-xs" />

        {/* Mascot Icon Centerpiece */}
        <div className="flex justify-center mb-5">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 animate-joyful-pulse-scale">
              <Brain className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>

            {/* Orbiting Sparkles & Zap */}
            <div className="absolute -top-2 -right-2 p-2 rounded-full bg-amber-400 text-amber-950 shadow-md shadow-amber-400/40 animate-bounce">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <div className="absolute -bottom-1 -left-2 p-1.5 rounded-full bg-pink-500 text-white shadow-md shadow-pink-500/40 animate-pulse">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* App Title & Greeting */}
        <div className="space-y-1.5 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Selamat Datang</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            MathSprint{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Speed Math
            </span>
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm font-medium">
            Latihan Penalaran Numerik & Refleks Hitung Kilat
          </p>
        </div>

        {/* Progress Bar & Percentage Pill */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 px-1">
            <span className="flex items-center gap-1.5">
              <span className="text-base">{currentEmoji}</span>
              <span className="truncate max-w-[240px] sm:max-w-none text-left">{currentStageText}</span>
            </span>
            <span className="font-mono-numbers text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md font-extrabold">
              {progress}%
            </span>
          </div>

          <div className="w-full h-3.5 sm:h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/80 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-150 ease-out shadow-xs relative"
              style={{ width: `${progress}%` }}
            >
              {/* Sparkling light reflection */}
              <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/60 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* 4 Joyful Features Showcase */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <Zap className="w-4 h-4 text-amber-500 mb-1" />
            <span className="text-[11px] font-bold text-slate-700">Refleks Kilat</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <Target className="w-4 h-4 text-emerald-500 mb-1" />
            <span className="text-[11px] font-bold text-slate-700">Akurasi 100%</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <Flame className="w-4 h-4 text-rose-500 mb-1" />
            <span className="text-[11px] font-bold text-slate-700">Combo Streak</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <BarChart3 className="w-4 h-4 text-indigo-500 mb-1" />
            <span className="text-[11px] font-bold text-slate-700">Grafik Detail</span>
          </div>
        </div>

        {/* Bottom Action Button */}
        <div>
          {isReady ? (
            <button
              type="button"
              id="btn-enter-app-ready"
              onClick={onComplete}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-emerald-500/25 animate-joyful-pop hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Masuk ke Arena Latihan!</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              id="btn-enter-app-wait"
              onClick={onComplete}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm border border-slate-200 transition-all duration-150 cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <span>Langsung Mulai Tanpa Menunggu</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
