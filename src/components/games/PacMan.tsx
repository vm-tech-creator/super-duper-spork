'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { addSandDollars, calculatePacManCoins } from '@/utils/sandDollars';

interface Position {
  x: number;
  y: number;
}

interface Ghost extends Position {
  id: number;
  color: string;
  direction: { dx: number; dy: number };
}

const CELL_SIZE = 25;
const MAZE_WIDTH = 19;
const MAZE_HEIGHT = 21;
const GHOST_COUNT = 4;

export default function PacMan({ onClose }: { onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const [pacmanPos, setPacmanPos] = useState<Position>({ x: 9, y: 15 });
  const [pacmanDir, setPacmanDir] = useState<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const [nextDir, setNextDir] = useState<{ dx: number; dy: number }>({ dx: 0, dy: 0 });
  const [ghosts, setGhosts] = useState<Ghost[]>([]);
  const [score, setScore] = useState(0);
  const [pelletsLeft, setPelletsLeft] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  const pelletsRef = useRef<boolean[][]>(
    maze.map((row, y) =>
      row.map((cell, x) => cell === 0 && !(x === 9 && y === 1) && !(x === 9 && y === 9))
    )
  );

  // Initialize ghosts
  useEffect(() => {
    const initialGhosts: Ghost[] = [
      { id: 0, x: 8, y: 9, color: '#FF0000', direction: { dx: 1, dy: 0 } },
      { id: 1, x: 9, y: 9, color: '#FFB897', direction: { dx: -1, dy: 0 } },
      { id: 2, x: 10, y: 9, color: '#00FFFF', direction: { dx: 0, dy: 1 } },
      { id: 3, x: 9, y: 8, color: '#FFB0E0', direction: { dx: 0, dy: -1 } },
    ];
    setGhosts(initialGhosts);

    let count = 0;
    for (let y = 0; y < MAZE_HEIGHT; y++) {
      for (let x = 0; x < MAZE_WIDTH; x++) {
        if (pelletsRef.current[y]?.[x]) {
          count++;
        }
      }
    }
    setPelletsLeft(count);
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          setNextDir({ dx: 0, dy: -1 });
          e.preventDefault();
          break;
        case 'arrowdown':
        case 's':
          setNextDir({ dx: 0, dy: 1 });
          e.preventDefault();
          break;
        case 'arrowleft':
        case 'a':
          setNextDir({ dx: -1, dy: 0 });
          e.preventDefault();
          break;
        case 'arrowright':
        case 'd':
          setNextDir({ dx: 1, dy: 0 });
          e.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Game loop
  useEffect(() => {
    if (gameOver || won) return;

    const gameInterval = setInterval(() => {
      setPacmanPos((prev) => {
        let newX = prev.x + nextDir.dx;
        let newY = prev.y + nextDir.dy;

        if (newX < 0) newX = MAZE_WIDTH - 1;
        if (newX >= MAZE_WIDTH) newX = 0;

        if (maze[newY]?.[newX] === 0) {
          setPacmanDir(nextDir);
          return { x: newX, y: newY };
        }

        newX = prev.x + pacmanDir.dx;
        newY = prev.y + pacmanDir.dy;

        if (newX < 0) newX = MAZE_WIDTH - 1;
        if (newX >= MAZE_WIDTH) newX = 0;

        if (maze[newY]?.[newX] === 0) {
          return { x: newX, y: newY };
        }

        return prev;
      });

      setGhosts((prevGhosts) =>
        prevGhosts.map((ghost) => {
          let newX = ghost.x + ghost.direction.dx;
          let newY = ghost.y + ghost.direction.dy;

          if (newX < 0) newX = MAZE_WIDTH - 1;
          if (newX >= MAZE_WIDTH) newX = 0;

          if (maze[newY]?.[newX] === 0) {
            return { ...ghost, x: newX, y: newY };
          }

          const directions = [{ dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }];
          let validDir = null;

          for (let dir of directions) {
            let testX = ghost.x + dir.dx;
            let testY = ghost.y + dir.dy;
            if (testX < 0) testX = MAZE_WIDTH - 1;
            if (testX >= MAZE_WIDTH) testX = 0;
            if (maze[testY]?.[testX] === 0) {
              validDir = dir;
              break;
            }
          }

          if (validDir) {
            return { ...ghost, x: ghost.x + validDir.dx, y: ghost.y + validDir.dy, direction: validDir };
          }
          return ghost;
        })
      );

    }, 200);

    return () => clearInterval(gameInterval);
  }, [nextDir, pacmanDir, gameOver, won, maze]);

  // Eat pellets when Pac-Man enters a space
  useEffect(() => {
    if (pelletsRef.current[pacmanPos.y]?.[pacmanPos.x]) {
      pelletsRef.current[pacmanPos.y][pacmanPos.x] = false;
      setScore((s) => s + 10);
      setPelletsLeft((p) => p - 1);
    }
  }, [pacmanPos]);

  // Check collision
  useEffect(() => {
    ghosts.forEach((ghost) => {
      if (ghost.x === pacmanPos.x && ghost.y === pacmanPos.y) {
        setGameOver(true);
      }
    });
  }, [pacmanPos, ghosts]);

  // Win when all pellets are collected
  useEffect(() => {
    if (pelletsLeft <= 0 && !gameOver) {
      setWon(true);
    }
  }, [pelletsLeft, gameOver]);

  // Award coins when game ends
  useEffect(() => {
    if (gameOver || won) {
      const coins = calculatePacManCoins(score, won);
      addSandDollars(coins);

      // Show notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg font-bold z-50 shadow-lg';
      notification.textContent = `+${coins} Sand Dollars!`;
      document.body.appendChild(notification);

      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    }
  }, [pelletsLeft]);

  const drawGameToCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.width = MAZE_WIDTH * CELL_SIZE;
    canvas.height = MAZE_HEIGHT * CELL_SIZE;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#000033';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw walls
    ctx.fillStyle = '#0066FF';
    for (let y = 0; y < MAZE_HEIGHT; y++) {
      for (let x = 0; x < MAZE_WIDTH; x++) {
        if (maze[y][x] === 1) {
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }
    }

    // Draw pellets
    ctx.fillStyle = '#FFB8B8';
    for (let y = 0; y < MAZE_HEIGHT; y++) {
      for (let x = 0; x < MAZE_WIDTH; x++) {
        if (pelletsRef.current[y]?.[x]) {
          ctx.fillRect(x * CELL_SIZE + CELL_SIZE / 2 - 2, y * CELL_SIZE + CELL_SIZE / 2 - 2, 4, 4);
        }
      }
    }

    // Draw Pac-Man
    ctx.fillStyle = '#FFFF00';
    const pacX = pacmanPos.x * CELL_SIZE + CELL_SIZE / 2;
    const pacY = pacmanPos.y * CELL_SIZE + CELL_SIZE / 2;
    const radius = CELL_SIZE / 2 - 2;

    ctx.beginPath();
    ctx.arc(pacX, pacY, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000033';
    let mouthAngle = 0;
    if (pacmanDir.dx === 1) mouthAngle = 0;
    else if (pacmanDir.dx === -1) mouthAngle = Math.PI;
    else if (pacmanDir.dy === -1) mouthAngle = Math.PI * 1.5;
    else if (pacmanDir.dy === 1) mouthAngle = Math.PI * 0.5;

    const mouthSize = radius * 0.6;
    ctx.save();
    ctx.translate(pacX, pacY);
    ctx.rotate(mouthAngle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-mouthSize, -mouthSize * 0.7);
    ctx.lineTo(0, -mouthSize * 1.3);
    ctx.lineTo(mouthSize, -mouthSize * 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Draw ghosts
    ghosts.forEach((ghost) => {
      const ghostX = ghost.x * CELL_SIZE + CELL_SIZE / 2;
      const ghostY = ghost.y * CELL_SIZE + CELL_SIZE / 2;
      const ghostSize = CELL_SIZE / 2 - 1;

      ctx.fillStyle = ghost.color;
      ctx.beginPath();
      ctx.moveTo(ghostX - ghostSize, ghostY - ghostSize / 2);
      ctx.quadraticCurveTo(ghostX - ghostSize, ghostY - ghostSize, ghostX, ghostY - ghostSize);
      ctx.quadraticCurveTo(ghostX + ghostSize, ghostY - ghostSize, ghostX + ghostSize, ghostY - ghostSize / 2);
      ctx.lineTo(ghostX + ghostSize, ghostY + ghostSize / 2);
      ctx.lineTo(ghostX - ghostSize, ghostY + ghostSize / 2);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = ghost.color;
      const spikeWidth = ghostSize * 0.3;
      const spikeHeight = ghostSize * 0.5;
      const bottomY = ghostY + ghostSize / 2;
      const spaceWidth = (ghostSize * 2) / 4;

      for (let i = 0; i < 4; i++) {
        const spikeX = ghostX - ghostSize + (i + 0.5) * spaceWidth;
        ctx.beginPath();
        ctx.moveTo(spikeX - spikeWidth, bottomY);
        ctx.lineTo(spikeX + spikeWidth, bottomY);
        ctx.lineTo(spikeX, bottomY + spikeHeight);
        ctx.closePath();
        ctx.fill();
      }

      ctx.fillStyle = '#FFFFFF';
      const eyeWidth = 1.5;
      const eyeHeight = 3;
      ctx.fillRect(ghostX - ghostSize / 3 - eyeWidth / 2, ghostY - ghostSize / 3 - eyeHeight / 2, eyeWidth, eyeHeight);
      ctx.fillRect(ghostX + ghostSize / 3 - eyeWidth / 2, ghostY - ghostSize / 3 - eyeHeight / 2, eyeWidth, eyeHeight);
    });

    return canvas;
  };

  // Three.js setup
  useEffect(() => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Determine container size (fallback to reasonable defaults)
    const container = containerRef.current;
    const containerW = container ? Math.max(container.clientWidth, 360) : 360;
    const containerH = container ? Math.max(container.clientHeight, 400) : 400;

    // Create an orthographic camera sized to the game plane so the canvas matches the maze size
    const planeWidth = MAZE_WIDTH * CELL_SIZE;
    const planeHeight = MAZE_HEIGHT * CELL_SIZE;
    const camera = new THREE.OrthographicCamera(-planeWidth / 2, planeWidth / 2, planeHeight / 2, -planeHeight / 2, 0.1, 1000);
    camera.position.z = 10;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // Size the renderer to container so it fits the UI; CSS will center the plane
    renderer.setSize(containerW, containerH);
    renderer.setClearColor(0x000033);
    rendererRef.current = renderer;

    if (containerRef.current) {
      // remove any previous canvas
      const existing = containerRef.current.querySelector('canvas');
      if (existing) existing.remove();
      renderer.domElement.style.width = `${containerW}px`;
      renderer.domElement.style.height = `${containerH}px`;
      containerRef.current.appendChild(renderer.domElement);
    }

    let gameTexture = new THREE.CanvasTexture(drawGameToCanvas());
    const gameMaterial = new THREE.MeshBasicMaterial({ map: gameTexture });
    const gameGeometry = new THREE.PlaneGeometry(MAZE_WIDTH * CELL_SIZE, MAZE_HEIGHT * CELL_SIZE);
    const gameMesh = new THREE.Mesh(gameGeometry, gameMaterial);
    scene.add(gameMesh);

    // UI canvas for score
    const createUICanvas = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 100;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFFF00';
      ctx.font = 'bold 20px Arial';
      ctx.fillText(`Score: ${score}  |  Pellets: ${pelletsLeft}`, 20, 40);
      if (gameOver) {
        ctx.fillStyle = '#FF0000';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('GAME OVER!', 120, 80);
      } else if (won) {
        ctx.fillStyle = '#00FF00';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('YOU WON!', 130, 80);
      }
      return canvas;
    };

    let uiTexture = new THREE.CanvasTexture(createUICanvas());
    const uiMaterial = new THREE.MeshBasicMaterial({ map: uiTexture });
    const uiGeometry = new THREE.PlaneGeometry(300, 75);
    const uiMesh = new THREE.Mesh(uiGeometry, uiMaterial);
    uiMesh.position.set(0, -planeHeight / 2 + 60, 1);
    scene.add(uiMesh);

    const handleResize = () => {
      const container = containerRef.current;
      const newW = container ? Math.max(container.clientWidth, 360) : window.innerWidth;
      const newH = container ? Math.max(container.clientHeight, 400) : window.innerHeight;
      // keep camera fixed to game plane size (no change needed), but update renderer size
      renderer.setSize(newW, newH);
      renderer.domElement.style.width = `${newW}px`;
      renderer.domElement.style.height = `${newH}px`;
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      requestAnimationFrame(animate);

      gameTexture = new THREE.CanvasTexture(drawGameToCanvas());
      gameMaterial.map = gameTexture;
      gameMaterial.needsUpdate = true;

      uiTexture = new THREE.CanvasTexture(createUICanvas());
      uiMaterial.map = uiTexture;
      uiMaterial.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      gameTexture.dispose();
      uiTexture.dispose();
      gameMaterial.dispose();
      uiMaterial.dispose();
      gameGeometry.dispose();
      uiGeometry.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [pacmanPos, ghosts, pacmanDir, score, pelletsLeft, gameOver, won]);

  const handleRestart = () => {
    setPacmanPos({ x: 9, y: 15 });
    setPacmanDir({ dx: 0, dy: 0 });
    setNextDir({ dx: 0, dy: 0 });
    setGhosts([
      { id: 0, x: 8, y: 9, color: '#FF0000', direction: { dx: 1, dy: 0 } },
      { id: 1, x: 9, y: 9, color: '#FFB897', direction: { dx: -1, dy: 0 } },
      { id: 2, x: 10, y: 9, color: '#00FFFF', direction: { dx: 0, dy: 1 } },
      { id: 3, x: 9, y: 8, color: '#FFB0E0', direction: { dx: 0, dy: -1 } },
    ]);
    setScore(0);
    setGameOver(false);
    setWon(false);
    pelletsRef.current = maze.map((row, y) =>
      row.map((cell, x) => cell === 0 && !(x === 9 && y === 1) && !(x === 9 && y === 9))
    );
    let count = 0;
    for (let y = 0; y < MAZE_HEIGHT; y++) {
      for (let x = 0; x < MAZE_WIDTH; x++) {
        if (pelletsRef.current[y][x]) {
          count++;
        }
      }
    }
    setPelletsLeft(count);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div ref={containerRef} className="w-full h-full" />

      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">PAC-MAN (Three.js)</h1>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors text-2xl"
        >
          ✕
        </button>
      </div>

      <div className="absolute bottom-4 left-4 right-4 text-white text-sm space-y-2">
        <p>Controls: Arrow Keys or WASD to move</p>
        <p>Eat all pellets to win!</p>
        {(gameOver || won) && (
          <button
            onClick={handleRestart}
            className="px-4 py-2 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-300"
          >
            Play Again
          </button>
        )}
      </div>
    </div>
  );
}
