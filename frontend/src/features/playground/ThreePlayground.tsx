import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

import { planetConfigs } from "./solarSystemConfig";
import {
  createMoon,
  createOrbitLine,
  createPlanet,
  createSaturnRing,
  createStars,
} from "./solarSystemObjects";
import { disposeObject } from "./threeUtils";
import "./ThreePlayground.css";

export default function ThreePlayground() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [selectedPlanet, setSelectedPlanet] = useState<{
    name: string;
    label: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const planets: {
      name: string;
      label: string;
      description: string;
      mesh: THREE.Mesh;
      distance: number;
      angle: number;
      orbitSpeed: number;
      rotationSpeed: number;
      inclination: number;
      ascendingNode: number;
    }[] = [];

    // 3D 공간 생성 (물체, 조명 넣는 곳)
    const scene = new THREE.Scene();

    // 별 생성
    const stars = createStars();
    scene.add(stars);

    // 원근감 카메라
    const camera = new THREE.PerspectiveCamera(
      60, // 시야각
      container.clientWidth / container.clientHeight, // 가로/세로 비율
      0.1, // 너무 가까우면 안 그림
      100, // 너무 멀면 안 그림
    );

    // 카메라 거리
    camera.position.set(8, 13, 20);
    camera.lookAt(0, 0, 0);

    // 카메라가 바라본 3D 장면을 캔버스에 그림, antialias: true 는 계단 현상을 줄여줌
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const findPlanetByObject = (object: THREE.Object3D) => {
      return planets.find((planet) => {
        let current: THREE.Object3D | null = object;

        while (current) {
          if (current === planet.mesh) return true;
          current = current.parent;
        }

        return false;
      });
    };

    const handleClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();

      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);

      const planetMeshes = planets.map((planet) => planet.mesh);
      const intersects = raycaster.intersectObjects(planetMeshes, true);

      if (intersects.length === 0) {
        setSelectedPlanet(null);
        return;
      }

      const selected = findPlanetByObject(intersects[0].object);

      if (!selected) return;

      setSelectedPlanet({
        name: selected.name,
        label: selected.label,
        description: selected.description,
      });
    };

    renderer.domElement.addEventListener("click", handleClick);

    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true; // 움직임을 부드럽게
    controls.dampingFactor = 0.05; // 움직임 관성정도

    controls.enableZoom = true;
    controls.minDistance = 2;
    controls.maxDistance = 35;

    controls.enablePan = true; // 우클릭/드래그로 화면 밀기 활성화

    const SUN_SIZE_SCALE = 0.12;
    const sunSize = Math.sqrt(109) * SUN_SIZE_SCALE;

    const textureLoader = new THREE.TextureLoader();
    const sunTexture = textureLoader.load("/textures/sun.jpg");
    sunTexture.colorSpace = THREE.SRGBColorSpace;

    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(sunSize, 64, 64),
      new THREE.MeshStandardMaterial({
        map: sunTexture,
        emissive: "#ff9f1c",
        emissiveMap: sunTexture,
        emissiveIntensity: 1.8,
        roughness: 1,
      }),
    );
    scene.add(sun);

    const sunGlow = new THREE.Mesh(
      new THREE.SphereGeometry(sunSize * 1.03, 32, 32),
      new THREE.MeshBasicMaterial({
        color: "#ffb347",
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    );

    sun.add(sunGlow);

    const sunLight = new THREE.PointLight("#fff4dc", 3.2, 80);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    planetConfigs.forEach((config) => {
      // 궤도
      const orbitLine = createOrbitLine(
        config.distance,
        config.inclination,
        config.ascendingNode,
      );
      scene.add(orbitLine);

      // 행성
      const mesh = createPlanet(config);

      // 토성 고리
      if (config.name === "saturn") {
        mesh.add(createSaturnRing(config.size));
      }

      scene.add(mesh);

      planets.push({
        name: config.name,
        label: config.label,
        description: config.description,
        mesh,
        distance: config.distance,
        angle: config.startAngle,
        orbitSpeed: config.orbitSpeed,
        rotationSpeed: config.rotationSpeed,
        inclination: config.inclination,
        ascendingNode: config.ascendingNode,
      });
    });

    const moon = createMoon();
    scene.add(moon);

    const ambientLight = new THREE.AmbientLight("#ffffff", 0.12);
    scene.add(ambientLight);

    let moonAngle = 0;
    const moonOrbitSpeed = 0.06;
    const moonDistance = 0.45;

    let animationId = 0;

    const earth = planets.find((planet) => planet.name === "earth");

    const getOrbitalPosition = (
      angle: number,
      distance: number,
      inclinationDegrees: number,
      ascendingNodeDegrees: number,
    ) => {
      const inclination = THREE.MathUtils.degToRad(inclinationDegrees);
      const ascendingNode = THREE.MathUtils.degToRad(ascendingNodeDegrees);

      const orbitalX = Math.cos(angle) * distance;
      const orbitalZ = Math.sin(angle) * distance;

      const rotatedX =
        orbitalX * Math.cos(ascendingNode) -
        orbitalZ * Math.cos(inclination) * Math.sin(ascendingNode);

      const rotatedY = orbitalZ * Math.sin(inclination);

      const rotatedZ =
        orbitalX * Math.sin(ascendingNode) +
        orbitalZ * Math.cos(inclination) * Math.cos(ascendingNode);

      return new THREE.Vector3(rotatedX, rotatedY, rotatedZ);
    };

    const animate = () => {
      if (earth) {
        moonAngle += moonOrbitSpeed;

        moon.position.x =
          earth.mesh.position.x + Math.cos(moonAngle) * moonDistance;

        moon.position.z =
          earth.mesh.position.z + Math.sin(moonAngle) * moonDistance;
      }
      sun.rotation.y += 0.002;
      stars.rotation.y += 0.0002;

      planets.forEach((planet) => {
        planet.mesh.rotation.y += planet.rotationSpeed;

        planet.angle += planet.orbitSpeed;

        const position = getOrbitalPosition(
          planet.angle,
          planet.distance,
          planet.inclination,
          planet.ascendingNode,
        );

        planet.mesh.position.copy(position);
      });

      controls.update();
      renderer.render(scene, camera);
      animationId = window.requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      renderer.domElement.removeEventListener("click", handleClick);

      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);

      controls.dispose();
      disposeObject(scene);
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="three-playground-wrapper">
      <div className="three-playground" ref={containerRef} />

      {selectedPlanet && (
        <aside className="planet-detail-panel">
          <button
            type="button"
            className="planet-detail-close"
            onClick={() => setSelectedPlanet(null)}
            aria-label="닫기"
          >
            ✖
          </button>

          <h2>{selectedPlanet.label}</h2>
          <p>{selectedPlanet.description}</p>
        </aside>
      )}
    </div>
  );
}
