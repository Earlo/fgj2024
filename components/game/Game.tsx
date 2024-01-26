'use client';
import { Map } from './map/Map';
import { Stage, Container } from '@pixi/react';

export const Game = () => {
  return (
    <Stage>
      <Container x={400} y={230}>
        <Map width={12} height={12} />
      </Container>
    </Stage>
  );
};
