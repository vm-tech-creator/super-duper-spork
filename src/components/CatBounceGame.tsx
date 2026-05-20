'use client';

import { useState, useEffect } from 'react';

interface Cat {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
}

export default function CatBounceGame() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [isRaining, setIsRaining] = useState(false);
  const [score, setScore] = useState(0);

  const catImages = [
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1544568100-847a948585b9?w=100&h=100&fit=crop',
  ];

  const createCat = (x?: number, y?: number): Cat => ({
    id: Date.now() + Math.random(),
    x: x ?? Math.random() * (window.innerWidth - 100),
    y: y ?? -100,
    vx: (Math.random() - 0.5) * 8,
    vy: Math.random() * 3 + 2,
    rotation: 0,
    rotationSpeed: (Math.random() - 0.5) * 10,
  });

  const addCat = () => {
    setCats(prev => [...prev, createCat()]);
    setScore(prev => prev + 1);
  };

  const makeItRain = () => {
    setIsRaining(true);
    const newCats = Array.from({ length: 20 }, () => createCat());
    setCats(prev => [...prev, ...newCats]);
    setScore(prev => prev + 20);

    setTimeout(() => setIsRaining(false), 3000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCats(prev => prev.map(cat => {
        let newX = cat.x + cat.vx;
        let newY = cat.y + cat.vy;
        let newVx = cat.vx;
        let newVy = cat.vy + 0.3; // gravity

        // Bounce off walls
        if (newX <= 0 || newX >= window.innerWidth - 100) {
          newVx = -newVx * 0.8; // lose some energy
          newX = Math.max(0, Math.min(window.innerWidth - 100, newX));
        }

        // Bounce off floor
        if (newY >= window.innerHeight - 100) {
          newVy = -newVy * 0.8;
          newY = window.innerHeight - 100;
        }

        // Remove cats that fall too far below screen
        if (newY > window.innerHeight + 100) {
          return null;
        }

        return {
          ...cat,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          rotation: cat.rotation + cat.rotationSpeed,
        };
      }).filter(Boolean) as Cat[]);
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-blue-400 to-blue-600 overflow-hidden cursor-pointer" onClick={addCat}>
      {/* Background */}
      <div className="absolute inset-0 bg-white/10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      {/* Cats */}
      {cats.map(cat => (
        <img
          key={cat.id}
          src={catImages[Math.floor(Math.random() * catImages.length)]}
          alt="Bouncing cat"
          className="absolute w-24 h-24 rounded-full object-cover shadow-lg transition-transform"
          style={{
            left: cat.x,
            top: cat.y,
            transform: `rotate(${cat.rotation}deg)`,
          }}
        />
      ))}

      {/* UI */}
      <div className="absolute top-4 left-4 text-white">
        <h1 className="text-3xl font-bold mb-2">Cat Bounce!</h1>
        <p className="text-lg">Click anywhere to add cats • Score: {score}</p>
      </div>

      <div className="absolute top-4 right-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            makeItRain();
          }}
          disabled={isRaining}
          className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 text-black font-bold py-3 px-6 rounded-full text-lg shadow-lg transition-all transform hover:scale-105 disabled:cursor-not-allowed"
        >
          {isRaining ? '🌧️ Raining Cats!' : '🌧️ Make It Rain!'}
        </button>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-white">
        <p className="text-lg mb-2">Click anywhere to spawn bouncing cats!</p>
        <p className="text-sm opacity-75">Cats bounce with physics and disappear when they fall off screen</p>
      </div>
    </div>
  );
}