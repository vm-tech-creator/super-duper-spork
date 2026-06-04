'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Cat {
  mesh: THREE.Mesh;
  vx: number;
  vy: number;
  size: number;
}

export default function CatBounce({ onClose }: { onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const catsRef = useRef<Cat[]>([]);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const catImages = [
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1579581570160-ce0133b63971?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1506755855726-85d230d8b83e?w=100&h=100&fit=crop',
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      window.innerWidth / -2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerHeight / -2,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0d1a2e);
    containerRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;

    const textureLoader = new THREE.TextureLoader();

    const createCat = () => {
      const randomImage = catImages[Math.floor(Math.random() * catImages.length)];
      textureLoader.load(randomImage, (texture) => {
        const size = 60;
        const geometry = new THREE.PlaneGeometry(size, size);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const mesh = new THREE.Mesh(geometry, material);

        const x = (Math.random() - 0.5) * window.innerWidth;
        const y = (Math.random() - 0.5) * window.innerHeight;
        mesh.position.set(x, y, 0);

        scene.add(mesh);
        catsRef.current.push({
          mesh,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          size,
        });
      });
    };

    // Create initial cats
    for (let i = 0; i < 5; i++) {
      createCat();
    }

    // Animation loop with physics
    const animate = () => {
      requestAnimationFrame(animate);

      catsRef.current.forEach((cat) => {
        const newX = cat.mesh.position.x + cat.vx;
        const newY = cat.mesh.position.y + cat.vy;

        // Bounce off walls
        if (newX < -window.innerWidth / 2 + cat.size / 2 || newX > window.innerWidth / 2 - cat.size / 2) {
          cat.vx *= -1;
          cat.mesh.position.x = Math.max(-window.innerWidth / 2 + cat.size / 2, Math.min(window.innerWidth / 2 - cat.size / 2, newX));
        } else {
          cat.mesh.position.x = newX;
        }

        if (newY < -window.innerHeight / 2 + cat.size / 2 || newY > window.innerHeight / 2 - cat.size / 2) {
          cat.vy *= -1;
          cat.mesh.position.y = Math.max(-window.innerHeight / 2 + cat.size / 2, Math.min(window.innerHeight / 2 - cat.size / 2, newY));
        } else {
          cat.mesh.position.y = newY;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // Make it rain cats
    const makeItRain = () => {
      for (let i = 0; i < 10; i++) {
        createCat();
      }
    };

    (window as any).makeItRain = makeItRain;

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      (camera as THREE.OrthographicCamera).left = width / -2;
      (camera as THREE.OrthographicCamera).right = width / 2;
      (camera as THREE.OrthographicCamera).top = height / 2;
      (camera as THREE.OrthographicCamera).bottom = height / -2;
      (camera as THREE.OrthographicCamera).updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        try {
          containerRef.current.removeChild(renderer.domElement);
        } catch (e) {}
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />

      {/* Controls */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => (window as any).makeItRain()}
          className="bg-sahara-gold text-sahara-bg border-none px-6 py-2 rounded font-bold uppercase tracking-[.08em] cursor-pointer hover:opacity-90 transition-all hover:shadow-lg"
        >
          🌧️ Make it Rain Cats
        </button>
        <button
          onClick={onClose}
          className="bg-[#497ab6] text-sahara-text border-none px-6 py-2 rounded font-bold uppercase tracking-[.08em] cursor-pointer hover:bg-[#2b4c7d]"
        >
          ← Back to Games
        </button>
      </div>

      {/* Header */}
      <div className="absolute top-4 left-4">
        <h1 className="text-sahara-gold font-bold text-2xl">🐱 Cat Bounce</h1>
      </div>
    </div>
  );
}
