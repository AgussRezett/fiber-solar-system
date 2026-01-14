import { useFrame, useThree } from '@react-three/fiber';
import { useRef, type RefObject } from 'react';
import * as THREE from 'three';

const VISIBILITY_EPSILON = 0.02;

const useOrbitPathOpacity = (
  planetRadius: number,
  planetRef: RefObject<THREE.Object3D | null>,
  orbitLineRef: RefObject<THREE.Line | null>
) => {
  const { camera } = useThree();
  const opacityRef = useRef(0);

  useFrame((state) => {
    if (!planetRef.current || !orbitLineRef.current) return;

    const planetPos = new THREE.Vector3();
    planetRef.current.getWorldPosition(planetPos);

    const distance = camera.position.distanceTo(planetPos);

    const { size } = state;
    const fov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 50;
    const fovRad = THREE.MathUtils.degToRad(fov);

    const planetDiameter = planetRadius * 2;
    const screenHeight = size.height;
    const distanceToCamera = Math.max(distance, 0.1);

    const apparentSize =
      (planetDiameter * screenHeight) /
      (distanceToCamera * Math.tan(fovRad / 2) * 2);

    const SHOW_THRESHOLD = 25;
    const MIN_SIZE = 5;

    let targetOpacity = 0;

    if (apparentSize > MIN_SIZE && apparentSize <= SHOW_THRESHOLD) {
      const t = (apparentSize - MIN_SIZE) / (SHOW_THRESHOLD - MIN_SIZE);
      targetOpacity = 1 - THREE.MathUtils.clamp(t, 0, 1);
    } else if (apparentSize <= MIN_SIZE) {
      targetOpacity = 1;
    }

    // suavizado
    opacityRef.current += (targetOpacity - opacityRef.current) * 0.1;

    const line = orbitLineRef.current;
    const material = line.material as THREE.LineBasicMaterial;

    // 🔑 VISIBILITY REAL
    if (opacityRef.current <= VISIBILITY_EPSILON) {
      line.visible = false;
      return;
    }

    // visible
    line.visible = true;
    material.transparent = true;
    material.opacity = opacityRef.current;
  });
};

export default useOrbitPathOpacity;
