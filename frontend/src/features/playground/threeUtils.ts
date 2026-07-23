import * as THREE from "three";

export const disposeMaterial = (material: THREE.Material | THREE.Material[]) => {
    if (Array.isArray(material)) {
        material.forEach((item) => item.dispose());
    } else {
        material.dispose();
    }
};

export const disposeObject = (object: THREE.Object3D) => {
    object.traverse((child) => {
        if (
            child instanceof THREE.Mesh ||
            child instanceof THREE.Line ||
            child instanceof THREE.Points
        ) {
            child.geometry.dispose();
            disposeMaterial(child.material);
        }
    });
};