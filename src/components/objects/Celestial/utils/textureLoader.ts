import * as THREE from 'three';
import { CELESTIAL_VISUALS, type CelestialVisualInterface } from '../../../../visuals/celestialVisuals';

type TextureSet = {
  map?: THREE.Texture;
  normalMap?: THREE.Texture;
  specularMap?: THREE.Texture;
  displacementMap?: THREE.Texture;
};

type Listener = (id: string, textures: TextureSet) => void;

class TextureLoaderService {
  private cache = new Map<string, TextureSet>();
  private loader = new THREE.TextureLoader();
  private loadingPromises = new Map<string, Promise<TextureSet>>();
  private listeners = new Set<Listener>();

  // Suscribirse a cambios
  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(id: string, textures: TextureSet) {
    this.listeners.forEach(listener => listener(id, textures));
  }

  // Pre-cargar todas las texturas del sistema solar
  async preloadAllTextures() {
    const promises = Object.entries(CELESTIAL_VISUALS).map(([id, visuals]) => 
      this.loadTextures(id, visuals)
    );
    const results = await Promise.all(promises);
    
    // Notificar a todos los listeners de todas las texturas cargadas
    Object.entries(CELESTIAL_VISUALS).forEach(([id]) => {
      const textures = this.cache.get(id);
      if (textures) {
        this.notifyListeners(id, textures);
      }
    });
    
    return results;
  }

  // Cargar texturas para un planeta específico
  async loadTextures(id: string, visuals: CelestialVisualInterface): Promise<TextureSet> {
    // Si ya está en caché, retornar inmediatamente
    if (this.cache.has(id)) {
      return this.cache.get(id)!;
    }

    // Si ya está cargando, retornar la promesa existente
    if (this.loadingPromises.has(id)) {
      return this.loadingPromises.get(id)!;
    }

    // Crear nueva promesa de carga
    const loadPromise = this.performLoad(visuals);
    this.loadingPromises.set(id, loadPromise);

    try {
      const textures = await loadPromise;
      this.cache.set(id, textures);
      this.notifyListeners(id, textures);
      return textures;
    } finally {
      this.loadingPromises.delete(id);
    }
  }

  private async performLoad(visuals: CelestialVisualInterface): Promise<TextureSet> {
    const textures: TextureSet = {};
    const promises: Promise<void>[] = [];

    if (visuals.map) {
      promises.push(
        this.loader.loadAsync(visuals.map).then(tex => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.needsUpdate = true;
          textures.map = tex;
        })
      );
    }

    if (visuals.normalMap) {
      promises.push(
        this.loader.loadAsync(visuals.normalMap).then(tex => {
          tex.needsUpdate = true;
          textures.normalMap = tex;
        })
      );
    }

    if (visuals.specularMap) {
      promises.push(
        this.loader.loadAsync(visuals.specularMap).then(tex => {
          tex.needsUpdate = true;
          textures.specularMap = tex;
        })
      );
    }

    if (visuals.displacementMap) {
      promises.push(
        this.loader.loadAsync(visuals.displacementMap).then(tex => {
          tex.needsUpdate = true;
          textures.displacementMap = tex;
        })
      );
    }

    await Promise.all(promises);
    return textures;
  }

  // Obtener texturas desde la caché (síncrono)
  getTextures(id: string): TextureSet | null {
    return this.cache.get(id) || null;
  }

  // Verificar si las texturas están cargadas
  isLoaded(id: string): boolean {
    return this.cache.has(id);
  }
}

// Exportar instancia singleton
export const textureLoader = new TextureLoaderService();