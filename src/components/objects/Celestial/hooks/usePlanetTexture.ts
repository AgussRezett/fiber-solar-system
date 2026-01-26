import { useEffect, useRef, useState } from 'react';
import { textureLoader } from '../utils/textureLoader';
import type { CelestialVisualInterface } from '../../../../visuals/celestialVisuals';

export const usePlanetTextures = (planetId: string, visuals: CelestialVisualInterface) => {
  const [textures, setTextures] = useState(() => 
    textureLoader.getTextures(planetId) || {}
  );
  const isMountedRef = useRef(true);

  useEffect(() => {
      isMountedRef.current = true;
  
      // Suscribirse a cambios
      const unsubscribe = textureLoader.subscribe((id, loadedTextures) => {
        if (id === planetId && isMountedRef.current) {
          setTextures(loadedTextures);
        }
      });
  
      // Iniciar carga si no está cargado
      if (!textureLoader.isLoaded(planetId)) {
        textureLoader.loadTextures(planetId, visuals);
      }
  
      return () => {
        isMountedRef.current = false;
        unsubscribe();
      };
    }, [planetId, visuals]);

  return textures;
};