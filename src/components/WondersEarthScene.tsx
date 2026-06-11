'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const FLAT_MAP_TEXTURE_URL = 'https://th.bing.com/th/id/R.8596f983b6db5aea0622b1bc325d88d1?rik=W40Nyt12GVs%2bbA&riu=http%3a%2f%2fgetdrawings.com%2fvectors%2fflat-earth-map-vector-12.jpg&ehk=vuA2T1TuKBoIptjcHGoCVjU9aCVWpKqtNM8KbDDf%2bzk%3d&risl=&pid=ImgRaw&r=0';

export default function WondersEarthScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030713');
    scene.fog = new THREE.FogExp2('#030713', 0.04);

    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const mapGroup = new THREE.Group();
    mapGroup.position.set(0, 0, 0);
    scene.add(mapGroup);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableRotate = false;

    const starPositions = new Float32Array(1200 * 3);
    for (let i = 0; i < 1200; i++) {
      const i3 = i * 3;
      starPositions[i3] = (Math.random() - 0.5) * 34;
      starPositions[i3 + 1] = (Math.random() - 0.5) * 20;
      starPositions[i3 + 2] = -4 - Math.random() * 26;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        color: '#ffffff',
        size: 0.035,
        transparent: true,
        opacity: 0.82,
      }),
    );
    scene.add(stars);

    const mapMaterial = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.42,
      metalness: 0.02,
      emissive: '#061a33',
      emissiveIntensity: 0.08,
    });

    let loadedMapTexture: THREE.Texture | null = null;
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');
    textureLoader.load(
      FLAT_MAP_TEXTURE_URL,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        mapMaterial.map = texture;
        mapMaterial.needsUpdate = true;
        loadedMapTexture = texture;
      },
      undefined,
      () => {
        mapMaterial.color.set('#2ba7ff');
        mapMaterial.emissive.set('#083d72');
        mapMaterial.emissiveIntensity = 0.2;
      },
    );

    const flatMap = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 9),
      mapMaterial,
    );
    mapGroup.add(flatMap);

    scene.add(new THREE.AmbientLight(0xffffff, 1.65));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const handleKeyDown = (event: KeyboardEvent) => {
      // Disabled - map is now static
    };

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;
      stars.rotation.y = t * 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      controls.dispose();
      renderer.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) {
            material.forEach((entry) => entry.dispose());
          } else {
            material.dispose();
          }
        }
      });
      loadedMapTexture?.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 z-10" aria-label="Interactive 3D flat map background" />;
}
