import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./ThreePlayground.css";

export default function ThreePlayground() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // 3D 공간 생성 (물체, 조명 넣는 곳)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#18322f");

    // 원근감 카메라
    const camera = new THREE.PerspectiveCamera(
      60, // 시야각
      container.clientWidth / container.clientHeight, // 가로/세로 비율
      0.1, // 너무 가까우면 안 그림
      100, // 너무 멀면 안 그림
    );
    camera.position.z = 4;
    
    // 카메라가 바라본 3D 장면을 캔버스에 그림, antialias: true 는 계단 현상을 줄여줌
    const renderer = new THREE.WebGLRenderer({ antialias: true }); 
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1.2, 0); // 물체 모양 (각진 다면체)
    const material = new THREE.MeshStandardMaterial({ // 물체 재질
      color: "#ff00001a",
      roughness: 0.35,
      metalness: 0.15,
    });

    const mesh = new THREE.Mesh(geometry, material); // 위 geometry, meterial의 속성을 가진 Mesh(물체)
    scene.add(mesh);

    const mainLight = new THREE.DirectionalLight("#ffffff", 2);
    mainLight.position.set(3, 3, 4);
    scene.add(mainLight);

    const ambientLight = new THREE.AmbientLight("#ffffff", 0.7);
    scene.add(ambientLight);

    let animationId = 0;

    const animate = () => {
      mesh.rotation.x += 0.011;
      mesh.rotation.y += 0.011;

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

      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="three-playground" ref={containerRef} />;
}
