import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

type PlanetProps = {
  radius: number;
  distance: number;
  speed: number;
  initialAngle: number;
};

const Planet = ({ radius, distance, speed, initialAngle }: PlanetProps) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + initialAngle;
    ref.current?.position.set(
      Math.cos(t) * distance,
      Math.sin(t) * distance,
      0
    );
  });

  return (
    <mesh ref={ref}>
      <circleGeometry args={[radius, 32]} />
      <meshBasicMaterial color="#ffffff" />
    </mesh>
  );
};

const Orbit = ({ radius }: { radius: number }) => (
  <mesh>
    <ringGeometry args={[radius - 0.002, radius + 0.002, 128]} />
    <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
  </mesh>
);

// Definimos planetas con posición y velocidad aleatoria
const planets = [
  {
    radius: 0.06,
    distance: 0.9,
    speed: 0.9,
    initialAngle: Math.random() * Math.PI * 2,
  },
  {
    radius: 0.08,
    distance: 1.4,
    speed: 0.6,
    initialAngle: Math.random() * Math.PI * 2,
  },
  {
    radius: 0.07,
    distance: 1.9,
    speed: 0.4,
    initialAngle: Math.random() * Math.PI * 2,
  },
];

const MiniSolarSystem = () => {
  return (
    <group>
      {/* Sol */}
      <mesh>
        <circleGeometry args={[0.25, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Órbitas */}
      {planets.map((p, i) => (
        <Orbit key={i} radius={p.distance} />
      ))}

      {/* Planetas */}
      {planets.map((p, i) => (
        <Planet
          key={i}
          radius={p.radius}
          distance={p.distance}
          speed={p.speed}
          initialAngle={p.initialAngle}
        />
      ))}
    </group>
  );
};

export default MiniSolarSystem;
