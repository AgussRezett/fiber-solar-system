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
    displacementMap: '/assets/venus/displacement.jpg',
    displacementScale: 0.15,
    shininess: 30,
    features: {
      clouds: {
        map: '/assets/venus/atmosphere.jpg',
        opacity: 0.1,
        speed: 0.01,
        scale: 1.09,
      },
      atmosphere: {
        color: '#ffd2a1',
        opacity: 0.5,
        scale: 1.1,
        intensity: 0.05,
      },
    },
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
        opacity: 0.5,
        scale: 1.04,
        intensity: 0.6,
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
    normalMap: '/assets/mars/normal.jpg',
    displacementMap: '/assets/mars/displacement.jpg',
    displacementScale: 0.15,
    shininess: 30,
    features: {
      atmosphere: {
        color: '#c98a6a',
        opacity: 0.12,
        scale: 1.02,
      },
    },
  },
  PL_JUPITER: {
    material: 'phong',
    map: '/assets/jupiter/map.jpg',
    shininess: 30,
    features: {
      atmosphere: {
        color: '#f2e7d5',
        opacity: 0.25,
        scale: 1.02,
        intensity: 0.02,
      },
    },
  },
  PL_SATURN: {
    material: 'phong',
    map: '/assets/saturn/map.jpg',
    shininess: 30,
    features: {
      atmosphere: {
        color: '#efe4c8',
        opacity: 0.22,
        scale: 1.02,
        intensity: 0.02,
      },
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
    features: {
      atmosphere: {
        color: '#9fd9d9',
        opacity: 0.35,
        scale: 1.04,
        intensity: 0.02,
      },
      rings: {
        innerRadiusMultiplier: 1.2,
        outerRadiusMultiplier: 1.8,
        colorMap: '/assets/uranus/rings_color.jpg',
        alphaMap: '/assets/uranus/rings_alpha.gif',
        opacity: 0.6,
      },
    },
  },
  PL_NEPTUNE: {
    material: 'phong',
    map: '/assets/neptune/map.jpg',
    shininess: 30,
    features: {
      atmosphere: {
        color: '#4f7dff',
        opacity: 0.4,
        scale: 1.04,
        intensity: 0.1,
      },
    },
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
