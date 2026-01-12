export type CelestialBodyId = keyof typeof CELESTIAL_VISUALS;

type CloudVisual = {
  map: string;
  opacity: number;
  speed: number;
  scale?: number;
};

export type RingsVisual = {
  innerRadiusMultiplier: number;
  outerRadiusMultiplier: number;
  colorMap: string;
  alphaMap: string;
  opacity?: number;
};

export type AtmosphereVisual = {
  color: string;
  opacity: number;
  scale: number;
};

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

  features?: {
    rings?: RingsVisual;
    atmosphere?: AtmosphereVisual;
    clouds?: CloudVisual;
  };
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
    specularMap: '/assets/earth/specular.jpg',
    displacementMap: '/assets/earth/displacement.jpg',
    displacementScale: 0.15,
    shininess: 30,
    features: {
      clouds: {
        map: '/assets/earth/clouds.jpg',
        opacity: 0.6,
        speed: 0.01,
        scale: 1.01,
      },

      atmosphere: {
        color: '#6fb7ff',
        opacity: 0.25,
        scale: 1.03,
      },
    },
  },
  MO_MOON: {
    material: 'phong',
    map: '/assets/moon/map.jpg',
    displacementMap: '/assets/moon/displacement.jpg',
    displacementScale: 0.003,
    shininess: 10,
  },
  PL_MARS: {
    material: 'phong',
    map: '/assets/mars/map.jpg',
    shininess: 30,
  },
  PL_JUPITER: {
    material: 'phong',
    map: '/assets/jupiter/map.jpg',
    shininess: 30,
  },
  PL_SATURN: {
    material: 'phong',
    map: '/assets/saturn/map.jpg',
    shininess: 30,
    features: {
      rings: {
        innerRadiusMultiplier: 1.3,
        outerRadiusMultiplier: 2.3,
        colorMap: '/assets/saturn/rings_color.jpg',
        alphaMap: '/assets/saturn/rings_alpha.png',
        opacity: 0.85,
      },
    },
  },
  PL_URANUS: {
    material: 'phong',
    map: '/assets/uranus/map.jpg',
    shininess: 30,
    /*     features: {
      rings: {
        innerRadiusMultiplier: 1.2,
        outerRadiusMultiplier: 1.8,
        colorMap: '/assets/uranus/rings_color.png',
        alphaMap: '/assets/uranus/rings_alpha.png',
        opacity: 0.6,
      },
    }, */
  },
  PL_NEPTUNE: {
    material: 'phong',
    map: '/assets/neptune/map.jpg',
    shininess: 30,
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
