import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import type { Group, Mesh } from 'three';

const ROTATION_TIME_SCALE = 2000; // 👈 ajustable

type Props = {
  meshRef: React.RefObject<Mesh | null>;
  cloudRef?: React.RefObject<Group | null>;
  rotationPeriodHours?: number;
};

export const useCelestialMotion = ({
  meshRef,
  cloudRef,
  rotationPeriodHours,
}: Props) => {
  const angularSpeed = useRef(0);

  useEffect(() => {
    if (rotationPeriodHours && rotationPeriodHours > 0) {
      angularSpeed.current = (Math.PI * 2) / (rotationPeriodHours * 3600);
    } else {
      angularSpeed.current = 0;
    }
  }, [rotationPeriodHours]);

  useFrame((_, delta) => {
    const rotationDelta = angularSpeed.current * delta * ROTATION_TIME_SCALE;

    if (meshRef.current) {
      meshRef.current.rotation.y += rotationDelta;
    }

    if (cloudRef?.current) {
      cloudRef.current.rotation.y += rotationDelta * 1.05;
    }
  });
};
