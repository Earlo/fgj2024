'use client';
import { Map } from './map/Map';
import { Stage, Container } from '@pixi/react';
export const Game = () => {
  return (
    <Stage
      width={window?.innerWidth || 0}
      height={window?.innerHeight || 0}
      options={{ backgroundColor: 0x101010 }}
    >
      <Container x={400} y={230}>
        <Map />
      </Container>
    </Stage>
  );
};
