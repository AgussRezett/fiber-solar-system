import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMERA_ORBIT_MODE } from '../../../types/cameraModes.type';
import { useCameraStore } from '../../../store/useCameraStore';

export const useOrbitFollow = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controlsRef: any
) => {
  const { cameraMode, focusTarget } = useCameraStore();

  // ───────── ORBIT FOLLOW TARGET ─────────
  useFrame(() => {
    if (
      cameraMode === CAMERA_ORBIT_MODE &&
      focusTarget &&
      controlsRef.current
    ) {
      const worldPos = new THREE.Vector3();
      focusTarget.getWorldPosition(worldPos);
      controlsRef.current.target.copy(worldPos);
      controlsRef.current.update();
    }
  });
};
