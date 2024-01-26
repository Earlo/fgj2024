import { TILE_WIDTH, TILE_HEIGHT } from './constants';
export const toIso = (x: number, y: number) => ({
  isoX: (x - y) * (TILE_WIDTH / 2),
  isoY: (x + y) * (TILE_HEIGHT / 2),
});
