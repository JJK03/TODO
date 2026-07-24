import type { PlanetConfig } from "./solarSystemObjects";

const ORBIT_DISTANCE_SCALE = 2.4; // 공전 궤도
const PLANET_SIZE_SCALE = 0.22; // 행성 크기
const EARTH_ORBIT_SPEED = 0.015 // 지구 공전 속도

const scaleOrbitDistance = (au: number) => {
    return Math.sqrt(au) * ORBIT_DISTANCE_SCALE;
}

const scalePlanetSize = (earthRadiusRatio: number) => {
    return Math.sqrt(earthRadiusRatio) * PLANET_SIZE_SCALE;
}

const scaleOrbitSpeed = (orbitalPeriodDays: number) => {
    return EARTH_ORBIT_SPEED * (365.25 / orbitalPeriodDays);
}

export const planetConfigs: PlanetConfig[] = [
    {
        name: "mercury",
        size: scalePlanetSize(0.383),
        distance: scaleOrbitDistance(0.39),
        color: "#a6a6a6",
        orbitSpeed: scaleOrbitSpeed(87.97),
        rotationSpeed: 0.02,
        startAngle: 0.2,
        inclination: 7.0,
        ascendingNode: 48.33,
    },
    {
        name: "venus",
        size: scalePlanetSize(0.949),
        distance: scaleOrbitDistance(0.72),
        color: "#d8b26e",
        orbitSpeed: scaleOrbitSpeed(224.7),
        rotationSpeed: 0.012,
        startAngle: 1.1,
        inclination: 3.39,
        ascendingNode: 76.68,
    },
    {
        name: "earth",
        size: scalePlanetSize(1),
        distance: scaleOrbitDistance(1),
        color: "#3b82f6",
        orbitSpeed: scaleOrbitSpeed(365.25),
        rotationSpeed: 0.03,
        startAngle: 2.4,
        inclination: 0,
        ascendingNode: 0,
    },
    {
        name: "mars",
        size: scalePlanetSize(0.532),
        distance: scaleOrbitDistance(1.52),
        color: "#d97745",
        orbitSpeed: scaleOrbitSpeed(686.98),
        rotationSpeed: 0.025,
        startAngle: 3.0,
        inclination: 1.85,
        ascendingNode: 49.56,
    },
    {
        name: "jupiter",
        size: scalePlanetSize(11.21),
        distance: scaleOrbitDistance(5.2),
        color: "#d6a36a",
        orbitSpeed: scaleOrbitSpeed(4332.59),
        rotationSpeed: 0.04,
        startAngle: 4.2,
        inclination: 1.3,
        ascendingNode: 100.46,
    },
    {
        name: "saturn",
        size: scalePlanetSize(9.45),
        distance: scaleOrbitDistance(9.58),
        color: "#e5c77f",
        orbitSpeed: scaleOrbitSpeed(10759.22),
        rotationSpeed: 0.035,
        startAngle: 5.1,
        inclination: 2.49,
        ascendingNode: 113.72,
    },
    {
        name: "uranus",
        size: scalePlanetSize(4.01),
        distance: scaleOrbitDistance(19.2),
        color: "#7dd3fc",
        orbitSpeed: scaleOrbitSpeed(30688.5),
        rotationSpeed: 0.025,
        startAngle: 5.8,
        inclination: 0.77,
        ascendingNode: 74.01,
    },
    {
        name: "neptune",
        size: scalePlanetSize(3.88),
        distance: scaleOrbitDistance(30.05),
        color: "#2563eb",
        orbitSpeed: scaleOrbitSpeed(60182),
        rotationSpeed: 0.022,
        startAngle: 0.9,
        inclination: 1.77,
        ascendingNode: 131.78,
    },
] as const;