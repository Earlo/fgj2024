export const TILE_WIDTH = 64;
export const TILE_HEIGHT = 32;
export const TerrainTypes = [
  'VOID',
  'Grassland',
  'Water',
  'Plains',
  'Mountain',
  'Sand',
] as const;
export type TerrainType = (typeof TerrainTypes)[number];

export const NeighborWeights: {
  [K in TerrainType]: {
    [K in TerrainType]: number;
  };
} = {
  Grassland: {
    Grassland: 1,
    Water: 0,
    Plains: 0.5,
    Sand: 0.05,
    Mountain: 0.01,
    VOID: 0,
  },
  Water: {
    Grassland: 0,
    Water: 1,
    Plains: 0,
    Sand: 0.1,
    Mountain: 0,
    VOID: 0,
  },
  Plains: {
    Grassland: 0.5,
    Water: 0,
    Plains: 1,
    Sand: 0.2,
    Mountain: 0.2,
    VOID: 0,
  },
  Sand: {
    Grassland: 0.5,
    Water: 1,
    Plains: 0.5,
    Sand: 0.2,
    Mountain: 0.2,
    VOID: 0,
  },
  Mountain: {
    Grassland: 0.15,
    Water: -0.1,
    Plains: 0.3,
    Sand: -0.05,
    Mountain: 1,
    VOID: 0,
  },
  VOID: {
    Grassland: 0,
    Water: 0,
    Plains: 0,
    Sand: 0,
    Mountain: 0,
    VOID: 0,
  },
};
