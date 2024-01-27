'use client';
import { Map } from './map/Map';
import { ScrollWindow } from './ScrollWindow';
import { toIso } from '@/lib/utils';
import { Stage } from '@pixi/react';
import { useEffect, useState } from 'react';

export const Game = () => {
  const [gameSize, setGameSize] = useState({ width: 0, height: 0 });
  const [mapDimensions, setMapDimensions] = useState({
    maxx: 0,
    maxy: 0,
    minx: 0,
    miny: 0,
  });
  const updateMapDimensions = (x: number, y: number) => {
    const { isoX, isoY } = toIso(x, y);
    setMapDimensions({
      maxx: Math.max(mapDimensions.maxx, isoX),
      maxy: Math.max(mapDimensions.maxy, isoY),
      minx: Math.min(mapDimensions.minx, isoX),
      miny: Math.min(mapDimensions.miny, isoY),
    });
  };
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
      <ScrollWindow
        centerX={gameSize.width / 2}
        centerY={gameSize.height / 2}
        maxX={mapDimensions.maxx}
        maxY={mapDimensions.maxy}
        minX={mapDimensions.minx}
        minY={mapDimensions.miny}
      >
        <Map updateMapDimensions={updateMapDimensions} />
      </ScrollWindow>
    </Stage>
  );
};
