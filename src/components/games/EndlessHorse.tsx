'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function EndlessHorse({ onClose }: { onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const legsRef = useRef<THREE.Mesh[]>([]);

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
    renderer.setClearColor(0x080f1c);
    containerRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Create horse body
    const bodyGeometry = new THREE.BoxGeometry(100, 80, 1);
    const bodyMaterial = new THREE.MeshBasicMaterial({ color: 0xffc105 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(-200, 0, 0);
    scene.add(body);

    // Create horse head
    const headGeometry = new THREE.BoxGeometry(60, 40, 1);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.set(-100, 30, 0);
    scene.add(head);

    // Create ears
    const earGeometry = new THREE.BoxGeometry(16, 20, 1);
    const leftEar = new THREE.Mesh(earGeometry, bodyMaterial);
    leftEar.position.set(-125, 60, 0);
    scene.add(leftEar);

    const rightEar = new THREE.Mesh(earGeometry, bodyMaterial);
    rightEar.position.set(-75, 60, 0);
    scene.add(rightEar);

    // Create legs (will be updated based on scroll)
    const createLegs = (length: number) => {
      // Clear old legs
      legsRef.current.forEach((leg) => scene.remove(leg));
      legsRef.current = [];

      const legPositions = [-150, -100, 100, 150];
      legPositions.forEach((x) => {
        const legGeometry = new THREE.BoxGeometry(16, length, 1);
        const leg = new THREE.Mesh(legGeometry, bodyMaterial);
        leg.position.set(x - 200, -(length / 2 + 40), 0);
        scene.add(leg);
        legsRef.current.push(leg);
      });
    };

    createLegs(400);

    // Handle scroll
    const handleScroll = (e: WheelEvent) => {
      e.preventDefault();
      setScrollHeight((prev) => Math.max(0, prev + e.deltaY));
    };

    window.addEventListener('wheel', handleScroll, { passive: false });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      createLegs(Math.max(400, scrollHeight + 400));
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
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        try {
          containerRef.current.removeChild(renderer.domElement);
        } catch (e) {}
      }
      renderer.dispose();
    };
  }, [scrollHeight]);

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />

      {/* Header */}
      <div className="absolute top-4 left-4">
        <h1 className="text-[#ffc105] font-bold text-2xl">🐴 Endless Horse</h1>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={onClose}
          className="bg-[#ffc105] text-[#080f1c] border-none px-6 py-2 rounded font-bold uppercase tracking-[.08em] cursor-pointer hover:bg-[#ffcf3a]"
        >
          ← Back to Games
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-black/50 px-4 py-2 rounded text-[#7a93b4] text-sm">
        Scroll to make the horse's legs grow infinitely... 🐴
      </div>
    </div>
  );
}
