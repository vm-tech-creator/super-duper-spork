'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Link from 'next/link';

export default function HackerTyper({ onClose }: { onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const codeRef = useRef<string[]>([]);
  const displayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const displayTextureRef = useRef<THREE.CanvasTexture | null>(null);

  const codeSnippets = [
    'ssh -i ~/.ssh/id_rsa user@192.168.1.1',
    'SELECT * FROM users WHERE admin=1;',
    'nmap -sV 192.168.0.0/24',
    'for i in range(1000): exploit(target)',
    'ACCESS GRANTED - ADMIN LEVEL: MAXIMUM',
    'DECRYPTING MAINFRAME... [████████████████] 99%',
    'cd /root && cat flag.txt',
    'INITIATING QUANTUM BACKDOOR...',
    'Password: ****** ACCEPTED',
    'sudo rm -rf / --no-preserve-root',
  ];

  const updateCanvas = () => {
    if (!displayCanvasRef.current) return;
    
    const canvas = displayCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff00';
    ctx.font = '14px monospace';
    ctx.textBaseline = 'top';

    const lines = codeRef.current.slice(-25);
    lines.forEach((line, i) => {
      ctx.fillText(line, 20, 20 + i * 20);
    });

    // Cursor
    ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
    ctx.fillRect(20 + ctx.measureText(lines[lines.length - 1] || '').width, 20 + lines.length * 20, 8, 18);

    if (displayTextureRef.current) {
      displayTextureRef.current.needsUpdate = true;
    }
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
    renderer.setClearColor(0x000000);
    rendererRef.current = renderer;

    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }

    // Create canvas texture for code display
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 768;
    displayCanvasRef.current = canvas;

    const texture = new THREE.CanvasTexture(canvas);
    displayTextureRef.current = texture;

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const geometry = new THREE.PlaneGeometry(800, 600);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = 0;
    scene.add(mesh);

    updateCanvas();

    const handleKeyPress = (e: KeyboardEvent) => {
      const snippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
      codeRef.current.push(snippet);

      if (codeRef.current.length > 25) {
        codeRef.current = codeRef.current.slice(codeRef.current.length - 25);
      }

      updateCanvas();
    };

    window.addEventListener('keydown', handleKeyPress);

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
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      texture.dispose();
      material.dispose();
      geometry.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Terminal header overlay */}
      <div className="absolute top-0 left-0 right-0 bg-[#1a1a1a] border-b border-[#00ff00] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-[#00ff00] ml-2 font-mono text-sm">HACKER_TERMINAL_v3.14</span>
        </div>
        <Link href="/games">
          <button className="text-[#00ff00] border border-[#00ff00] px-3 py-1 rounded text-sm hover:bg-[#00ff00] hover:text-black font-mono cursor-pointer">
            [BACK]
          </button>
        </Link>
      </div>

      {/* Footer overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-[#00ff00] px-4 py-2 text-[#00ff00] font-mono text-xs">
        <p>START TYPING TO HACK... YOU'RE TRULY A MASTER OF CODE NOW</p>
      </div>
    </div>
  );
}
