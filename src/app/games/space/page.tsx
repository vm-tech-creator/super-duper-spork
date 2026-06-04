'use client';

import { useState, useEffect, useRef, use } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface SpaceEntity {
  id: string;
  name: string;
  classification: 'Star' | 'Planet' | 'Moon' | 'Asteroid' | 'Comet' | 'Dwarf Planet';
  description: string;
  facts: string[];
  color: string;
  size: number;
  distance: number;
  orbitSpeed: number;
}

const SPACE_ENTITIES: SpaceEntity[] = [
  {
    id: 'sun',
    name: 'The Sun',
    classification: 'Star',
    description: 'The Sun is the star at the center of our Solar System. It is a nearly perfect sphere of hot plasma, heated to incandescence by nuclear fusion reactions in its core.',
    facts: [
      'The Sun accounts for 99.86% of the mass in the solar system',
      'Its surface temperature is approximately 5,500°C',
      'Light from the Sun takes about 8 minutes to reach Earth',
      'The Sun is about 4.6 billion years old'
    ],
    color: '#FDB813',
    size: 12,
    distance: 0,
    orbitSpeed: 0
  },
  {
    id: 'mercury',
    name: 'Mercury',
    classification: 'Planet',
    description: 'Mercury is the smallest planet in our solar system and the closest to the Sun. It has a rocky surface covered with craters.',
    facts: [
      'Mercury has no atmosphere, so temperatures vary from -180°C to 430°C',
      'A day on Mercury lasts 59 Earth days',
      'Mercury has a large iron core',
      'It is the fastest planet, orbiting the Sun in just 88 Earth days'
    ],
    color: '#B5B5B5',
    size: 2,
    distance: 25,
    orbitSpeed: 0.04
  },
  {
    id: 'venus',
    name: 'Venus',
    classification: 'Planet',
    description: 'Venus is the second planet from the Sun and is Earth\'s closest planetary neighbor. It has a thick toxic atmosphere filled with carbon dioxide.',
    facts: [
      'Venus rotates backwards compared to most planets',
      'A day on Venus is longer than its year',
      'Surface temperature reaches 465°C - hot enough to melt lead',
      'It is often called Earth\'s "twin" due to similar size'
    ],
    color: '#E6C87A',
    size: 2.8,
    distance: 35,
    orbitSpeed: 0.03
  },
  {
    id: 'earth',
    name: 'Earth',
    classification: 'Planet',
    description: 'Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 71% of its surface is covered with water.',
    facts: [
      'Earth is the only planet not named after a god',
      'It has a powerful magnetic field protecting from solar wind',
      'Earth\'s atmosphere protects us from meteoroids',
      'Our planet is approximately 4.5 billion years old'
    ],
    color: '#6B93D6',
    size: 3,
    distance: 48,
    orbitSpeed: 0.02
  },
  {
    id: 'moon',
    name: 'The Moon',
    classification: 'Moon',
    description: 'The Moon is Earth\'s only natural satellite. It is the fifth largest moon in the solar system and the largest relative to its parent planet.',
    facts: [
      'The Moon is slowly drifting away from Earth (3.8cm per year)',
      'There is no atmosphere on the Moon',
      '12 people have walked on the Moon',
      'A lunar eclipse occurs when Earth passes between the Sun and Moon'
    ],
    color: '#C4C4C4',
    size: 0.8,
    distance: 5,
    orbitSpeed: 0.08
  },
  {
    id: 'mars',
    name: 'Mars',
    classification: 'Planet',
    description: 'Mars is the fourth planet from the Sun, often called the "Red Planet" due to iron oxide on its surface. It has the largest volcano in the solar system.',
    facts: [
      'Mars has two small moons: Phobos and Deimos',
      'Olympus Mons on Mars is 3 times the height of Mount Everest',
      'A Martian day is only 37 minutes longer than an Earth day',
      'Mars has seasons similar to Earth due to its axial tilt'
    ],
    color: '#C1440E',
    size: 2.2,
    distance: 62,
    orbitSpeed: 0.016
  },
  {
    id: 'asteroid-belt',
    name: 'Asteroid Belt',
    classification: 'Asteroid',
    description: 'The asteroid belt is a torus-shaped region in the Solar System, located roughly between the orbits of the planets Mars and Jupiter.',
    facts: [
      'Contains millions of rocky objects',
      'Total mass is only about 4% of the Moon\'s mass',
      'Largest object is Ceres (now a dwarf planet)',
      'Objects in the belt are separated by vast distances'
    ],
    color: '#8B7355',
    size: 1,
    distance: 85,
    orbitSpeed: 0.01
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    classification: 'Planet',
    description: 'Jupiter is the largest planet in our solar system. It is a gas giant with a mass more than twice that of all other planets combined.',
    facts: [
      'The Great Red Spot is a storm larger than Earth',
      'Jupiter has at least 95 known moons',
      'It completes a rotation in just 10 hours',
      'Jupiter acts as a cosmic vacuum cleaner, protecting inner planets'
    ],
    color: '#D8CA9D',
    size: 8,
    distance: 110,
    orbitSpeed: 0.008
  },
  {
    id: 'saturn',
    name: 'Saturn',
    classification: 'Planet',
    description: 'Saturn is the sixth planet from the Sun and is famous for its stunning ring system. It is the second-largest planet in our solar system.',
    facts: [
      'Saturn\'s rings are made of ice and rock',
      'Saturn could float in water (if there was a bathtub big enough)',
      'It has 146 known moons',
      'Winds on Saturn can reach 1,800 km/h'
    ],
    color: '#F4D59E',
    size: 7,
    distance: 140,
    orbitSpeed: 0.006
  },
  {
    id: 'uranus',
    name: 'Uranus',
    classification: 'Planet',
    description: 'Uranus is the seventh planet from the Sun. It is an ice giant with a unique sideways rotation - it essentially orbits the Sun on its side.',
    facts: [
      'Uranus rotates at a 98-degree angle',
      'It was the first planet discovered with a telescope',
      'Uranus has 27 known moons',
      'Its blue-green color comes from methane in the atmosphere'
    ],
    color: '#D1E7E7',
    size: 5,
    distance: 170,
    orbitSpeed: 0.004
  },
  {
    id: 'neptune',
    name: 'Neptune',
    classification: 'Planet',
    description: 'Neptune is the eighth and farthest known planet from the Sun. It is an ice giant with the strongest winds in the solar system.',
    facts: [
      'Winds on Neptune can reach 2,100 km/h',
      'Neptune was the first planet located through mathematical predictions',
      'It has 16 known moons',
      'One year on Neptune equals 165 Earth years'
    ],
    color: '#5B5DDF',
    size: 4.8,
    distance: 200,
    orbitSpeed: 0.003
  },
  {
    id: 'pluto',
    name: 'Pluto',
    classification: 'Dwarf Planet',
    description: 'Pluto is a dwarf planet in the Kuiper belt. Once considered the ninth planet, it was reclassified in 2006.',
    facts: [
      'Pluto has a heart-shaped glacier made of nitrogen ice',
      'It has 5 known moons',
      'A day on Pluto lasts 6.4 Earth days',
      'New Horizons flew by Pluto in 2015, providing our first close-up images'
    ],
    color: '#E8D4B8',
    size: 1.2,
    distance: 230,
    orbitSpeed: 0.002
  },
  {
    id: 'halley-comet',
    name: 'Halley\'s Comet',
    classification: 'Comet',
    description: 'Halley\'s Comet is one of the most famous comets, visible from Earth every 75-76 years. It was the first comet recognized as periodic.',
    facts: [
      'Last seen in 1986, next expected in 2061',
      'It loses about 1-2 meters of material each pass near the Sun',
      'Recorded observations span over 2,000 years',
      'The comet is named after Edmond Halley'
    ],
    color: '#FFFFFF',
    size: 0.6,
    distance: 95,
    orbitSpeed: 0.015
  },
  {
    id: 'orion-nebula',
    name: 'Orion Nebula',
    classification: 'Star',
    description: 'The Orion Nebula is one of the brightest nebulae visible to the naked eye. It is a stellar nursery where new stars are being born.',
    facts: [
      'Located about 1,344 light-years from Earth',
      'Visible to the naked eye in the Orion constellation',
      'Contains over 1,000 young stars',
      'It is part of a larger star-forming region'
    ],
    color: '#FF6B9D',
    size: 4,
    distance: 260,
    orbitSpeed: 0
  }
];

const SOLAR_SYSTEM_INFO = {
  title: 'The Solar System',
  description: 'Our solar system consists of the Sun and everything orbiting around it. This includes eight planets, their moons, dwarf planets, asteroids, comets, and other icy objects.',
  facts: [
    'The solar system formed approximately 4.6 billion years ago',
    'It extends about 4.6 billion kilometers from the Sun to the outer edge of the Oort Cloud',
    'The Sun contains 99.86% of the solar system\'s total mass',
    'There are over 200 moons in our solar system',
    'The four inner planets are terrestrial: Mercury, Venus, Earth, and Mars',
    'The four outer planets are gas giants: Jupiter, Saturn, Uranus, and Neptune',
    'Beyond Neptune lies the Kuiper Belt and the Oort Cloud'
  ]
};

export default function SpaceModelPage() {
  const [selectedEntity, setSelectedEntity] = useState<SpaceEntity | null>(null);
  const [hoveredEntity, setHoveredEntity] = useState<SpaceEntity | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const entitiesRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const orbitsRef = useRef<THREE.Object3D[]>([]);
  const animationRef = useRef<number>(0);
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());

  const filteredEntities = SPACE_ENTITIES.filter(entity =>
    entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entity.classification.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera - closer and more zoomed in
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
    camera.position.set(0, 60, 100);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls with better zoom
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 15;
    controls.maxDistance = 500;
    controls.enablePan = true;
    controls.panSpeed = 0.8;
    controls.rotateSpeed = 0.8;
    controls.zoomSpeed = 1.2;
    controlsRef.current = controls;

    // Create starfield background
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 8000;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const radius = 400 + Math.random() * 300;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i3 + 2] = radius * Math.cos(phi);

      const brightness = 0.4 + Math.random() * 0.6;
      const tint = Math.random();
      starColors[i3] = brightness * (tint > 0.7 ? 1.2 : 1);
      starColors[i3 + 1] = brightness * (tint > 0.9 ? 0.8 : 1);
      starColors[i3 + 2] = brightness * (tint > 0.8 ? 1.1 : 1);
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Create space entities
    const entityGroups: THREE.Group[] = [];

    SPACE_ENTITIES.forEach((entity) => {
      const group = new THREE.Group();
      group.userData = { entityId: entity.id };
      entityGroups.push(group);

      if (entity.distance === 0) {
        // Sun with glow
        const sunGeometry = new THREE.SphereGeometry(entity.size, 64, 64);
        const sunMaterial = new THREE.MeshBasicMaterial({
          color: entity.color
        });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        
        // Inner glow
        const innerGlowGeometry = new THREE.SphereGeometry(entity.size * 1.15, 32, 32);
        const innerGlowMaterial = new THREE.MeshBasicMaterial({
          color: 0xffdd44,
          transparent: true,
          opacity: 0.5
        });
        const innerGlow = new THREE.Mesh(innerGlowGeometry, innerGlowMaterial);
        
        // Outer glow
        const outerGlowGeometry = new THREE.SphereGeometry(entity.size * 1.5, 32, 32);
        const outerGlowMaterial = new THREE.MeshBasicMaterial({
          color: 0xff8800,
          transparent: true,
          opacity: 0.2
        });
        const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);

        sun.add(innerGlow);
        sun.add(outerGlow);

        // Add point light
        const sunLight = new THREE.PointLight(0xffffee, 3, 600);
        sun.add(sunLight);

        // Ambient light from sun
        const sunAmbient = new THREE.PointLight(0xffaa00, 1, 400);
        sun.add(sunAmbient);

        group.add(sun);
        scene.add(group);
        entitiesRef.current.set(entity.id, group);
      } else if (entity.classification === 'Moon') {
        // Moon - will be positioned relative to Earth
        const moonGeometry = new THREE.SphereGeometry(entity.size, 32, 32);
        const moonMaterial = new THREE.MeshStandardMaterial({
          color: entity.color,
          roughness: 0.9,
          metalness: 0.05,
          emissive: 0x222222,
          emissiveIntensity: 0.1
        });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        moon.position.set(entity.distance, 0, 0);
        group.add(moon);
        scene.add(group);
        entitiesRef.current.set(entity.id, group);
      } else if (entity.classification === 'Asteroid') {
        // Asteroid belt
        const asteroidGroup = new THREE.Group();
        for (let i = 0; i < 300; i++) {
          const angle = (i / 300) * Math.PI * 2 + Math.random() * 0.8;
          const radius = entity.distance + (Math.random() - 0.5) * 15;
          const asteroidGeometry = new THREE.DodecahedronGeometry(0.2 + Math.random() * 0.5, 0);
          const asteroidMaterial = new THREE.MeshStandardMaterial({
            color: entity.color,
            roughness: 0.95,
            metalness: 0.05
          });
          const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
          asteroid.position.set(
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 4,
            Math.sin(angle) * radius
          );
          asteroid.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
          asteroidGroup.add(asteroid);
        }
        group.add(asteroidGroup);
        scene.add(group);
        entitiesRef.current.set(entity.id, group);
      } else if (entity.classification === 'Comet') {
        // Comet with tail
        const cometGeometry = new THREE.SphereGeometry(entity.size, 16, 16);
        const cometMaterial = new THREE.MeshBasicMaterial({ color: entity.color });
        const comet = new THREE.Mesh(cometGeometry, cometMaterial);
        
        // Comet tail (multiple layers)
        for (let t = 0; t < 3; t++) {
          const tailGeometry = new THREE.ConeGeometry(0.3 + t * 0.2, 6 - t, 8);
          const tailMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3 - t * 0.1
          });
          const tail = new THREE.Mesh(tailGeometry, tailMaterial);
          tail.rotation.x = Math.PI / 2;
          tail.position.z = 2 + t * 1.5;
          comet.add(tail);
        }

        comet.position.set(entity.distance, 0, 0);
        group.add(comet);
        scene.add(group);
        entitiesRef.current.set(entity.id, group);

        // Create orbit path
        const orbitCurve = new THREE.EllipseCurve(0, 0, entity.distance, entity.distance * 0.3, 0, 2 * Math.PI, false, 0);
        const orbitPoints = orbitCurve.getPoints(128);
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(
          orbitPoints.map(p => new THREE.Vector3(p.x, 0, p.y))
        );
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0x444466, transparent: true, opacity: 0.3 });
        const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit);
        orbitsRef.current.push(orbit);
      } else if (entity.id === 'orion-nebula') {
        // Nebula with particles
        const nebulaGroup = new THREE.Group();
        
        const nebulaGeometry = new THREE.SphereGeometry(entity.size, 32, 32);
        const nebulaMaterial = new THREE.MeshBasicMaterial({
          color: entity.color,
          transparent: true,
          opacity: 0.15
        });
        const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
        nebulaGroup.add(nebula);

        // Add particle cloud
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 1000;
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const r = entity.size * Math.random() * 1.5;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          
          positions[i3] = r * Math.sin(phi) * Math.cos(theta);
          positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          positions[i3 + 2] = r * Math.cos(phi);
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMaterial = new THREE.PointsMaterial({
          color: 0xff88aa,
          size: 0.5,
          transparent: true,
          opacity: 0.7,
          sizeAttenuation: true
        });
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        nebulaGroup.add(particles);

        nebulaGroup.position.set(entity.distance, 30, 0);
        scene.add(nebulaGroup);
        entitiesRef.current.set(entity.id, nebulaGroup);
      } else {
        // Planets and dwarf planets with better materials
        const geometry = new THREE.SphereGeometry(entity.size, 64, 64);
        const material = new THREE.MeshStandardMaterial({
          color: entity.color,
          roughness: 0.6,
          metalness: 0.15,
          emissive: entity.color,
          emissiveIntensity: 0.05
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(entity.distance, 0, 0);
        group.add(mesh);

        // Add rings for Saturn
        if (entity.id === 'saturn') {
          const ringGeometry = new THREE.RingGeometry(entity.size * 1.5, entity.size * 2.5, 64);
          const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xC9B896,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
          });
          const ring = new THREE.Mesh(ringGeometry, ringMaterial);
          ring.rotation.x = Math.PI / 2.2;
          mesh.add(ring);
          
          // Inner ring
          const innerRingGeometry = new THREE.RingGeometry(entity.size * 1.3, entity.size * 1.45, 64);
          const innerRingMaterial = new THREE.MeshBasicMaterial({
            color: 0xAA9977,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5
          });
          const innerRing = new THREE.Mesh(innerRingGeometry, innerRingMaterial);
          innerRing.rotation.x = Math.PI / 2.2;
          mesh.add(innerRing);
        }

        scene.add(group);
        entitiesRef.current.set(entity.id, group);

        // Create orbit path
        const orbitGeometry = new THREE.RingGeometry(entity.distance - 0.3, entity.distance + 0.3, 128);
        const orbitMaterial = new THREE.MeshBasicMaterial({
          color: 0x444466,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.15
        });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit);
        orbitsRef.current.push(orbit);
      }
    });

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x202040, 0.4);
    scene.add(ambientLight);

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      
      const allObjects: THREE.Object3D[] = [];
      entitiesRef.current.forEach((obj) => {
        obj.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            allObjects.push(child);
          }
        });
      });
      
      const intersects = raycasterRef.current.intersectObjects(allObjects, false);

      if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj.parent && !obj.userData.entityId) {
          obj = obj.parent;
        }
        
        const entityId = obj.userData?.entityId || obj.parent?.userData?.entityId;
        const entity = SPACE_ENTITIES.find(e => e.id === entityId);
        
        if (entity) {
          setHoveredEntity(entity);
          container.style.cursor = 'pointer';
        }
      } else {
        setHoveredEntity(null);
        container.style.cursor = 'grab';
      }
    };

    const handleClick = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      
      const allObjects: THREE.Object3D[] = [];
      entitiesRef.current.forEach((obj) => {
        obj.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            allObjects.push(child);
          }
        });
      });
      
      const intersects = raycasterRef.current.intersectObjects(allObjects, false);

      if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj.parent && !obj.userData.entityId) {
          obj = obj.parent;
        }
        
        const entityId = obj.userData?.entityId || obj.parent?.userData?.entityId;
        const entity = SPACE_ENTITIES.find(e => e.id === entityId);
        
        if (entity) {
          setSelectedEntity(entity);
          setShowInfo(true);
          
          // Teleport camera to entity
          const group = entitiesRef.current.get(entity.id);
          if (group && cameraRef.current && controlsRef.current) {
            const targetPos = new THREE.Vector3();
            group.getWorldPosition(targetPos);
            
            const distance = entity.size * 6 + 20;
            const cameraPos = targetPos.clone().add(new THREE.Vector3(distance, distance * 0.5, distance));
            
            // Animate camera
            const startPos = cameraRef.current.position.clone();
            const startTarget = controlsRef.current.target.clone();
            const startTime = Date.now();
            const duration = 1200;
            
            const animateCamera = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 4);
              
              cameraRef.current!.position.lerpVectors(startPos, cameraPos, eased);
              controlsRef.current!.target.lerpVectors(startTarget, targetPos, eased);
              controlsRef.current!.update();
              
              if (progress < 1) {
                requestAnimationFrame(animateCamera);
              }
            };
            animateCamera();
          }
        }
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);

    // Animation loop
    let time = 0;
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      time += 0.003;

      // Orbit planets
      SPACE_ENTITIES.forEach((entity) => {
        if (entity.orbitSpeed > 0 && entity.distance > 0 && entity.classification !== 'Moon') {
          const group = entitiesRef.current.get(entity.id);
          if (group && group.children[0] instanceof THREE.Mesh) {
            const mesh = group.children[0] as THREE.Mesh;
            const angle = time * entity.orbitSpeed * 80;
            mesh.position.x = Math.cos(angle) * entity.distance;
            mesh.position.z = Math.sin(angle) * entity.distance;
            mesh.rotation.y += 0.005;
          }
        }
      });

      // Animate comet
      const cometGroup = entitiesRef.current.get('halley-comet');
      if (cometGroup && cometGroup.children[0] instanceof THREE.Mesh) {
        const comet = cometGroup.children[0] as THREE.Mesh;
        const cometAngle = time * 1.2 * 80;
        comet.position.x = Math.cos(cometAngle) * 95;
        comet.position.z = Math.sin(cometAngle) * 30;
        comet.position.y = Math.sin(cometAngle * 2) * 15;
        
        // Point tail away from sun
        const sunPos = new THREE.Vector3(0, 0, 0);
        comet.lookAt(sunPos);
      }

      // Animate moon around Earth
      const earthGroup = entitiesRef.current.get('earth');
      const moonGroup = entitiesRef.current.get('moon');
      if (earthGroup && moonGroup && earthGroup.children[0] && moonGroup.children[0]) {
        const earth = earthGroup.children[0] as THREE.Mesh;
        const moon = moonGroup.children[0] as THREE.Mesh;
        const moonAngle = time * 0.5 * 80;
        moon.position.x = Math.cos(moonAngle) * 5;
        moon.position.z = Math.sin(moonAngle) * 5;
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!container) return;
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
  }, []);

  const handleEntityClick = (entity: SpaceEntity) => {
    setSelectedEntity(entity);
    setShowInfo(true);

    const group = entitiesRef.current.get(entity.id);
    if (group && cameraRef.current && controlsRef.current) {
      const targetPos = new THREE.Vector3();
      group.getWorldPosition(targetPos);
      
      const distance = entity.size * 6 + 20;
      const cameraPos = targetPos.clone().add(new THREE.Vector3(distance, distance * 0.5, distance));
      
      const startPos = cameraRef.current.position.clone();
      const startTarget = controlsRef.current.target.clone();
      const startTime = Date.now();
      const duration = 1200;
      
      const animateCamera = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        
        cameraRef.current!.position.lerpVectors(startPos, cameraPos, eased);
        controlsRef.current!.target.lerpVectors(startTarget, targetPos, eased);
        controlsRef.current!.update();
        
        if (progress < 1) {
          requestAnimationFrame(animateCamera);
        }
      };
      animateCamera();
    }
  };

  const handleBackToSystem = () => {
    setShowInfo(false);
    setSelectedEntity(null);

    if (cameraRef.current && controlsRef.current) {
      const startPos = cameraRef.current.position.clone();
      const targetPos = new THREE.Vector3(0, 60, 100);
      const startTarget = controlsRef.current.target.clone();
      const endTarget = new THREE.Vector3(0, 0, 0);
      const startTime = Date.now();
      const duration = 1200;
      
      const animateCamera = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        
        cameraRef.current!.position.lerpVectors(startPos, targetPos, eased);
        controlsRef.current!.target.lerpVectors(startTarget, endTarget, eased);
        controlsRef.current!.update();
        
        if (progress < 1) {
          requestAnimationFrame(animateCamera);
        }
      };
      animateCamera();
    }
  };

  return (
    <div className="relative min-h-screen bg-sahara-bg text-sahara-text overflow-hidden">
      {/* Noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-25 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-[5%] h-[68px] bg-[rgba(8,15,28,.85)] backdrop-blur-[16px] border-b border-[rgba(73,122,182,.2)]">
        <a href="/" className="flex items-center gap-2.5 text-decoration-none">
          <div className="w-9 h-9 bg-gradient-to-br from-sahara-gold to-sahara-gold rounded-lg grid place-items-center font-['Bebas_Neue'] text-xl text-sahara-bg shadow-[0_0_16px_rgba(255,193,5,.35)]">
            S
          </div>
          <div className="font-['Barlow_Condensed'] font-black text-xl uppercase tracking-[.04em]">
            <span className="text-sahara-gold">Sahara</span>
          </div>
        </a>
        <ul className="flex gap-8 list-none">
          <li>
            <a href="/" className="text-sahara-muted no-underline font-medium uppercase tracking-[.05em] text-[.875rem] hover:text-sahara-gold transition-colors">
              Home
            </a>
          </li>
          <li>
            <a href="/games" className="text-sahara-gold no-underline font-medium uppercase tracking-[.05em] text-[.875rem]">
              Games
            </a>
          </li>
        </ul>
        <button className="bg-sahara-gold text-sahara-bg border-none px-6 py-2.5 rounded transition-all hover:opacity-90 hover:translate-y-[-1px] hover:shadow-[0_6px_24px_rgba(255,193,5,.4)] font-['Barlow_Condensed'] font-bold uppercase tracking-[.08em] text-[.95rem] cursor-pointer">
          Sign In
        </button>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 pt-[68px] h-screen flex">
        {/* Left Sidebar - Entity List */}
        <div className="w-80 h-full bg-[rgba(8,15,28,.9)] backdrop-blur-md border-r border-[rgba(73,122,182,.2)] flex flex-col">
          <div className="p-4 border-b border-[rgba(73,122,182,.2)]">
            <h2 className="font-['Bebas_Neue'] text-2xl text-sahara-gold tracking-[.03em] mb-3">
              Space Entities
            </h2>
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search entities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[rgba(73,122,182,.1)] border border-[rgba(73,122,182,.3)] rounded-lg px-4 py-2.5 text-sahara-text placeholder-[#7a93b4] focus:outline-none focus:border-[#ffc105] transition-colors"
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sahara-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* Entity List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredEntities.map((entity) => (
              <button
                key={entity.id}
                onClick={() => handleEntityClick(entity)}
                className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-3 ${
                  selectedEntity?.id === entity.id
                    ? 'bg-[rgba(255,193,5,.2)] border border-[#ffc105]'
                    : 'bg-[rgba(73,122,182,.1)] border border-transparent hover:bg-[rgba(255,193,5,.1)] hover:border-[rgba(255,193,5,.3)]'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entity.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{entity.name}</div>
                  <div className="text-xs text-sahara-muted">{entity.classification}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 3D Canvas */}
        <div ref={containerRef} className="flex-1 relative" />

        {/* Hover Tooltip */}
        {hoveredEntity && !showInfo && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[rgba(8,15,28,.95)] backdrop-blur-md border border-[rgba(255,193,5,.3)] rounded-lg px-6 py-3 z-20">
            <div className="text-center">
              <div className="font-['Bebas_Neue'] text-xl text-sahara-gold tracking-[.02em]">
                {hoveredEntity.name}
              </div>
              <div className="text-sm text-sahara-muted">
                {hoveredEntity.classification}
              </div>
            </div>
          </div>
        )}

        {/* Right Panel - Info */}
        {showInfo && selectedEntity && (
          <div className="w-96 h-full bg-[rgba(8,15,28,.95)] backdrop-blur-md border-l border-[rgba(73,122,182,.2)] flex flex-col overflow-hidden animate-[slideIn_0.3s_ease-out]">
            <div className="p-4 border-b border-[rgba(73,122,182,.2)] flex items-center justify-between">
              <h2 className="font-['Bebas_Neue'] text-2xl text-sahara-gold tracking-[.03em]">
                {selectedEntity.name}
              </h2>
              <button
                onClick={handleBackToSystem}
                className="text-sahara-muted hover:text-sahara-gold transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Classification Badge */}
              <div className="flex items-center gap-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-[.05em]"
                  style={{ backgroundColor: `${selectedEntity.color}30`, color: selectedEntity.color }}
                >
                  {selectedEntity.classification}
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-sahara-muted uppercase tracking-[.05em] mb-2">
                  Overview
                </h3>
                <p className="text-sahara-text leading-relaxed">
                  {selectedEntity.description}
                </p>
              </div>

              {/* Facts */}
              <div>
                <h3 className="text-sm font-bold text-sahara-muted uppercase tracking-[.05em] mb-2">
                  Did You Know?
                </h3>
                <ul className="space-y-2">
                  {selectedEntity.facts.map((fact, index) => (
                    <li key={index} className="flex gap-2 text-sm text-sahara-text">
                      <span className="text-sahara-gold">•</span>
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Default Right Panel - Solar System Info */}
        {!showInfo && (
          <div className="w-96 h-full bg-[rgba(8,15,28,.95)] backdrop-blur-md border-l border-[rgba(73,122,182,.2)] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-[rgba(73,122,182,.2)]">
              <h2 className="font-['Bebas_Neue'] text-2xl text-sahara-gold tracking-[.03em]">
                The Solar System
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <p className="text-sahara-text leading-relaxed">
                {SOLAR_SYSTEM_INFO.description}
              </p>

              <div>
                <h3 className="text-sm font-bold text-sahara-muted uppercase tracking-[.05em] mb-2">
                  Key Facts
                </h3>
                <ul className="space-y-2">
                  {SOLAR_SYSTEM_INFO.facts.map((fact, index) => (
                    <li key={index} className="flex gap-2 text-sm text-sahara-text">
                      <span className="text-sahara-gold">•</span>
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 p-4 bg-[rgba(255,193,5,.1)] rounded-lg border border-[rgba(255,193,5,.2)]">
                <h3 className="text-sm font-bold text-sahara-gold uppercase tracking-[.05em] mb-2">
                  How to Navigate
                </h3>
                <ul className="space-y-1 text-sm text-sahara-muted">
                  <li>🖱️ Click + drag to rotate</li>
                  <li>🔍 Scroll to zoom in/out</li>
                  <li>👆 Hover to identify objects</li>
                  <li>👆 Click objects to learn more</li>
                  <li>📋 Use left panel to search</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}