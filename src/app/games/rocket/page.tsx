'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { addSandDollars } from '@/utils/sandDollars';
import SiteHeader from '@/components/SiteHeader';

interface RocketPart {
  id: string;
  name: string;
  type: 'body' | 'thruster' | 'parachute' | 'fuel' | 'wing' | 'capsule' | 'fins' | 'antenna';
  color: string;
  emissive?: string;
  scale: [number, number, number];
  fuelCapacity?: number;
  thrust?: number;
}

interface Mission {
  id: string;
  name: string;
  description: string;
  targetAltitude: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
  baseReward: number;
  objectives: string[];
}

const MISSIONS: Mission[] = [
  {
    id: 'suborbital',
    name: 'Suborbital Flight',
    description: 'Reach 100km altitude and return safely',
    targetAltitude: 100,
    difficulty: 'Easy',
    baseReward: 100,
    objectives: ['Reach 100km altitude', 'Deploy parachute', 'Land safely']
  },
  {
    id: 'orbital',
    name: 'Orbital Mission',
    description: 'Reach 200km altitude and maintain stable orbit',
    targetAltitude: 200,
    difficulty: 'Medium',
    baseReward: 250,
    objectives: ['Reach 200km altitude', 'Maintain speed above 7000m/s', 'Safe reentry']
  },
  {
    id: 'lunar',
    name: 'Lunar Approach',
    description: 'Reach 300km altitude - the limit of space',
    targetAltitude: 300,
    difficulty: 'Hard',
    baseReward: 500,
    objectives: ['Reach 300km altitude', 'Survive extreme conditions', 'Perfect landing']
  },
  {
    id: 'extreme',
    name: 'Edge of Space',
    description: 'Push your rocket to 500km - the ultimate challenge',
    targetAltitude: 500,
    difficulty: 'Extreme',
    baseReward: 1000,
    objectives: ['Reach 500km altitude', 'Handle intense pressure', 'Achieve perfect splashdown']
  }
];

const ROCKET_PARTS: RocketPart[] = [
  { id: 'body-large', name: 'Titan Body', type: 'body', color: '#e8e8e8', emissive: '#1a1a2e', scale: [2, 10, 2] },
  { id: 'body-medium', name: 'Atlas Body', type: 'body', color: '#d0d0d0', emissive: '#16162a', scale: [1.6, 7, 1.6] },
  { id: 'thruster-heavy', name: 'Titan Engine', type: 'thruster', color: '#b91c1c', emissive: '#ff4500', scale: [1.8, 3, 1.8], thrust: 150 },
  { id: 'thruster-standard', name: 'Vulcan Engine', type: 'thruster', color: '#dc2626', emissive: '#ff5500', scale: [1.4, 2.5, 1.4], thrust: 100 },
  { id: 'thruster-light', name: 'Pegasus Engine', type: 'thruster', color: '#ef4444', emissive: '#ff6600', scale: [1, 2, 1], thrust: 60 },
  { id: 'parachute-mega', name: 'Goliath Chute', type: 'parachute', color: '#f97316', scale: [6, 1.2, 6] },
  { id: 'parachute-large', name: 'Titan Chute', type: 'parachute', color: '#fb923c', scale: [4, 1, 4] },
  { id: 'fuel-tank-large', name: 'Quantum Tank', type: 'fuel', color: '#fbbf24', emissive: '#f59e0b', scale: [1.7, 6, 1.7], fuelCapacity: 150 },
  { id: 'fuel-tank-medium', name: 'Fusion Tank', type: 'fuel', color: '#fcd34d', emissive: '#f97316', scale: [1.3, 4, 1.3], fuelCapacity: 80 },
  { id: 'capsule-command', name: 'Orion Module', type: 'capsule', color: '#fefefe', emissive: '#94a3b8', scale: [1.8, 2.5, 1.8] },
  { id: 'capsule-crew', name: 'Apollo Module', type: 'capsule', color: '#f8fafc', emissive: '#cbd5e1', scale: [2, 3, 2] },
  { id: 'fins-stabilizer', name: 'Delta Fins', type: 'fins', color: '#991b1b', emissive: '#7f1d1d', scale: [0.25, 4, 2.5] },
  { id: 'wing-aero', name: 'Aero Stabilizers', type: 'wing', color: '#3b82f6', emissive: '#1d4ed8', scale: [4, 0.2, 2] },
  { id: 'antenna-comm', name: 'Comm Array', type: 'antenna', color: '#94a3b8', scale: [0.15, 2, 0.15] },
];

type GamePhase = 'missionselect' | 'build' | 'ready' | 'countdown' | 'launch' | 'flight' | 'descent' | 'landed' | 'failed';

export default function RocketBuilderPage() {
  const [phase, setPhase] = useState<GamePhase>('missionselect');
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [missionResult, setMissionResult] = useState<{ success: boolean; coinsEarned: number; message: string } | null>(null);
  const [placedParts, setPlacedParts] = useState<{ part: RocketPart; position: [number, number, number]; rotation: [number, number, number]; side: string }[]>([]);
  const [selectedPart, setSelectedPart] = useState<RocketPart | null>(null);
  const [attachSide, setAttachSide] = useState<string | null>(null);
  const [fuelLevels, setFuelLevels] = useState<Record<string, number>>({});
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [altitude, setAltitude] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [parachuteDeployed, setParachuteDeployed] = useState(false);
  const [detachedParts, setDetachedParts] = useState<{ part: RocketPart; position: THREE.Vector3; velocity: THREE.Vector3 }[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [totalThrust, setTotalThrust] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [mouseWorldPos, setMouseWorldPos] = useState<THREE.Vector3 | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rocketRef = useRef<THREE.Group | null>(null);
  const roofRef = useRef<THREE.Mesh | null>(null);
  const exhaustRef = useRef<THREE.Group | null>(null);
  const previewRef = useRef<THREE.Mesh | null>(null);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const animationRef = useRef<number>(0);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const groundPlaneRef = useRef<THREE.Plane>(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));

  useEffect(() => {
    let thrust = 0;
    placedParts.forEach(p => {
      if (p.part.thrust) thrust += p.part.thrust;
    });
    setTotalThrust(thrust);
  }, [placedParts]);

  const createPartMesh = useCallback((part: RocketPart, isPreview = false): THREE.Mesh => {
    let geometry: THREE.BufferGeometry;
    
    switch (part.type) {
      case 'body':
        geometry = new THREE.CylinderGeometry(part.scale[0], part.scale[0] * 0.95, part.scale[1], 32);
        break;
      case 'thruster':
        geometry = new THREE.ConeGeometry(part.scale[0], part.scale[1], 32);
        break;
      case 'parachute':
        geometry = new THREE.SphereGeometry(part.scale[0], 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        break;
      case 'fuel':
        geometry = new THREE.CylinderGeometry(part.scale[0] * 0.9, part.scale[0] * 0.9, part.scale[1], 32);
        break;
      case 'wing':
        geometry = new THREE.BoxGeometry(part.scale[0], part.scale[1], part.scale[2]);
        break;
      case 'capsule':
        geometry = new THREE.SphereGeometry(part.scale[0], 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        break;
      case 'fins':
        geometry = new THREE.BoxGeometry(part.scale[0], part.scale[1], part.scale[2]);
        break;
      case 'antenna':
        geometry = new THREE.CylinderGeometry(part.scale[0], part.scale[0], part.scale[1], 8);
        break;
      default:
        geometry = new THREE.CylinderGeometry(1, 1, 1, 32);
    }

    const material = new THREE.MeshStandardMaterial({
      color: part.color,
      roughness: 0.25,
      metalness: 0.7,
      emissive: part.emissive || '#000000',
      emissiveIntensity: isPreview ? 0.15 : (part.emissive ? 0.4 : 0),
      transparent: isPreview,
      opacity: isPreview ? 0.7 : 1,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = !isPreview;
    mesh.receiveShadow = !isPreview;
    mesh.userData = { partId: part.id, partType: part.type, isDraggable: !isPreview };
    
    return mesh;
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510);
    scene.fog = new THREE.FogExp2(0x050510, 0.008);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 3000);
    camera.position.set(25, 20, 30);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 100;
    controls.target.set(0, 8, 0);
    controlsRef.current = controls;

    // Ambient
    const ambientLight = new THREE.AmbientLight(0x404060, 0.6);
    scene.add(ambientLight);

    // Main sun
    const mainLight = new THREE.DirectionalLight(0xfff8f0, 1.8);
    mainLight.position.set(40, 60, 30);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 3072;
    mainLight.shadow.mapSize.height = 3072;
    mainLight.shadow.camera.near = 1;
    mainLight.shadow.camera.far = 200;
    mainLight.shadow.camera.left = -60;
    mainLight.shadow.camera.right = 60;
    mainLight.shadow.camera.top = 60;
    mainLight.shadow.camera.bottom = -60;
    mainLight.shadow.bias = -0.0001;
    scene.add(mainLight);

    // Blue fill
    const fillLight = new THREE.DirectionalLight(0x4488cc, 0.5);
    fillLight.position.set(-30, 40, -30);
    scene.add(fillLight);

    // Ground - infinite grid look
    const groundGeometry = new THREE.PlaneGeometry(500, 500);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x0a0a15,
      roughness: 0.95,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Grid helper
    const gridHelper = new THREE.GridHelper(200, 100, 0x1a1a2e, 0x0f0f1a);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Launch pad - premium look
    const padGroup = new THREE.Group();
    
    // Base ring
    const baseRing = new THREE.Mesh(
      new THREE.RingGeometry(5, 8, 64),
      new THREE.MeshStandardMaterial({ color: 0x1a1a2a, roughness: 0.9, metalness: 0.3, side: THREE.DoubleSide })
    );
    baseRing.rotation.x = -Math.PI / 2;
    baseRing.position.y = 0.02;
    padGroup.add(baseRing);

    // Concrete platform
    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(5, 5.5, 1.5, 32),
      new THREE.MeshStandardMaterial({ color: 0x2a2a3a, roughness: 0.7, metalness: 0.4 })
    );
    platform.position.y = 0.75;
    platform.castShadow = true;
    platform.receiveShadow = true;
    padGroup.add(platform);

    // Metal top
    const metalTop = new THREE.Mesh(
      new THREE.CylinderGeometry(4, 4, 0.2, 32),
      new THREE.MeshStandardMaterial({ color: 0x555566, roughness: 0.3, metalness: 0.8 })
    );
    metalTop.position.y = 1.6;
    metalTop.castShadow = true;
    padGroup.add(metalTop);

    // Launch tower
    const towerGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const tower = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.4, 18, 8),
        new THREE.MeshStandardMaterial({ color: 0x3a3a4a, roughness: 0.4, metalness: 0.6 })
      );
      tower.position.set(Math.cos(angle) * 4.5, 10, Math.sin(angle) * 4.5);
      tower.castShadow = true;
      towerGroup.add(tower);
    }
    padGroup.add(towerGroup);

    scene.add(padGroup);

    // Rocket
    const rocket = new THREE.Group();
    rocket.position.y = 2.9;
    rocketRef.current = rocket;
    scene.add(rocket);

    // Default rocket
    const defaultBody = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.4, 8, 32),
      new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.2, metalness: 0.6 })
    );
    defaultBody.position.y = 4;
    defaultBody.castShadow = true;
    defaultBody.userData = { isDefaultBody: true };
    rocket.add(defaultBody);

    const defaultNose = new THREE.Mesh(
      new THREE.ConeGeometry(1.4, 2.5, 32),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.25, metalness: 0.5, emissive: '#991b1b', emissiveIntensity: 0.3 })
    );
    defaultNose.position.y = 9.25;
    defaultNose.castShadow = true;
    defaultNose.userData = { isDefaultNose: true };
    rocket.add(defaultNose);

    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const fin = new THREE.Mesh(
        new THREE.BoxGeometry(0.15, 2.5, 2),
        new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.3, metalness: 0.5 })
      );
      fin.position.set(Math.cos(angle) * 1.35, 1.25, Math.sin(angle) * 1.35);
      fin.rotation.y = angle;
      fin.castShadow = true;
      fin.userData = { isDefaultFin: true };
      rocket.add(fin);
    }

    // Warehouse
    const warehouseGroup = new THREE.Group();
    
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80),
      new THREE.MeshStandardMaterial({ color: 0x15151f, roughness: 0.95 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.02;
    floor.receiveShadow = true;
    warehouseGroup.add(floor);

    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1f1f2e, roughness: 0.85, side: THREE.DoubleSide });
    
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(80, 30), wallMat);
    backWall.position.set(0, 15, -40);
    warehouseGroup.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(80, 30), wallMat);
    leftWall.position.set(-40, 15, 0);
    leftWall.rotation.y = Math.PI / 2;
    warehouseGroup.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(80, 30), wallMat);
    rightWall.position.set(40, 15, 0);
    rightWall.rotation.y = -Math.PI / 2;
    warehouseGroup.add(rightWall);

    const roof = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80),
      new THREE.MeshStandardMaterial({ color: 0x252535, roughness: 0.7, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    roof.position.set(0, 30, 0);
    roof.rotation.x = Math.PI / 2;
    roofRef.current = roof;
    warehouseGroup.add(roof);

    // Roof beams
    const beamMat = new THREE.MeshStandardMaterial({ color: 0x3a3a4a, metalness: 0.7, roughness: 0.3 });
    for (let i = -30; i <= 30; i += 15) {
      const beam = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 80), beamMat);
      beam.position.set(i, 29.5, 0);
      warehouseGroup.add(beam);
    }

    scene.add(warehouseGroup);

    // Parts shelf
    const shelfGroup = new THREE.Group();
    shelfGroup.position.set(-22, 0, 0);
    
    const shelf = new THREE.Mesh(
      new THREE.BoxGeometry(10, 0.5, 14),
      new THREE.MeshStandardMaterial({ color: 0x1a1a2a, roughness: 0.8, metalness: 0.3 })
    );
    shelf.position.y = 2.5;
    shelf.castShadow = true;
    shelf.receiveShadow = true;
    shelfGroup.add(shelf);

    // Shelf supports
    for (let x = -4; x <= 4; x += 8) {
      for (let z = -6; z <= 6; z += 12) {
        const support = new THREE.Mesh(
          new THREE.CylinderGeometry(0.2, 0.2, 2.5, 8),
          new THREE.MeshStandardMaterial({ color: 0x3a3a4a, metalness: 0.7, roughness: 0.3 })
        );
        support.position.set(x, 1.25, z);
        shelfGroup.add(support);
      }
    }

    // Back panel glow
    const shelfBack = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial({ color: 0x0a0a15, emissive: '#f59e0b', emissiveIntensity: 0.08 })
    );
    shelfBack.position.set(0, 7.5, -6.9);
    shelfGroup.add(shelfBack);

    scene.add(shelfGroup);

    // Display parts
    ROCKET_PARTS.forEach((part, index) => {
      const mesh = createPartMesh(part);
      const row = Math.floor(index / 4);
      const col = index % 4;
      mesh.position.set(-24 + col * 3, 3 + row * 3, -5 + row * 2);
      mesh.userData = { ...mesh.userData, originalPosition: mesh.position.clone() };
      scene.add(mesh);
    });

    // Exhaust
    const exhaust = new THREE.Group();
    exhaust.position.y = -0.5;
    exhaust.visible = false;
    exhaustRef.current = exhaust;
    rocket.add(exhaust);

    // Exhaust particles
    const exhaustGeom = new THREE.BufferGeometry();
    const exhaustCount = 800;
    const exhaustPos = new Float32Array(exhaustCount * 3);
    const exhaustCol = new Float32Array(exhaustCount * 3);
    const exhaustSize = new Float32Array(exhaustCount);

    for (let i = 0; i < exhaustCount; i++) {
      exhaustPos[i * 3] = (Math.random() - 0.5) * 2.5;
      exhaustPos[i * 3 + 1] = -Math.random() * 15;
      exhaustPos[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
      
      const t = Math.random();
      exhaustCol[i * 3] = 1;
      exhaustCol[i * 3 + 1] = 0.2 + t * 0.6;
      exhaustCol[i * 3 + 2] = t * 0.1;
      
      exhaustSize[i] = 0.8 + Math.random() * 2;
    }

    exhaustGeom.setAttribute('position', new THREE.BufferAttribute(exhaustPos, 3));
    exhaustGeom.setAttribute('color', new THREE.BufferAttribute(exhaustCol, 3));
    exhaustGeom.setAttribute('size', new THREE.BufferAttribute(exhaustSize, 1));

    const exhaustMat = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });

    const exhaustParticles = new THREE.Points(exhaustGeom, exhaustMat);
    exhaust.add(exhaustParticles);

    // Mouse handlers
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      if (phase !== 'build') return;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      
      // Get world position for preview
      const planeIntersect = new THREE.Vector3();
      raycasterRef.current.ray.intersectPlane(groundPlaneRef.current, planeIntersect);
      if (planeIntersect) {
        setMouseWorldPos(planeIntersect.clone());
      }

      // Hover detection
      const allObjects: THREE.Object3D[] = [];
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh && obj.userData.partId && obj.userData.isDraggable) {
          allObjects.push(obj);
        }
      });
      
      const intersects = raycasterRef.current.intersectObjects(allObjects, false);

      if (intersects.length > 0) {
        const obj = intersects[0].object;
        if (obj.userData.partId) {
          setHoveredPart(obj.userData.partId);
          container.style.cursor = 'pointer';
        }
      } else {
        setHoveredPart(null);
        container.style.cursor = 'default';
      }
    };

    const handleClick = (event: MouseEvent) => {
      if (phase !== 'build') return;

      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      
      const allObjects: THREE.Object3D[] = [];
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh && obj.userData.partId && obj.userData.isDraggable) {
          allObjects.push(obj);
        }
      });
      
      const intersects = raycasterRef.current.intersectObjects(allObjects, false);

      if (intersects.length > 0) {
        const obj = intersects[0].object as THREE.Mesh;
        const part = ROCKET_PARTS.find(p => p.id === obj.userData.partId);
        if (part) {
          setSelectedPart(part);
          setShowInstructions(false);
          
          // Create preview mesh
          if (previewRef.current) {
            scene.remove(previewRef.current);
          }
          previewRef.current = createPartMesh(part, true);
          previewRef.current.position.copy(rocket.position);
          scene.add(previewRef.current);
        }
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);

    // Animation
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      const time = clockRef.current.getElapsedTime();

      controls.update();

      // Update preview position to follow mouse
      if (previewRef.current && selectedPart && mouseWorldPos && attachSide) {
        const rocketPos = rocket.position;
        let targetPos = new THREE.Vector3();
        
        switch (attachSide) {
          case 'top':
            targetPos.set(rocketPos.x, rocketPos.y + 10, rocketPos.z);
            break;
          case 'bottom':
            targetPos.set(rocketPos.x, rocketPos.y - 2, rocketPos.z);
            break;
          case 'left':
            targetPos.set(rocketPos.x - 2, rocketPos.y + 3, rocketPos.z);
            break;
          case 'right':
            targetPos.set(rocketPos.x + 2, rocketPos.y + 3, rocketPos.z);
            break;
          default:
            targetPos.copy(rocketPos);
        }
        
        previewRef.current.position.lerp(targetPos, 0.15);
        previewRef.current.rotation.y += 0.02;
      }

      // Exhaust animation
      if ((phase === 'launch' || phase === 'flight') && exhaustRef.current && exhaustRef.current.visible) {
        const positions = (exhaustRef.current.children[0] as THREE.Points).geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < exhaustCount; i++) {
          positions[i * 3 + 1] -= 0.6 + Math.random() * 0.6;
          positions[i * 3] += (Math.random() - 0.5) * 0.4;
          positions[i * 3 + 2] += (Math.random() - 0.5) * 0.4;
          
          if (positions[i * 3 + 1] < -20) {
            positions[i * 3] = (Math.random() - 0.5) * 2.5;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
          }
        }
        (exhaustRef.current.children[0] as THREE.Points).geometry.attributes.position.needsUpdate = true;
      }

      // Camera follow during flight
      if ((phase === 'flight' || phase === 'launch' || phase === 'descent') && rocketRef.current) {
        const targetY = rocketRef.current.position.y + 5;
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, Math.max(15, targetY + 10), 0.03);
        controls.target.y = THREE.MathUtils.lerp(controls.target.y, targetY, 0.05);
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [phase, createPartMesh, selectedPart, attachSide, mouseWorldPos]);

  const handlePlacePart = (side: string) => {
    if (!selectedPart || !rocketRef.current) return;
    setAttachSide(side);

    const newPlacedPart = {
      part: selectedPart,
      position: [0, 0, 0] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      side
    };

    setPlacedParts([...placedParts, newPlacedPart]);
    setFuelLevels({ ...fuelLevels, [selectedPart.id]: selectedPart.fuelCapacity || 0 });
    
    // Remove preview
    if (previewRef.current && sceneRef.current) {
      sceneRef.current.remove(previewRef.current);
      previewRef.current = null;
    }
    
    setSelectedPart(null);
    setAttachSide(null);
    setMessage(`✓ ${selectedPart.name} attached!`);
    setTimeout(() => setMessage(null), 2000);
  };

  const handleReady = () => {
    if (placedParts.length === 0) {
      setMessage('Add parts to your rocket first!');
      setTimeout(() => setMessage(null), 2000);
      return;
    }
    setPhase('ready');
    setShowInstructions(false);
  };

  const handleLaunch = () => {
    if (phase !== 'ready') return;
    
    setPhase('countdown');
    setCountdown(3);

    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setPhase('launch');
          
          if (roofRef.current) {
            roofRef.current.position.y = 60;
            roofRef.current.rotation.x = Math.PI / 3;
          }
          
          if (exhaustRef.current) {
            exhaustRef.current.visible = true;
          }
          
          setTimeout(() => {
            setPhase('flight');
          }, 1500);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (phase !== 'flight') return;

    const interval = setInterval(() => {
      setAltitude(prev => {
        const newAlt = prev + speed;
        if (rocketRef.current) {
          rocketRef.current.position.y = 2.9 + newAlt;
        }
        return newAlt;
      });

      setSpeed(prev => {
        const gravity = 0.015;
        const thrustPower = totalThrust / 2500;
        return Math.max(0, prev + thrustPower - gravity);
      });

      setFuelLevels(prev => {
        const newLevels = { ...prev };
        let hasFuel = false;
        Object.keys(newLevels).forEach(key => {
          if (newLevels[key] > 0) {
            newLevels[key] = Math.max(0, newLevels[key] - 0.25);
            hasFuel = true;
          }
        });
        
        if (!hasFuel && exhaustRef.current) {
          exhaustRef.current.visible = false;
        }
        
        return newLevels;
      });
    }, 33);

    return () => clearInterval(interval);
  }, [phase, speed, totalThrust]);

  useEffect(() => {
    if (phase !== 'flight' || !parachuteDeployed) return;

    const interval = setInterval(() => {
      setAltitude(prev => {
        const newAlt = Math.max(0, prev - 0.8);
        if (newAlt <= 0) {
          setPhase('landed');
          setMessage('🎉 Mission Complete!');
          // Handle mission completion
          setTimeout(() => {
            const isSuccess = newAlt >= (currentMission?.targetAltitude ?? 100) * 0.9 || altitude >= (currentMission?.targetAltitude ?? 100) * 0.9;
            const baseReward = currentMission?.baseReward ?? 100;
            let coinsEarned = isSuccess ? baseReward + 100 : Math.floor(baseReward * 0.2);
            if (parachuteDeployed) coinsEarned += 50;
            if (isSuccess) {
              addSandDollars(coinsEarned);
              setMissionResult({
                success: true,
                coinsEarned,
                message: `Mission Success! +${coinsEarned} Sand Dollars!`
              });
            }
          }, 500);
          return 0;
        }
        if (rocketRef.current) {
          rocketRef.current.position.y = 2.9 + newAlt;
        }
        return newAlt;
      });
    }, 33);

    return () => clearInterval(interval);
  }, [phase, parachuteDeployed, currentMission]);

  const handleDeployParachute = () => {
    setParachuteDeployed(true);
    setPhase('descent');
    setMessage('🪂 Parachute deployed!');
    setTimeout(() => setMessage(null), 2000);
  };

  const handleDetachPart = (partId: string) => {
    const part = placedParts.find(p => p.part.id === partId);
    if (part && rocketRef.current) {
      setDetachedParts([...detachedParts, {
        part: part.part,
        position: rocketRef.current.position.clone(),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.8,
          0.3,
          (Math.random() - 0.5) * 0.8
        )
      }]);
    }
    setPlacedParts(prev => prev.filter(p => p.part.id !== partId));
    setFuelLevels(prev => {
      const newLevels = { ...prev };
      delete newLevels[partId];
      return newLevels;
    });
    setMessage('↘️ Part detached!');
    setTimeout(() => setMessage(null), 2000);
  };

  const handleUseFuel = (partId: string) => {
    setFuelLevels(prev => ({
      ...prev,
      [partId]: 0
    }));
    setMessage('⚡ Fuel burned!');
    setTimeout(() => setMessage(null), 2000);
  };

  const handleBreakFuel = (partId: string) => {
    handleDetachPart(partId);
    setMessage('💥 Tank lost!');
    setTimeout(() => setMessage(null), 2000);
  };

  const handleMissionSelect = (mission: Mission) => {
    setCurrentMission(mission);
    setPhase('build');
    setAltitude(0);
    setSpeed(0);
    setPlacedParts([]);
    setFuelLevels({});
    setParachuteDeployed(false);
    setMissionResult(null);
  };

  const calculateReward = () => {
    if (!currentMission) return 0;
    let reward = currentMission.baseReward;
    
    // Bonus for reaching target altitude
    if (altitude >= currentMission.targetAltitude * 0.9) {
      reward += 100;
    }
    
    // Bonus for safe landing
    if (phase === 'landed' && speed < 5) {
      reward += 100;
    }
    
    // Bonus for parachute deployment
    if (parachuteDeployed) {
      reward += 50;
    }
    
    return Math.floor(reward);
  };

  const handleMissionComplete = () => {
    const isSuccess = altitude >= (currentMission?.targetAltitude ?? 100) * 0.9;
    const coinsEarned = isSuccess ? calculateReward() : Math.floor((currentMission?.baseReward ?? 100) * 0.2);
    
    if (isSuccess) {
      addSandDollars(coinsEarned);
      setMissionResult({
        success: true,
        coinsEarned,
        message: `Mission Success! +${coinsEarned} Sand Dollars!`
      });
    } else {
      setMissionResult({
        success: false,
        coinsEarned: 0,
        message: `Mission Failed. Better luck next time!`
      });
    }
    
    setPhase('landed');
  };

  const handleReturnToMissions = () => {
    setPhase('missionselect');
    setMissionResult(null);
    setCurrentMission(null);
    setAltitude(0);
    setSpeed(0);
    setPlacedParts([]);
    setFuelLevels({});
    setParachuteDeployed(false);
    setCountdown(3);
  };

  // Mission Selection Screen
  if (phase === 'missionselect') {
    return (
      <div className="relative min-h-screen bg-[#050510] text-white overflow-hidden">
        <SiteHeader
          links={[
            { label: 'Home', href: '/' },
            { label: 'Games', href: '/games' },
          ]}
          rightSlot={
            <a
              href="/games"
              className="rounded-xl border border-[#88a9d8]/20 bg-[#080f1c]/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#ffc105] no-underline transition hover:bg-[#0a1222]"
            >
              Back to Games
            </a>
          }
        />

        <div className="pt-[68px] min-h-screen px-8 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-5xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent mb-2">
                🚀 Kerbal Mission Control
              </h1>
              <p className="text-gray-400 text-lg">Select a mission and design your rocket to achieve the objective</p>
            </div>

            {/* Mission Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MISSIONS.map(mission => (
                <div key={mission.id} className="p-6 bg-[rgba(255,255,255,.05)] border border-amber-500/20 rounded-2xl hover:border-amber-500/50 transition-all hover:bg-[rgba(255,255,255,.08)]">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-amber-400">{mission.name}</h3>
                      <p className="text-gray-400 text-sm mt-1">{mission.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${{
                      'Easy': 'bg-emerald-500/20 text-emerald-400',
                      'Medium': 'bg-amber-500/20 text-amber-400',
                      'Hard': 'bg-orange-500/20 text-orange-400',
                      'Extreme': 'bg-red-500/20 text-red-400'
                    }[mission.difficulty]}`}>
                      {mission.difficulty}
                    </span>
                  </div>

                  <div className="mb-4 p-4 bg-[rgba(255,255,255,.02)] rounded-lg">
                    <div className="text-sm text-gray-500 uppercase tracking-wider mb-2">Target: {mission.targetAltitude}km</div>
                    <div className="text-3xl font-black text-amber-400">{mission.baseReward}</div>
                    <div className="text-xs text-gray-400">Sand Dollars Reward</div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Objectives:</div>
                    <ul className="space-y-1 text-sm text-gray-300">
                      {mission.objectives.map((obj, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-amber-400">✓</span> {obj}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleMissionSelect(mission)}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    SELECT MISSION
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mission Results Screen
  if (missionResult) {
    return (
      <div className="relative min-h-screen bg-[#050510] text-white flex items-center justify-center overflow-hidden">
        <div className="text-center max-w-2xl px-8">
          <div className="text-6xl mb-6">{missionResult.success ? '🎉' : '❌'}</div>
          <h1 className={`text-5xl font-black mb-4 ${missionResult.success ? 'text-emerald-400' : 'text-red-400'}`}>
            {missionResult.message}
          </h1>
          
          {missionResult.success && (
            <div className="my-8 p-6 bg-emerald-500/20 border border-emerald-500/50 rounded-xl">
              <div className="text-sm text-gray-300 uppercase tracking-wider mb-2">Sand Dollars Earned</div>
              <div className="text-6xl font-black text-emerald-400">{missionResult.coinsEarned}</div>
            </div>
          )}

          <div className="space-y-4 mt-8">
            <button
              onClick={handleReturnToMissions}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold rounded-lg transition-all transform hover:scale-[1.02]"
            >
              NEXT MISSION
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050510] text-white overflow-hidden">
      <SiteHeader
        links={[
          { label: 'Home', href: '/' },
          { label: 'Games', href: '/games' },
        ]}
      />

      {/* Main */}
      <div className="pt-[68px] h-screen flex">
        {/* Parts Panel */}
        <div className="w-80 bg-[rgba(10,10,25,.98)] border-r border-[rgba(251,191,36,.1)] flex flex-col">
          <div className="p-6 border-b border-[rgba(251,191,36,.1)]">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Components
            </h2>
            <p className="text-xs text-gray-500 mt-2">Select a part, then choose attachment point</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {ROCKET_PARTS.map(part => (
              <button
                key={part.id}
                onClick={() => setSelectedPart(part)}
                className={`w-full p-3.5 rounded-xl flex items-center gap-3 transition-all duration-200 ${
                  selectedPart?.id === part.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-xl shadow-amber-500/25 scale-[1.02]'
                    : 'bg-[rgba(255,255,255,.04)] hover:bg-[rgba(255,255,255,.08)] border border-transparent hover:border-amber-500/30'
                }`}
              >
                <div
                  className="w-11 h-11 rounded-lg shadow-inner flex items-center justify-center"
                  style={{ 
                    backgroundColor: part.color, 
                    boxShadow: part.emissive ? `0 0 15px ${part.emissive}40, inset 0 2px 4px rgba(255,255,255,0.3)` : 'inset 0 2px 4px rgba(0,0,0,0.2)',
                  }}
                />
                <div className="text-left flex-1">
                  <div className="font-bold text-sm">{part.name}</div>
                  <div className="text-xs opacity-60 capitalize">{part.type}</div>
                </div>
                <div className="flex flex-col gap-1">
                  {part.fuelCapacity && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-medium">
                      ⛽ {part.fuelCapacity}
                    </span>
                  )}
                  {part.thrust && (
                    <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-medium">
                      💨 {part.thrust}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {selectedPart && (
            <div className="p-4 border-t border-[rgba(251,191,36,.1)] bg-gradient-to-b from-amber-500/10 to-transparent">
              <h3 className="font-bold text-sm mb-3 text-amber-400">Attach point:</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'top', label: '⬆️ Top', y: 10 },
                  { id: 'bottom', label: '⬇️ Base', y: -2 },
                  { id: 'left', label: '⬅️ Port', x: -2 },
                  { id: 'right', label: '➡️ Starboard', x: 2 }
                ].map(side => (
                  <button
                    key={side.id}
                    onClick={() => handlePlacePart(side.id)}
                    className="p-3 bg-[rgba(255,255,255,.08)] hover:bg-amber-500/30 rounded-lg text-xs font-medium transition-all"
                  >
                    {side.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3D Canvas */}
        <div ref={containerRef} className="flex-1 relative" />

        {/* Controls Panel */}
        <div className="w-72 bg-[rgba(10,10,25,.98)] border-l border-[rgba(251,191,36,.1)] flex flex-col">
          <div className="p-6 border-b border-[rgba(251,191,36,.1)]">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Mission Control
            </h2>
          </div>

          <div className="flex-1 p-4 space-y-4">
            {/* Status */}
            <div className="p-5 bg-gradient-to-r from-amber-500/10 to-orange-500/5 rounded-2xl border border-amber-500/20">
              <div className="text-xs text-gray-500 uppercase tracking-widest font-medium">Status</div>
              <div className="font-bold text-xl mt-1 text-amber-400">
                {phase === 'build' && '🔧 Assembly'}
                {phase === 'ready' && '✅ Ready'}
                {phase === 'countdown' && '⏱️ T-Minus'}
                {phase === 'launch' && '🚀 Liftoff!'}
                {phase === 'flight' && '✈️ Flight'}
                {phase === 'descent' && '🪂 Descent'}
                {phase === 'landed' && '🏁 Complete'}
              </div>
            </div>

            {/* Telemetry */}
            {(phase === 'flight' || phase === 'descent') && (
              <>
                <div className="p-4 bg-[rgba(255,255,255,.04)] rounded-xl">
                  <div className="text-xs text-gray-500 uppercase tracking-widest">Altitude</div>
                  <div className="text-4xl font-black text-emerald-400 mt-1">
                    {altitude.toFixed(0)}<span className="text-lg ml-1">m</span>
                  </div>
                </div>

                <div className="p-4 bg-[rgba(255,255,255,.04)] rounded-xl">
                  <div className="text-xs text-gray-500 uppercase tracking-widest">Velocity</div>
                  <div className="text-4xl font-black text-orange-400 mt-1">
                    {(speed * 100).toFixed(0)}<span className="text-lg ml-1">m/s</span>
                  </div>
                </div>
              </>
            )}

            {/* Thrust */}
            {totalThrust > 0 && (
              <div className="p-4 bg-[rgba(255,255,255,.04)] rounded-xl">
                <div className="text-xs text-gray-500 uppercase tracking-widest">Thrust</div>
                <div className="text-2xl font-bold text-red-400 mt-1">
                  {totalThrust}<span className="text-sm ml-1 text-gray-500">kN</span>
                </div>
              </div>
            )}

            {/* Fuel */}
            {Object.keys(fuelLevels).length > 0 && (
              <div className="space-y-3">
                <div className="text-sm font-bold text-gray-400">Fuel Status:</div>
                {Object.entries(fuelLevels).map(([partId, level]) => {
                  const part = ROCKET_PARTS.find(p => p.id === partId);
                  if (!part || !part.fuelCapacity) return null;
                  
                  const percentage = (level / part.fuelCapacity) * 100;
                  
                  return (
                    <div key={partId} className="p-3 bg-[rgba(255,255,255,.03)] rounded-lg">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="font-medium">{part.name}</span>
                        <span className={percentage < 20 ? 'text-red-400' : 'text-amber-400'}>{level.toFixed(0)}L</span>
                      </div>
                      <div className="h-1.5 bg-[rgba(255,255,255,.1)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      {phase === 'flight' && level > 0 && (
                        <div className="flex gap-1.5 mt-2">
                          <button
                            onClick={() => handleUseFuel(partId)}
                            className="flex-1 text-[10px] bg-emerald-600 hover:bg-emerald-500 py-1.5 rounded font-medium transition-colors"
                          >
                            ⚡ Burn
                          </button>
                          <button
                            onClick={() => handleBreakFuel(partId)}
                            className="flex-1 text-[10px] bg-red-600 hover:bg-red-500 py-1.5 rounded font-medium transition-colors"
                          >
                            💥 Drop
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Parts */}
            {placedParts.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-bold text-gray-400">Attached:</div>
                {placedParts.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 bg-[rgba(255,255,255,.04)] rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: p.part.color, boxShadow: p.part.emissive ? `0 0 6px ${p.part.emissive}` : 'none' }}
                      />
                      <span className="text-xs font-medium">{p.part.name}</span>
                    </div>
                    {phase === 'flight' && (
                      <button
                        onClick={() => handleDetachPart(p.part.id)}
                        className="text-[10px] bg-red-600/80 hover:bg-red-500 px-2 py-1 rounded transition-colors"
                      >
                        ↘️
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-[rgba(251,191,36,.1)] space-y-3">
            {phase === 'build' && (
              <button
                onClick={handleReady}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-amber-500/30 transition-all"
              >
                ✅ Ready for Launch
              </button>
            )}
            
            {phase === 'ready' && (
              <button
                onClick={handleLaunch}
                className="w-full py-5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-xl font-bold text-xl hover:shadow-2xl hover:shadow-emerald-500/40 transition-all animate-pulse"
              >
                🚀 LAUNCH
              </button>
            )}
            
            {phase === 'countdown' && (
              <div className="w-full py-10 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-2xl">
                <div className="text-center text-8xl font-black text-white animate-pulse drop-shadow-2xl">
                  {countdown}
                </div>
              </div>
            )}
            
            {phase === 'flight' && (
              <button
                onClick={handleDeployParachute}
                disabled={parachuteDeployed}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  parachuteDeployed
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:shadow-xl hover:shadow-orange-500/30'
                }`}
              >
                🪂 {parachuteDeployed ? 'Deployed' : 'Deploy Chute'}
              </button>
            )}

            {phase === 'landed' && (
              <button
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black rounded-xl font-bold text-lg hover:shadow-xl transition-all"
              >
                🔄 New Mission
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {message && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-black px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl z-50 animate-bounce">
          {message}
        </div>
      )}

      {/* Instructions */}
      {showInstructions && phase === 'build' && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[rgba(0,0,0,.92)] border border-amber-500/30 px-10 py-5 rounded-3xl z-30 max-w-lg backdrop-blur-xl">
          <div className="text-center">
            <div className="text-amber-400 font-bold text-xl mb-3">🚀 Build Your Rocket</div>
            <div className="text-gray-400 text-sm leading-relaxed">
              1. Click a component from the left panel<br/>
              2. Select an attachment point (top/bottom/port/starboard)<br/>
              3. Add engines, fuel tanks, parachutes & more!<br/>
              4. Click "Ready for Launch" when complete
            </div>
          </div>
        </div>
      )}
    </div>
  );
}