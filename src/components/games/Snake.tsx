'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface SnakeProps {
  onClose?: () => void;
}

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const GRID_SIZE = 20;
const CELL_SIZE = CANVAS_WIDTH / GRID_SIZE;
const INITIAL_SPEED = 150;

export default function Snake({ onClose }: SnakeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  
  const [snake, setSnake] = useState<Array<{ x: number; y: number }>>([
    { x: 10, y: 10 },
  ]);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [nextDirection, setNextDirection] = useState({ x: 1, y: 0 });
  const [apple, setApple] = useState({ x: 15, y: 15 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const generateApple = useCallback((currentSnake: Array<{ x: number; y: number }>) => {
    let newApple;
    do {
      newApple = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === newApple.x && segment.y === newApple.y));
    return newApple;
  }, []);

  const resetGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 1, y: 0 });
    setNextDirection({ x: 1, y: 0 });
    setApple({ x: 15, y: 15 });
    setGameOver(false);
    setScore(0);
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setDirection(nextDirection);
    
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + nextDirection.x,
        y: head.y + nextDirection.y,
      };

      // Check border collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true);
        setHighScore(prev => Math.max(prev, score));
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        setHighScore(prev => Math.max(prev, score));
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check apple collision
      if (newHead.x === apple.x && newHead.y === apple.y) {
        setScore(prev => prev + 10);
        setApple(generateApple(newSnake));
        return newSnake;
      }

      // Remove tail if no apple eaten
      newSnake.pop();
      return newSnake;
    });
  }, [gameOver, nextDirection, apple, generateApple, score]);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0f1c';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid
    ctx.strokeStyle = '#1a2a4a';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, CANVAS_HEIGHT);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(CANVAS_WIDTH, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw apple
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(
      apple.x * CELL_SIZE + CELL_SIZE / 2,
      apple.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw apple stem
    ctx.fillStyle = '#4a2';
    ctx.fillRect(apple.x * CELL_SIZE + CELL_SIZE / 2 - 1, apple.y * CELL_SIZE + 2, 2, 5);

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00ff88' : '#00cc66';
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );

      // Draw eyes on head
      if (index === 0) {
        ctx.fillStyle = '#ffffff';
        const eyeOffset = 4;
        const eyeSize = 3;
        
        if (direction.x === 1) {
          ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize, segment.y * CELL_SIZE + eyeOffset, eyeSize, eyeSize);
          ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize, segment.y * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize, eyeSize, eyeSize);
        } else if (direction.x === -1) {
          ctx.fillRect(segment.x * CELL_SIZE + eyeOffset, segment.y * CELL_SIZE + eyeOffset, eyeSize, eyeSize);
          ctx.fillRect(segment.x * CELL_SIZE + eyeOffset, segment.y * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize, eyeSize, eyeSize);
        } else if (direction.y === 1) {
          ctx.fillRect(segment.x * CELL_SIZE + eyeOffset, segment.y * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize, eyeSize, eyeSize);
          ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize, segment.y * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize, eyeSize, eyeSize);
        } else {
          ctx.fillRect(segment.x * CELL_SIZE + eyeOffset, segment.y * CELL_SIZE + eyeOffset, eyeSize, eyeSize);
          ctx.fillRect(segment.x * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize, segment.y * CELL_SIZE + eyeOffset, eyeSize, eyeSize);
        }
      }
    });

    // Draw UI
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`Score: ${score}`, 20, 30);
    ctx.fillText(`High Score: ${highScore}`, 20, 60);

    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
      
      ctx.font = '24px Arial';
      ctx.fillText(`Final Score: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
      
      ctx.font = '20px Arial';
      ctx.fillText('Press SPACE to restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 70);
      ctx.textAlign = 'left';
    }
  }, [snake, apple, direction, gameOver, score, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) {
        if (e.key === ' ') {
          resetGame();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) {
            setNextDirection({ x: 0, y: -1 });
          }
          e.preventDefault();
          break;
        case 'ArrowDown':
          if (direction.y !== -1) {
            setNextDirection({ x: 0, y: 1 });
          }
          e.preventDefault();
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) {
            setNextDirection({ x: -1, y: 0 });
          }
          e.preventDefault();
          break;
        case 'ArrowRight':
          if (direction.x !== -1) {
            setNextDirection({ x: 1, y: 0 });
          }
          e.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver, resetGame]);

  useEffect(() => {
    const gameLoop = () => {
      drawGame();
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [drawGame]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (!gameOver) {
      intervalRef.current = window.setInterval(moveSnake, INITIAL_SPEED);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameOver, moveSnake]);

  return (
    <div className="relative w-full h-screen bg-[#0a0f1c] flex flex-col items-center justify-center">
      <div className="absolute top-4 left-4 z-50">
        <h1 className="text-[#ffc105] font-bebas-neue font-bold text-2xl mb-2">🐍 Snake</h1>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.href = '/games'}
            className="bg-[#497ab6] text-[#e8edf5] border-none px-4 py-1 rounded text-sm font-barlow font-bold uppercase tracking-[.08em] cursor-pointer hover:bg-[#2b4c7d] transition-all"
          >
            ← Games
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-[#497ab6] text-[#e8edf5] border-none px-4 py-1 rounded text-sm font-barlow font-bold uppercase tracking-[.08em] cursor-pointer hover:bg-[#2b4c7d] transition-all"
          >
            🏠 Home
          </button>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={onClose}
          className="bg-[#ffc105] text-[#080f1c] border-none px-6 py-2 rounded font-barlow font-bold uppercase tracking-[.08em] cursor-pointer hover:bg-[#ffcf3a]"
        >
          ← Back to Game Details
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-40">
        <p className="text-[#ffc105] text-lg font-barlow font-bold mb-2">
          Arrow Keys: Move | Space: Restart
        </p>
        <p className="text-[#7a93b4] text-sm">
          Eat apples to grow. Don't hit the walls or yourself!
        </p>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-2 border-[#497ab6] rounded-lg shadow-2xl"
      />
    </div>
  );
}
