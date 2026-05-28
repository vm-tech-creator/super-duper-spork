'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Link from 'next/link';

interface Item {
  name: string;
  cost: number;
  emoji: string;
}

export default function ElonFortune({ onClose }: { onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const itemButtonsRef = useRef<Map<THREE.Mesh, Item>>(new Map());

  const [balance, setBalance] = useState(250000000000);
  const [purchases, setPurchases] = useState<{ name: string; count: number }[]>([]);

  const items: Item[] = [
    { name: 'Diamond-Encrusted Toilet Seat', cost: 500000, emoji: '🚽' },
    { name: 'Gold-Plated Tesla', cost: 5000000, emoji: '🚗' },
    { name: 'Private Moon Base', cost: 500000000, emoji: '🌙' },
    { name: 'Entire Pizza Industry', cost: 50000000000, emoji: '🍕' },
    { name: 'Giant Golden Statue of Yourself', cost: 100000000, emoji: '🏆' },
    { name: 'Unicorn (Cyber Edition)', cost: 1000000, emoji: '🦄' },
    { name: 'All Twitter Bots', cost: 25000000, emoji: '🤖' },
    { name: 'Replacement for Earth', cost: 1000000000, emoji: '🪐' },
    { name: 'World\'s Largest Flamingo Pool Float', cost: 10000000, emoji: '🦩' },
    { name: 'Lifetime Supply of Memes', cost: 1000000, emoji: '😂' },
  ];

  const formatBalance = (num: number) => {
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    return `$${num.toLocaleString()}`;
  };

  const buyItem = (item: Item) => {
    setBalance((prev) => {
      if (prev >= item.cost) {
        const newBalance = prev - item.cost;
        const existing = purchases.find((p) => p.name === item.name);
        if (existing) {
          setPurchases(purchases.map((p) => (p.name === item.name ? { ...p, count: p.count + 1 } : p)));
        } else {
          setPurchases([...purchases, { name: item.name, count: 1 }]);
        }
        return newBalance;
      }
      return prev;
    });
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

    const createItemCanvas = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#080f1c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ffc105';
      ctx.font = 'bold 20px Arial';
      ctx.fillText(`Balance: ${formatBalance(balance)}`, 20, 40);

      ctx.fillStyle = '#e8edf5';
      ctx.font = '16px Arial';

      items.forEach((item, i) => {
        const y = 80 + i * 100;
        const canBuy = balance >= item.cost;

        ctx.fillStyle = canBuy ? 'rgba(255, 193, 5, 0.3)' : 'rgba(73, 122, 182, 0.1)';
        ctx.fillRect(10, y, 780, 90);

        ctx.strokeStyle = canBuy ? '#ffc105' : 'rgba(73, 122, 182, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, y, 780, 90);

        ctx.font = '32px Arial';
        ctx.fillText(item.emoji, 30, y + 55);

        ctx.fillStyle = canBuy ? '#e8edf5' : '#7a93b4';
        ctx.font = 'bold 14px Arial';
        ctx.fillText(item.name, 80, y + 25);

        ctx.fillStyle = '#7a93b4';
        ctx.font = '12px Arial';
        ctx.fillText(formatBalance(item.cost), 80, y + 50);
      });

      return canvas;
    };

    const createPurchasesCanvas = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 1200;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#080f1c';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ffc105';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`Purchases (${purchases.length})`, 15, 35);

      if (purchases.length === 0) {
        ctx.fillStyle = '#7a93b4';
        ctx.font = '14px Arial';
        ctx.fillText('Start buying things!', 15, 70);
      } else {
        purchases.forEach((purchase, i) => {
          const y = 70 + i * 50;
          ctx.fillStyle = 'rgba(255, 193, 5, 0.2)';
          ctx.fillRect(10, y, 280, 45);

          ctx.strokeStyle = 'rgba(255, 193, 5, 0.2)';
          ctx.lineWidth = 1;
          ctx.strokeRect(10, y, 280, 45);

          ctx.fillStyle = '#e8edf5';
          ctx.font = 'bold 12px Arial';
          ctx.fillText(purchase.name.substring(0, 25), 20, y + 20);

          ctx.fillStyle = '#ffc105';
          ctx.font = '12px Arial';
          ctx.fillText(`×${purchase.count}`, 20, y + 35);
        });
      }

      return canvas;
    };

    const itemTexture = new THREE.CanvasTexture(createItemCanvas());
    const itemMaterial = new THREE.MeshBasicMaterial({ map: itemTexture });
    const itemGeometry = new THREE.PlaneGeometry(600, 900);
    const itemMesh = new THREE.Mesh(itemGeometry, itemMaterial);
    itemMesh.position.set(-150, 0, 0);
    scene.add(itemMesh);

    const purchasesTexture = new THREE.CanvasTexture(createPurchasesCanvas());
    const purchasesMaterial = new THREE.MeshBasicMaterial({ map: purchasesTexture });
    const purchasesGeometry = new THREE.PlaneGeometry(200, 900);
    const purchasesMesh = new THREE.Mesh(purchasesGeometry, purchasesMaterial);
    purchasesMesh.position.set(350, 0, 0);
    scene.add(purchasesMesh);

    const handleMouseClick = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / w) * 2 - 1;
      mouseRef.current.y = -(event.clientY / h) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects([itemMesh]);

      if (intersects.length > 0) {
        const y = intersects[0].uv?.y;
        if (y !== undefined) {
          const itemIndex = Math.floor((1 - y) * items.length);
          if (itemIndex >= 0 && itemIndex < items.length) {
            buyItem(items[itemIndex]);
          }
        }
      }
    };

    window.addEventListener('click', handleMouseClick);

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

    let lastBalance = balance;
    const animate = () => {
      requestAnimationFrame(animate);

      if (lastBalance !== balance) {
        itemTexture.image = createItemCanvas();
        itemTexture.needsUpdate = true;
        lastBalance = balance;
      }

      purchasesTexture.image = createPurchasesCanvas();
      purchasesTexture.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('click', handleMouseClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      itemTexture.dispose();
      purchasesMaterial.dispose();
      purchasesGeometry.dispose();
      itemMaterial.dispose();
      itemGeometry.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-sahara-bg">
      <div ref={containerRef} className="w-full h-full" />

      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 border-b border-[rgba(73,122,182,.2)] px-6 py-4 flex items-center justify-between bg-gradient-to-r from-[rgba(255,193,5,.1)] to-[rgba(73,122,182,.1)]">
        <div>
          <h1 className="text-sahara-gold font-bold text-2xl">💰 Elon Musk's Fortune</h1>
          <p className="text-sahara-secondary text-sm">Try to spend $250 billion on ridiculous items!</p>
        </div>
        <Link href="/games">
          <button className="bg-sahara-gold text-sahara-bg border-none px-6 py-2 rounded font-bold uppercase tracking-[.08em] cursor-pointer hover:opacity-90">
            ← Back to Games
          </button>
        </Link>
      </div>

      <div className="absolute top-24 left-0 right-0 bottom-0 text-center text-sahara-muted flex items-center justify-center">
        <p className="text-sm">Click items to purchase them</p>
      </div>
    </div>
  );
}
