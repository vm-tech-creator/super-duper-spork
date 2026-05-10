'use client';

import { useEffect, useRef, useState } from 'react';

interface Milestone {
  distance: number;
  label: string;
  achieved: boolean;
}

const MILESTONES: Milestone[] = [
  { distance: 0.1, label: '0.1 mi', achieved: false },
  { distance: 0.5, label: '0.5 mi', achieved: false },
  { distance: 1, label: '1 mi', achieved: false },
  { distance: 5, label: '5 mi', achieved: false },
  { distance: 10, label: '10 mi', achieved: false },
  { distance: 50, label: '50 mi', achieved: false },
  { distance: 100, label: '100 mi', achieved: false },
];

const PIXELS_PER_MILE = 5280;
const TOKEN_VALUE = 0.01; // 1 token per 0.01 mile

export default function EndlessHorse({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [legLength, setLegLength] = useState(100);
  const [tokens, setTokens] = useState(0);
  const [milestones, setMilestones] = useState<Milestone[]>(MILESTONES);
  const [distance, setDistance] = useState(0);
  const animationRef = useRef<number>();
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Draw pixelated horse
    const drawHorse = (x: number, y: number, legLen: number) => {
      ctx.fillStyle = '#f5f5dc'; // Beige background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const pixelSize = 8;
      const scale = (size: number) => Math.round(size / pixelSize) * pixelSize;

      const drawPixelRect = (px: number, py: number, pw: number, ph: number, color: string) => {
        ctx.fillStyle = color;
        ctx.fillRect(px, py, pw, ph);
      };

      // Draw body (brown)
      drawPixelRect(x, y, scale(100), scale(60), '#8B4513');

      // Draw head (brown)
      drawPixelRect(x - scale(80), y - scale(40), scale(60), scale(50), '#8B4513');

      // Draw mane (black)
      drawPixelRect(x - scale(60), y - scale(60), scale(20), scale(30), '#000000');
      drawPixelRect(x - scale(40), y - scale(55), scale(20), scale(25), '#000000');
      drawPixelRect(x - scale(20), y - scale(50), scale(20), scale(20), '#000000');

      // Draw ear (brown)
      drawPixelRect(x - scale(90), y - scale(100), scale(12), scale(30), '#8B4513');

      // Draw snout (light brown)
      drawPixelRect(x - scale(100), y - scale(20), scale(25), scale(20), '#A0522D');

      // Draw eye (black)
      drawPixelRect(x - scale(95), y - scale(45), scale(4), scale(4), '#000000');

      // Draw front legs
      const frontLegX1 = x + scale(15);
      const frontLegX2 = x + scale(50);
      const legBottomY = y + scale(60);

      drawPixelRect(frontLegX1, legBottomY, scale(12), legLen, '#A0522D');
      drawPixelRect(frontLegX2, legBottomY, scale(12), legLen, '#A0522D');

      // Draw back legs
      const backLegX1 = x - scale(50);
      const backLegX2 = x - scale(15);

      drawPixelRect(backLegX1, legBottomY, scale(12), legLen, '#A0522D');
      drawPixelRect(backLegX2, legBottomY, scale(12), legLen, '#A0522D');

      // Draw tail (black)
      const tailStartX = x - scale(100);
      const tailStartY = y + scale(20);
      for (let i = 0; i < Math.min(legLen, 200); i += 8) {
        drawPixelRect(
          tailStartX + Math.sin(i / 20) * scale(10),
          tailStartY + i,
          scale(8),
          scale(8),
          '#000000'
        );
      }
    };

    // Handle scroll
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollRef.current += e.deltaY;
      const newDistance = Math.max(0, scrollRef.current / PIXELS_PER_MILE);
      setDistance(newDistance);

      const newLegLength = 100 + scrollRef.current / 10;
      setLegLength(newLegLength);

      const newTokens = Math.floor(newDistance / TOKEN_VALUE);
      setTokens(newTokens);

      // Check milestones
      setMilestones((prev) =>
        prev.map((m) => ({
          ...m,
          achieved: newDistance >= m.distance || m.achieved,
        }))
      );
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    // Animation loop
    const animate = () => {
      drawHorse(canvas.width / 2, canvas.height / 3, legLength);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const newMilestones = milestones.filter((m) => m.achieved);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />

      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <h1 className="text-[#8B4513] font-bold text-3xl drop-shadow-lg">
          🐴 Endless Horse
        </h1>
        <p className="text-[#A0522D] text-sm mt-2">Scroll to stretch those legs!</p>
      </div>

      {/* Stats */}
      <div className="absolute top-4 right-4 z-10 bg-black/40 px-6 py-4 rounded-lg backdrop-blur">
        <div className="text-[#f5f5dc] font-bold text-lg">
          Tokens: <span className="text-yellow-400">{tokens}</span>
        </div>
        <div className="text-[#f5f5dc] text-sm mt-2">
          Distance: <span className="text-yellow-400">{distance.toFixed(2)} mi</span>
        </div>
        <div className="text-[#f5f5dc] text-sm mt-1">
          Leg Length: <span className="text-yellow-400">{Math.round(legLength)}px</span>
        </div>
      </div>

      {/* Milestones */}
      <div className="absolute bottom-4 right-4 z-10 bg-black/40 px-6 py-4 rounded-lg backdrop-blur max-h-96 overflow-y-auto">
        <div className="text-[#f5f5dc] font-bold mb-2">Milestones Achieved:</div>
        {newMilestones.length === 0 ? (
          <div className="text-[#A0522D] text-sm">Keep scrolling...</div>
        ) : (
          <div className="space-y-1">
            {newMilestones.map((m) => (
              <div key={m.label} className="text-yellow-400 text-sm">
                ✓ {m.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-4 z-10">
        <button
          onClick={onClose}
          className="bg-[#8B4513] text-[#f5f5dc] border-2 border-[#f5f5dc] px-6 py-2 rounded font-bold uppercase tracking-[.08em] cursor-pointer hover:bg-[#A0522D] transition-colors"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
