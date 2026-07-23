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
      name: string;
      mesh: THREE.Mesh;
      distance: number;
      angle: number;
      orbitSpeed: number;
      rotationSpeed: number;
    }[] = [];

    const disposeMaterial = (material: THREE.Material | THREE.Material[]) => {
      if (Array.isArray(material)) {
        material.forEach((item) => item.dispose());
      } else {
        material.dispose();
      }
    };

    const disposeObject = (object: THREE.Object3D) => {
      object.traverse((child) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.Line) {
          child.geometry.dispose();
          disposeMaterial(child.material);
        }

        if (child instanceof THREE.Points) {
          child.geometry.dispose();
          disposeMaterial(child.material);
        }
      });
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
      const orbitGeometry = new THREE.BufferGeometry();
      const orbitPoints = [];
      const segmentCount = 128;

      for (let i = 0; i <= segmentCount; i++) {
        const angle = (i / segmentCount) * Math.PI * 2;

        orbitPoints.push(
          new THREE.Vector3(
            Math.cos(angle) * config.distance,
            0,
            Math.sin(angle) * config.distance,
          ),
        );
      }

      orbitGeometry.setFromPoints(orbitPoints);

      const orbitLine = new THREE.Line(
        orbitGeometry,
        new THREE.LineBasicMaterial({
          color: "#ffffff",
          transparent: true,
          opacity: 0.25,
        }),
      );

      scene.add(orbitLine);

      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(config.size, 32, 32),
        new THREE.MeshStandardMaterial({
          color: config.color,
          roughness: 0.6,
        }),
      );

      if (config.name === "saturn") {
        const ringGeometry = new THREE.RingGeometry(
          config.size * 1.35,
          config.size * 2.1,
          96,
        );

        const ringMaterial = new THREE.MeshStandardMaterial({
          color: "#d8c48a",
          roughness: 0.7,
          metalness: 0.05,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.85,
        });

        const ring = new THREE.Mesh(ringGeometry, ringMaterial);

        ring.rotation.x = Math.PI / 2.8;

        mesh.add(ring);
      }

      mesh.position.x = Math.cos(config.startAngle) * config.distance;
      mesh.position.z = Math.sin(config.startAngle) * config.distance;

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

    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 16, 16),
      new THREE.MeshStandardMaterial({
        color: "#cfd4d8",
        roughness: 0.7,
      }),
    );
    scene.add(moon);

    const ambientLight = new THREE.AmbientLight("#ffffff", 0.25);
    scene.add(ambientLight);

    let moonAngle = 0;
    const moonOrbitSpeed = 0.06;
    const moonDistance = 0.45;

    let animationId = 0;

    const animate = () => {
      const earth = planets.find((planet) => planet.name === "earth");

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
