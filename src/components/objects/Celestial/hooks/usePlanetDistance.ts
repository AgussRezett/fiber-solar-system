import { useFrame, useThree } from '@react-three/fiber';
import { useRef, type RefObject } from 'react';
import * as THREE from 'three';

const usePlanetDistance = (
  planetRadius: number,
  planetCircleRef: RefObject<THREE.Group | null>,
  planetLabelRef: RefObject<HTMLDivElement | null>
) => {
  const { camera } = useThree();
  const opacityRef = useRef(0);

  useFrame((state) => {
    if (!planetCircleRef.current || !planetLabelRef.current) return;

    const worldPosition = new THREE.Vector3();
    planetCircleRef.current.getWorldPosition(worldPosition);

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
      const normalizedSize =
        (apparentSize - MIN_SIZE) / (SHOW_THRESHOLD - MIN_SIZE);
      const t = Math.max(0, Math.min(1, normalizedSize));
      opacity = 1 - t;
    } else if (apparentSize <= MIN_SIZE) {
      opacity = 1;
    }

    opacityRef.current += (opacity - opacityRef.current) * 0.1;

    planetLabelRef.current.style.opacity = opacityRef.current.toString();
    planetLabelRef.current.style.pointerEvents =
      opacityRef.current > 0.1 ? 'auto' : 'none';
  });
};

export default usePlanetDistance;
