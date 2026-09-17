import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiEffectProps {
  onFire?: () => void;
}

export function fireGrandCelebration() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    disableForReducedMotion: true,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // 1. Initial multi-ratio blast (center fireworks)
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'],
  });

  fire(0.2, {
    spread: 60,
    colors: ['#a855f7', '#06b6d4', '#f43f5e', '#eab308'],
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981'],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    shapes: ['circle', 'square'],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#ffd700', '#ff69b4', '#00ffff'],
  });

  // 2. Left side cannon
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 60,
      origin: { x: 0.05, y: 0.75 },
      colors: ['#ec4899', '#8b5cf6', '#f59e0b', '#10b981'],
    });
  }, 250);

  // 3. Right side cannon
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 60,
      origin: { x: 0.95, y: 0.75 },
      colors: ['#06b6d4', '#ec4899', '#a855f7', '#eab308'],
    });
  }, 400);

  // 4. Golden starry rain
  setTimeout(() => {
    confetti({
      particleCount: 40,
      angle: 90,
      spread: 100,
      startVelocity: 35,
      origin: { x: 0.5, y: 0.4 },
      shapes: ['star', 'circle'],
      colors: ['#f59e0b', '#fbbf24', '#fde047', '#ffd700'],
      scalar: 1.1,
    });
  }, 700);
}

export function ConfettiEffect({ onFire }: ConfettiEffectProps = {}) {
  const triggerConfetti = useCallback(() => {
    fireGrandCelebration();
    if (onFire) onFire();
  }, [onFire]);

  useEffect(() => {
    // Delay slightly to let screen transition finish smoothly
    const timer = setTimeout(() => {
      triggerConfetti();
    }, 150);

    return () => {
      clearTimeout(timer);
      try {
        confetti.reset();
      } catch {
        // Safe fallback
      }
    };
  }, [triggerConfetti]);

  return null;
}
