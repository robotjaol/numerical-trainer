import { useEffect, useState } from 'react';
import { Flame, Sparkles, Zap, Star, Award, Crown } from 'lucide-react';

export interface StreakInfo {
  id: number;
  streak: number;
  tier: 'good' | 'great' | 'excellent' | 'unstoppable';
  title: string;
  subtitle: string;
  badgeColor: string;
  borderColor: string;
  textColor: string;
  glowColor: string;
  particles: string[];
}

export function getStreakTierInfo(streak: number): Omit<StreakInfo, 'id' | 'streak'> | null {
  if (streak < 2) return null;

  if (streak >= 15) {
    return {
      tier: 'unstoppable',
      title: 'UNSTOPPABLE!',
      subtitle: `${streak}x Berturut-turut • Fokus Legendaris!`,
      badgeColor: 'from-amber-400 via-rose-500 to-purple-600',
      borderColor: 'border-amber-300',
      textColor: 'text-amber-900',
      glowColor: 'shadow-amber-400/40',
      particles: ['👑', '⚡', '★', '🔥', '✦', '✨'],
    };
  } else if (streak >= 10) {
    return {
      tier: 'excellent',
      title: 'EXCELLENT!',
      subtitle: `${streak}x Streak • Luar Biasa & Akurat!`,
      badgeColor: 'from-purple-600 via-pink-600 to-rose-500',
      borderColor: 'border-purple-300',
      textColor: 'text-purple-900',
      glowColor: 'shadow-purple-400/40',
      particles: ['🌟', '✨', '✦', '🎯', '💫'],
    };
  } else if (streak >= 7) {
    return {
      tier: 'great',
      title: 'AWESOME!',
      subtitle: `${streak}x Streak • Sangat Cepat!`,
      badgeColor: 'from-orange-500 to-amber-500',
      borderColor: 'border-amber-300',
      textColor: 'text-amber-900',
      glowColor: 'shadow-orange-400/35',
      particles: ['⚡', '🔥', '★', '✨'],
    };
  } else if (streak >= 5) {
    return {
      tier: 'great',
      title: 'GREAT!',
      subtitle: `${streak}x Streak • Pertahankan Ritme!`,
      badgeColor: 'from-sky-500 to-indigo-600',
      borderColor: 'border-sky-300',
      textColor: 'text-sky-900',
      glowColor: 'shadow-sky-400/35',
      particles: ['🔥', '✨', '✦'],
    };
  } else if (streak >= 3) {
    return {
      tier: 'good',
      title: 'GOOD JOB!',
      subtitle: `${streak}x Streak • Konsentrasi Bagus!`,
      badgeColor: 'from-emerald-500 to-teal-600',
      borderColor: 'border-emerald-300',
      textColor: 'text-emerald-900',
      glowColor: 'shadow-emerald-400/30',
      particles: ['✨', '👍', '★'],
    };
  } else {
    // streak === 2
    return {
      tier: 'good',
      title: 'GOOD!',
      subtitle: 'Jawaban Benar! Terus Lanjutkan!',
      badgeColor: 'from-teal-500 to-emerald-500',
      borderColor: 'border-teal-300',
      textColor: 'text-teal-900',
      glowColor: 'shadow-teal-400/25',
      particles: ['✨', '✦'],
    };
  }
}

interface StreakCelebrationProps {
  streak: number;
  triggerKey: number; // updates on each right answer
}

export function StreakCelebration({ streak, triggerKey }: StreakCelebrationProps) {
  const [activeStreakInfo, setActiveStreakInfo] = useState<StreakInfo | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (streak < 2) {
      setVisible(false);
      return;
    }

    const info = getStreakTierInfo(streak);
    if (!info) return;

    setActiveStreakInfo({
      id: triggerKey,
      streak,
      ...info,
    });
    setVisible(true);

    // Auto fade after 1.5s
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [streak, triggerKey]);

  if (!visible || !activeStreakInfo) return null;

  const renderIcon = () => {
    switch (activeStreakInfo.tier) {
      case 'unstoppable':
        return <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 fill-yellow-300 animate-bounce" />;
      case 'excellent':
        return <Award className="w-5 h-5 sm:w-6 sm:h-6 text-pink-200 fill-pink-200 animate-pulse" />;
      case 'great':
        return activeStreakInfo.streak >= 7 ? (
          <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300 fill-yellow-300 animate-pulse" />
        ) : (
          <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-200 fill-orange-200 animate-bounce" />
        );
      default:
        return activeStreakInfo.streak >= 3 ? (
          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-200 fill-emerald-200 animate-spin" style={{ animationDuration: '4s' }} />
        ) : (
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-teal-200" />
        );
    }
  };

  return (
    <div className="absolute -top-7 sm:-top-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none select-none flex flex-col items-center">
      {/* Floating Particles */}
      <div className="relative w-full flex justify-center">
        {activeStreakInfo.particles.map((char, idx) => {
          const offsetLeft = (idx - activeStreakInfo.particles.length / 2) * 28;
          return (
            <span
              key={`${activeStreakInfo.id}-${idx}`}
              className="absolute text-sm sm:text-base animate-joyful-float font-bold drop-shadow-sm opacity-90"
              style={{
                left: `calc(50% + ${offsetLeft}px)`,
                top: `${-14 - (idx % 2) * 8}px`,
                animationDelay: `${idx * 0.15}s`,
                animationDuration: '2s',
              }}
            >
              {char}
            </span>
          );
        })}
      </div>

      {/* Main Streak Badge Banner */}
      <div
        key={activeStreakInfo.id}
        className={`animate-streak-pop flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r ${activeStreakInfo.badgeColor} text-white shadow-lg ${activeStreakInfo.glowColor} border-2 ${activeStreakInfo.borderColor} backdrop-blur-xs`}
      >
        <div className="flex items-center justify-center p-1 rounded-full bg-white/20">
          {renderIcon()}
        </div>

        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-xs sm:text-sm tracking-wider uppercase drop-shadow-xs">
              {activeStreakInfo.title}
            </span>
            <span className="text-[10px] sm:text-xs font-mono font-black px-1.5 py-0.5 rounded-full bg-white/25">
              {activeStreakInfo.streak}x
            </span>
          </div>
          <span className="text-[10px] sm:text-xs font-semibold text-white/90 leading-tight">
            {activeStreakInfo.subtitle}
          </span>
        </div>
      </div>
    </div>
  );
}
