'use client'

import { useEffect, useRef, useState } from 'react'

interface SuperstarRacingProps {
  onClose?: () => void
}

const CANVAS_WIDTH = 960
const CANVAS_HEIGHT = 520
const TERRAIN_SEGMENT = 120
const TERRAIN_LENGTH = 220

const CAR_TYPES = {
  basic: {
    name: 'Basic Car',
    unlockRequirement: 0,
    color: '#ffe270',
    accentColor: '#ff8f3a',
    wheelColor: '#101e41',
    fuelEfficiency: 1.0,
    acceleration: 1.0,
    maxSpeed: 6.2,
    description: 'Standard vehicle'
  },
  sports: {
    name: 'Sports Car',
    unlockRequirement: 500,
    color: '#ff6b6b',
    accentColor: '#ff4757',
    wheelColor: '#2f3542',
    fuelEfficiency: 0.8,
    acceleration: 1.2,
    maxSpeed: 7.5,
    description: 'Faster but uses more fuel'
  },
  offroad: {
    name: 'Offroad Vehicle',
    unlockRequirement: 1500,
    color: '#3742fa',
    accentColor: '#2f3542',
    wheelColor: '#ffa502',
    fuelEfficiency: 0.9,
    acceleration: 0.9,
    maxSpeed: 5.8,
    description: 'Better handling on rough terrain'
  },
  luxury: {
    name: 'Luxury Sedan',
    unlockRequirement: 3000,
    color: '#7bed9f',
    accentColor: '#2ed573',
    wheelColor: '#3742fa',
    fuelEfficiency: 1.1,
    acceleration: 0.8,
    maxSpeed: 6.8,
    description: 'Efficient and smooth'
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function createTerrain() {
  const points: { x: number; y: number }[] = []
  let lastHeight = CANVAS_HEIGHT * 0.65
  for (let i = 0; i <= TERRAIN_LENGTH; i += 1) {
    const x = i * TERRAIN_SEGMENT
    const variation = (Math.sin(i * 0.6) * 60 + Math.cos(i * 0.3) * 30 + Math.random() * 30 - 15)
    lastHeight = clamp(lastHeight + variation, CANVAS_HEIGHT * 0.35, CANVAS_HEIGHT * 0.85)
    points.push({ x, y: lastHeight })
  }
  return points
}

function getTerrainY(points: { x: number; y: number }[], worldX: number) {
  if (points.length === 0) return CANVAS_HEIGHT * 0.75

  const maxX = points[points.length - 1].x
  const x = clamp(worldX, 0, maxX)
  const segment = clamp(Math.floor(x / TERRAIN_SEGMENT), 0, points.length - 2)
  const a = points[segment]
  const b = points[segment + 1]

  if (!a || !b) {
    return points[0]?.y ?? CANVAS_HEIGHT * 0.75
  }

  const t = (x - a.x) / Math.max(b.x - a.x, 1)
  return a.y + (b.y - a.y) * t
}

function getTerrainSlope(points: { x: number; y: number }[], worldX: number) {
  if (points.length < 2) return 0

  const maxX = points[points.length - 1].x
  const x = clamp(worldX, 0, maxX)
  const segment = clamp(Math.floor(x / TERRAIN_SEGMENT), 0, points.length - 2)
  const a = points[segment]
  const b = points[segment + 1]

  if (!a || !b) return 0

  const dy = b.y - a.y
  const dx = b.x - a.x
  return Math.atan2(dy, dx)
}

export default function SuperstarRacing({ onClose }: SuperstarRacingProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const [distance, setDistance] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [fuel, setFuel] = useState(100)
  const [coins, setCoins] = useState(0)
  const [score, setScore] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState('Use ↑ to accelerate, ←/→ to balance, ↓ to brake')
  const [currentCar, setCurrentCar] = useState('basic')
  const [unlockedCars, setUnlockedCars] = useState(new Set(['basic']))
  const [bestScore, setBestScore] = useState(0)

  const toggleFullscreen = async () => {
    if (!containerRef.current) return
    try {
      if (document.fullscreenElement === containerRef.current) {
        await document.exitFullscreen()
      } else {
        await containerRef.current.requestFullscreen()
      }
    } catch (error) {
      console.warn('Fullscreen request failed', error)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const terrain = createTerrain()
    const pickupPositions = new Set<number>()
    for (let i = 2; i < TERRAIN_LENGTH; i += 3) {
      pickupPositions.add(i * TERRAIN_SEGMENT + 40)
    }

    const fuelPickupPositions = new Set<number>()
    for (let i = 4; i < TERRAIN_LENGTH; i += 5) {
      fuelPickupPositions.add(i * TERRAIN_SEGMENT + 80)
    }

    const state = {
      distance: 0,
      speed: 0,
      fuel: 100,
      tilt: 0,
      airtime: 0,
      onGround: true,
      crashed: false,
      collected: new Set<number>(),
      fuelCollected: new Set<number>(),
      engine: false,
      controls: {
        accelerate: false,
        brake: false,
        leanLeft: false,
        leanRight: false,
      },
      lastFrame: performance.now(),
    }

    const handleKey = (event: KeyboardEvent, isDown: boolean) => {
      if (event.repeat) return
      switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
          state.controls.accelerate = isDown
          break
        case 'ArrowDown':
        case 'KeyS':
          state.controls.brake = isDown
          break
        case 'ArrowLeft':
        case 'KeyA':
          state.controls.leanLeft = isDown
          break
        case 'ArrowRight':
        case 'KeyD':
          state.controls.leanRight = isDown
          break
      }
    }

    const onKeyDown = (event: KeyboardEvent) => handleKey(event, true)
    const onKeyUp = (event: KeyboardEvent) => handleKey(event, false)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    const drawBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
      gradient.addColorStop(0, '#0b1535')
      gradient.addColorStop(0.45, '#112549')
      gradient.addColorStop(1, '#0d1d3b')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      const stars = 120
      ctx.fillStyle = '#3C5AA6'
      for (let i = 0; i < stars; i += 1) {
        const x = (i * 53) % CANVAS_WIDTH
        const y = ((i * 29) % (CANVAS_HEIGHT * 0.25)) + 20
        ctx.globalAlpha = 0.14
        ctx.fillRect(x, y, 2, 2)
      }
      ctx.globalAlpha = 1
    }

    const drawTerrain = (offset: number) => {
      ctx.fillStyle = '#121a36'
      ctx.beginPath()
      ctx.moveTo(0, CANVAS_HEIGHT)
      for (let px = 0; px <= CANVAS_WIDTH; px += 8) {
        const worldX = offset + px
        const y = getTerrainY(terrain, worldX)
        ctx.lineTo(px, y)
      }
      ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT)
      ctx.closePath()
      ctx.fill()

      ctx.strokeStyle = '#4f86ff'
      ctx.lineWidth = 4
      ctx.beginPath()
      for (let px = 0; px <= CANVAS_WIDTH; px += 8) {
        const worldX = offset + px
        const y = getTerrainY(terrain, worldX)
        if (px === 0) ctx.moveTo(px, y)
        else ctx.lineTo(px, y)
      }
      ctx.stroke()
    }

    const drawCar = (worldX: number, slope: number) => {
      const carX = CANVAS_WIDTH * 0.22
      const carY = getTerrainY(terrain, worldX) - 22
      const bodyWidth = 90
      const bodyHeight = 28
      const wheelRadius = 12
      const rotation = slope + state.tilt * 0.35
      const carType = CAR_TYPES[currentCar as keyof typeof CAR_TYPES]

      ctx.save()
      ctx.translate(carX, carY)
      ctx.rotate(rotation)

      ctx.fillStyle = carType.color
      ctx.strokeStyle = carType.color
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(-bodyWidth * 0.5, -bodyHeight * 0.3)
      ctx.lineTo(bodyWidth * 0.25, -bodyHeight * 0.8)
      ctx.lineTo(bodyWidth * 0.5, -bodyHeight * 0.2)
      ctx.lineTo(bodyWidth * 0.2, 0)
      ctx.lineTo(-bodyWidth * 0.5, 0)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = carType.accentColor
      ctx.fillRect(-bodyWidth * 0.45, 0, bodyWidth * 0.6, bodyHeight * 0.5)
      ctx.fillRect(bodyWidth * 0.05, -bodyHeight * 0.4, bodyWidth * 0.16, bodyHeight * 0.4)

      ctx.fillStyle = carType.wheelColor
      ctx.beginPath()
      ctx.arc(-bodyWidth * 0.3, wheelRadius, wheelRadius, 0, Math.PI * 2)
      ctx.arc(bodyWidth * 0.2, wheelRadius, wheelRadius, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    const drawPickups = (offset: number) => {
      ctx.fillStyle = '#fdd835'
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      pickupPositions.forEach((pickupX) => {
        const screenX = pickupX - offset
        if (screenX < -40 || screenX > CANVAS_WIDTH + 40) return
        const y = getTerrainY(terrain, pickupX) - 38

        ctx.beginPath()
        ctx.arc(screenX, y, 12, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
      })
    }

    const drawFuelPickups = (offset: number) => {
      ctx.fillStyle = '#4f86ff'
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      fuelPickupPositions.forEach((pickupX) => {
        const screenX = pickupX - offset
        if (screenX < -40 || screenX > CANVAS_WIDTH + 40) return
        const y = getTerrainY(terrain, pickupX) - 38

        ctx.beginPath()
        ctx.arc(screenX, y, 10, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()

        // Draw fuel icon
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 12px Arial'
        ctx.textAlign = 'center'
        ctx.fillText('F', screenX, y + 4)
        ctx.textAlign = 'left'
      })
    }

    const drawHUD = () => {
      ctx.fillStyle = '#0e2048'
      ctx.globalAlpha = 0.8
      ctx.fillRect(20, 22, 280, 130)
      ctx.globalAlpha = 1

      ctx.fillStyle = '#ffffff'
      ctx.font = '700 18px Barlow, sans-serif'
      ctx.fillText('SUPERSTAR RACING', 32, 48)
      ctx.font = '500 14px Inter, sans-serif'
      ctx.fillStyle = '#cbd5e1'
      ctx.fillText(`DISTANCE ${Math.floor(state.distance)} m`, 32, 74)
      ctx.fillText(`SPEED ${Math.floor(state.speed * 18)} km/h`, 32, 96)
      ctx.fillText(`FUEL ${Math.max(0, Math.floor(state.fuel))}%`, 32, 118)
      ctx.fillText(`COINS ${coins}`, 32, 140)

      ctx.fillStyle = '#ffffff'
      ctx.fillRect(32, 150, 220, 8)
      ctx.fillStyle = '#4f86ff'
      ctx.fillRect(32, 150, 220 * clamp(state.fuel / 100, 0, 1), 8)
    }

    const update = () => {
      const now = performance.now()
      const delta = clamp((now - state.lastFrame) / 16.66, 0.3, 2)
      state.lastFrame = now

      if (!state.crashed) {
        const carType = CAR_TYPES[currentCar as keyof typeof CAR_TYPES]
        if (state.controls.accelerate && state.fuel > 0) {
          state.speed += 0.08 * delta * carType.acceleration
          state.fuel -= 0.25 * delta / carType.fuelEfficiency
          state.engine = true
        } else {
          state.speed -= 0.04 * delta
          state.engine = false
        }

        if (state.controls.brake) {
          state.speed -= 0.16 * delta
        }

        if (state.controls.leanLeft) {
          state.tilt -= 0.04 * delta
        }
        if (state.controls.leanRight) {
          state.tilt += 0.04 * delta
        }
        state.tilt *= 0.98

        state.speed = clamp(state.speed, 0, carType.maxSpeed)
        state.fuel = clamp(state.fuel, 0, 100)

        const speedFactor = state.speed * 12
        state.distance += speedFactor * delta * 0.33

        const worldX = state.distance
        const slope = getTerrainSlope(terrain, worldX)
        const groundY = getTerrainY(terrain, worldX)
        const carY = groundY - 22
        const idealAngle = slope
        const tiltDifference = Math.abs(state.tilt + idealAngle)

        if (tiltDifference > 1.6 && state.speed > 1.3) {
          state.crashed = true
          setGameOver(true)
          setMessage('You flipped! Press R to restart')
        }

        const nearestPickups = Array.from(pickupPositions).filter((pickupX) => {
          return Math.abs(pickupX - worldX) < 30 && !state.collected.has(pickupX)
        })
        nearestPickups.forEach((pickupX) => {
          state.collected.add(pickupX)
          setCoins((current) => current + 5)
          setScore((current) => current + 25)
        })

        const nearestFuelPickups = Array.from(fuelPickupPositions).filter((pickupX) => {
          return Math.abs(pickupX - worldX) < 30 && !state.fuelCollected.has(pickupX)
        })
        nearestFuelPickups.forEach((pickupX) => {
          state.fuelCollected.add(pickupX)
          setFuel((current) => Math.min(100, current + 25))
          setScore((current) => current + 15)
        })

        if (state.fuel <= 0 && state.speed < 0.2) {
          state.crashed = true
          setGameOver(true)
          setMessage('Out of fuel! Press R to restart')
        }
      }

      const render = () => {
        drawBackground()
        drawTerrain(state.distance - CANVAS_WIDTH * 0.22)
        drawPickups(state.distance - CANVAS_WIDTH * 0.22)
        drawFuelPickups(state.distance - CANVAS_WIDTH * 0.22)
        drawCar(state.distance, getTerrainSlope(terrain, state.distance))
        drawHUD()

        if (state.crashed) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'
          ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
          ctx.fillStyle = '#ffffff'
          ctx.font = '800 42px Barlow, sans-serif'
          ctx.fillText('CRASHED', 320, 240)
          ctx.font = '600 20px Inter, sans-serif'
          ctx.fillText(message, 320, 280)
          
          // Draw play again button on canvas
          ctx.fillStyle = '#4f86ff'
          ctx.fillRect(340, 320, 280, 50)
          ctx.fillStyle = '#ffffff'
          ctx.font = '600 18px Inter, sans-serif'
          ctx.fillText('PLAY AGAIN (R)', 380, 350)
        }
      }

      render()
      setSpeed(state.speed)
      setDistance(state.distance)
      setFuel(state.fuel)
      setScore((prev) => {
        const newScore = prev + (state.speed > 0 && !state.crashed ? 0.05 * delta : 0)
        setBestScore(currentBest => Math.max(currentBest, Math.floor(newScore)))
        
        // Check for car unlocks
        Object.entries(CAR_TYPES).forEach(([carKey, carData]) => {
          if (Math.floor(newScore) >= carData.unlockRequirement && !unlockedCars.has(carKey)) {
            setUnlockedCars(prev => new Set([...prev, carKey]))
          }
        })
        
        return newScore
      })
      setCoins((prev) => prev + (state.speed > 0 && !state.crashed ? 0.01 * delta : 0))
    }

    const animate = () => {
      update()
      if (state.crashed) return
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    const handleRestart = (event: KeyboardEvent) => {
      if (event.code !== 'KeyR') return
      if (!state.crashed) return
      state.crashed = false
      setGameOver(false)
      state.distance = 0
      state.speed = 0
      state.tilt = 0
      state.fuel = 100
      state.collected.clear()
      state.fuelCollected.clear()
      setCoins(0)
      setScore(0)
      setMessage('Use ↑ to accelerate, ←/→ to balance, ↓ to brake')
      animate()
    }

    window.addEventListener('keydown', handleRestart)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('keydown', handleRestart)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#050b1a] text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.05),_transparent_35%)] pointer-events-none" />
      <div className="relative z-10 max-w-[1120px] mx-auto px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#7da1ff]">Racing</p>
            <h1 className="text-4xl font-black tracking-[0.04em] text-white">Superstar Racing</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">A hill climb racer inspired by classic mobile physics. Keep the car balanced, collect coins, and avoid flipping.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onClose?.()}
              className="rounded-full bg-[#0b1734] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#d9e7ff] shadow-[0_18px_40px_rgba(16,29,80,.35)] transition hover:bg-[#111f4f]"
            >
              Back
            </button>
            <button
              onClick={toggleFullscreen}
              className="rounded-full bg-[#1a2a56] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#d9e7ff] shadow-[0_18px_40px_rgba(16,29,80,.35)] transition hover:bg-[#17243f]"
            >
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#09102b] shadow-[0_30px_120px_rgba(4,8,32,0.65)]">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="w-full h-auto block"
          />
        </div>

        {gameOver && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setGameOver(false)
                // Trigger restart
                const event = new KeyboardEvent('keydown', { code: 'KeyR' })
                window.dispatchEvent(event)
              }}
              className="rounded-full bg-[#4f86ff] px-8 py-4 text-lg font-semibold uppercase tracking-[0.18em] text-white shadow-[0_18px_40px_rgba(79,134,255,0.35)] transition hover:bg-[#3a6fd8]"
            >
              Play Again
            </button>
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Distance</p>
            <p className="mt-2 text-3xl font-bold text-white">{Math.floor(distance)} m</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Fuel</p>
            <p className="mt-2 text-3xl font-bold text-white">{Math.floor(fuel)}%</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Coins</p>
            <p className="mt-2 text-3xl font-bold text-white">{coins}</p>
          </div>
        </div>
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Current Car</p>
              <p className="text-xl font-bold text-white">{CAR_TYPES[currentCar as keyof typeof CAR_TYPES].name}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Best Score</p>
              <p className="text-xl font-bold text-yellow-400">{Math.floor(bestScore)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(CAR_TYPES).map(([carKey, carData]) => {
              const isUnlocked = unlockedCars.has(carKey)
              const isSelected = currentCar === carKey
              return (
                <button
                  key={carKey}
                  onClick={() => isUnlocked && setCurrentCar(carKey)}
                  disabled={!isUnlocked}
                  className={`p-3 rounded-lg border transition ${
                    isSelected
                      ? 'border-yellow-400 bg-yellow-400/20 text-yellow-400'
                      : isUnlocked
                      ? 'border-white/20 bg-white/5 text-white hover:bg-white/10'
                      : 'border-gray-600 bg-gray-800/50 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <div className="text-sm font-semibold">{carData.name}</div>
                  <div className="text-xs opacity-75">{isUnlocked ? carData.description : `Unlock at ${carData.unlockRequirement} pts`}</div>
                </button>
              )
            })}
          </div>
        </div>
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          <p className="font-semibold text-white">Controls</p>
          <ul className="mt-3 space-y-2">
            <li>↑ / W = Accelerate</li>
            <li>↓ / S = Brake</li>
            <li>← / A = Lean back</li>
            <li>→ / D = Lean forward</li>
            <li>R = Restart after crash</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
