'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function ThePointingPointer({ onClose }: { onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sceneRef = useRef<THREE.Scene | null>(null);
  const personsRef = useRef<THREE.Mesh[]>([]);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const pointingPhotos = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=300&fit=crop',
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup Three.js scene
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
    renderer.setClearColor(0x080f1c);
    containerRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;

    const textureLoader = new THREE.TextureLoader();

    // Handle mouse move
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Show random pointing person
      if (Math.random() > 0.95) {
        const randomPhoto = pointingPhotos[Math.floor(Math.random() * pointingPhotos.length)];

        textureLoader.load(randomPhoto, (texture) => {
          const geometry = new THREE.PlaneGeometry(120, 120);
          const material = new THREE.MeshBasicMaterial({ map: texture });
          const mesh = new THREE.Mesh(geometry, material);

          const x = e.clientX - window.innerWidth / 2;
          const y = window.innerHeight / 2 - e.clientY;
          mesh.position.set(x, y, 0);

          scene.add(mesh);
          personsRef.current.push(mesh);

          // Remove after 2 seconds
          setTimeout(() => {
            scene.remove(mesh);
            personsRef.current = personsRef.current.filter((p) => p !== mesh);
          }, 2000);
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />

      {/* Cursor display */}
      <div className="absolute top-4 left-4 text-sahara-gold font-bold text-2xl">👉 The Pointing Pointer</div>

      <div
        className="fixed pointer-events-none text-white text-sm bg-black/50 px-3 py-2 rounded"
        style={{
          right: '20px',
          bottom: '20px',
        }}
      >
        Move your cursor: ({mousePos.x}, {mousePos.y})
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={onClose}
          className="bg-sahara-gold text-sahara-bg border-none px-6 py-2 rounded font-bold uppercase tracking-[.08em] cursor-pointer hover:opacity-90"
        >
          ← Back to Games
        </button>
      </div>
    </div>
  );
}
