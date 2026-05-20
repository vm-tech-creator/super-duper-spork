'use client';

import { useEffect, useRef, useState } from 'react';

interface PointingPerson {
  id: number;
  x: number;
  y: number;
  imageUrl: string;
  rotation: number;
}

export default function ThePointingPointer({ onClose }: { onClose: () => void }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [pointingPeople, setPointingPeople] = useState<PointingPerson[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(0);

  const pointingPhotos = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&h=150&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&auto=format',
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Show random pointing person occasionally
      if (Math.random() > 0.97) {
        const randomPhoto = pointingPhotos[Math.floor(Math.random() * pointingPhotos.length)];
        const angle = Math.atan2(e.clientY - window.innerHeight / 2, e.clientX - window.innerWidth / 2);
        
        const newPerson: PointingPerson = {
          id: nextIdRef.current++,
          x: e.clientX,
          y: e.clientY,
          imageUrl: randomPhoto,
          rotation: angle * (180 / Math.PI),
        };

        setPointingPeople(prev => [...prev, newPerson]);

        // Remove after 3 seconds
        setTimeout(() => {
          setPointingPeople(prev => prev.filter(p => p.id !== newPerson.id));
        }, 3000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-[#080f1c] to-[#001a4d]" ref={containerRef}>
      {/* Header with Navigation */}
      <div className="absolute top-4 left-4 z-50">
        <h1 className="text-[#ffc105] font-bebas-neue font-bold text-2xl mb-2">👉 The Pointing Pointer</h1>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.href = '/games'}
            className="bg-[#497ab6] text-[#e8edf5] border-none px-4 py-1 rounded text-sm font-barlow font-bold uppercase tracking-[.08em] cursor-pointer hover:bg-[#2b4c7d] transition-all"
          >
            ← Games
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-[#497ab6] text-[#e8edf5] border-none px-4 py-1 rounded text-sm font-barlow font-bold uppercase tracking-[.08em] cursor-pointer hover:bg-[#2b4c7d] transition-all"
          >
            🏠 Home
          </button>
        </div>
      </div>

      {/* Cursor display */}
      <div
        className="fixed pointer-events-none text-white text-sm bg-black/50 px-3 py-2 rounded z-40"
        style={{
          right: '20px',
          bottom: '20px',
        }}
      >
        Move your cursor: ({mousePos.x}, {mousePos.y})
      </div>

      {/* Custom cursor follower */}
      <div
        className="fixed pointer-events-none z-30 transition-all duration-100"
        style={{
          left: mousePos.x - 10,
          top: mousePos.y - 10,
        }}
      >
        <div className="w-5 h-5 bg-[#ffc105] rounded-full animate-pulse" />
      </div>

      {/* Pointing people */}
      {pointingPeople.map(person => (
        <div
          key={person.id}
          className="absolute pointer-events-none animate-fade-in"
          style={{
            left: person.x - 75,
            top: person.y - 75,
            transform: `rotate(${person.rotation}deg)`,
            transition: 'all 0.3s ease-out',
          }}
        >
          <div className="relative">
            <img
              src={person.imageUrl}
              alt="Pointing person"
              className="w-32 h-32 rounded-full border-4 border-[#ffc105] shadow-lg"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(255, 193, 5, 0.6))',
              }}
            />
            <div className="absolute -bottom-2 -right-2 text-2xl animate-bounce">
              👉
            </div>
          </div>
        </div>
      ))}

      {/* Instructions */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-40">
        <p className="text-[#ffc105] text-lg font-barlow font-bold mb-2">
          Move your mouse around!
        </p>
        <p className="text-[#7a93b4] text-sm">
          Random people will appear pointing exactly where your cursor is
        </p>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={onClose}
          className="bg-[#ffc105] text-[#080f1c] border-none px-6 py-2 rounded font-barlow font-bold uppercase tracking-[.08em] cursor-pointer hover:bg-[#ffcf3a]"
        >
          ← Back to Game Details
        </button>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
