import { TerrainType } from './Map';
import React, { useCallback } from 'react';
import { Graphics, Sprite } from '@pixi/react';
import { Graphics as PixiGraphics, NoiseFilter } from 'pixi.js';

const TILE_WIDTH = 64;
const TILE_HEIGHT = 32;

export interface TileProps {
  x: number;
  y: number;
  terrain: TerrainType;
  level: number;
  onClick: (x: number, y: number) => void; // Add an onClick prop
}

const getTerrainColor = (terrainType: TerrainType): number => {
  switch (terrainType) {
    case TerrainType.VOID:
      return 0x000000; // Black
    case TerrainType.Grassland:
      return 0x00ff00; // Green
    case TerrainType.Water:
      return 0x0000ff; // Blue
    case TerrainType.Plains:
      return 0xffd733;
    case TerrainType.Sand:
      return 0xffff00; // Yellow
    case TerrainType.Mountain:
      return 0x808080; // Gray
    // ... add other cases for different terrain types
    default:
      return 0xffffff; // Default color if none match
  }
};

const toIso = (x: number, y: number) => ({
  isoX: (x - y) * (TILE_WIDTH / 2),
  isoY: (x + y) * (TILE_HEIGHT / 2),
});

export const Tile = ({ x, y, terrain, level, onClick }: TileProps) => {
  const { isoX, isoY } = toIso(x, y);
  const color = getTerrainColor(terrain);

  const drawTile = useCallback(
    (g: PixiGraphics) => {
      g.clear();
      g.beginFill(color);
      g.lineStyle(2, 0x000000, 1);
      g.moveTo(0, 0);
      g.lineTo(TILE_WIDTH / 2, TILE_HEIGHT / 2);
      g.lineTo(0, TILE_HEIGHT);
      g.lineTo(-TILE_WIDTH / 2, TILE_HEIGHT / 2);
      g.lineTo(0, 0);
      g.endFill();
    },
    [color],
  );

  const handleOnClick = () => onClick(x, y);

  return (
    <>
      <Graphics
        x={isoX}
        y={isoY}
        draw={drawTile}
        pointertap={handleOnClick}
        interactive
        filters={[new NoiseFilter(0.2)]}
      />
      {level > 0 && (
        <Sprite x={isoX} y={isoY} image="house0.png" anchor={0.5} />
      )}
    </>
  );
};
