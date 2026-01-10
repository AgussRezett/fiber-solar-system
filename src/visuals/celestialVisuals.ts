export const CELESTIAL_VISUALS = {
  SOL_001: {
    material: 'basic',
    emissive: true,
    map: '/assets/sun/map.jpg',
  },
  PL_EARTH: {
    material: 'phong',
    map: '/assets/earth/map.jpg',
    normalMap: '/assets/earth/normal.png',
    specularMap: '/assets/earth/specular.png',
    displacementMap: '/assets/earth/displacement.jpg',
    displacementScale: 0.15,
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
