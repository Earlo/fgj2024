// Character.tsx
import { toIso } from '@/lib/utils';
import React from 'react';
import { Sprite } from '@pixi/react';

interface CharacterProps {
  x: number;
  y: number;
}

export const Character: React.FC<CharacterProps> = ({ x, y }) => {
  const { isoX, isoY } = toIso(x, y);

  return <Sprite x={isoX} y={isoY} image="house0.png" anchor={0.5} />;
};
