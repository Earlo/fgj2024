'use client';
import { TILE_HEIGHT, TILE_WIDTH, TerrainType } from '@/lib/constants';
import { toIso, getTerrainColor } from '@/lib/utils';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Graphics, Sprite, useTick } from '@pixi/react';
import { Graphics as PixiGraphics, NoiseFilter } from 'pixi.js';

export interface TileProps {
  x: number;
  y: number;
  terrain: TerrainType;
  level: number;
  onClick: (x: number, y: number) => void;
}

export const Tile = ({ x, y, terrain, level, onClick }: TileProps) => {
  const [scale, setScale] = useState(0);
  const tileRef = useRef<PixiGraphics>(null);

  useTick((delta) => {
    if (scale < 1) {
      setScale(scale + 0.05 * delta);
    } else if (scale > 1) {
      setScale(1);
    }
  });

  useEffect(() => {
    setScale(0);
  }, [terrain]);

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
        ref={tileRef}
        x={isoX}
        y={((1 - scale) * TILE_HEIGHT) / 2 + isoY}
        scale={scale}
        draw={drawTile}
        pointertap={handleOnClick}
        interactive
        filters={[new NoiseFilter(0.2)]}
      />
      {level > 0 && (
        <Sprite
          x={isoX}
          y={isoY}
          image="house0.png"
          anchor={0.5}
          scale={scale}
        />
      )}
    </>
  );
};
