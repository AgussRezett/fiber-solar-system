import type { CelestialBodyInterface } from '../../types/celestialBody.type';
import celestialObjects from '../../data/solarSystem.json';
import CelestialBody from '../objects/CelestialBody';

const SolarSystem = () => {
  return (
    <>
      {(celestialObjects as CelestialBodyInterface[]).map((object) => {
        return <CelestialBody key={object.id} data={object} />;
      })}
    </>
  );
};

export default SolarSystem;
