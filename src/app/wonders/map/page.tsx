'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { OrbitControls as ThreeOrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ArrowLeft, ExternalLink, MapPin, Rotate3D, Sparkles, X, ZoomIn } from 'lucide-react';

interface Wonder {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  built: string;
  coordinates: string;
  image: string;
  sourceUrl: string;
  credit: string;
  description: string;
  trivia: string[];
  questions: string[];
}

const WONDERS: Wonder[] = [
  {
    id: 'great-wall',
    name: 'Great Wall of China',
    location: 'Northern China',
    lat: 40.4319,
    lng: 116.5704,
    built: '7th century BC to Ming dynasty expansions',
    coordinates: '40.4319 N, 116.5704 E',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/The_Great_Wall_of_China_at_Jinshanling-edit.jpg?width=1200',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:The_Great_Wall_of_China_at_Jinshanling-edit.jpg',
    credit: 'Severin.stalder, CC BY-SA 3.0, via Wikimedia Commons',
    description:
      'A network of fortifications crossing mountains, deserts, and passes in northern China. Much of the most photographed stone-and-brick wall was rebuilt during the Ming dynasty.',
    trivia: [
      'The total length of all known wall branches is commonly cited at more than 13,000 miles.',
      'Beacon towers could pass warning signals using smoke by day and fire by night.',
      'The wall was never one continuous project; different dynasties built and rebuilt sections for different frontiers.',
    ],
    questions: [
      'Why would builders choose ridge lines instead of valley floors?',
      'How did geography shape the wall as much as politics did?',
    ],
  },
  {
    id: 'colosseum',
    name: 'Colosseum',
    location: 'Rome, Italy',
    lat: 41.8902,
    lng: 12.4923,
    built: 'Completed in 80 AD',
    coordinates: '41.8902 N, 12.4923 E',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Colosseum_in_Rome-April_2007-1-_copie_2B.jpg?width=1200',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Colosseum_in_Rome-April_2007-1-_copie_2B.jpg',
    credit: 'Diliff, CC BY-SA 2.5, via Wikimedia Commons',
    description:
      'The largest amphitheater of ancient Rome, built for public spectacles on a scale that still feels enormous nearly two thousand years later.',
    trivia: [
      'Its original name was the Flavian Amphitheatre.',
      'The arena floor once covered underground rooms and passages called the hypogeum.',
      'Its seating reflected Roman social rank, with the best views reserved for elites.',
    ],
    questions: [
      'What does the building reveal about entertainment as political power?',
      'How would crowd movement work in a stadium this large without modern signs?',
    ],
  },
  {
    id: 'petra',
    name: 'Petra',
    location: "Ma'an, Jordan",
    lat: 30.3286,
    lng: 35.4419,
    built: 'Flourished around 1st century BC to 1st century AD',
    coordinates: '30.3286 N, 35.4419 E',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Al_Khazneh_Petra_edit_2.jpg?width=1200',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Al_Khazneh_Petra_edit_2.jpg',
    credit: 'Diego Delso, CC BY-SA 4.0, via Wikimedia Commons',
    description:
      'A Nabataean city carved into rose-colored sandstone cliffs, famous for its rock-cut facades and control of desert trade routes.',
    trivia: [
      'Petra managed scarce desert water with dams, cisterns, and channels.',
      'Al-Khazneh, the Treasury, is a tomb despite its popular name.',
      'The narrow approach through the Siq makes the first view of the Treasury dramatic by design.',
    ],
    questions: [
      'How does carving a monument into rock change what architects can do?',
      'Why would water engineering be as important as decoration here?',
    ],
  },
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    location: 'Agra, India',
    lat: 27.1751,
    lng: 78.0421,
    built: '1632 to 1653',
    coordinates: '27.1751 N, 78.0421 E',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/El_Taj_Mahal-Agra_India0023.JPG?width=1200',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:El_Taj_Mahal-Agra_India0023.JPG',
    credit: 'David Castor, public domain, via Wikimedia Commons',
    description:
      'A white marble mausoleum built by Mughal emperor Shah Jahan in memory of Mumtaz Mahal, combining Persian, Islamic, and Indian design traditions.',
    trivia: [
      'The complex is arranged around careful symmetry, with the tomb offset by the Yamuna River.',
      'Its marble changes color visibly with daylight and weather.',
      'The decorative inlay work uses semi-precious stones set into marble.',
    ],
    questions: [
      'How does symmetry make the building feel calm and monumental?',
      'Why might a tomb be designed as a garden experience?',
    ],
  },
  {
    id: 'chichen-itza',
    name: 'Chichen Itza',
    location: 'Yucatan, Mexico',
    lat: 20.6829,
    lng: -88.5686,
    built: 'Major development around 600 to 1200 AD',
    coordinates: '20.6829 N, 88.5686 W',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chichen_Itza_3.jpg?width=1200',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Chichen_Itza_3.jpg',
    credit: 'Daniel Schwen, CC BY-SA 4.0, via Wikimedia Commons',
    description:
      'A major Maya city whose monuments, especially El Castillo, reflect ceremonial life, astronomy, trade, and political power.',
    trivia: [
      'El Castillo is also known as the Temple of Kukulcan.',
      'During equinoxes, light and shadow can create a serpent-like effect on the pyramid stairway.',
      'The site includes one of the largest known Mesoamerican ball courts.',
    ],
    questions: [
      'What would it take to align architecture with seasonal light?',
      'How can a city be both a sacred center and a trade hub?',
    ],
  },
  {
    id: 'machu-picchu',
    name: 'Machu Picchu',
    location: 'Cusco Region, Peru',
    lat: -13.1631,
    lng: -72.545,
    built: 'Around 1450',
    coordinates: '13.1631 S, 72.5450 W',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/80_-_Machu_Picchu_-_Juin_2009_-_edit.jpg?width=1200',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:80_-_Machu_Picchu_-_Juin_2009_-_edit.jpg',
    credit: 'Martin St-Amant, CC BY-SA 3.0, via Wikimedia Commons',
    description:
      'An Inca citadel set high in the Andes, known for precise stonework, agricultural terraces, and its extraordinary mountain setting.',
    trivia: [
      'The terraces helped control erosion and created usable growing space.',
      'Many stones were fitted without mortar.',
      'The site sits between Machu Picchu and Huayna Picchu mountains.',
    ],
    questions: [
      'Why build a royal or sacred site in such a difficult place?',
      'How do terraces turn steep terrain into an engineered landscape?',
    ],
  },
  {
    id: 'christ-redeemer',
    name: 'Christ the Redeemer',
    location: 'Rio de Janeiro, Brazil',
    lat: -22.9519,
    lng: -43.2105,
    built: '1922 to 1931',
    coordinates: '22.9519 S, 43.2105 W',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Christ_the_Redeemer_-_From_Above.jpg?width=1200',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Christ_the_Redeemer_-_From_Above.jpg',
    credit: 'Arne Museler, CC BY-SA 3.0, via Wikimedia Commons',
    description:
      'An Art Deco statue on Corcovado mountain, looking over Rio de Janeiro and Guanabara Bay from one of the citys most recognizable viewpoints.',
    trivia: [
      'The statue is about 98 feet tall, excluding its pedestal.',
      'Its outer surface is covered in small soapstone tiles.',
      'The open-armed silhouette was chosen to read clearly from far across the city.',
    ],
    questions: [
      'How does a skyline monument change the identity of a city?',
      'Why does a simple silhouette matter at this scale?',
    ],
  },
];

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lng + 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function ThreeGlobe({
  selectedWonder,
  onSelectWonder,
}: {
  selectedWonder: Wonder | null;
  onSelectWonder: (wonder: Wonder) => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<
    Array<{
      id: string;
      sphere: THREE.Mesh<THREE.SphereGeometry, THREE.MeshStandardMaterial>;
      ring: THREE.Mesh<THREE.RingGeometry, THREE.MeshBasicMaterial>;
    }>
  >([]);

  useEffect(() => {
    const selectedId = selectedWonder?.id;
    markersRef.current.forEach(({ id, sphere, ring }) => {
      const active = id === selectedId;
      sphere.scale.setScalar(active ? 1.28 : 1);
      sphere.material.color.set(active ? '#ffdd63' : '#ff3d2e');
      sphere.material.emissive.set(active ? '#ffb000' : '#9c100c');
      sphere.material.emissiveIntensity = active ? 0.9 : 0.45;
      ring.material.color.set(active ? '#ffdd63' : '#ff544a');
      ring.material.opacity = active ? 0.95 : 0.7;
    });
  }, [selectedWonder]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#020611');
    scene.fog = new THREE.Fog('#020611', 8, 13);

    const camera = new THREE.PerspectiveCamera(48, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.25, 4.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const controls = new ThreeOrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 3.4;
    controls.maxDistance = 6.6;
    controls.enablePan = false;
    controls.rotateSpeed = 0.65;
    controls.zoomSpeed = 0.75;

    scene.add(new THREE.AmbientLight(0xffffff, 1.35));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.3);
    keyLight.position.set(5, 4, 7);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight('#4fb8ff', 2);
    rimLight.position.set(-5, -2, -3);
    scene.add(rimLight);

    const starPositions = new Float32Array(2200 * 3);
    for (let index = 0; index < 2200; index += 1) {
      const radius = 22 + Math.random() * 58;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const i = index * 3;
      starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = radius * Math.cos(phi);
      starPositions[i + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({ color: '#ffffff', size: 0.055, transparent: true, opacity: 0.82 }),
    );
    scene.add(stars);

    const globeGroup = new THREE.Group();
    globeGroup.rotation.y = -0.85;
    scene.add(globeGroup);

    const earthMaterial = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.68,
      metalness: 0.03,
    });
    const earth = new THREE.Mesh(new THREE.SphereGeometry(2, 96, 96), earthMaterial);
    globeGroup.add(earth);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.035, 96, 96),
      new THREE.MeshBasicMaterial({ color: '#61c7ff', transparent: true, opacity: 0.1, side: THREE.BackSide }),
    );
    globeGroup.add(atmosphere);

    let earthTexture: THREE.Texture | null = null;
    const textureLoader = new THREE.TextureLoader();
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const textureUrl = `${basePath}/images/earth-blue-marble.png`;
    textureLoader.load(
      textureUrl,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        earthMaterial.map = texture;
        earthMaterial.needsUpdate = true;
        earthTexture = texture;
      },
      undefined,
      () => {
        earthMaterial.color.set('#2b8ad6');
        earthMaterial.emissive.set('#07284d');
        earthMaterial.emissiveIntensity = 0.2;
      },
    );

    const clickableMarkers: THREE.Mesh[] = [];
    markersRef.current = WONDERS.map((wonder) => {
      const position = latLngToVector3(wonder.lat, wonder.lng, 2.045);
      const normal = position.clone().normalize();
      const active = wonder.id === selectedWonder?.id;
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(active ? 0.07 : 0.055, 24, 24),
        new THREE.MeshStandardMaterial({
          color: active ? '#ffdd63' : '#ff3d2e',
          emissive: active ? '#ffb000' : '#9c100c',
          emissiveIntensity: active ? 0.9 : 0.45,
          roughness: 0.2,
        }),
      );
      sphere.position.copy(position);
      sphere.userData.wonderId = wonder.id;
      sphere.userData.wonder = wonder;
      globeGroup.add(sphere);
      clickableMarkers.push(sphere);

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.095, 0.112, 32),
        new THREE.MeshBasicMaterial({
          color: active ? '#ffdd63' : '#ff544a',
          transparent: true,
          opacity: active ? 0.95 : 0.7,
          side: THREE.DoubleSide,
        }),
      );
      ring.position.copy(position.clone().add(normal.multiplyScalar(0.015)));
      ring.lookAt(0, 0, 0);
      globeGroup.add(ring);

      return { id: wonder.id, sphere, ring };
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const setPointerFromEvent = (event: PointerEvent) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -(((event.clientY - bounds.top) / bounds.height) * 2 - 1);
    };

    const getHit = (event: PointerEvent) => {
      setPointerFromEvent(event);
      raycaster.setFromCamera(pointer, camera);
      return raycaster.intersectObjects(clickableMarkers, false)[0]?.object as THREE.Mesh | undefined;
    };

    const handlePointerMove = (event: PointerEvent) => {
      renderer.domElement.style.cursor = getHit(event) ? 'pointer' : 'grab';
    };

    const handlePointerDown = (event: PointerEvent) => {
      const hit = getHit(event);
      if (hit?.userData.wonder) {
        onSelectWonder(hit.userData.wonder as Wonder);
      }
    };

    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      stars.rotation.y += 0.0008;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      controls.dispose();
      earthTexture?.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) {
            material.forEach((entry) => entry.dispose());
          } else {
            material.dispose();
          }
        }
      });
      renderer.dispose();
      markersRef.current = [];
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [onSelectWonder]);

  return <div ref={mountRef} className="absolute inset-0" aria-label="Movable 3D globe showing the Seven Wonders" />;
}

export default function WondersMapPage() {
  const [selectedWonder, setSelectedWonder] = useState<Wonder | null>(WONDERS[0]);

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#020611] text-white">
      <ThreeGlobe selectedWonder={selectedWonder} onSelectWonder={setSelectedWonder} />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/80 via-black/30 to-transparent px-4 py-4 sm:px-6">
        <div className="pointer-events-auto flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/wonders"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
              aria-label="Back to wonders"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ffcf4d]">Interactive Globe</p>
              <h1 className="truncate text-xl font-black sm:text-2xl">Seven Wonders Map</h1>
            </div>
          </div>
          <div className="hidden items-center gap-3 rounded-md border border-white/15 bg-black/35 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur md:flex">
            <Rotate3D className="h-4 w-4 text-[#61c7ff]" />
            Drag to rotate
            <ZoomIn className="h-4 w-4 text-[#ffcf4d]" />
            Scroll to zoom
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 z-10 hidden max-w-sm rounded-md border border-white/15 bg-black/45 p-4 text-sm text-white/80 backdrop-blur md:block">
        <div className="mb-2 flex items-center gap-2 font-bold text-white">
          <MapPin className="h-4 w-4 text-[#ff544a]" />
          Click a glowing point
        </div>
        Each marker opens photos, fast facts, trivia, and questions to think about while you explore.
      </div>

      <aside
        className={`absolute right-0 z-20 flex w-full max-w-[430px] flex-col border-l border-white/15 bg-[#07111f]/92 shadow-2xl backdrop-blur-xl transition-transform duration-300 sm:w-[430px] ${
          selectedWonder ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: 'var(--header-offset)', height: 'calc(100% - var(--header-offset))' }}
      >
        {selectedWonder && (
          <>
            <div className="relative h-56 shrink-0 overflow-hidden">
              <img src={selectedWonder.image} alt={selectedWonder.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07111f] via-transparent to-black/20" />
              <button
                type="button"
                onClick={() => setSelectedWonder(null)}
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur transition hover:bg-black/65"
                aria-label="Close wonder details"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-5 right-5">
                <div className="mb-2 inline-flex items-center gap-2 rounded-md bg-[#ffcf4d] px-3 py-1 text-xs font-black uppercase text-black">
                  <Sparkles className="h-3.5 w-3.5" />
                  Wonder
                </div>
                <h2 className="text-3xl font-black leading-tight">{selectedWonder.name}</h2>
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md border border-white/12 bg-white/[0.06] p-3">
                  <p className="text-xs font-bold uppercase text-[#ffcf4d]">Location</p>
                  <p className="mt-1 text-sm font-semibold">{selectedWonder.location}</p>
                </div>
                <div className="rounded-md border border-white/12 bg-white/[0.06] p-3">
                  <p className="text-xs font-bold uppercase text-[#ffcf4d]">Built</p>
                  <p className="mt-1 text-sm font-semibold">{selectedWonder.built}</p>
                </div>
              </div>

              <section>
                <p className="mb-2 text-xs font-bold uppercase text-[#61c7ff]">Coordinates</p>
                <p className="rounded-md border border-white/12 bg-black/25 px-3 py-2 text-sm text-white/85">
                  {selectedWonder.coordinates}
                </p>
              </section>

              <section>
                <p className="mb-2 text-xs font-bold uppercase text-[#61c7ff]">Description</p>
                <p className="leading-7 text-white/86">{selectedWonder.description}</p>
              </section>

              <section>
                <p className="mb-2 text-xs font-bold uppercase text-[#61c7ff]">Trivia Facts</p>
                <div className="space-y-2">
                  {selectedWonder.trivia.map((fact) => (
                    <p key={fact} className="rounded-md border border-white/12 bg-white/[0.055] p-3 text-sm leading-6 text-white/85">
                      {fact}
                    </p>
                  ))}
                </div>
              </section>

              <section>
                <p className="mb-2 text-xs font-bold uppercase text-[#61c7ff]">Questions</p>
                <div className="space-y-2">
                  {selectedWonder.questions.map((question) => (
                    <p key={question} className="rounded-md border border-[#ffcf4d]/25 bg-[#ffcf4d]/10 p-3 text-sm font-semibold leading-6 text-white">
                      {question}
                    </p>
                  ))}
                </div>
              </section>

              <a
                href={selectedWonder.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/18"
              >
                Image source
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <p className="text-xs leading-5 text-white/55">{selectedWonder.credit}</p>
            </div>
          </>
        )}
      </aside>
    </main>
  );
}
