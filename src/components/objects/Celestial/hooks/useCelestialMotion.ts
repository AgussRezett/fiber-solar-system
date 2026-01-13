import { useFrame } from '@react-three/fiber';
import type { RefObject } from 'react';
import type { Group, Mesh } from 'three';

type Props = {
  orbitRef: RefObject<Group | null>;
  meshRef: RefObject<Mesh | null>;
  cloudRef: RefObject<Group | null>;
  orbitSpeed: number;
  rotationSpeed: number;
  hasClouds: boolean;
};

export const useCelestialMotion = ({
  orbitRef,
  meshRef,
  cloudRef,
  orbitSpeed,
  rotationSpeed,
  hasClouds,
}: Props) => {
  useFrame((_, delta) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += orbitSpeed * delta * 0.1;
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed * delta;
    }

    if (cloudRef.current && hasClouds) {
      cloudRef.current.rotation.y += rotationSpeed * delta;
    }
  });
};
