import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  CAMERA_ORBIT_MODE,
  CAMERA_TRANSITION_MODE,
} from '../../../types/cameraModes.type';
import { useEffect, useRef } from 'react';
import { useCameraStore } from '../../../store/useCameraStore';
import { useCameraSettingsStore } from '../../../store/useCameraSettingsStore';

export const useCameraTransition = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controlsRef: any
) => {
  const { camera } = useThree();
  const { cameraMode, focusTarget, setCameraMode } = useCameraStore();
  const { transitionSpeed } = useCameraSettingsStore();

  const startOrbitTransition = (target: THREE.Object3D) => {
    const targetPos = new THREE.Vector3();
    target.getWorldPosition(targetPos);

    // tamaño del cuerpo
    const box = new THREE.Box3().setFromObject(target);
    const size = new THREE.Vector3();
    box.getSize(size);
    const radius = Math.max(size.x, size.y, size.z) * 0.5;

    const computeOrbitDistance = (r: number) => {
      const MIN = 6;
      const SCALE = 24;
      return MIN + Math.log(r + 1) * SCALE;
    };

    const distance = computeOrbitDistance(radius);

    // dirección actual cámara → planeta
    const direction = new THREE.Vector3()
      .subVectors(camera.position, targetPos)
      .normalize();

    if (direction.lengthSq() === 0) direction.set(0, 0, 1);

    const endPos = targetPos.clone().add(direction.multiplyScalar(distance));

    const dummyCam = camera.clone();
    dummyCam.position.copy(endPos);
    dummyCam.lookAt(targetPos);

    transition.current = {
      startPos: camera.position.clone(),
      endPos,
      startQuat: camera.quaternion.clone(),
      endQuat: dummyCam.quaternion.clone(),
      progress: 0,
    };

    setCameraMode(CAMERA_TRANSITION_MODE);
  };

  useEffect(() => {
    if (cameraMode !== CAMERA_TRANSITION_MODE) return;
    if (!focusTarget) return;

    startOrbitTransition(focusTarget);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraMode, focusTarget, transitionSpeed]);

  // ───────────── Movement (TRANSITION) ─────────────
  const transition = useRef<{
    startPos: THREE.Vector3;
    endPos: THREE.Vector3;
    startQuat: THREE.Quaternion;
    endQuat: THREE.Quaternion;
    progress: number;
  } | null>(null);

  useFrame((_, delta) => {
    if (cameraMode !== CAMERA_TRANSITION_MODE) return;
    if (!transition.current) return;

    const t = transition.current;

    t.progress = Math.min(t.progress + delta * transitionSpeed, 1);

    const eased = t.progress * t.progress * (3 - 2 * t.progress); // smoothstep

    camera.position.lerpVectors(t.startPos, t.endPos, eased);
    camera.quaternion.slerpQuaternions(t.startQuat, t.endQuat, eased);

    if (t.progress === 1) {
      transition.current = null;

      if (focusTarget && controlsRef.current) {
        const worldPos = new THREE.Vector3();
        focusTarget.getWorldPosition(worldPos);
        controlsRef.current.target.copy(worldPos);
        controlsRef.current.update();
      }

      setCameraMode(CAMERA_ORBIT_MODE);
    }
  });
};
