'use client';

import { useEffect, useRef, useState } from 'react';

interface NeonFlamesProps {
  onClose: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
  alpha: number;
}

export default function NeonFlames({ onClose }: NeonFlamesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<{ x: number; y: number; size: number; alpha: number; offset: number }[]>([]);
  const pointerRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);
  const [started, setStarted] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      starsRef.current = Array.from({ length: 120 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.6 + 0.3,
        alpha: Math.random() * 0.6 + 0.15,
        offset: Math.random() * Math.PI * 2,
      }));
    };

    resize();
    window.addEventListener('resize', resize);

    const createParticle = (x: number, y: number) => {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 3.2,
        vy: (Math.random() - 0.5) * 3.2,
        size: Math.random() * 6 + 5,
        hue: 190 + Math.random() * 120,
        alpha: 1,
      });
      if (particlesRef.current.length > 320) {
        particlesRef.current.splice(0, particlesRef.current.length - 320);
      }
    };

    const update = (time: number) => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = 'rgba(0, 0, 18, 0.08)';
      ctx.fillRect(0, 0, width, height);

      const nebula = ctx.createRadialGradient(width * 0.6, height * 0.3, 0, width * 0.6, height * 0.3, width * 1.2);
      nebula.addColorStop(0, 'rgba(88, 128, 255, 0.22)');
      nebula.addColorStop(0.42, 'rgba(79, 9, 120, 0.14)');
      nebula.addColorStop(1, 'rgba(0, 0, 10, 0.95)');
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      starsRef.current.forEach((star) => {
        star.x += Math.sin((time + star.offset * 400) * 0.00008) * 0.3;
        star.y += Math.cos((time + star.offset * 500) * 0.00006) * 0.2;
        if (star.x > width) star.x = 0;
        if (star.x < 0) star.x = width;
        if (star.y > height) star.y = 0;
        if (star.y < 0) star.y = height;
        ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      particlesRef.current = particlesRef.current.filter((particle) => particle.alpha > 0.02 && particle.size > 0.5);
      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.98;
        particle.vy *= 0.98;
        particle.alpha *= 0.96;
        particle.size *= 0.986;

        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 10);
        gradient.addColorStop(0, `hsla(${particle.hue}, 100%, 80%, ${particle.alpha})`);
        gradient.addColorStop(0.2, `hsla(${particle.hue}, 100%, 70%, ${particle.alpha * 0.35})`);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 8, 0, Math.PI * 2);
        ctx.fill();
      });

      if (startedRef.current && (pointerRef.current.x !== 0 || pointerRef.current.y !== 0)) {
        createParticle(pointerRef.current.x, pointerRef.current.y);
      }

      animationRef.current = requestAnimationFrame(update);
    };

    animationRef.current = requestAnimationFrame(update);

    const moveHandler = (event: MouseEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY };
      if (!startedRef.current) return;
      for (let i = 0; i < 3; i += 1) {
        createParticle(event.clientX + (Math.random() - 0.5) * 16, event.clientY + (Math.random() - 0.5) * 16);
      }
    };

    window.addEventListener('mousemove', moveHandler);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', moveHandler);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030414] text-sahara-text">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {!started && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-[#030414]/95 p-6">
          <div className="max-w-2xl rounded-[32px] border border-white/10 bg-[#020613]/95 p-10 text-center shadow-[0_40px_120px_rgba(0,0,0,.5)] backdrop-blur-xl">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#8cb9ff]">Neon Flames</p>
            <h2 className="mb-6 text-4xl font-black uppercase tracking-[0.12em] text-sahara-text sm:text-5xl">
              Start Painting Your Nebula
            </h2>
            <p className="mb-8 text-base leading-7 text-[#b2c7ff]">
              Enter full-screen cosmic mode and paint a glowing nebula trail across a slowly drifting space background.
            </p>
            <button
              onClick={() => {
                startedRef.current = true;
                setStarted(true);
              }}
              className="rounded-full bg-gradient-to-r from-[#7c4dff] to-[#00d4ff] px-8 py-4 text-base font-semibold uppercase tracking-[0.14em] text-sahara-bg shadow-[0_20px_50px_rgba(124,77,255,.35)] transition hover:scale-[1.02]"
            >
              Start Painting
            </button>
          </div>
        </div>
      )}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 sm:px-10">
        <header className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-black/20 px-5 py-4 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,.35)]">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[#8cb9ff]">Neon Flames</p>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-[0.12em] text-sahara-text sm:text-4xl">
              Paint your own nebula
            </h1>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-[#ffffff33] bg-sahara-bg/80 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-sahara-gold transition hover:border-[#ffc105] hover:bg-[#111826]"
          >
            Exit
          </button>
        </header>

        <section className="mt-10 rounded-[32px] border border-white/10 bg-black/30 p-6 backdrop-blur-2xl shadow-[0_40px_120px_rgba(0,0,0,.45)]">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <p className="max-w-2xl text-sm leading-7 text-[#b2c7ff] sm:text-base">
                Move your cursor through a drifting cosmic canvas and watch luminous nebula trails bloom behind your pointer. Every stroke leaves glowing color, sparks, and swirling cosmic dust across a slowly shifting starfield.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  'Glowing cosmic trails',
                  'Slow-moving starfield',
                  'Interactive nebula painting',
                  'Live cursor particle effects',
                ].map((feature) => (
                  <div key={feature} className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#d7e5ff]">
                    {feature}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-[#ffffff11] bg-[#061026]/80 p-4 text-sm text-[#8fbaf4] shadow-inner shadow-[#1b3153]/30">
              <p className="font-semibold uppercase tracking-[0.2em] text-[#81c2ff]">How to play</p>
              <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-[#c7d6ff]">
                <li>Move the mouse to paint a neon nebula trail.</li>
                <li>Drag quickly to make brighter bursts.</li>
                <li>Leave the page and return to stop the flow.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
