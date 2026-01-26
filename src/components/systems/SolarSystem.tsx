import type { CelestialBodyInterface } from '../../types/celestialBody.type';
import celestialObjects from '../../data/solarSystem.json';
import CelestialBody from '../objects/Celestial/CelestialBody';
import { useEffect } from 'react';
import { useCameraStore } from '../../store/useCameraStore';
import { SUN_ID } from '../../consts/system';

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

  useEffect(() => {
    useCameraStore.getState().startOrbitById(SUN_ID);
  }, []);

  return <>{childrenMap.ROOT?.map(renderBody)}</>;
};

export default SolarSystem;
