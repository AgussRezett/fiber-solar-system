import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export const useCelestialHover = (
  meshRef: React.RefObject<THREE.Mesh | null>,
  baseShininess: number
) => {
  const hoverTarget = useRef(0);
  const hoverValue = useRef(0);

  useFrame((_, delta) => {
    const speed = 4;
    hoverValue.current +=
      (hoverTarget.current - hoverValue.current) * delta * speed;

    const eased = 0.5 - 0.5 * Math.cos(Math.PI * hoverValue.current);

    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshPhongMaterial;

      mat.emissive.set('#ffffff');
      mat.emissiveIntensity = eased * 0.15;
      mat.shininess = baseShininess + eased * 40;
    }
  });

  return {
    onHoverStart: () => (hoverTarget.current = 1),
    onHoverEnd: () => (hoverTarget.current = 0),
  };
};
