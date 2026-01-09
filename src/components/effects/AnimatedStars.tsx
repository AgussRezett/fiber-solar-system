import { Stars } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';

const AnimatedStars = () => {
  //eslint-disable-next-line
  const starsRef = useRef<any>(null);

  useFrame(() => {
    if (!starsRef.current) return;

    starsRef.current.rotation.x += 0.0001;
    starsRef.current.rotation.y += 0.0001;
    starsRef.current.rotation.z += 0.0001;
  });

  return (
    <Suspense fallback={null}>
      <Stars
        ref={starsRef}
        radius={20}
        depth={90}
        count={1000}
        factor={4}
        saturation={0}
        fade
        speed={0}
      />
    </Suspense>
  );
};

export default AnimatedStars;
