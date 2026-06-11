'use client';

import { forwardRef, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

interface GameState {
  score: number;
  lives: number;
  gameOver: boolean;
  paused: boolean;
}

const Spaceship = forwardRef<
  THREE.Group,
  { position: [number, number, number]; rotation: [number, number, number] }
>(({ position, rotation }, ref) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      {/* Main body */}
      <mesh ref={meshRef}>
        <coneGeometry args={[0.5, 2, 8]} />
        <meshStandardMaterial color="#00ff88" emissive="#004422" />
      </mesh>
      {/* Wings */}
      <mesh position={[-1, 0, 0]}>
        <boxGeometry args={[0.2, 0.1, 1]} />
        <meshStandardMaterial color="#ff4444" emissive="#220000" />
      </mesh>
      <mesh position={[1, 0, 0]}>
        <boxGeometry args={[0.2, 0.1, 1]} />
        <meshStandardMaterial color="#ff4444" emissive="#220000" />
      </mesh>
      {/* Engine glow */}
      <mesh position={[0, -1, 0]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshBasicMaterial color="#0088ff" transparent opacity={0.6} />
      </mesh>
    </group>
  );
});

Spaceship.displayName = 'Spaceship';

function Star({ position, onCollect }: { position: [number, number, number]; onCollect: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [collected, setCollected] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current && !collected) {
      meshRef.current.rotation.y += delta * 2;
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 3) * 0.01;
    }
  });

  const handleClick = () => {
    if (!collected) {
      setCollected(true);
      onCollect();
      // Animate collection
      if (meshRef.current) {
        meshRef.current.scale.setScalar(0);
      }
    }
  };

  if (collected) return null;

  return (
    <mesh ref={meshRef} position={position} onClick={handleClick}>
      <octahedronGeometry args={[0.3, 0]} />
      <meshStandardMaterial color="#ffff00" emissive="#444400" />
    </mesh>
  );
}

function Asteroid({ position, speed }: { position: [number, number, number]; speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * speed;
      meshRef.current.rotation.y += delta * speed * 0.7;
      meshRef.current.position.z += speed * 10 * delta;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <dodecahedronGeometry args={[0.8, 0]} />
      <meshStandardMaterial color="#8B4513" roughness={0.8} />
    </mesh>
  );
}

function GameScene({ gameState, setGameState }: { gameState: GameState; setGameState: (state: GameState) => void }) {
  const { camera, mouse } = useThree();
  const spaceshipRef = useRef<THREE.Group>(null);
  const [stars, setStars] = useState<Array<{ id: number; position: [number, number, number] }>>([]);
  const [asteroids, setAsteroids] = useState<Array<{ id: number; position: [number, number, number]; speed: number }>>([]);

  // Initialize stars
  useEffect(() => {
    const initialStars = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        Math.random() * -50 - 10
      ] as [number, number, number]
    }));
    setStars(initialStars);
  }, []);

  // Initialize asteroids
  useEffect(() => {
    const initialAsteroids = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        Math.random() * -40 - 20
      ] as [number, number, number],
      speed: Math.random() * 0.5 + 0.2
    }));
    setAsteroids(initialAsteroids);
  }, []);

  useFrame((state, delta) => {
    if (gameState.gameOver || gameState.paused) return;

    // Move camera forward
    camera.position.z -= delta * 5;

    // Update spaceship position based on mouse
    if (spaceshipRef.current) {
      spaceshipRef.current.position.x = mouse.x * 8;
      spaceshipRef.current.position.y = mouse.y * 6;
    }

    // Check star collection
    stars.forEach(star => {
      if (spaceshipRef.current) {
        const distance = spaceshipRef.current.position.distanceTo(new THREE.Vector3(...star.position));
        if (distance < 1.5) {
          setStars(prev => prev.filter(s => s.id !== star.id));
          setGameState({ ...gameState, score: gameState.score + 10 });

          // Add new star
          setStars(prev => [...prev, {
            id: Date.now(),
            position: [
              (Math.random() - 0.5) * 40,
              (Math.random() - 0.5) * 40,
              camera.position.z - 50
            ]
          }]);
        }
      }
    });

    // Check asteroid collision
    asteroids.forEach(asteroid => {
      if (spaceshipRef.current) {
        const distance = spaceshipRef.current.position.distanceTo(new THREE.Vector3(...asteroid.position));
        if (distance < 1.2) {
          setGameState({ ...gameState, lives: gameState.lives - 1 });
          // Reset asteroid position
          setAsteroids(prev => prev.map(a =>
            a.id === asteroid.id
              ? {
                  ...a,
                  position: [
                    (Math.random() - 0.5) * 30,
                    (Math.random() - 0.5) * 30,
                    camera.position.z - 40
                  ]
                }
              : a
          ));

          if (gameState.lives <= 1) {
            setGameState({ ...gameState, gameOver: true, lives: 0 });
          }
        }
      }
    });

    // Reset asteroids that go too far
    setAsteroids(prev => prev.map(asteroid => {
      if (asteroid.position[2] > camera.position.z + 10) {
        return {
          ...asteroid,
          position: [
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30,
            camera.position.z - 40
          ]
        };
      }
      return asteroid;
    }));
  });

  const collectStar = () => {
    setGameState({ ...gameState, score: gameState.score + 10 });
  };

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

      <Spaceship
        ref={spaceshipRef}
        position={[0, 0, 5]}
        rotation={[0, 0, 0]}
      />

      {stars.map(star => (
        <Star
          key={star.id}
          position={star.position}
          onCollect={collectStar}
        />
      ))}

      {asteroids.map(asteroid => (
        <Asteroid
          key={asteroid.id}
          position={asteroid.position}
          speed={asteroid.speed}
        />
      ))}

      {/* UI Overlay */}
      <Html position={[0, 0, 0]} center>
        <div className="absolute top-4 left-4 text-white font-mono text-xl">
          <div>Score: {gameState.score}</div>
          <div>Lives: {gameState.lives}</div>
        </div>

        {gameState.gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
              <p className="text-xl mb-4">Final Score: {gameState.score}</p>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold"
                onClick={() => setGameState({ score: 0, lives: 3, gameOver: false, paused: false })}
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {!gameState.gameOver && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-white">
            <p className="text-lg">Move mouse to control spaceship • Click stars to collect them!</p>
          </div>
        )}
      </Html>
    </>
  );
}

export default function SpaceExplorerGame({ onClose }: { onClose?: () => void } = {}) {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    gameOver: false,
    paused: false
  });

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: 'radial-gradient(ellipse at center, #0c0c2c 0%, #000000 70%)' }}
      >
        <GameScene gameState={gameState} setGameState={setGameState} />
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
