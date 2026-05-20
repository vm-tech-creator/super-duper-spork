'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';

interface GameState {
  score: number;
  timeLeft: number;
  gameOver: boolean;
  paused: boolean;
  level: number;
}

function Player({ position, onMove }: { position: [number, number, number]; onMove: (newPos: [number, number, number]) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [keys, setKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setKeys(prev => new Set(prev).add(event.code));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(event.code);
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const speed = 5 * delta;
    let newX = position[0];
    let newZ = position[2];

    if (keys.has('KeyW') || keys.has('ArrowUp')) newZ -= speed;
    if (keys.has('KeyS') || keys.has('ArrowDown')) newZ += speed;
    if (keys.has('KeyA') || keys.has('ArrowLeft')) newX -= speed;
    if (keys.has('KeyD') || keys.has('ArrowRight')) newX += speed;

    // Boundary checks (maze boundaries)
    newX = Math.max(-8, Math.min(8, newX));
    newZ = Math.max(-8, Math.min(8, newZ));

    onMove([newX, position[1], newZ]);
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#ff6b6b" emissive="#330000" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.2, 0.2, 0.41]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.2, 0.2, 0.41]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Pupils */}
      <mesh position={[-0.2, 0.2, 0.46]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.2, 0.2, 0.46]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
}

function Coin({ position, onCollect }: { position: [number, number, number]; onCollect: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [collected, setCollected] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current && !collected) {
      meshRef.current.rotation.y += delta * 3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 4) * 0.2;
    }
  });

  useEffect(() => {
    if (collected && meshRef.current) {
      // Collection animation
      const animate = () => {
        if (meshRef.current) {
          meshRef.current.scale.multiplyScalar(0.95);
          if (meshRef.current.scale.x > 0.1) {
            requestAnimationFrame(animate);
          } else {
            meshRef.current.visible = false;
          }
        }
      };
      animate();
    }
  }, [collected]);

  const handleCollect = () => {
    if (!collected) {
      setCollected(true);
      onCollect();
    }
  };

  if (collected) return null;

  return (
    <mesh ref={meshRef} position={position} onClick={handleCollect}>
      <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
      <meshStandardMaterial color="#ffd700" emissive="#332200" />
    </mesh>
  );
}

function Wall({ position, size }: { position: [number, number, number]; size: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#4a5568" />
    </mesh>
  );
}

function MazeScene({ gameState, setGameState }: { gameState: GameState; setGameState: (state: GameState) => void }) {
  const [playerPos, setPlayerPos] = useState<[number, number, number]>([-7, 0.5, -7]);
  const [coins, setCoins] = useState<Array<{ id: number; position: [number, number, number] }>>([]);
  const [collectedCoins, setCollectedCoins] = useState(0);

  // Generate maze walls
  const walls = useMemo(() => {
    const mazeWalls = [
      // Outer boundaries
      { pos: [0, 1, -9], size: [18, 2, 1] },
      { pos: [0, 1, 9], size: [18, 2, 1] },
      { pos: [-9, 1, 0], size: [1, 2, 18] },
      { pos: [9, 1, 0], size: [1, 2, 18] },

      // Inner maze walls
      { pos: [0, 1, -2], size: [10, 2, 1] },
      { pos: [0, 1, 2], size: [10, 2, 1] },
      { pos: [-2, 1, 0], size: [1, 2, 6] },
      { pos: [2, 1, 0], size: [1, 2, 6] },
      { pos: [4, 1, -4], size: [8, 2, 1] },
      { pos: [-4, 1, 4], size: [8, 2, 1] },
      { pos: [6, 1, 0], size: [1, 2, 8] },
      { pos: [-6, 1, 0], size: [1, 2, 8] },
    ];
    return mazeWalls;
  }, []);

  // Generate coins
  useEffect(() => {
    const coinPositions = [
      [7, 0.5, -7], [7, 0.5, 7], [-7, 0.5, 7], [-7, 0.5, -7],
      [0, 0.5, -6], [0, 0.5, 6], [6, 0.5, 0], [-6, 0.5, 0],
      [4, 0.5, -6], [-4, 0.5, 6], [6, 0.5, -4], [-6, 0.5, 4],
      [2, 0.5, -4], [-2, 0.5, 4], [4, 0.5, 2], [-4, 0.5, -2],
    ];

    const newCoins = coinPositions.map((pos, i) => ({
      id: i,
      position: pos as [number, number, number]
    }));
    setCoins(newCoins);
  }, []);

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

  // Check coin collection
  useEffect(() => {
    coins.forEach(coin => {
      const distance = Math.sqrt(
        Math.pow(playerPos[0] - coin.position[0], 2) +
        Math.pow(playerPos[2] - coin.position[2], 2)
      );

      if (distance < 1) {
        setCoins(prev => prev.filter(c => c.id !== coin.id));
        setCollectedCoins(prev => prev + 1);
        setGameState(prev => ({ ...prev, score: prev.score + 50 }));
      }
    });
  }, [playerPos, coins, setGameState]);

  // Check win condition
  useEffect(() => {
    if (collectedCoins >= coins.length && coins.length > 0) {
      setGameState(prev => ({ ...prev, level: prev.level + 1, score: prev.score + 1000 }));
      // Reset for next level
      setCollectedCoins(0);
      setPlayerPos([-7, 0.5, -7]);
    }
  }, [collectedCoins, coins.length, setGameState]);

  const handlePlayerMove = (newPos: [number, number, number]) => {
    // Check wall collisions
    let canMove = true;
    walls.forEach(wall => {
      const wallLeft = wall.pos[0] - wall.size[0] / 2;
      const wallRight = wall.pos[0] + wall.size[0] / 2;
      const wallTop = wall.pos[2] - wall.size[2] / 2;
      const wallBottom = wall.pos[2] + wall.size[2] / 2;

      if (
        newPos[0] >= wallLeft - 0.5 && newPos[0] <= wallRight + 0.5 &&
        newPos[2] >= wallTop - 0.5 && newPos[2] <= wallBottom + 0.5
      ) {
        canMove = false;
      }
    });

    if (canMove) {
      setPlayerPos(newPos);
    }
  };

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 10, 0]} intensity={0.8} />
      <directionalLight position={[-5, 5, 5]} intensity={0.5} />

      {/* Ground */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#2d5016" />
      </mesh>

      {/* Walls */}
      {walls.map((wall, i) => (
        <Wall key={i} position={wall.pos as [number, number, number]} size={wall.size as [number, number, number]} />
      ))}

      {/* Coins */}
      {coins.map(coin => (
        <Coin
          key={coin.id}
          position={coin.position}
          onCollect={() => {}}
        />
      ))}

      {/* Player */}
      <Player position={playerPos} onMove={handlePlayerMove} />

      {/* Finish area */}
      <mesh position={[7, 0.1, 7]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.5, 16]} />
        <meshStandardMaterial color="#22c55e" emissive="#0f5132" />
      </mesh>

      {/* UI Overlay */}
      <Html position={[0, 0, 0]} center>
        <div className="absolute top-4 left-4 text-white font-mono text-xl">
          <div>Score: {gameState.score}</div>
          <div>Time: {gameState.timeLeft}s</div>
          <div>Level: {gameState.level}</div>
          <div>Coins: {collectedCoins}/{coins.length}</div>
        </div>

        {gameState.gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-4">Time's Up!</h2>
              <p className="text-xl mb-2">Final Score: {gameState.score}</p>
              <p className="text-lg mb-4">Level Reached: {gameState.level}</p>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-semibold mr-4"
                onClick={() => setGameState({ score: 0, timeLeft: 60, gameOver: false, paused: false, level: 1 })}
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {!gameState.gameOver && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-white">
            <p className="text-lg">Use WASD or Arrow Keys to move • Collect all coins before time runs out!</p>
          </div>
        )}
      </Html>
    </>
  );
}

export default function MazeRunnerGame() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    timeLeft: 60,
    gameOver: false,
    paused: false,
    level: 1
  });

  return (
    <div className="w-full h-screen bg-gradient-to-b from-blue-900 to-purple-900 relative overflow-hidden">
      <Canvas
        camera={{ position: [0, 15, 0], rotation: [-Math.PI / 2, 0, 0], fov: 75 }}
        style={{ background: 'linear-gradient(to bottom, #1e3a8a, #581c87)' }}
      >
        <MazeScene gameState={gameState} setGameState={setGameState} />
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