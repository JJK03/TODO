import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./ThreePlayground.css";

export default function ThreePlayground() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    const planetConfigs = [
      {
        name: "mercury",
        size: 0.12,
        distance: 1.1,
        color: "#a6a6a6",
        orbitSpeed: 0.025,
        rotationSpeed: 0.02,
        startAngle: 0.2,
      },
      {
        name: "venus",
        size: 0.2,
        distance: 1.6,
        color: "#d8b26e",
        orbitSpeed: 0.018,
        rotationSpeed: 0.012,
        startAngle: 1.1,
      },
      {
        name: "earth",
        size: 0.22,
        distance: 2.1,
        color: "#3b82f6",
        orbitSpeed: 0.014,
        rotationSpeed: 0.03,
        startAngle: 2.4,
      },
      {
        name: "mars",
        size: 0.18,
        distance: 2.7,
        color: "#d97745",
        orbitSpeed: 0.011,
        rotationSpeed: 0.025,
        startAngle: 3.0,
      },
      {
        name: "jupiter",
        size: 0.45,
        distance: 3.6,
        color: "#d6a36a",
        orbitSpeed: 0.007,
        rotationSpeed: 0.04,
        startAngle: 4.2,
      },
      {
        name: "saturn",
        size: 0.38,
        distance: 4.6,
        color: "#e5c77f",
        orbitSpeed: 0.005,
        rotationSpeed: 0.035,
        startAngle: 5.1,
      },
      {
        name: "uranus",
        size: 0.3,
        distance: 5.5,
        color: "#7dd3fc",
        orbitSpeed: 0.0035,
        rotationSpeed: 0.025,
        startAngle: 5.8,
      },
      {
        name: "neptune",
        size: 0.3,
        distance: 6.3,
        color: "#2563eb",
        orbitSpeed: 0.0028,
        rotationSpeed: 0.022,
        startAngle: 0.9,
      },
    ];

    const planets: {
      mesh: THREE.Mesh;
      distance: number;
      angle: number;
      orbitSpeed: number;
      rotationSpeed: number;
    }[] = [];

    const disposeMesh = (mesh: THREE.Mesh) => {
      mesh.geometry.dispose();

      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((material) => material.dispose());
      } else {
        mesh.material.dispose();
      }
    };

    // 3D 공간 생성 (물체, 조명 넣는 곳)
    const scene = new THREE.Scene();

    const starGeometry = new THREE.BufferGeometry();
    const starCount = 800;
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;

      starPositions[i3] = (Math.random() - 0.5) * 40; // x
      starPositions[i3 + 1] = (Math.random() - 0.5) * 20; // y
      starPositions[i3 + 2] = (Math.random() - 0.5) * 40; // z
    }

    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3),
    );

    const starMaterial = new THREE.PointsMaterial({
      color: "#ffffff",
      size: 0.035,
      sizeAttenuation: true,
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
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
      const orbit = new THREE.Group();
      scene.add(orbit);

      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(config.size, 32, 32),
        new THREE.MeshStandardMaterial({
          color: config.color,
          roughness: 0.6,
        }),
      );

      mesh.position.x = Math.cos(config.startAngle) * config.distance;
      mesh.position.z = Math.sin(config.startAngle) * config.distance;

      orbit.add(mesh);

      planets.push({
        mesh,
        distance: config.distance,
        angle: config.startAngle,
        orbitSpeed: config.orbitSpeed,
        rotationSpeed: config.rotationSpeed,
      });
    });

    const ambientLight = new THREE.AmbientLight("#ffffff", 0.25);
    scene.add(ambientLight);

    let animationId = 0;

    const animate = () => {
      sun.rotation.y += 0.004;
      stars.rotation.y += 0.0002;

      planets.forEach((planet) => {
        planet.mesh.rotation.y += planet.rotationSpeed;

        planet.angle += planet.orbitSpeed;
        planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
        planet.mesh.position.y = Math.sin(planet.angle) * planet.distance;
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

      scene.remove(stars);
      starGeometry.dispose();
      starMaterial.dispose();

      disposeMesh(sun);
      planets.forEach((planet) => disposeMesh(planet.mesh));

      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="three-playground" ref={containerRef} />;
}
