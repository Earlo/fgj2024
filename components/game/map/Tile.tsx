import React, { useCallback } from 'react';
import { Container, Graphics, Sprite } from '@pixi/react';
import { Graphics as PixiGraphics, BlurFilter, NoiseFilter } from 'pixi.js';

const TILE_WIDTH = 64;
const TILE_HEIGHT = 32;

export interface TileProps {
  x: number;
  y: number;
  color: number;
  level: number;
  onClick: (x: number, y: number) => void; // Add an onClick prop
}

// Converts 2D grid coordinates to isometric screen coordinates
const toIso = (x: number, y: number) => ({
  isoX: (x - y) * (TILE_WIDTH / 2),
  isoY: (x + y) * (TILE_HEIGHT / 2),
});

export const Tile = ({ x, y, color, level, onClick }: TileProps) => {
  const { isoX, isoY } = toIso(x, y);

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
