import { TILE_HEIGHT, TILE_WIDTH, TerrainType } from '@/lib/constants';
import { toIso, getTerrainColor } from '@/lib/utils';
import React, { useCallback } from 'react';
import { Graphics, Sprite } from '@pixi/react';
import { Graphics as PixiGraphics, NoiseFilter } from 'pixi.js';
export interface TileProps {
  x: number;
  y: number;
  terrain: TerrainType;
  level: number;
  onClick: (x: number, y: number) => void;
}

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
