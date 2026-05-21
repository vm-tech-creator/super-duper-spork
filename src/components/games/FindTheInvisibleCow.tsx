'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Link from 'next/link';

export default function FindTheInvisibleCow({ onClose }: { onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cowPosRef = useRef({ x: Math.random() * window.innerWidth - window.innerWidth / 2, y: Math.random() * window.innerHeight - window.innerHeight / 2 });
  const mouseRef = useRef({ x: 0, y: 0 });
  const distanceRef = useRef(0);
  const foundRef = useRef(false);

  const [distance, setDistance] = useState(0);
  const [found, setFound] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    setAudioContext(ctx);
    return () => ctx.close();
  }, []);

  useEffect(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.OrthographicCamera(w / -2, w / 2, h / 2, h / -2, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setClearColor(0x080f1c);
    rendererRef.current = renderer;

    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }

    // Create visual indicator circle
    const geometry = new THREE.CircleGeometry(30, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const indicatorCircle = new THREE.Mesh(geometry, material);
    indicatorCircle.position.z = 0;
    scene.add(indicatorCircle);

    // Create distance indicator rings
    const rings: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const ringGeometry = new THREE.CircleGeometry(30 + i * 20, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.z = -1;
      scene.add(ring);
      rings.push(ring);
    }

    // Create canvas texture for UI display
    const updateCanvas = (distance: number) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(255, 193, 5, 0.9)';
      ctx.font = 'bold 60px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🐄 Find the Invisible Cow', canvas.width / 2, 80);

      ctx.fillStyle = '#7a93b4';
      ctx.font = '24px Arial';
      ctx.fillText('Move your mouse around to find the hidden cow', canvas.width / 2, 140);

      if (found) {
        ctx.fillStyle = '#ffc105';
        ctx.font = 'bold 80px Arial';
        ctx.fillText('🎉', canvas.width / 2, 300);

        ctx.fillStyle = '#ffc105';
        ctx.font = 'bold 48px Arial';
        ctx.fillText('FOUND IT!', canvas.width / 2, 390);
      } else {
        ctx.fillStyle = '#ffc105';
        ctx.font = 'bold 40px Arial';
        ctx.fillText(`Distance: ${Math.round(distance)}px`, canvas.width / 2, 300);

        const volume = Math.max(0, 1 - distance / 500);
        const percentage = Math.round(volume * 100);

        ctx.fillStyle = percentage > 50 ? '#00ff00' : percentage > 25 ? '#ffff00' : '#ff0000';
        ctx.font = '28px Arial';
        ctx.fillText(`Proximity: ${percentage}%`, canvas.width / 2, 360);
      }

      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    let uiTexture = updateCanvas(0);
    const uiMaterial = new THREE.MeshBasicMaterial({ map: uiTexture });
    const uiGeometry = new THREE.PlaneGeometry(800, 400);
    const uiMesh = new THREE.Mesh(uiGeometry, uiMaterial);
    uiMesh.position.z = 5;
    scene.add(uiMesh);

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = w / 2;
      const centerY = h / 2;

      mouseRef.current.x = e.clientX - centerX;
      mouseRef.current.y = centerY - e.clientY;

      const dist = Math.sqrt(
        Math.pow(mouseRef.current.x - cowPosRef.current.x, 2) +
        Math.pow(mouseRef.current.y - cowPosRef.current.y, 2)
      );

      distanceRef.current = dist;
      setDistance(Math.round(dist));

      if (audioContext && dist > 0) {
        const volume = Math.max(0, 1 - dist / 500);
        const frequency = 200 + (1 - volume) * 300;

        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.frequency.value = frequency;
        gain.gain.value = volume * 0.3;

        osc.start();
        setTimeout(() => osc.stop(), 50);
      }

      if (dist < 50 && !foundRef.current) {
        foundRef.current = true;
        setFound(true);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      const newW = window.innerWidth;
      const newH = window.innerHeight;
      camera.left = newW / -2;
      camera.right = newW / 2;
      camera.top = newH / 2;
      camera.bottom = newH / -2;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      requestAnimationFrame(animate);

      const volume = Math.max(0, 1 - distanceRef.current / 500);
      indicatorCircle.material.color.setHex(volume > 0.7 ? 0x00ff00 : volume > 0.4 ? 0xffff00 : 0xff0000);
      indicatorCircle.scale.set(1 + volume, 1 + volume, 1);

      uiTexture = updateCanvas(distanceRef.current);
      uiMaterial.map = uiTexture;
      uiMaterial.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      uiTexture.dispose();
      uiMaterial.dispose();
      uiGeometry.dispose();
      geometry.dispose();
      material.dispose();
      rings.forEach((ring) => {
        ring.geometry.dispose();
        (ring.material as THREE.Material).dispose();
      });
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [found]);

  const handlePlayAgain = () => {
    cowPosRef.current = {
      x: Math.random() * window.innerWidth - window.innerWidth / 2,
      y: Math.random() * window.innerHeight - window.innerHeight / 2,
    };
    foundRef.current = false;
    setFound(false);
    setDistance(0);
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-[#0d1a2e] to-[#080f1c]">
      <div ref={containerRef} className="w-full h-full" />

      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <h1 className="text-[#ffc105] font-bold text-2xl">🐄 Find the Invisible Cow</h1>
        <Link href="/games">
          <button className="bg-[#ffc105] text-[#080f1c] border-none px-6 py-2 rounded font-bold uppercase tracking-[.08em] cursor-pointer hover:bg-[#ffcf3a]">
            ← Back to Games
          </button>
        </Link>
      </div>

      {found && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <button
            onClick={handlePlayAgain}
            className="bg-[#ffc105] text-[#080f1c] border-none px-8 py-3 rounded font-bold uppercase tracking-[.08em] cursor-pointer hover:bg-[#ffcf3a]"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
