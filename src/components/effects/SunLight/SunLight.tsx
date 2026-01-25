import { useHelper } from '@react-three/drei';
import { useRef } from 'react';
import { PointLightHelper, type PointLight } from 'three';

const SunLight = () => {
  const pointerLightRef = useRef<PointLight>(null!);
  useHelper(pointerLightRef, PointLightHelper, 1000, 'yellow');

  return (
    <>
      <pointLight
        position={[0, 0, 0]}
        intensity={2}
        distance={0}
        decay={0}
        color="#ffffff"
        ref={pointerLightRef}
      />
      <ambientLight intensity={0.08} />
    </>
  );
};

export default SunLight;
