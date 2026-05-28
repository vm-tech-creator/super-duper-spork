'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface Rocket {
  x: number;
  y: number;
  angle: number;
  health: number;
  isPlayer: boolean;
}

interface Bullet {
  x: number;
  y: number;
  angle: number;
  isPlayer: boolean;
  id: number;
}

interface SpaceWarProps {
  onClose?: () => void;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const ROCKET_SIZE = 30;
const BULLET_SPEED = 8;
const ROCKET_SPEED = 4;
const ROTATION_SPEED = 0.08;
const MAX_HEALTH = 100;

export default function SpaceWar({ onClose }: SpaceWarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const keysRef = useRef<Set<string>>(new Set());
  
  const [playerRocket, setPlayerRocket] = useState<Rocket>({
    x: 100,
    y: CANVAS_HEIGHT / 2,
    angle: 0,
    health: MAX_HEALTH,
    isPlayer: true,
  });
  
  const [aiRocket, setAiRocket] = useState<Rocket>({
    x: CANVAS_WIDTH - 100,
    y: CANVAS_HEIGHT / 2,
    angle: Math.PI,
    health: MAX_HEALTH,
    isPlayer: false,
  });
  
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string>('');
  const [score, setScore] = useState(0);
  const bulletIdRef = useRef(0);

  const shootBullet = useCallback((rocket: Rocket) => {
    const bullet: Bullet = {
      x: rocket.x + Math.cos(rocket.angle) * ROCKET_SIZE,
      y: rocket.y + Math.sin(rocket.angle) * ROCKET_SIZE,
      angle: rocket.angle,
      isPlayer: rocket.isPlayer,
      id: bulletIdRef.current++,
    };
    setBullets(prev => [...prev, bullet]);
  }, []);

  const updatePlayerRocket = useCallback(() => {
    setPlayerRocket(prev => {
      let newAngle = prev.angle;
      let newX = prev.x;
      let newY = prev.y;

      // Rotation
      if (keysRef.current.has('ArrowLeft')) {
        newAngle -= ROTATION_SPEED;
      }
      if (keysRef.current.has('ArrowRight')) {
        newAngle += ROTATION_SPEED;
      }

      // Movement
      if (keysRef.current.has('ArrowUp')) {
        newX += Math.cos(newAngle) * ROCKET_SPEED;
        newY += Math.sin(newAngle) * ROCKET_SPEED;
      }
      if (keysRef.current.has('ArrowDown')) {
        newX -= Math.cos(newAngle) * ROCKET_SPEED;
        newY -= Math.sin(newAngle) * ROCKET_SPEED;
      }

      // Boundary check
      newX = Math.max(ROCKET_SIZE, Math.min(CANVAS_WIDTH - ROCKET_SIZE, newX));
      newY = Math.max(ROCKET_SIZE, Math.min(CANVAS_HEIGHT - ROCKET_SIZE, newY));

      return { ...prev, x: newX, y: newY, angle: newAngle };
    });
  }, []);

  const updateAiRocket = useCallback(() => {
    setAiRocket(prev => {
      const target = playerRocket;
      const dx = target.x - prev.x;
      const dy = target.y - prev.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      let newAngle = Math.atan2(dy, dx);
      let newX = prev.x;
      let newY = prev.y;

      // Move towards player if far away
      if (distance > 200) {
        newX += Math.cos(newAngle) * ROCKET_SPEED * 0.7;
        newY += Math.sin(newAngle) * ROCKET_SPEED * 0.7;
      } else if (distance < 150) {
        // Move away if too close
        newX -= Math.cos(newAngle) * ROCKET_SPEED * 0.5;
        newY -= Math.sin(newAngle) * ROCKET_SPEED * 0.5;
      }

      // Boundary check
      newX = Math.max(ROCKET_SIZE, Math.min(CANVAS_WIDTH - ROCKET_SIZE, newX));
      newY = Math.max(ROCKET_SIZE, Math.min(CANVAS_HEIGHT - ROCKET_SIZE, newY));

      // AI shooting logic
      if (Math.random() < 0.02 && distance < 400) {
        const aiRocketForShooting: Rocket = { ...prev, x: newX, y: newY, angle: newAngle };
        shootBullet(aiRocketForShooting);
      }

      return { ...prev, x: newX, y: newY, angle: newAngle };
    });
  }, [playerRocket, shootBullet]);

  const updateBullets = useCallback(() => {
    setBullets(prev => {
      return prev
        .map(bullet => ({
          ...bullet,
          x: bullet.x + Math.cos(bullet.angle) * BULLET_SPEED,
          y: bullet.y + Math.sin(bullet.angle) * BULLET_SPEED,
        }))
        .filter(bullet => 
          bullet.x > 0 && bullet.x < CANVAS_WIDTH &&
          bullet.y > 0 && bullet.y < CANVAS_HEIGHT
        );
    });
  }, []);

  const checkCollisions = useCallback(() => {
    setBullets(prevBullets => {
      let remainingBullets = [...prevBullets];
      let playerHit = false;
      let aiHit = false;

      // Check bullet collisions with rockets
      remainingBullets.forEach(bullet => {
        if (bullet.isPlayer) {
          // Check if player bullet hits AI
          const dx = bullet.x - aiRocket.x;
          const dy = bullet.y - aiRocket.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < ROCKET_SIZE) {
            aiHit = true;
            setAiRocket(prev => ({ ...prev, health: Math.max(0, prev.health - 20) }));
            setScore(prev => prev + 10);
          }
        } else {
          // Check if AI bullet hits player
          const dx = bullet.x - playerRocket.x;
          const dy = bullet.y - playerRocket.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < ROCKET_SIZE) {
            playerHit = true;
            setPlayerRocket(prev => ({ ...prev, health: Math.max(0, prev.health - 20) }));
          }
        }
      });

      // Remove bullets that hit
      remainingBullets = remainingBullets.filter(bullet => {
        if (bullet.isPlayer && aiHit) {
          const dx = bullet.x - aiRocket.x;
          const dy = bullet.y - aiRocket.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance >= ROCKET_SIZE;
        }
        if (!bullet.isPlayer && playerHit) {
          const dx = bullet.x - playerRocket.x;
          const dy = bullet.y - playerRocket.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance >= ROCKET_SIZE;
        }
        return true;
      });

      return remainingBullets;
    });
  }, [playerRocket, aiRocket]);

  const checkGameOver = useCallback(() => {
    if (playerRocket.health <= 0) {
      setGameOver(true);
      setWinner('AI Wins!');
    } else if (aiRocket.health <= 0) {
      setGameOver(true);
      setWinner('You Win!');
    }
  }, [playerRocket.health, aiRocket.health]);

  const drawRocket = (ctx: CanvasRenderingContext2D, rocket: Rocket) => {
    ctx.save();
    ctx.translate(rocket.x, rocket.y);
    ctx.rotate(rocket.angle);

    // Rocket body
    ctx.fillStyle = rocket.isPlayer ? '#00ff88' : '#ff4444';
    ctx.beginPath();
    ctx.moveTo(ROCKET_SIZE, 0);
    ctx.lineTo(-ROCKET_SIZE * 0.7, -ROCKET_SIZE * 0.5);
    ctx.lineTo(-ROCKET_SIZE * 0.4, 0);
    ctx.lineTo(-ROCKET_SIZE * 0.7, ROCKET_SIZE * 0.5);
    ctx.closePath();
    ctx.fill();

    // Cockpit
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ROCKET_SIZE * 0.2, 0, ROCKET_SIZE * 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Engine flame
    if (keysRef.current.has('ArrowUp') && rocket.isPlayer) {
      ctx.fillStyle = '#ffaa00';
      ctx.beginPath();
      ctx.moveTo(-ROCKET_SIZE * 0.4, 0);
      ctx.lineTo(-ROCKET_SIZE * 1.2, -ROCKET_SIZE * 0.3);
      ctx.lineTo(-ROCKET_SIZE * 1.2, ROCKET_SIZE * 0.3);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();

    // Health bar
    const healthBarWidth = 50;
    const healthBarHeight = 6;
    const healthBarX = rocket.x - healthBarWidth / 2;
    const healthBarY = rocket.y - ROCKET_SIZE - 15;

    ctx.fillStyle = '#333';
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

    const healthPercent = rocket.health / MAX_HEALTH;
    ctx.fillStyle = rocket.isPlayer ? '#00ff88' : '#ff4444';
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth * healthPercent, healthBarHeight);
  };

  const drawBullets = (ctx: CanvasRenderingContext2D, bullets: Bullet[]) => {
    bullets.forEach(bullet => {
      ctx.fillStyle = bullet.isPlayer ? '#00ff88' : '#ff4444';
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const drawStars = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 100; i++) {
      const x = (i * 73) % CANVAS_WIDTH;
      const y = (i * 137) % CANVAS_HEIGHT;
      const size = (i % 3) + 1;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0f1c';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw stars
    drawStars(ctx);

    // Update game state
    if (!gameOver) {
      updatePlayerRocket();
      updateAiRocket();
      updateBullets();
      checkCollisions();
      checkGameOver();
    }

    // Draw game elements
    drawRocket(ctx, playerRocket);
    drawRocket(ctx, aiRocket);
    drawBullets(ctx, bullets);

    // Draw UI
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`Score: ${score}`, 20, 30);
    ctx.fillText(`Health: ${playerRocket.health}%`, 20, 60);

    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(winner, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
      
      ctx.font = '20px Arial';
      ctx.fillText('Press SPACE to restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
      ctx.textAlign = 'left';
    }

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [
    playerRocket,
    aiRocket,
    bullets,
    gameOver,
    winner,
    score,
    updatePlayerRocket,
    updateAiRocket,
    updateBullets,
    checkCollisions,
    checkGameOver,
  ]);

  const resetGame = () => {
    setPlayerRocket({
      x: 100,
      y: CANVAS_HEIGHT / 2,
      angle: 0,
      health: MAX_HEALTH,
      isPlayer: true,
    });
    setAiRocket({
      x: CANVAS_WIDTH - 100,
      y: CANVAS_HEIGHT / 2,
      angle: Math.PI,
      health: MAX_HEALTH,
      isPlayer: false,
    });
    setBullets([]);
    setGameOver(false);
    setWinner('');
    setScore(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      
      if (e.key === ' ' && gameOver) {
        resetGame();
      }
      
      if (e.key === ' ' && !gameOver) {
        shootBullet(playerRocket);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver, playerRocket, shootBullet]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameLoop]);

  return (
    <div className="relative w-full h-screen bg-[#0a0f1c] flex flex-col items-center justify-center">
      <div className="absolute top-4 left-4 z-50">
        <h1 className="text-[#ffc105] font-bebas-neue font-bold text-2xl mb-2">🚀 Space War</h1>
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
          Arrow Keys: Move | Space: Shoot
        </p>
        <p className="text-[#7a93b4] text-sm">
          Destroy the AI rocket to win!
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
