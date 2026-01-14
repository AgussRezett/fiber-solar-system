import * as THREE from 'three';
import PlanetRings from './components/PlanetRings';
import Atmosphere from './components/Atmosphere';
import Clouds from './components/Clouds';

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  features: any;
  radius: number;
  axialTilt: number;
  cloudRef: React.RefObject<THREE.Group | null>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  textures: any;
  displacementScale: number;
};

const CelestialFeatures = ({
  features,
  radius,
  axialTilt,
  cloudRef,
  textures,
  displacementScale,
}: Props) => {
  return (
    <>
      {features?.rings && (
        <group rotation={[0, 0, axialTilt]}>
          <PlanetRings radius={radius} {...features.rings} />
        </group>
      )}

      {features?.atmosphere && (
        <Atmosphere radius={radius} {...features.atmosphere} />
      )}

      {features?.clouds?.map && (
        <Clouds
          features={features}
          radius={radius}
          axialTilt={axialTilt}
          cloudRef={cloudRef}
          textures={textures}
          displacementScale={displacementScale}
        />
      )}
    </>
  );
};

export default CelestialFeatures;
