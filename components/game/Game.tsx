'use client';
import { Map } from './map/Map';
import { Stage, Container } from '@pixi/react';
export const Game = () => {
  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      options={{ backgroundColor: 0x1099bb }}
    >
      <Container x={400} y={230}>
        <Map />
      </Container>
    </Stage>
  );
};
