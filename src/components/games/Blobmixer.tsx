'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Blob {
  mesh: THREE.Mesh;
  initialScale: THREE.Vector3;
  basePosition: THREE.Vector3;
  velocity: THREE.Vector3;
}

export default function Blobmixer({ onClose }: { onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const blobsRef = useRef<Blob[]>([]);
  const pointerRef = useRef({
    x: 0,
    y: 0,
    isDown: false,
    lastX: 0,
    lastY: 0,
    target: null as THREE.Mesh | null,
  });
  const [hintText, setHintText] = useState('Click and drag a blob to squish it.');

  useEffect(() => {
    const scene = new THREE.Scene();
    const width = window.innerWidth;
    const height = window.innerHeight;

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 2000);
    camera.position.set(0, 0, 32);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setClearColor(0x06101f, 1);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0x84b5ff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.1);
    directionalLight.position.set(5, 10, 15);
    scene.add(directionalLight);

    const baseMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x8dc7ff,
      metalness: 0.05,
      roughness: 0.18,
      transmission: 0.55,
      opacity: 0.92,
      transparent: true,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      reflectivity: 0.4,
    });

    const createBlob = (x: number, y: number, radius: number) => {
      const geometry = new THREE.IcosahedronGeometry(radius, 3);
      const position = geometry.attributes.position;

      for (let i = 0; i < position.count; i++) {
        const noise = 0.6 + Math.random() * 0.4;
        position.setXYZ(
          i,
          position.getX(i) * noise,
          position.getY(i) * noise,
          position.getZ(i) * noise,
        );
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();

      const mesh = new THREE.Mesh(geometry, baseMaterial.clone());
      mesh.position.set(x, y, 0);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);

      return {
        mesh,
        initialScale: new THREE.Vector3(1, 1, 1),
        basePosition: new THREE.Vector3(x, y, 0),
        velocity: new THREE.Vector3((Math.random() - 0.5) * 0.04, (Math.random() - 0.5) * 0.025, 0),
      };
    };

    blobsRef.current = [
      createBlob(-9, 2, 4.5),
      createBlob(8, 3, 3.5),
      createBlob(-2, -6, 5),
    ];

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const resizeScene = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (rendererRef.current && cameraRef.current) {
        rendererRef.current.setSize(w, h);
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
      }
    };

    const updateHover = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      pointerRef.current.x = pointer.x;
      pointerRef.current.y = pointer.y;
      pointerRef.current.lastX = event.clientX;
      pointerRef.current.lastY = event.clientY;

      if (!cameraRef.current) return;
      raycaster.setFromCamera(pointer, cameraRef.current);
      const hits = raycaster.intersectObjects(blobsRef.current.map((blob) => blob.mesh));
      if (hits.length > 0) {
        const hitMesh = hits[0].object as THREE.Mesh;
        setHintText('Drag to squish the selected blob.');
        blobsRef.current.forEach((blob) => {
          const material = blob.mesh.material as THREE.MeshPhysicalMaterial;
          material.opacity = blob.mesh === hitMesh ? 0.98 : 0.72;
          blob.mesh.scale.lerp(blob.initialScale, blob.mesh === hitMesh ? 0.05 : 0.1);
        });
      } else {
        setHintText(pointerRef.current.isDown ? 'Drag across the floaty shapes.' : 'Click and drag a blob to squish it.');
        blobsRef.current.forEach((blob) => {
          const material = blob.mesh.material as THREE.MeshPhysicalMaterial;
          material.opacity = 0.92;
          blob.mesh.scale.lerp(blob.initialScale, 0.08);
        });
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      pointerRef.current.isDown = true;
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      pointer.set(x, y);
      if (!cameraRef.current) return;
      raycaster.setFromCamera(pointer, cameraRef.current);
      const hits = raycaster.intersectObjects(blobsRef.current.map((blob) => blob.mesh));
      pointerRef.current.target = hits.length > 0 ? (hits[0].object as THREE.Mesh) : null;
    };

    const handlePointerUp = () => {
      pointerRef.current.isDown = false;
      pointerRef.current.target = null;
      blobsRef.current.forEach((blob) => blob.mesh.scale.lerp(blob.initialScale, 0.18));
    };

    const handlePointerMove = (event: PointerEvent) => {
      updateHover(event);
      if (!pointerRef.current.isDown || !pointerRef.current.target) {
        return;
      }

      const moveX = event.clientX - pointerRef.current.lastX;
      const moveY = event.clientY - pointerRef.current.lastY;
      const strength = Math.min(0.55, Math.max(-0.45, (moveX - moveY) * 0.0025));
      pointerRef.current.lastX = event.clientX;
      pointerRef.current.lastY = event.clientY;

      const targetBlob = blobsRef.current.find((blob) => blob.mesh === pointerRef.current.target);
      if (targetBlob) {
        const scaleX = 1 + strength;
        const scaleY = 1 - strength;
        targetBlob.mesh.scale.set(scaleX, scaleY, 1 + Math.abs(strength) * 0.35);
      }
    };

    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      blobsRef.current.forEach((blob) => {
        blob.mesh.position.add(blob.velocity);
        const drift = blob.mesh.position.distanceTo(blob.basePosition);
        if (drift > 4.5) {
          blob.velocity.multiplyScalar(-1);
        }
        blob.mesh.rotation.x += 0.0023;
        blob.mesh.rotation.y += 0.0018;
      });

      renderer.render(scene, camera);
    };

    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    containerRef.current?.appendChild(renderer.domElement);

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('resize', resizeScene);

    animate();

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', resizeScene);

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      blobsRef.current.forEach((blob) => {
        blob.mesh.geometry.dispose();
        (blob.mesh.material as THREE.Material).dispose();
        scene.remove(blob.mesh);
      });
      renderer.dispose();
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#041025] text-[#e8edf5] overflow-hidden">
      <div className="absolute inset-0 opacity-70 bg-gradient-to-b from-[#041025] via-[#061d41] to-[#041025]" />
      <div ref={containerRef} className="absolute inset-0" />

      <div className="relative z-10 px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <p className="uppercase tracking-[.2em] text-sm text-[#7a93b4]">Blobmixer</p>
            <h1 className="text-4xl md:text-5xl font-['Barlow_Condensed'] font-black uppercase text-[#ffc105]">3D Blob Playground</h1>
            <p className="max-w-3xl text-[#c8d3e8] leading-relaxed">{hintText} Use the pointer to push, drag, and stretch each floating blob in a soft, liquid 3D studio.</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-[#ffc105] px-6 py-3 text-[#080f1c] font-semibold uppercase tracking-[.08em] transition hover:bg-[#ffdd6c]"
          >
            Close
          </button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-[rgba(255,193,5,.15)] bg-[rgba(255,255,255,.04)] p-6 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-[#e8edf5]">Squish Play</h2>
            <p className="mt-3 text-sm text-[#7a93b4]">Click on a blob and drag to deform its shape. Release to watch it rebound softly.</p>
          </div>
          <div className="rounded-3xl border border-[rgba(255,193,5,.15)] bg-[rgba(255,255,255,.04)] p-6 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-[#e8edf5]">Float Studio</h2>
            <p className="mt-3 text-sm text-[#7a93b4]">Three blobs drift together in a calm space, with translucent material and slow motion.</p>
          </div>
          <div className="rounded-3xl border border-[rgba(255,193,5,.15)] bg-[rgba(255,255,255,.04)] p-6 backdrop-blur-xl">
            <h2 className="text-lg font-semibold text-[#e8edf5]">Relaxing Visuals</h2>
            <p className="mt-3 text-sm text-[#7a93b4]">Soft lighting, fluid surfaces, and interactive feedback make this a soothing 3D experiment.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
