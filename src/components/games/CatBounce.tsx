'use client';

import { useEffect, useRef, useState } from 'react';

interface Cat {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  imageUrl: string;
  size: number;
  rotation: number;
}

export default function CatBounce({ onClose }: { onClose: () => void }) {
  const [cats, setCats] = useState<Cat[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const nextIdRef = useRef(0);

  const catImages = [
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=80&h=80&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1579581570160-ce0133b63971?w=80&h=80&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=80&h=80&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1506755855726-85d230d8b83e?w=80&h=80&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1514888286974-6c05e2bfb302?w=80&h=80&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1495360010591-d7aa0f1dee33?w=80&h=80&fit=crop&auto=format',
  ];

  const createCat = () => {
    const newCat: Cat = {
      id: nextIdRef.current++,
      x: Math.random() * (window.innerWidth - 80),
      y: Math.random() * (window.innerHeight - 80),
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      imageUrl: catImages[Math.floor(Math.random() * catImages.length)],
      size: 80,
      rotation: Math.random() * 360,
    };
    setCats(prev => [...prev, newCat]);
  };

  const makeItRain = () => {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => createCat(), i * 100);
    }
  };

  useEffect(() => {
    // Create initial cats
    for (let i = 0; i < 5; i++) {
      setTimeout(() => createCat(), i * 200);
    }

    // Make it rain function available globally
    (window as any).makeItRain = makeItRain;

    return () => {
      delete (window as any).makeItRain;
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      setCats(prevCats => 
        prevCats.map(cat => {
          let newX = cat.x + cat.vx;
          let newY = cat.y + cat.vy;
          let newVx = cat.vx;
          let newVy = cat.vy;

          // Bounce off walls
          if (newX <= 0 || newX >= window.innerWidth - cat.size) {
            newVx = -newVx;
            newX = Math.max(0, Math.min(window.innerWidth - cat.size, newX));
          }
          if (newY <= 0 || newY >= window.innerHeight - cat.size) {
            newVy = -newVy;
            newY = Math.max(0, Math.min(window.innerHeight - cat.size, newY));
          }

          return {
            ...cat,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            rotation: cat.rotation + 2,
          };
        })
      );

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-[#0d1a2e] to-[#001a4d]">
      {/* Bouncing Cats */}
      {cats.map(cat => (
        <div
          key={cat.id}
          className="absolute transition-all duration-100"
          style={{
            left: cat.x,
            top: cat.y,
            transform: `rotate(${cat.rotation}deg)`,
          }}
        >
          <div className="relative">
            <img
              src={cat.imageUrl}
              alt="Bouncing cat"
              className="w-20 h-20 rounded-full border-2 border-[#ffc105] shadow-lg"
              style={{
                filter: 'drop-shadow(0 0 10px rgba(255, 193, 5, 0.4))',
              }}
            />
            <div className="absolute -bottom-1 -right-1 text-lg">
              🐾
            </div>
          </div>
        </div>
      ))}

      {/* Header with Navigation */}
      <div className="absolute top-4 left-4 z-50">
        <h1 className="text-[#ffc105] font-bold text-2xl mb-2">🐱 Cat Bounce</h1>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.href = '/games'}
            className="bg-[#497ab6] text-[#e8edf5] border-none px-4 py-1 rounded text-sm font-bold uppercase tracking-[.08em] cursor-pointer hover:bg-[#2b4c7d] transition-all"
          >
            ← Games
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-[#497ab6] text-[#e8edf5] border-none px-4 py-1 rounded text-sm font-bold uppercase tracking-[.08em] cursor-pointer hover:bg-[#2b4c7d] transition-all"
          >
            🏠 Home
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-40">
        <p className="text-[#ffc105] text-lg font-bold mb-2">
          Cats are bouncing around!
        </p>
        <p className="text-[#7a93b4] text-sm">
          Click "Make it Rain Cats" to add more bouncing cats
        </p>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => (window as any).makeItRain()}
          className="bg-[#ffc105] text-[#080f1c] border-none px-6 py-2 rounded font-bold uppercase tracking-[.08em] cursor-pointer hover:bg-[#ffcf3a] transition-all hover:shadow-lg"
        >
          🌧️ Make it Rain Cats
        </button>
        <button
          onClick={onClose}
          className="bg-[#ffc105] text-[#080f1c] border-none px-6 py-2 rounded font-bold uppercase tracking-[.08em] cursor-pointer hover:bg-[#ffcf3a] transition-all hover:shadow-lg"
        >
          ← Back to Game Details
        </button>
      </div>
    </div>
  );
}
