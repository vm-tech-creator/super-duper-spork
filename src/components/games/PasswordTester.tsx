'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Link from 'next/link';

export default function PasswordTester({ onClose }: { onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const passwordRef = useRef('');
  const strengthRef = useRef(0);
  const feedbackRef = useRef('');

  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');
  const [strength, setStrength] = useState(0);

  const passiveAggressiveComments = [
    "Oh honey, that's... a choice.",
    "I mean, if you like getting hacked, sure!",
    "Your mother would approve. That's not a compliment.",
    "It's like you WANT someone to steal your passwords.",
    "Bless your heart, that's adorable.",
    "Did a toddler pick this?",
    "I've seen better security on a cardboard box.",
    "Well, at least it's memorable... to hackers.",
    "That's not a password, that's a cry for help.",
    "You're making my job very easy.",
    "Is this your first Internet?",
    "I can crack this faster than you can say 'data breach'.",
  ];

  const analyzePassword = (pwd: string) => {
    setPassword(pwd);
    passwordRef.current = pwd;
    let score = 0;

    if (pwd.length >= 8) score += 20;
    if (pwd.length >= 12) score += 20;
    if (/[a-z]/.test(pwd)) score += 10;
    if (/[A-Z]/.test(pwd)) score += 10;
    if (/\d/.test(pwd)) score += 15;
    if (/[!@#$%^&*]/.test(pwd)) score += 25;

    const finalScore = Math.min(score, 100);
    setStrength(finalScore);
    strengthRef.current = finalScore;

    if (pwd.length === 0) {
      setFeedback('');
      feedbackRef.current = '';
    } else {
      const randomComment = passiveAggressiveComments[Math.floor(Math.random() * passiveAggressiveComments.length)];
      setFeedback(randomComment);
      feedbackRef.current = randomComment;
    }
  };

  const updateCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 768;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#080f1c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = '#ffc105';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🔐 Password Tester', canvas.width / 2, 80);

    ctx.fillStyle = '#7a93b4';
    ctx.font = '18px Arial';
    ctx.fillText('Let\'s see how bad this will be...', canvas.width / 2, 130);

    // Input field
    ctx.fillStyle = '#101e34';
    ctx.fillRect(150, 160, 724, 60);
    ctx.strokeStyle = '#497ab6';
    ctx.lineWidth = 2;
    ctx.strokeRect(150, 160, 724, 60);

    ctx.fillStyle = '#e8edf5';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    const displayPassword = passwordRef.current ? '●'.repeat(passwordRef.current.length) : 'Enter your password...';
    ctx.fillText(displayPassword, 170, 200);

    if (passwordRef.current) {
      // Strength bar
      ctx.fillStyle = '#7a93b4';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('Strength', 150, 280);

      ctx.fillStyle = strengthRef.current < 40 ? '#ff0000' : strengthRef.current < 70 ? '#ffff00' : '#00ff00';
      ctx.font = '14px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`${strengthRef.current}%`, 874, 280);

      ctx.fillStyle = '#101e34';
      ctx.fillRect(150, 290, 724, 20);
      ctx.fillStyle = strengthRef.current < 40 ? '#ff0000' : strengthRef.current < 70 ? '#ffff00' : '#00ff00';
      ctx.fillRect(150, 290, (724 * strengthRef.current) / 100, 20);

      // Feedback
      if (feedbackRef.current) {
        ctx.fillStyle = '#101e34';
        ctx.fillRect(150, 330, 724, 80);
        ctx.strokeStyle = '#ffc105';
        ctx.lineWidth = 2;
        ctx.strokeRect(150, 330, 724, 80);

        ctx.fillStyle = '#ffc105';
        ctx.font = 'italic 16px Arial';
        ctx.textAlign = 'center';
        const words = feedbackRef.current.split(' ');
        let line = '';
        let y = 360;
        words.forEach((word) => {
          const testLine = line + (line ? ' ' : '') + word;
          if (testLine.length > 45) {
            ctx.fillText(line, canvas.width / 2, y);
            y += 25;
            line = word;
          } else {
            line = testLine;
          }
        });
        ctx.fillText(line, canvas.width / 2, y);
      }

      // Stats
      const stats = [
        { label: 'Length', value: `${passwordRef.current.length} chars` },
        { label: 'Has Numbers', value: /\d/.test(passwordRef.current) ? '✓' : '✗' },
        { label: 'Has Uppercase', value: /[A-Z]/.test(passwordRef.current) ? '✓' : '✗' },
        { label: 'Has Symbols', value: /[!@#$%^&*]/.test(passwordRef.current) ? '✓' : '✗' },
      ];

      ctx.fillStyle = '#7a93b4';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      stats.forEach((stat, i) => {
        const x = 200 + i * 180;
        const y = 450;

        ctx.fillStyle = '#101e34';
        ctx.fillRect(x - 70, y, 140, 80);
        ctx.strokeStyle = '#497ab6';
        ctx.lineWidth = 1;
        ctx.strokeRect(x - 70, y, 140, 80);

        ctx.fillStyle = '#7a93b4';
        ctx.font = '11px Arial';
        ctx.fillText(stat.label, x, y + 20);

        ctx.fillStyle = '#e8edf5';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(stat.value, x, y + 50);
      });
    }

    return canvas;
  };

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

    let uiTexture = new THREE.CanvasTexture(updateCanvas());
    const uiMaterial = new THREE.MeshBasicMaterial({ map: uiTexture });
    const uiGeometry = new THREE.PlaneGeometry(800, 600);
    const uiMesh = new THREE.Mesh(uiGeometry, uiMaterial);
    scene.add(uiMesh);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        analyzePassword(passwordRef.current.slice(0, -1));
      } else if (e.key.length === 1) {
        analyzePassword(passwordRef.current + e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

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

      uiTexture = new THREE.CanvasTexture(updateCanvas());
      uiMaterial.map = uiTexture;
      uiMaterial.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      uiTexture.dispose();
      uiMaterial.dispose();
      uiGeometry.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#080f1c]">
      <div ref={containerRef} className="w-full h-full" />

      {/* Back button overlay */}
      <div className="absolute top-4 right-4">
        <Link href="/games">
          <button className="bg-[#ffc105] text-[#080f1c] border-none px-6 py-2 rounded font-bold uppercase tracking-[.08em] cursor-pointer hover:bg-[#ffcf3a]">
            ← Back
          </button>
        </Link>
      </div>

      {/* Help text */}
      <div className="absolute bottom-4 left-4 text-[#7a93b4] text-sm">
        <p>Type to enter password...</p>
      </div>
    </div>
  );
}
