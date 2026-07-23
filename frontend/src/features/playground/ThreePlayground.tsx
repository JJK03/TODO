import { useEffect, useRef } from "react";
import * as THREE from "three";
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

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const planets: {
      name: string;
      mesh: THREE.Mesh;
      distance: number;
      angle: number;
      orbitSpeed: number;
      rotationSpeed: number;
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
    camera.position.set(0, 12, 0);
    camera.lookAt(0, 0, 0);

    // 카메라가 바라본 3D 장면을 캔버스에 그림, antialias: true 는 계단 현상을 줄여줌
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 32, 32),
      new THREE.MeshStandardMaterial({
        color: "#ffcc33",
        emissive: "#ff9900",
        emissiveIntensity: 1.2,
      }),
    );
    scene.add(sun);

    const sunLight = new THREE.PointLight("#ffffff", 2, 20);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    planetConfigs.forEach((config) => {
      // 궤도
      const orbitLine = createOrbitLine(config.distance);
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
        mesh,
        distance: config.distance,
        angle: config.startAngle,
        orbitSpeed: config.orbitSpeed,
        rotationSpeed: config.rotationSpeed,
      });
    });

    const moon = createMoon();
    scene.add(moon);

    const ambientLight = new THREE.AmbientLight("#ffffff", 0.25);
    scene.add(ambientLight);

    let moonAngle = 0;
    const moonOrbitSpeed = 0.06;
    const moonDistance = 0.45;

    let animationId = 0;

    const earth = planets.find((planet) => planet.name === "earth");

    const animate = () => {
      if (earth) {
        moonAngle += moonOrbitSpeed;

        moon.position.x =
          earth.mesh.position.x + Math.cos(moonAngle) * moonDistance;

        moon.position.z =
          earth.mesh.position.z + Math.sin(moonAngle) * moonDistance;
      }
      sun.rotation.y += 0.004;
      stars.rotation.y += 0.0002;

      planets.forEach((planet) => {
        planet.mesh.rotation.y += planet.rotationSpeed;

        planet.angle += planet.orbitSpeed;
        planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
        planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
      });

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
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);

      disposeObject(scene);

      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="three-playground" ref={containerRef} />;
}
