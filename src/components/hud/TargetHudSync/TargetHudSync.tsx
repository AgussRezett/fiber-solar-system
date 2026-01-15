import { useEffect } from 'react';
import { useCameraStore } from '../../../store/useCameraStore';
import celestialObjects from '../../../data/solarSystem.json';

export const useTargetHudSync = () => {
  const { focusTargetId, setTargetHud } = useCameraStore();

  useEffect(() => {
    if (!focusTargetId) {
      setTargetHud({
        visible: false,
      });
      return;
    }

    const planet = celestialObjects.find((obj) => obj.id === focusTargetId);

    setTargetHud({
      visible: true,
      name: planet?.name ?? 'UNKNOWN',
      type: planet?.type ?? 'BODY',
      radiusKm: planet?.radiusKm,
    });
  }, [focusTargetId, setTargetHud]);
};
