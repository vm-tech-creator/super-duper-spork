'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Link from 'next/link';

interface QuizQuestion {
  question: string;
  answers: string[];
}

interface DemographicResult {
  name: string;
  emoji: string;
}

export default function MusicQuiz({ onClose }: { onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const buttonMeshesRef = useRef<Map<THREE.Mesh, number>>(new Map());

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({
    parents: 0,
    boomers: 0,
    rivals: 0,
    pretentious: 0,
  });
  const [showResult, setShowResult] = useState(false);

  const questions: QuizQuestion[] = [
    {
      question: 'What genre do you listen to most?',
      answers: ['Heavy Metal', 'Country', 'Pop/Hip-Hop', 'Progressive Jazz Fusion'],
    },
    {
      question: 'How loud do you listen to music?',
      answers: ['EXTREMELY LOUD', 'Those darn kids!', 'Above average', 'At audiophile levels'],
    },
    {
      question: 'Your favorite artist is:',
      answers: ['Someone my parents hate', 'Someone from the 60s', 'A TikTok trend', 'An obscure indie band'],
    },
    {
      question: 'Concert experience preference:',
      answers: ['Mosh pit chaos', 'Big outdoor festival', 'Sold-out stadium tour', 'Underground venue'],
    },
    {
      question: 'Music in the car means:',
      answers: ['Windows down, full volume', 'Oldies radio', 'Latest hits from TikTok', 'Vinyl collection'],
    },
  ];

  const demographics: Record<string, DemographicResult> = {
    parents: { name: 'Your Parents', emoji: '👴👵' },
    boomers: { name: 'Baby Boomers', emoji: '🎶' },
    rivals: { name: 'Your Rivalry Fandoms', emoji: '😤' },
    pretentious: { name: 'Pretentious Music Snobs', emoji: '🎻' },
  };

  const answerMapping = [
    { parents: 2, boomers: 0, rivals: 1, pretentious: 3 },
    { parents: 1, boomers: 2, rivals: 0, pretentious: 3 },
    { parents: 1, boomers: 0, rivals: 2, pretentious: 3 },
    { parents: 1, boomers: 0, rivals: 2, pretentious: 3 },
    { parents: 2, boomers: 1, rivals: 0, pretentious: 3 },
  ];

  const handleAnswer = (index: number) => {
    const mapping = answerMapping[currentQuestion];
    const newScores = { ...scores };
    Object.keys(mapping).forEach((key) => {
      if (index === (mapping as any)[key]) {
        (newScores as any)[key]++;
      }
    });
    setScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const getMostAnnoyedDemographic = () => {
    const entries = Object.entries(scores);
    return entries.reduce((max, current) => (current[1] > max[1] ? current : max))[0];
  };

  const updateCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1200;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#080f1c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = '#ffc105';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎵 Who is Pissed Off At Your Music?', canvas.width / 2, 60);

    ctx.fillStyle = '#7a93b4';
    ctx.font = '18px Arial';
    ctx.fillText('Find out which demographic you\'re annoying!', canvas.width / 2, 100);

    if (!showResult) {
      // Progress bar
      const progress = ((currentQuestion + 1) / questions.length) * 100;
      ctx.fillStyle = '#101e34';
      ctx.fillRect(50, 130, 924, 20);
      ctx.fillStyle = '#ffc105';
      ctx.fillRect(50, 130, (924 * progress) / 100, 20);

      ctx.fillStyle = '#7a93b4';
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Question ${currentQuestion + 1} of ${questions.length}`, 70, 165);

      // Question
      ctx.fillStyle = '#e8edf5';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      const question = questions[currentQuestion].question;
      const words = question.split(' ');
      let line = '';
      let y = 220;
      words.forEach((word) => {
        const testLine = line + (line ? ' ' : '') + word;
        if (testLine.length > 40) {
          ctx.fillText(line, canvas.width / 2, y);
          y += 40;
          line = word;
        } else {
          line = testLine;
        }
      });
      ctx.fillText(line, canvas.width / 2, y);

      // Answers
      const answers = questions[currentQuestion].answers;
      answers.forEach((answer, i) => {
        const answerY = 350 + i * 90;
        ctx.fillStyle = '#101e34';
        ctx.fillRect(50, answerY, 924, 80);
        ctx.strokeStyle = '#497ab6';
        ctx.lineWidth = 2;
        ctx.strokeRect(50, answerY, 924, 80);

        ctx.fillStyle = '#e8edf5';
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(answer, 70, answerY + 45);
      });
    } else {
      // Results
      ctx.fillStyle = '#101e34';
      ctx.fillRect(150, 200, 724, 400);
      ctx.strokeStyle = '#ffc105';
      ctx.lineWidth = 3;
      ctx.strokeRect(150, 200, 724, 400);

      ctx.fillStyle = '#7a93b4';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Most annoyed demographic:', canvas.width / 2, 250);

      const demographic = demographics[getMostAnnoyedDemographic()];
      ctx.fillStyle = '#ffc105';
      ctx.font = '80px Arial';
      ctx.fillText(demographic.emoji, canvas.width / 2, 360);

      ctx.fillStyle = '#ffc105';
      ctx.font = 'bold 36px Arial';
      ctx.fillText(demographic.name, canvas.width / 2, 420);

      ctx.fillStyle = '#7a93b4';
      ctx.font = '16px Arial';
      ctx.fillText('Congratulations! You\'re successfully annoying them!', canvas.width / 2, 480);

      // Retry button
      ctx.fillStyle = '#ffc105';
      ctx.fillRect(250, 550, 524, 60);
      ctx.fillStyle = '#080f1c';
      ctx.font = 'bold 18px Arial';
      ctx.fillText('Take Quiz Again', canvas.width / 2, 585);
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
    const uiGeometry = new THREE.PlaneGeometry(800, 900);
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
          if (showResult) {
            // Check if clicked on retry button
            if (uv.y > 0.4 && uv.y < 0.55) {
              setCurrentQuestion(0);
              setScores({ parents: 0, boomers: 0, rivals: 0, pretentious: 0 });
              setShowResult(false);
            }
          } else {
            // Calculate which answer was clicked
            const answerIndex = Math.floor((1 - uv.y - 0.3) / 0.075);
            if (answerIndex >= 0 && answerIndex < questions[currentQuestion].answers.length) {
              handleAnswer(answerIndex);
            }
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
      requestAnimationFrame(animate);

      uiTexture = new THREE.CanvasTexture(updateCanvas());
      uiMaterial.map = uiTexture;
      uiMaterial.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('click', handleMouseClick);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      uiTexture.dispose();
      uiMaterial.dispose();
      uiGeometry.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [currentQuestion, showResult, scores]);

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-[#0d1a2e] to-sahara-bg">
      <div ref={containerRef} className="w-full h-full" />

      {/* Back button overlay */}
      <Link href="/games">
        <button className="absolute top-4 right-4 bg-sahara-gold text-sahara-bg border-none px-6 py-2 rounded font-bold uppercase tracking-[.08em] cursor-pointer hover:opacity-90">
          ← Back
        </button>
      </Link>

      <div className="absolute bottom-4 left-4 text-sahara-muted text-sm">
        <p>Click on answers to proceed...</p>
      </div>
    </div>
  );
}
