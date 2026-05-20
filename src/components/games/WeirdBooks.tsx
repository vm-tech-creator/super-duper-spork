'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Book {
  title: string;
  author: string;
  year: number;
  category: string;
}

export default function WeirdBooks({ onClose }: { onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const animationIdRef = useRef<number | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const books: Book[] = [
    { title: 'Goblin Erasure: A Study of Myth and Reality', author: 'Robert Michael Pyle', year: 1997, category: 'Cryptozoology' },
    { title: 'The Codidact and Pluralist: On Varieties of Individualism Across Cultures', author: 'Philip Cole', year: 2011, category: 'Philosophy' },
    { title: 'Proceedings of the Second International Symposium on Odor Elimination Using Oxidizers', author: 'Various', year: 1985, category: 'Academic' },
    { title: 'How to Avoid Huge Ships', author: 'John W. Trimmer', year: 1993, category: 'Navigation' },
    { title: 'Oral Sadism and Oral Algolagnia', author: 'Wilhelm Stekel', year: 1952, category: 'Psychology' },
    { title: 'The Big Book of Lesbian Horse Stories', author: 'Susie Bright', year: 2003, category: 'Humor' },
    { title: 'The Stray Shopping Carts of Eastern North America', author: 'Julian Montague', year: 2006, category: 'Art' },
    { title: 'Techniques for the Reconstruction of Severely Damaged Human Faces', author: 'Joseph Murray', year: 1944, category: 'Medical' },
    { title: 'Knitting with Dog Hair', author: 'Kathleen Kinder', year: 1997, category: 'Crafts' },
    { title: 'The Joy of Chickens', author: 'Richard Gwin', year: 1982, category: 'Agriculture' },
    { title: 'Bombproof Your Horse', author: 'Rick Pelicano', year: 1992, category: 'Equestrian' },
    { title: 'The Biggest Loser Quick Start Program', author: 'Cheryl Forberg', year: 2008, category: 'Fitness' },
  ];

  const nextBook = () => {
    setCurrentIndex((prev) => (prev + 1) % books.length);
  };

  const prevBook = () => {
    setCurrentIndex((prev) => (prev - 1 + books.length) % books.length);
  };

  const updateCanvas = () => {
    const book = books[currentIndex];
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#080f1c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = '#ffc105';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('📚 Always Judge a Book by its Cover', canvas.width / 2, 60);

    ctx.fillStyle = '#7a93b4';
    ctx.font = '16px Arial';
    ctx.fillText('The weirdest real book titles ever published', canvas.width / 2, 100);

    // Book card
    ctx.fillStyle = '#101e34';
    ctx.fillRect(100, 140, 824, 500);
    ctx.strokeStyle = '#ffc105';
    ctx.lineWidth = 3;
    ctx.strokeRect(100, 140, 824, 500);

    // Book icon
    ctx.font = '80px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('📖', canvas.width / 2, 220);

    // Book title
    ctx.fillStyle = '#ffc105';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    const words = book.title.split(' ');
    let line = '';
    let y = 280;
    words.forEach((word) => {
      const testLine = line + (line ? ' ' : '') + word;
      if (testLine.length > 35) {
        ctx.fillText(line, canvas.width / 2, y);
        y += 40;
        line = word;
      } else {
        line = testLine;
      }
    });
    ctx.fillText(line, canvas.width / 2, y);

    // Author
    ctx.fillStyle = '#497ab6';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('AUTHOR', 150, 400);
    ctx.fillStyle = '#e8edf5';
    ctx.font = '14px Arial';
    ctx.fillText(book.author, 150, 425);

    // Year
    ctx.fillStyle = '#497ab6';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('YEAR', 650, 400);
    ctx.fillStyle = '#e8edf5';
    ctx.font = '14px Arial';
    ctx.fillText(book.year.toString(), 650, 425);

    // Category
    ctx.fillStyle = '#497ab6';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('CATEGORY', 150, 470);
    ctx.fillStyle = '#ffc105';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(book.category, 150, 495);

    // Progress
    ctx.fillStyle = '#7a93b4';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${currentIndex + 1} of ${books.length}`, canvas.width / 2, 580);

    // Prev Button
    ctx.fillStyle = '#497ab6';
    ctx.fillRect(100, 650, 300, 60);
    ctx.strokeStyle = '#2b4c7d';
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 650, 300, 60);
    ctx.fillStyle = '#e8edf5';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('← Prev', 250, 687);

    // Next Button
    ctx.fillStyle = '#ffc105';
    ctx.fillRect(624, 650, 300, 60);
    ctx.strokeStyle = '#ffcf3a';
    ctx.lineWidth = 2;
    ctx.strokeRect(624, 650, 300, 60);
    ctx.fillStyle = '#080f1c';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Next →', 774, 687);

    // Footer
    ctx.fillStyle = '#7a93b4';
    ctx.font = 'italic 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('These are all real books! Isn\'t literature strange?', canvas.width / 2, 930);

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
    const uiGeometry = new THREE.PlaneGeometry(800, 800);
    const uiMesh = new THREE.Mesh(uiGeometry, uiMaterial);
    scene.add(uiMesh);

    const handleMouseClick = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / w) * 2 - 1;
      mouseRef.current.y = -(event.clientY / h) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects([uiMesh]);

      if (intersects.length > 0) {
        const uv = intersects[0].uv;
        if (uv) {
          // Prev button area: left side, bottom
          if (uv.x < 0.4 && uv.y < 0.25) {
            prevBook();
          }
          // Next button area: right side, bottom
          else if (uv.x > 0.6 && uv.y < 0.25) {
            nextBook();
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

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      uiTexture.dispose();
      uiTexture = new THREE.CanvasTexture(updateCanvas());
      uiMaterial.map = uiTexture;
      uiMaterial.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('click', handleMouseClick);
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      renderer.dispose();
      uiTexture.dispose();
      uiMaterial.dispose();
      uiGeometry.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [currentIndex]);

  return (
    <div className="relative w-full h-screen bg-[#080f1c]">
      <div ref={containerRef} className="w-full h-full" />

      {/* Back button overlay */}
      <div className="absolute top-4 right-4">
        <button
          onClick={onClose}
          className="bg-[#ffc105] text-[#080f1c] border-none px-6 py-2 rounded font-barlow font-bold uppercase tracking-[.08em] cursor-pointer hover:bg-[#ffcf3a] transition-colors"
        >
          ← Back
        </button>
      </div>

      <div className="absolute bottom-4 left-4 text-[#7a93b4] text-sm">
        <p>Click buttons to navigate...</p>
      </div>
    </div>
  );
}
