import { useFrame, useThree } from '@react-three/fiber';
import { useRef, type RefObject } from 'react';
import * as THREE from 'three';
import { DISTANCE_KM_TO_UNITS } from '../../../../consts/scales';

const VISIBILITY_EPSILON = 0.02;

interface Params {
  referenceRadiusKm: number;
  orbitCenterRef: RefObject<THREE.Object3D | null>;
  orbitLineRef: RefObject<THREE.Line | null>;
}

const useOrbitPathOpacity = ({
  referenceRadiusKm,
  orbitCenterRef,
  orbitLineRef,
}: Params) => {
  const { camera, size } = useThree();
  const opacityRef = useRef(0);
  const centerPos = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!orbitCenterRef.current || !orbitLineRef.current) return;

    orbitCenterRef.current.getWorldPosition(centerPos.current);

    const distance = camera.position.distanceTo(centerPos.current);

    const fov = camera instanceof THREE.PerspectiveCamera ? camera.fov : 50;
    const fovRad = THREE.MathUtils.degToRad(fov);

    const planetDiameter = referenceRadiusKm * 2 * DISTANCE_KM_TO_UNITS;

    const distanceToCamera = Math.max(distance, 0.1);

    const apparentSize =
      (planetDiameter * size.height) /
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

    if (opacityRef.current <= VISIBILITY_EPSILON) {
      line.visible = false;
      return;
    }

    line.visible = true;
    material.transparent = true;
    material.opacity = opacityRef.current;
  });
};

export default useOrbitPathOpacity;
