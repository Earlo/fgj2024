import { TILE_WIDTH, TILE_HEIGHT, TerrainType } from './constants';
export const toIso = (x: number, y: number) => ({
  isoX: (x - y) * (TILE_WIDTH / 2),
  isoY: (x + y) * (TILE_HEIGHT / 2),
});

export const getTerrainColor = (terrainType: TerrainType): number => {
  switch (terrainType) {
    case 'VOID':
      return 0x000000; // Black
    case 'Grassland':
      return 0x00ff00; // Green
    case 'Water':
      return 0x0000ff; // Blue
    case 'Plains':
      return 0xffd733;
    case 'Sand':
      return 0xffff00; // Yellow
    case 'Mountain':
      return 0x808080; // Gray
    // ... add other cases for different terrain types
    default:
      return 0xffffff; // Default color if none match
  }
};
