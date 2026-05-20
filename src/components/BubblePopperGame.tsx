'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';

interface GameState {
  score: number;
  combo: number;
  timeLeft: number;
  gameOver: boolean;
  paused: boolean;
  level: number;
}

interface Bubble {
  id: number;
  position: [number, number, number];
  velocity: [number, number, number];
  size: number;
  color: string;
  points: number;
  popped: boolean;
}

function BubbleMesh({ bubble, onPop }: { bubble: Bubble; onPop: (id: number) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(1);

  useFrame((state, delta) => {
    if (!meshRef.current || bubble.popped) return;

    // Float up and down
    meshRef.current.position.y = bubble.position[1] + Math.sin(state.clock.elapsedTime * 2 + bubble.id) * 0.5;

    // Gentle rotation
    meshRef.current.rotation.x += delta * 0.5;
    meshRef.current.rotation.y += delta * 0.3;

    // Pulse effect
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 3 + bubble.id) * 0.1;
    meshRef.current.scale.setScalar(bubble.size * pulse);
  });

  const handleClick = () => {
    if (!bubble.popped) {
      onPop(bubble.id);
      // Pop animation
      setScale(0);
      setTimeout(() => {
        if (meshRef.current) {
          meshRef.current.visible = false;
        }
      }, 200);
    }
  };

  if (bubble.popped) return null;

  return (
    <mesh
      ref={meshRef}
      position={bubble.position}
      onClick={handleClick}
      scale={scale}
    >
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color={bubble.color}
        transparent
        opacity={0.8}
        emissive={bubble.color}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}

function ParticleSystem({ position, color }: { position: [number, number, number]; color: string }) {
  const pointsRef = useRef<THREE.Points>(null);
  const [particles, setParticles] = useState<THREE.Vector3[]>([]);

  useEffect(() => {
    // Create particle explosion
    const newParticles = Array.from({ length: 20 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      return new THREE.Vector3(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        (Math.random() - 0.5) * speed
      );
    });
    setParticles(newParticles);

    // Remove particles after animation
    setTimeout(() => setParticles([]), 1000);
  }, [position]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      particles.forEach((particle, i) => {
        particle.multiplyScalar(0.98); // Slow down
      });
      pointsRef.current.geometry.setFromPoints(particles);
    }
  });

  if (particles.length === 0) return null;

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry />
      <pointsMaterial color={color} size={0.1} transparent opacity={0.8} />
    </points>
  );
}

function BubbleScene({ gameState, setGameState }: { gameState: GameState; setGameState: (state: GameState) => void }) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [particles, setParticles] = useState<Array<{ id: number; position: [number, number, number]; color: string }>>([]);
  const [lastPopTime, setLastPopTime] = useState(0);

  // Generate bubbles
  useEffect(() => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe'];
    const newBubbles: Bubble[] = Array.from({ length: 15 + gameState.level * 5 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 20,
        Math.random() * 10 + 2,
        (Math.random() - 0.5) * 20
      ],
      velocity: [
        (Math.random() - 0.5) * 0.5,
        Math.random() * 0.2,
        (Math.random() - 0.5) * 0.5
      ],
      size: Math.random() * 0.5 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      points: Math.floor(Math.random() * 50) + 10,
      popped: false
    }));
    setBubbles(newBubbles);
  }, [gameState.level]);

  // Timer
  useEffect(() => {
    if (gameState.gameOver || gameState.paused) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          return { ...prev, gameOver: true, timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.gameOver, gameState.paused, setGameState]);

  // Check win condition
  useEffect(() => {
    const activeBubbles = bubbles.filter(b => !b.popped);
    if (activeBubbles.length === 0 && bubbles.length > 0) {
      setGameState(prev => ({
        ...prev,
        level: prev.level + 1,
        score: prev.score + prev.level * 100,
        timeLeft: Math.max(30, prev.timeLeft + 10)
      }));
    }
  }, [bubbles, setGameState]);

  const handleBubblePop = (id: number) => {
    const bubble = bubbles.find(b => b.id === id);
    if (!bubble || bubble.popped) return;

    const currentTime = Date.now();
    const timeDiff = currentTime - lastPopTime;
    let comboMultiplier = 1;

    // Combo system
    if (timeDiff < 1000) { // Within 1 second
      comboMultiplier = Math.min(gameState.combo + 1, 5);
      setGameState(prev => ({ ...prev, combo: comboMultiplier }));
    } else {
      setGameState(prev => ({ ...prev, combo: 1 }));
    }

    const points = bubble.points * comboMultiplier;
    setGameState(prev => ({ ...prev, score: prev.score + points }));

    // Add particles
    setParticles(prev => [...prev, {
      id: Date.now(),
      position: bubble.position,
      color: bubble.color
    }]);

    // Mark bubble as popped
    setBubbles(prev => prev.map(b =>
      b.id === id ? { ...b, popped: true } : b
    ));

    setLastPopTime(currentTime);
  };

  // Clean up old particles
  useEffect(() => {
    const cleanup = setInterval(() => {
      setParticles(prev => prev.filter(p => Date.now() - p.id < 2000));
    }, 1000);
    return () => clearInterval(cleanup);
  }, []);

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <directionalLight position={[-5, 5, 5]} intensity={0.4} />

      {/* Background elements */}
      <mesh position={[0, 0, -10]}>
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial color="#1a1a2a" />
      </mesh>

      {/* Bubbles */}
      {bubbles.map(bubble => (
        <BubbleMesh
          key={bubble.id}
          bubble={bubble}
          onPop={handleBubblePop}
        />
      ))}

      {/* Particles */}
      {particles.map(particle => (
        <ParticleSystem
          key={particle.id}
          position={particle.position}
          color={particle.color}
        />
      ))}

      {/* UI Overlay */}
      <Html position={[0, 0, 0]} center>
        <div className="absolute top-4 left-4 text-white font-mono text-xl">
          <div>Score: {gameState.score}</div>
          <div>Combo: x{gameState.combo}</div>
          <div>Time: {gameState.timeLeft}s</div>
          <div>Level: {gameState.level}</div>
          <div>Bubbles Left: {bubbles.filter(b => !b.popped).length}</div>
        </div>

        {gameState.gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-4">Time's Up!</h2>
              <p className="text-xl mb-2">Final Score: {gameState.score}</p>
              <p className="text-lg mb-4">Level Reached: {gameState.level}</p>
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-lg font-semibold mr-4"
                onClick={() => setGameState({ score: 0, combo: 1, timeLeft: 60, gameOver: false, paused: false, level: 1 })}
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {!gameState.gameOver && gameState.combo > 1 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-6xl font-bold text-yellow-400 animate-pulse">
              {gameState.combo}x COMBO!
            </div>
          </div>
        )}

        {!gameState.gameOver && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-white">
            <p className="text-lg">Click bubbles to pop them • Build combos for bonus points!</p>
          </div>
        )}
      </Html>
    </>
  );
}

export default function BubblePopperGame() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    combo: 1,
    timeLeft: 60,
    gameOver: false,
    paused: false,
    level: 1
  });

  return (
    <div className="w-full h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      <Canvas
        camera={{ position: [0, 5, 15], fov: 75 }}
        style={{ background: 'radial-gradient(ellipse at center, #2d1b69 0%, #11998e 100%)' }}
      >
        <BubbleScene gameState={gameState} setGameState={setGameState} />
      </Canvas>

      <div className="absolute top-4 right-4 text-white">
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
          onClick={() => setGameState({ ...gameState, paused: !gameState.paused })}
        >
          {gameState.paused ? 'Resume' : 'Pause'}
        </button>
      </div>
    </div>
  );
}