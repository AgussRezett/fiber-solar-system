export type CelestialBodyId = keyof typeof CELESTIAL_VISUALS;

export type CelestialVisualInterface = {
  material: string;
  emissive?: boolean;
  map?: string;
  normalMap?: string;
  specularMap?: string;
  displacementMap?: string;
  displacementScale?: number;
  shininess?: number;
  toneMapped?: boolean;
};

export const CELESTIAL_VISUALS = {
  SOL_001: {
    material: 'basic',
    emissive: true,
    map: '/assets/sun/map.jpg',
    toneMapped: false,
  },
  PL_MERCURY: {
    material: 'phong',
    map: '/assets/mercury/map.jpg',
    shininess: 30,
  },
  PL_VENUS: {
    material: 'phong',
    map: '/assets/venus/map.jpg',
    shininess: 30,
  },
  PL_EARTH: {
    material: 'phong',
    map: '/assets/earth/map.jpg',
    normalMap: '/assets/earth/normal.png',
    specularMap: '/assets/earth/specular.png',
    displacementMap: '/assets/earth/displacement.jpg',
    displacementScale: 0.05,
    shininess: 30,
  },
  MO_MOON: {
    material: 'phong',
    map: '/assets/moon/map.jpg',
    shininess: 10,
  },
};

export const DEFAULT_VISUALS_BY_TYPE = {
  star: {
    material: 'basic',
    emissive: true,
  },
  planet: {
    material: 'phong',
  },
  satellite: {
    material: 'phong',
  },
};
