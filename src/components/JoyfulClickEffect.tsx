import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  shape: string;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  color: string;
}

const JOYFUL_COLORS = [
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#f43f5e', // Rose
  '#6366f1', // Indigo
];

const JOYFUL_SHAPES = ['★', '✦', '●', '▲', '◆', '♥', '✿'];

export function JoyfulClickEffect() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if clicked element is interactive (button, link, or child of one)
      const clickable = target.closest('button, [role="button"], a, input[type="button"], input[type="submit"], input[type="checkbox"], label');
      if (!clickable) return;

      const clickX = e.clientX;
      const clickY = e.clientY;

      // Create a cheerful ripple at click
      const randomColor = JOYFUL_COLORS[Math.floor(Math.random() * JOYFUL_COLORS.length)];
      const newRippleId = Date.now() + Math.random();
      setRipples((prev) => [...prev.slice(-4), { id: newRippleId, x: clickX, y: clickY, color: randomColor }]);

      // Generate 7-10 cheerful confetti particles
      const count = 8;
      const newParticles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
        const speed = 40 + Math.random() * 60;
        const color = JOYFUL_COLORS[Math.floor(Math.random() * JOYFUL_COLORS.length)];
        const shape = JOYFUL_SHAPES[Math.floor(Math.random() * JOYFUL_SHAPES.length)];

        newParticles.push({
          id: Date.now() + i + Math.random(),
          x: clickX,
          y: clickY,
          color,
          shape,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 20, // slight upward bias
          size: 10 + Math.random() * 8,
          rotation: Math.random() * 360,
        });
      }

      setParticles((prev) => [...prev.slice(-25), ...newParticles]);

      // Cleanup ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRippleId));
      }, 600);
    };

    window.addEventListener('click', handleClick, { passive: true });
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // Periodic particle cleanup
  useEffect(() => {
    if (particles.length === 0) return;
    const timer = setTimeout(() => {
      setParticles([]);
    }, 700);
    return () => clearTimeout(timer);
  }, [particles]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none">
      {/* Expanding cheerful click ripples */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none animate-ping opacity-60"
          style={{
            left: ripple.x - 25,
            top: ripple.y - 25,
            width: 50,
            height: 50,
            backgroundColor: ripple.color,
            animationDuration: '0.45s',
          }}
        />
      ))}

      {/* Joyful particles bursting from click */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute font-bold transition-all duration-500 ease-out pointer-events-none drop-shadow-xs"
          style={{
            left: p.x,
            top: p.y,
            color: p.color,
            fontSize: `${p.size}px`,
            transform: `translate(${p.vx}px, ${p.vy}px) rotate(${p.rotation}deg) scale(0)`,
            opacity: 0,
          }}
        >
          {p.shape}
        </span>
      ))}
    </div>
  );
}
