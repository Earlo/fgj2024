'use client';
import React, { useCallback } from 'react';
import { Graphics } from '@pixi/react';
import { Graphics as PixiGraphics, NoiseFilter } from 'pixi.js';
export interface RectProps {
  x: number;
  y: number;
  w: number;
  h: number;
  color?: number;
}

export const Rect = ({ x, y, w, h, color = 0xff0000 }: RectProps) => {
  const drawRect = useCallback(
    (g: PixiGraphics) => {
      g.clear();
      g.lineStyle(2, color, 1);
      g.drawRect(x, y, w, h);
    },
    [x, y, w, h, color],
  );

  return (
    <Graphics draw={drawRect} interactive filters={[new NoiseFilter(0.2)]} />
  );
};
