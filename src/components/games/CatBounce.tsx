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
  scale: number;
}

export default function CatBounce({ onClose }: { onClose: () => void }) {
  const catsRef = useRef<Cat[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const nextIdRef = useRef(0);
  const [cats, setCats] = useState<Cat[]>([]);

  const catImages = [
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=100&h=100&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1579581570160-ce0133b63971?w=100&h=100&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=100&h=100&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1506755855726-85d230d8b83e?w=100&h=100&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1514888286974-6c05e2bfb302?w=100&h=100&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1495360010591-d7aa0f1dee33?w=100&h=100&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=100&h=100&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=100&h=100&fit=crop&auto=format',
  ];

  const createCat = () => {
    const newCat: Cat = {
      id: nextIdRef.current++,
      x: Math.random() * (window.innerWidth - 100),
      y: Math.random() * (window.innerHeight - 100),
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.5) * 12,
      imageUrl: catImages[Math.floor(Math.random() * catImages.length)],
      size: 100,
      rotation: Math.random() * 360,
      scale: 0,
    };
    catsRef.current.push(newCat);
    
    // Animate scale in
    let scale = 0;
    const scaleIn = setInterval(() => {
      scale += 0.1;
      if (scale >= 1) {
        scale = 1;
        clearInterval(scaleIn);
      }
      const catIndex = catsRef.current.findIndex(c => c.id === newCat.id);
      if (catIndex !== -1) {
        catsRef.current[catIndex].scale = scale;
        setCats([...catsRef.current]);
      }
    }, 16);
  };

  const makeItRain = () => {
    for (let i = 0; i < 15; i++) {
      setTimeout(() => createCat(), i * 50);
    }
  };

  const clearCats = () => {
    catsRef.current = [];
    setCats([]);
  };

  useEffect(() => {
    // Create initial cats
    for (let i = 0; i < 8; i++) {
      setTimeout(() => createCat(), i * 150);
    }

    // Make it rain function available globally
    (window as any).makeItRain = makeItRain;
    (window as any).clearCats = clearCats;

    return () => {
      delete (window as any).makeItRain;
      delete (window as any).clearCats;
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      const gravity = 0.3;
      const friction = 0.99;
      const bounceEnergy = 0.85;

      catsRef.current = catsRef.current.map(cat => {
        let newX = cat.x + cat.vx;
        let newY = cat.y + cat.vy;
        let newVx = cat.vx * friction;
        let newVy = cat.vy * friction + gravity;

        // Bounce off walls
        if (newX <= 0) {
          newVx = Math.abs(newVx) * bounceEnergy;
          newX = 0;
        } else if (newX >= window.innerWidth - cat.size) {
          newVx = -Math.abs(newVx) * bounceEnergy;
          newX = window.innerWidth - cat.size;
        }

        if (newY <= 0) {
          newVy = Math.abs(newVy) * bounceEnergy;
          newY = 0;
        } else if (newY >= window.innerHeight - cat.size) {
          newVy = -Math.abs(newVy) * bounceEnergy;
          newY = window.innerHeight - cat.size;
        }

        // Add some random movement to keep it interesting
        if (Math.random() > 0.98) {
          newVx += (Math.random() - 0.5) * 2;
          newVy -= Math.random() * 3;
        }

        return {
          ...cat,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          rotation: cat.rotation + (newVx + newVy) * 0.5,
        };
      });

      setCats([...catsRef.current]);
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
      {/* Background particles */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#ffc105] rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Bouncing Cats */}
      {cats.map(cat => (
        <div
          key={cat.id}
          className="absolute transition-transform"
          style={{
            left: cat.x,
            top: cat.y,
            transform: `rotate(${cat.rotation}deg) scale(${cat.scale})`,
            transition: 'transform 0.1s linear',
          }}
        >
          <div className="relative">
            <img
              src={cat.imageUrl}
              alt="Bouncing cat"
              className="w-24 h-24 rounded-full border-3 border-[#ffc105] shadow-2xl"
              style={{
                filter: 'drop-shadow(0 0 15px rgba(255, 193, 5, 0.6))',
              }}
            />
            <div className="absolute -bottom-2 -right-2 text-2xl animate-bounce">
              🐾
            </div>
            {/* Speed indicator */}
            <div className="absolute -top-1 -right-1 text-xs bg-black/50 text-white px-1 rounded">
              {Math.round(Math.sqrt(cat.vx * cat.vx + cat.vy * cat.vy))}
            </div>
          </div>
        </div>
      ))}

      {/* Cat counter */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-black/50 backdrop-blur px-4 py-2 rounded-full">
          <span className="text-[#ffc105] font-bold text-lg">
            🐱 {cats.length} cats
          </span>
        </div>
      </div>

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
          Cats are bouncing with gravity!
        </p>
        <p className="text-[#7a93b4] text-sm">
          Click buttons to add more cats or clear them all
        </p>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => (window as any).makeItRain()}
          className="bg-[#ffc105] text-[#080f1c] border-none px-6 py-2 rounded font-bold uppercase tracking-[.08em] cursor-pointer hover:bg-[#ffcf3a] transition-all hover:shadow-lg"
        >
          🌧️ Rain Cats
        </button>
        <button
          onClick={() => (window as any).clearCats()}
          className="bg-[#e74c3c] text-white border-none px-6 py-2 rounded font-bold uppercase tracking-[.08em] cursor-pointer hover:bg-[#c0392b] transition-all hover:shadow-lg"
        >
          🧹 Clear
        </button>
        <button
          onClick={onClose}
          className="bg-[#ffc105] text-[#080f1c] border-none px-6 py-2 rounded font-bold uppercase tracking-[.08em] cursor-pointer hover:bg-[#ffcf3a] transition-all hover:shadow-lg"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
