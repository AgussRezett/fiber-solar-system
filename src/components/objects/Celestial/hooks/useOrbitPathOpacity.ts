import { useFrame, useThree } from '@react-three/fiber';
import { useRef, type RefObject } from 'react';
import * as THREE from 'three';

const useOrbitPathOpacity = (
  planetRadius: number,
  planetRef: RefObject<THREE.Object3D | null>,
  orbitLineRef: RefObject<THREE.Line | null>
) => {
  const { camera } = useThree();
  const opacityRef = useRef(0);

  useFrame((state) => {
    if (!planetRef.current || !orbitLineRef.current) return;

    const worldPosition = new THREE.Vector3();
    planetRef.current.getWorldPosition(worldPosition);

    const distance = camera.position.distanceTo(worldPosition);

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

    let opacity = 0;

    if (apparentSize > MIN_SIZE && apparentSize <= SHOW_THRESHOLD) {
      const t = (apparentSize - MIN_SIZE) / (SHOW_THRESHOLD - MIN_SIZE);
      opacity = 1 - THREE.MathUtils.clamp(t, 0, 1);
    } else if (apparentSize <= MIN_SIZE) {
      opacity = 1;
    }

    opacityRef.current += (opacity - opacityRef.current) * 0.1;

    const material = orbitLineRef.current.material as THREE.LineBasicMaterial;

    material.opacity = opacityRef.current;
    material.transparent = true;
  });
};

export default useOrbitPathOpacity;
