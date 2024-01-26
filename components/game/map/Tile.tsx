import { TILE_HEIGHT, TILE_WIDTH, TerrainType } from '@/lib/constants';
import { toIso } from '@/lib/utils';
import React, { useCallback } from 'react';
import { Graphics, Sprite } from '@pixi/react';
import { Graphics as PixiGraphics, NoiseFilter } from 'pixi.js';
export interface TileProps {
  x: number;
  y: number;
  terrain: TerrainType;
  level: number;
  onClick: (x: number, y: number) => void; // Add an onClick prop
}

const getTerrainColor = (terrainType: TerrainType): number => {
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

const noiseFilter = new NoiseFilter(0.2);
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
        filters={[noiseFilter]}
      />
      {level > 0 && (
        <Sprite x={isoX} y={isoY} image="house0.png" anchor={0.5} />
      )}
    </>
  );
};
