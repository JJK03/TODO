import * as THREE from "three";

export type PlanetConfig = {
    name: string;
    size: number;
    distance: number;
    color: string;
    orbitSpeed: number;
    rotationSpeed: number;
    startAngle: number;
};

export const createStars = () => {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 800;
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i += 1) {
        const i3 = i * 3;

        starPositions[i3] = (Math.random() - 0.5) * 40;
        starPositions[i3 + 1] = (Math.random() - 0.5) * 20;
        starPositions[i3 + 2] = (Math.random() - 0.5) * 40;
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

    return new THREE.Points(starGeometry, starMaterial);
};

export const createOrbitLine = (distance: number) => {
    const orbitGeometry = new THREE.BufferGeometry();
    const orbitPoints: THREE.Vector3[] = [];
    const segmentCount = 128;

    for (let i = 0; i <= segmentCount; i += 1) {
        const angle = (i / segmentCount) * Math.PI * 2;

        orbitPoints.push(
            new THREE.Vector3(
                Math.cos(angle) * distance,
                0,
                Math.sin(angle) * distance,
            ),
        );
    }

    orbitGeometry.setFromPoints(orbitPoints);

    return new THREE.Line(
        orbitGeometry,
        new THREE.LineBasicMaterial({
            color: "#ffffff",
            transparent: true,
            opacity: 0.25,
        }),
    );
};

export const createPlanet = (config: PlanetConfig) => {
    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(config.size, 32, 32),
        new THREE.MeshStandardMaterial({
            color: config.color,
            roughness: 0.6,
        }),
    );

    mesh.position.x = Math.cos(config.startAngle) * config.distance;
    mesh.position.z = Math.sin(config.startAngle) * config.distance;

    return mesh;
};

export const createSaturnRing = (planetSize: number) => {
    const ring = new THREE.Mesh(
        new THREE.RingGeometry(planetSize * 1.35, planetSize * 2.1, 96),
        new THREE.MeshStandardMaterial({
            color: "#d8c48a",
            roughness: 0.7,
            metalness: 0.05,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.85,
        }),
    );

    ring.rotation.x = Math.PI / 2.8;

    return ring;
};

export const createMoon = () => {
    return new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 16, 16),
        new THREE.MeshStandardMaterial({
            color: "#cfd4d8",
            roughness: 0.7,
        }),
    );
};