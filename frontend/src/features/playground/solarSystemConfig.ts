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
        label: "수성",
        description: "태양에 가장 가까운 행성입니다. 대기가 거의 없어 낮과 밤의 온도 차이가 매우 큽니다.",
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
        label: "금성",
        description: "두꺼운 이산화탄소 대기와 강한 온실 효과를 가진 행성입니다. 표면 온도가 태양계 행성 중 가장 높습니다.",
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
        label: "지구",
        description: "액체 상태의 물과 생명체가 존재하는 것으로 알려진 유일한 행성입니다. 대기와 자기장이 표면 환경을 보호합니다.",
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
        label: "화성",
        description: "붉은 산화철 먼지로 덮인 행성입니다. 과거에 물이 흘렀던 흔적이 발견되어 탐사 대상이 되고 있습니다.",
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
        label: "목성",
        description: "태양계에서 가장 큰 행성입니다. 거대한 대기 소용돌이인 대적점과 많은 위성을 가지고 있습니다.",
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
        label: "토성",
        description: "크고 뚜렷한 고리로 유명한 가스 행성입니다. 고리는 얼음과 암석 조각들로 이루어져 있습니다.",
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
        label: "천왕성",
        description: "자전축이 크게 기울어져 옆으로 누운 채 도는 것처럼 보이는 얼음 행성입니다. 푸른빛은 대기의 메탄 때문입니다.",
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
        label: "해왕성",
        description: "태양에서 가장 멀리 있는 행성입니다. 강한 바람과 짙은 푸른색 대기를 가진 얼음 행성입니다.",
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