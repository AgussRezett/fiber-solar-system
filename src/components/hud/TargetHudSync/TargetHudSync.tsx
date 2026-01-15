import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useCameraStore } from '../../../store/useCameraStore';
import celestialObjects from '../../../data/solarSystem.json';
import { useRef, useMemo } from 'react';

export const useTargetHudSync = () => {
  const { camera } = useThree();
  const { focusTarget, focusTargetId, setTargetHud } = useCameraStore();

  const opacityRef = useRef(0);
  const lastDistanceRef = useRef<number | null>(null);
  const lastVisibleRef = useRef<boolean>(false);

  const targetPos = useRef(new THREE.Vector3());

  const currentPlanet = useMemo(
    () => celestialObjects.find((obj) => obj.id === focusTargetId),
    [focusTargetId]
  );

  useFrame(() => {
    if (!focusTarget) {
      opacityRef.current += (0 - opacityRef.current) * 0.08;

      const visible = opacityRef.current > 0.01;

      // 🚫 No actualizamos si no cambió nada relevante
      if (
        visible === lastVisibleRef.current &&
        Math.abs(opacityRef.current) < 0.001
      ) {
        return;
      }

      lastVisibleRef.current = visible;

      setTargetHud({
        visible,
        opacity: opacityRef.current,
      });

      return;
    }

    focusTarget.getWorldPosition(targetPos.current);
    const distance = camera.position.distanceTo(targetPos.current);

    opacityRef.current += (1 - opacityRef.current) * 0.08;

    const distanceChanged =
      lastDistanceRef.current === null ||
      Math.abs(distance - lastDistanceRef.current) > 1; // 1 km

    const opacityChanged = Math.abs(opacityRef.current - 1) > 0.001;

    if (!distanceChanged && !opacityChanged && lastVisibleRef.current) {
      return;
    }

    lastDistanceRef.current = distance;
    lastVisibleRef.current = true;

    setTargetHud({
      visible: true,
      opacity: opacityRef.current,
      distance,
      name: currentPlanet?.name ?? 'UNKNOWN',
      type: currentPlanet?.type ?? 'BODY',
      radiusKm: currentPlanet?.radiusKm,
    });
  });
};
