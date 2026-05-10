'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { getSandDollars, spendSandDollars, resetSandDollars } from '@/utils/sandDollars';
import SiteHeader from '@/components/SiteHeader';

// Avatar data
const AVATAR_ITEMS = {
  hair: [
    { id: 'hair1', name: 'Short Brown', price: 0, image: '👨‍🦰' },
    { id: 'hair2', name: 'Long Blonde', price: 50, image: '👩‍🦱' },
    { id: 'hair3', name: 'Curly Black', price: 75, image: '👨‍🦱' },
    { id: 'hair4', name: 'Bald', price: 25, image: '👨‍🦲' },
    { id: 'hair5', name: 'Rainbow Afro', price: 150, image: '👨‍🦳' },
  ],
  head: [
    { id: 'head1', name: 'Baseball Cap', price: 100, image: '🧢' },
    { id: 'head2', name: 'Crown', price: 500, image: '👑' },
    { id: 'head3', name: 'Santa Hat', price: 200, image: '🎅' },
    { id: 'head4', name: 'Graduation Cap', price: 150, image: '🎓' },
    { id: 'head5', name: 'Party Hat', price: 50, image: '🎉' },
  ],
  skin: [
    { id: 'skin1', name: 'Light', price: 0, image: '🏻' },
    { id: 'skin2', name: 'Medium', price: 0, image: '🏼' },
    { id: 'skin3', name: 'Medium Dark', price: 0, image: '🏽' },
    { id: 'skin4', name: 'Dark', price: 0, image: '🏾' },
    { id: 'skin5', name: 'Deep Dark', price: 0, image: '🏿' },
  ],
  pants: [
    { id: 'pants1', name: 'Blue Jeans', price: 0, image: '👖' },
    { id: 'pants2', name: 'Black Pants', price: 25, image: '👖' },
    { id: 'pants3', name: 'Cargo Shorts', price: 75, image: '🩳' },
    { id: 'pants4', name: 'Designer Jeans', price: 200, image: '👖' },
    { id: 'pants5', name: 'Superhero Cape', price: 300, image: '🦸' },
  ],
  shoes: [
    { id: 'shoes1', name: 'Sneakers', price: 0, image: '👟' },
    { id: 'shoes2', name: 'Boots', price: 50, image: '👢' },
    { id: 'shoes3', name: 'Sandals', price: 25, image: '🩴' },
    { id: 'shoes4', name: 'High Heels', price: 100, image: '👠' },
    { id: 'shoes5', name: 'Rocket Boots', price: 400, image: '🚀' },
  ],
  accessories: [
    { id: 'acc1', name: 'Sunglasses', price: 75, image: '🕶️' },
    { id: 'acc2', name: 'Watch', price: 150, image: '⌚' },
    { id: 'acc3', name: 'Necklace', price: 100, image: '📿' },
    { id: 'acc4', name: 'Backpack', price: 125, image: '🎒' },
    { id: 'acc5', name: 'Jetpack', price: 500, image: '🛸' },
  ],
};

const SUMMER_DEALS = [
  {
    id: 'deal1',
    name: 'Harry Potter',
    price: 250,
    image: '🧙‍♂️',
    description: 'Wizard robes and glasses',
    preset: {
      hair: 'hair3',
      head: 'head2',
      skin: 'skin2',
      pants: 'pants4',
      shoes: 'shoes2',
      accessories: 'acc1',
    },
  },
  {
    id: 'deal2',
    name: 'Elon Musk',
    price: 300,
    image: '🚀',
    description: 'SpaceX jumpsuit',
    preset: {
      hair: 'hair4',
      head: 'head1',
      skin: 'skin1',
      pants: 'pants4',
      shoes: 'shoes1',
      accessories: 'acc5',
    },
  },
  {
    id: 'deal3',
    name: 'Super Mario',
    price: 275,
    image: '🍄',
    description: 'Red hat and mustache',
    preset: {
      hair: 'hair1',
      head: 'head5',
      skin: 'skin1',
      pants: 'pants4',
      shoes: 'shoes1',
      accessories: 'acc2',
    },
  },
  {
    id: 'deal4',
    name: 'Wonder Woman',
    price: 350,
    image: '🦸‍♀️',
    description: 'Hero costume',
    preset: {
      hair: 'hair2',
      head: 'head5',
      skin: 'skin3',
      pants: 'pants4',
      shoes: 'shoes3',
      accessories: 'acc3',
    },
  },
  {
    id: 'deal5',
    name: 'Iron Man',
    price: 400,
    image: '🤖',
    description: 'Powered armor suit',
    preset: {
      hair: 'hair4',
      head: 'head1',
      skin: 'skin4',
      pants: 'pants4',
      shoes: 'shoes5',
      accessories: 'acc5',
    },
  },
  {
    id: 'deal6',
    name: 'Batman',
    price: 325,
    image: '🦇',
    description: 'Dark knight outfit',
    preset: {
      hair: 'hair4',
      head: 'head1',
      skin: 'skin4',
      pants: 'pants4',
      shoes: 'shoes2',
      accessories: 'acc4',
    },
  },
];

const SKIN_COLOR_MAP: Record<string, string> = {
  skin1: '#f3c3b2',
  skin2: '#d8a16d',
  skin3: '#b57845',
  skin4: '#7b4a28',
  skin5: '#462a18',
};

const HAIR_COLOR_MAP: Record<string, string> = {
  hair1: '#4b2b0d',
  hair2: '#e6c17a',
  hair3: '#20110b',
  hair4: '#2c2c2c',
  hair5: '#d152d2',
};

const PANTS_COLOR_MAP: Record<string, string> = {
  pants1: '#2f6ae8',
  pants2: '#1f2937',
  pants3: '#6b7280',
  pants4: '#111827',
  pants5: '#be185d',
};

const SHOE_COLOR_MAP: Record<string, string> = {
  shoes1: '#111827',
  shoes2: '#4b5563',
  shoes3: '#d97706',
  shoes4: '#831843',
  shoes5: '#0891b2',
};

const MATERIAL_OPTIONS = {
  roughness: 0.5,
  metalness: 0.1,
};

function createAvatarBody(group: THREE.Group, selectedItems: Record<string, string>) {
  group.clear();

  const skinColor = SKIN_COLOR_MAP[selectedItems.skin] || SKIN_COLOR_MAP.skin1;
  const hairColor = HAIR_COLOR_MAP[selectedItems.hair] || HAIR_COLOR_MAP.hair1;
  const pantsColor = PANTS_COLOR_MAP[selectedItems.pants] || PANTS_COLOR_MAP.pants1;
  const shoesColor = SHOE_COLOR_MAP[selectedItems.shoes] || SHOE_COLOR_MAP.shoes1;
  const shirtColor = selectedItems.pants === 'pants5' ? '#d97706' : '#2563eb';

  const headMaterial = new THREE.MeshStandardMaterial({ color: skinColor, ...MATERIAL_OPTIONS });
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: shirtColor, ...MATERIAL_OPTIONS });
  const pantsMaterial = new THREE.MeshStandardMaterial({ color: pantsColor, ...MATERIAL_OPTIONS });
  const skinMaterial = new THREE.MeshStandardMaterial({ color: skinColor, ...MATERIAL_OPTIONS });
  const hairMaterial = new THREE.MeshStandardMaterial({ color: hairColor, ...MATERIAL_OPTIONS });
  const shoeMaterial = new THREE.MeshStandardMaterial({ color: shoesColor, ...MATERIAL_OPTIONS });

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 32, 32), headMaterial);
  head.position.set(0, 2.05, 0);
  group.add(head);

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.25, 0.7, 6, 16), bodyMaterial);
  body.position.set(0, 1.15, 0);
  group.add(body);

  const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.11, 0.8, 16), skinMaterial);
  leftArm.position.set(-0.42, 1.2, 0);
  leftArm.rotation.z = 0.16;
  group.add(leftArm);

  const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.11, 0.8, 16), skinMaterial);
  rightArm.position.set(0.42, 1.2, 0);
  rightArm.rotation.z = -0.16;
  group.add(rightArm);

  const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.8, 16), pantsMaterial);
  leftLeg.position.set(-0.16, 0.35, 0);
  group.add(leftLeg);

  const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.8, 16), pantsMaterial);
  rightLeg.position.set(0.16, 0.35, 0);
  group.add(rightLeg);

  const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.15), shoeMaterial);
  leftShoe.position.set(-0.16, -0.05, 0.1);
  group.add(leftShoe);

  const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.15), shoeMaterial);
  rightShoe.position.set(0.16, -0.05, 0.1);
  group.add(rightShoe);

  const eyesMaterial = new THREE.MeshStandardMaterial({ color: 0x303030, ...MATERIAL_OPTIONS });
  const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), eyesMaterial);
  leftEye.position.set(-0.12, 2.12, 0.31);
  group.add(leftEye);

  const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), eyesMaterial);
  rightEye.position.set(0.12, 2.12, 0.31);
  group.add(rightEye);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.18, 8), new THREE.MeshStandardMaterial({ color: 0xd4997b, ...MATERIAL_OPTIONS }));
  nose.position.set(0, 2.0, 0.33);
  nose.rotation.x = Math.PI * 0.5;
  group.add(nose);

  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.02, 12, 24, Math.PI), new THREE.MeshStandardMaterial({ color: 0x381f16, ...MATERIAL_OPTIONS }));
  mouth.position.set(0, 1.92, 0.32);
  mouth.rotation.x = Math.PI * 0.15;
  group.add(mouth);

  if (selectedItems.hair !== 'hair4') {
    if (selectedItems.hair === 'hair1') {
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.38, 24, 24), hairMaterial);
      hair.position.set(0, 2.18, -0.04);
      group.add(hair);
    }
    if (selectedItems.hair === 'hair2') {
      const hair = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.58, 0.3), hairMaterial);
      hair.position.set(0, 2.25, -0.08);
      group.add(hair);
    }
    if (selectedItems.hair === 'hair3') {
      const curl1 = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), hairMaterial);
      curl1.position.set(-0.16, 2.22, -0.08);
      group.add(curl1);
      const curl2 = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), hairMaterial);
      curl2.position.set(0.16, 2.22, -0.08);
      group.add(curl2);
      const top = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), hairMaterial);
      top.position.set(0, 2.35, -0.08);
      group.add(top);
    }
    if (selectedItems.hair === 'hair5') {
      const afro = new THREE.Mesh(new THREE.SphereGeometry(0.48, 24, 24), hairMaterial);
      afro.position.set(0, 2.28, -0.08);
      group.add(afro);
    }
  }

  if (selectedItems.head) {
    switch (selectedItems.head) {
      case 'head1': {
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.39, 0.16, 24), new THREE.MeshStandardMaterial({ color: 0x1f2937, ...MATERIAL_OPTIONS }));
        cap.position.set(0, 2.4, 0);
        group.add(cap);
        const brim = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.06, 0.26), new THREE.MeshStandardMaterial({ color: 0x111827, ...MATERIAL_OPTIONS }));
        brim.position.set(0, 2.33, 0.17);
        group.add(brim);
        break;
      }
      case 'head2': {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.05, 16, 60), new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1, roughness: 0.2 }));
        ring.position.set(0, 2.45, 0);
        ring.rotation.x = Math.PI * 0.5;
        group.add(ring);
        break;
      }
      case 'head3': {
        const hat = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.5, 24), new THREE.MeshStandardMaterial({ color: 0xcc0b2b, ...MATERIAL_OPTIONS }));
        hat.position.set(0, 2.55, 0);
        group.add(hat);
        const bobble = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), new THREE.MeshStandardMaterial({ color: 0xffffff, ...MATERIAL_OPTIONS }));
        bobble.position.set(0, 2.77, 0);
        group.add(bobble);
        break;
      }
      case 'head4': {
        const mortar = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.08, 0.6), new THREE.MeshStandardMaterial({ color: 0x111827, ...MATERIAL_OPTIONS }));
        mortar.position.set(0, 2.5, 0);
        group.add(mortar);
        const tassel = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 8), new THREE.MeshStandardMaterial({ color: 0xffd700, ...MATERIAL_OPTIONS }));
        tassel.position.set(0.15, 2.35, 0);
        group.add(tassel);
        break;
      }
      case 'head5': {
        const cone = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.5, 20), new THREE.MeshStandardMaterial({ color: 0xec4899, ...MATERIAL_OPTIONS }));
        cone.position.set(0, 2.55, 0);
        group.add(cone);
        break;
      }
      default:
        break;
    }
  }

  if (selectedItems.accessories) {
    switch (selectedItems.accessories) {
      case 'acc1': {
        const leftGlass = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.02), new THREE.MeshStandardMaterial({ color: 0x111827, ...MATERIAL_OPTIONS }));
        leftGlass.position.set(-0.12, 2.12, 0.33);
        group.add(leftGlass);
        const rightGlass = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.02), new THREE.MeshStandardMaterial({ color: 0x111827, ...MATERIAL_OPTIONS }));
        rightGlass.position.set(0.12, 2.12, 0.33);
        group.add(rightGlass);
        const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 0.02), new THREE.MeshStandardMaterial({ color: 0x111827, ...MATERIAL_OPTIONS }));
        bridge.position.set(0, 2.12, 0.33);
        group.add(bridge);
        break;
      }
      case 'acc2': {
        const watch = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.04), new THREE.MeshStandardMaterial({ color: 0xfacc15, ...MATERIAL_OPTIONS }));
        watch.position.set(0.52, 0.8, 0);
        group.add(watch);
        break;
      }
      case 'acc3': {
        const necklace = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.04, 12, 32), new THREE.MeshStandardMaterial({ color: 0xfbbf24, ...MATERIAL_OPTIONS }));
        necklace.position.set(0, 1.7, 0);
        necklace.rotation.x = Math.PI * 0.5;
        group.add(necklace);
        break;
      }
      case 'acc4': {
        const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.55, 0.18), new THREE.MeshStandardMaterial({ color: 0x2563eb, ...MATERIAL_OPTIONS }));
        backpack.position.set(0, 1.25, -0.22);
        group.add(backpack);
        break;
      }
      case 'acc5': {
        const leftTank = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.4, 16), new THREE.MeshStandardMaterial({ color: 0x6b7280, ...MATERIAL_OPTIONS }));
        leftTank.position.set(-0.18, 1.2, -0.24);
        leftTank.rotation.z = Math.PI * 0.05;
        group.add(leftTank);
        const rightTank = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.4, 16), new THREE.MeshStandardMaterial({ color: 0x6b7280, ...MATERIAL_OPTIONS }));
        rightTank.position.set(0.18, 1.2, -0.24);
        rightTank.rotation.z = Math.PI * 0.05;
        group.add(rightTank);
        break;
      }
      default:
        break;
    }
  }
}

function AvatarViewer({ selectedItems }: { selectedItems: Record<string, string> }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1220);

    const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 1.8, 3.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x222b58, 0.9);
    scene.add(hemiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(4, 8, 6);
    scene.add(dirLight);

    const avatarGroup = new THREE.Group();
    avatarGroup.position.set(0, -0.25, 0);
    scene.add(avatarGroup);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(2.5, 64),
      new THREE.MeshStandardMaterial({ color: 0x111f3a, roughness: 0.7, metalness: 0 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.4;
    scene.add(floor);

    groupRef.current = avatarGroup;

    const resize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', resize);

    const animate = () => {
      avatarGroup.rotation.y += 0.004;
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (!groupRef.current) return;
    createAvatarBody(groupRef.current, selectedItems);
  }, [selectedItems]);

  return <div ref={containerRef} className="w-full h-[420px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-950" />;
}

export default function AvatarPage() {
  const [sandDollars, setSandDollars] = useState(1000);
  const [selectedCategory, setSelectedCategory] = useState('hair');
  const [selectedItems, setSelectedItems] = useState<Record<string, string>>({
    hair: 'hair1',
    head: '',
    skin: 'skin1',
    pants: 'pants1',
    shoes: 'shoes1',
    accessories: '',
  });

  useEffect(() => {
    resetSandDollars(1000);
    setSandDollars(getSandDollars());
  }, []);

  const purchaseItem = (item: any, category?: string) => {
    if (item.price === 0) {
      if (category && category !== 'summer-deals') {
        setSelectedItems((prev) => ({
          ...prev,
          [category]: item.id,
        }));
      }
      return;
    }

    if (spendSandDollars(item.price)) {
      setSandDollars(getSandDollars());

      if (category === 'summer-deals' && item.preset) {
        setSelectedItems((prev) => ({
          ...prev,
          ...item.preset,
        }));
      } else if (category && category !== 'summer-deals') {
        setSelectedItems((prev) => ({
          ...prev,
          [category]: item.id,
        }));
      }

      alert(`Purchased ${item.name} for ${item.price} Sand Dollars!`);
    } else {
      alert('Not enough Sand Dollars!');
    }
  };

  const selectItem = (category: string, itemId: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [category]: itemId,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white">
      <SiteHeader
        links={[
          { label: 'Home', href: '/' },
          { label: 'Games', href: '/games' },
        ]}
        rightSlot={
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.href = '/games'}
              className="rounded-xl border border-[#88a9d8]/20 bg-[#080f1c]/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#ffc105] no-underline transition hover:bg-[#0a1222]"
            >
              Back to Games
            </button>
            <div className="rounded-xl border border-[#88a9d8]/20 bg-[#ffc105]/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#ffc105]">
              🪙 {sandDollars} Sand Dollars
            </div>
            <button
              onClick={() => {
                resetSandDollars(1000);
                setSandDollars(1000);
              }}
              className="rounded-xl border border-[#88a9d8]/20 bg-[#10b981]/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#10b981] transition hover:bg-[#10b981]/15"
            >
              Reset to 1000
            </button>
          </div>
        }
      />

      <div className="pt-[92px] max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
              <h2 className="text-xl font-bold mb-4">Your 3D Avatar</h2>
              <div className="mb-4">
                <AvatarViewer selectedItems={selectedItems} />
              </div>
              <div className="text-sm text-gray-300">Your avatar updates when you buy or select items.</div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.keys(AVATAR_ITEMS).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
              <button
                onClick={() => setSelectedCategory('summer-deals')}
                className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                  selectedCategory === 'summer-deals'
                    ? 'bg-orange-600 text-white'
                    : 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-200'
                }`}
              >
                🌞 Summer Deals
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedCategory === 'summer-deals' ? (
                SUMMER_DEALS.map((item) => (
                  <div key={item.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center hover:bg-white/20 transition-colors">
                    <div className="text-4xl mb-2">{item.image}</div>
                    <div className="font-bold text-sm mb-1">{item.name}</div>
                    <div className="text-xs text-gray-300 mb-2">{item.description}</div>
                    <div className="text-yellow-400 font-bold mb-2">🪙 {item.price}</div>
                    <button
                      onClick={() => purchaseItem(item, 'summer-deals')}
                      className="bg-orange-600 hover:bg-orange-500 px-3 py-1 rounded text-xs transition-colors w-full"
                    >
                      Buy
                    </button>
                  </div>
                ))
              ) : (
                AVATAR_ITEMS[selectedCategory as keyof typeof AVATAR_ITEMS]?.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center transition-colors ${
                      selectedItems[selectedCategory] === item.id
                        ? 'bg-blue-600/50 border-2 border-blue-400'
                        : 'hover:bg-white/20'
                    }`}
                  >
                    <div className="text-4xl mb-2">{item.image}</div>
                    <div className="font-bold text-sm mb-1">{item.name}</div>
                    <div className="text-yellow-400 font-bold text-xs">
                      {item.price === 0 ? 'FREE' : `🪙 ${item.price}`}
                    </div>
                    <div className="mt-3">
                      {item.price > 0 ? (
                        <button
                          onClick={() => purchaseItem(item, selectedCategory)}
                          disabled={sandDollars < item.price}
                          className={`w-full rounded-lg px-3 py-2 text-xs font-semibold transition ${
                            sandDollars >= item.price
                              ? 'bg-green-600 hover:bg-green-500 text-white'
                              : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                          }`}
                        >
                          {sandDollars >= item.price ? `Buy for 🪙 ${item.price}` : `Need 🪙 ${item.price}`}
                        </button>
                      ) : (
                        <button
                          onClick={() => selectItem(selectedCategory, item.id)}
                          className={`w-full rounded-lg px-3 py-2 text-xs font-semibold transition ${
                            selectedItems[selectedCategory] === item.id
                              ? 'bg-blue-700 text-white'
                              : 'bg-slate-700 hover:bg-slate-600 text-white'
                          }`}
                        >
                          {selectedItems[selectedCategory] === item.id ? 'Using' : 'Select'}
                        </button>
                      )}
                    </div>
                    {item.price > 0 && sandDollars < item.price && (
                      <div className="text-red-400 text-xs mt-1">Can't afford</div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">💰 How to Earn Sand Dollars</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-bold text-green-400 mb-2">🎮 Play Games:</h4>
                  <ul className="space-y-1 text-gray-300">
                    <li>• Pac-Man: 50-200 coins (based on score)</li>
                    <li>• Space Program: 100-500 coins (missions)</li>
                    <li>• Rocket Builder: 75-300 coins (success)</li>
                    <li>• Interactive Games: 25-100 coins</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-blue-400 mb-2">🎯 Daily Challenges:</h4>
                  <ul className="space-y-1 text-gray-300">
                    <li>• Login daily: 10 coins</li>
                    <li>• Complete 3 games: 50 coins</li>
                    <li>• Share score: 25 coins</li>
                    <li>• Weekly bonus: 100 coins</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
