import type { CelestialBodyInterface } from '../../types/celestialBody.type';
import celestialObjects from '../../data/solarSystem.json';
import CelestialBody from '../objects/CelestialBody';

const SolarSystem = () => {
  const childrenMap: Record<string, CelestialBodyInterface[]> = {};

  (celestialObjects as CelestialBodyInterface[]).forEach((body) => {
    const parentId = body.parentId ?? 'ROOT';
    if (!childrenMap[parentId]) childrenMap[parentId] = [];
    childrenMap[parentId].push(body);
  });

  const renderBody = (body: CelestialBodyInterface) => (
    <CelestialBody key={body.id} data={body}>
      {childrenMap[body.id]?.map(renderBody)}
    </CelestialBody>
  );

  return <>{childrenMap.ROOT?.map(renderBody)}</>;
};

export default SolarSystem;
