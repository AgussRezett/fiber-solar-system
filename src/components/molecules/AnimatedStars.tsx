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
  /* return null; */
  return (
    <Suspense fallback={null}>
      <Stars
        ref={starsRef}
        radius={50}
        depth={10}
        count={800}
        factor={2}
        saturation={0}
        fade
        speed={1}
      />
    </Suspense>
  );
};

export default AnimatedStars;
