'use client';
import { Map } from './map/Map';
import { Stage, Container } from '@pixi/react';
import { useEffect, useState } from 'react';
export const Game = () => {
  const [gameSize, setGameSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setGameSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Stage
      width={gameSize.width}
      height={gameSize.height}
      options={{ backgroundColor: 0x101010 }}
    >
      <Container x={400} y={230}>
        <Map />
      </Container>
    </Stage>
  );
};
