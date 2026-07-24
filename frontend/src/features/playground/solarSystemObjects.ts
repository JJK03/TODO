import * as THREE from "three";

export type PlanetConfig = {
    name: string;
    label: string;
    description: string;
    size: number;
    distance: number;
    color: string;
    texture: string;
    orbitSpeed: number;
    rotationSpeed: number;
    startAngle: number;
    inclination: number;
    ascendingNode: number;
};

const textureLoader = new THREE.TextureLoader();

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

export const createOrbitLine = (
    distance: number,
    inclinationDegrees = 0,
    ascendingNodeDegrees = 0,
) => {
    const orbitGeometry = new THREE.BufferGeometry();
    const orbitPoints: THREE.Vector3[] = [];
    const segmentCount = 128;

    const inclination = THREE.MathUtils.degToRad(inclinationDegrees);
    const ascendingNode = THREE.MathUtils.degToRad(ascendingNodeDegrees);

    for (let i = 0; i <= segmentCount; i += 1) {
        const angle = (i / segmentCount) * Math.PI * 2;

        const orbitalX = Math.cos(angle) * distance;
        const orbitalZ = Math.sin(angle) * distance;

        const rotatedX =
            orbitalX * Math.cos(ascendingNode) -
            orbitalZ * Math.cos(inclination) * Math.sin(ascendingNode);

        const rotatedY = orbitalZ * Math.sin(inclination);

        const rotatedZ =
            orbitalX * Math.sin(ascendingNode) +
            orbitalZ * Math.cos(inclination) * Math.cos(ascendingNode);

        orbitPoints.push(new THREE.Vector3(rotatedX, rotatedY, rotatedZ));
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
    const texture = textureLoader.load(config.texture);
    texture.colorSpace = THREE.SRGBColorSpace;

    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(config.size, 32, 32),
        new THREE.MeshStandardMaterial({
            map: texture,
            color: "#ffffff",
            roughness: 0.75,
        }),
    );

    const hitArea = new THREE.Mesh(
        new THREE.SphereGeometry(Math.max(config.size * 2.2, 0.35), 16, 16),
        new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0,
            depthWrite: false,
        }),
    );

    hitArea.name = `${config.name}-hit-area`;
    mesh.add(hitArea);

    mesh.position.x = Math.cos(config.startAngle) * config.distance;
    mesh.position.z = Math.sin(config.startAngle) * config.distance;

    return mesh;
};

export const createSaturnRing = (planetSize: number) => {
    const group = new THREE.Group();

    const rings = [
        { inner: 1.35, outer: 1.55, color: "#c7b06b", opacity: 0.65 },
        { inner: 1.58, outer: 1.85, color: "#e0cf91", opacity: 0.75 },
        { inner: 1.9, outer: 2.15, color: "#8f7a52", opacity: 0.45 },
        { inner: 2.18, outer: 2.42, color: "#d8c48a", opacity: 0.6 },
    ];

    rings.forEach((ringConfig) => {
        const ring = new THREE.Mesh(
            new THREE.RingGeometry(
                planetSize * ringConfig.inner,
                planetSize * ringConfig.outer,
                128,
            ),
            new THREE.MeshStandardMaterial({
                color: ringConfig.color,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: ringConfig.opacity,
                roughness: 0.8,
            }),
        );

        ring.rotation.x = Math.PI / 2.8;
        group.add(ring);
    });

    return group;
};

export const createMoon = () => {
    const moonTexture = textureLoader.load("/textures/moon.jpg");
    moonTexture.colorSpace = THREE.SRGBColorSpace;

    return new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 32, 32),
        new THREE.MeshStandardMaterial({
            map: moonTexture,
            color: "#",
            roughness: 0.85,
        }),
    );
};