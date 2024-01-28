'use client';
import { Map } from './map/Map';
import { ScrollWindow } from './ScrollWindow';
import { Character } from './Guy';
import { toIso, getNeighbours } from '@/lib/utils';
import { Stage } from '@pixi/react';
import { useCallback, useEffect, useState } from 'react';

export const Game = () => {
  const [characterPos, setCharacterPos] = useState({ x: 0, y: 0 });
  const [gameSize, setGameSize] = useState({ width: 0, height: 0 });
  const [mapDimensions, setMapDimensions] = useState({
    maxx: 0,
    maxy: 0,
    minx: 0,
    miny: 0,
  });
  const updateMapDimensions = useCallback(
    (x: number, y: number) => {
      const { isoX, isoY } = toIso(x, y);
      setMapDimensions({
        maxx: Math.max(mapDimensions.maxx, isoX),
        maxy: Math.max(mapDimensions.maxy, isoY),
        minx: Math.min(mapDimensions.minx, isoX),
        miny: Math.min(mapDimensions.miny, isoY),
      });
    },
    [
      mapDimensions.maxx,
      mapDimensions.maxy,
      mapDimensions.minx,
      mapDimensions.miny,
    ],
  );
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

  useEffect(() => {
    const moveCharacter = () => {
      const moves = getNeighbours(characterPos.x, characterPos.y);
      setCharacterPos((prev) => {
        const move = moves[Math.floor(Math.random() * moves.length)];
        const newX = move[0];
        const newY = move[1];
        updateMapDimensions(newX, newY); // Update map dimensions for new position
        return { x: newX, y: newY };
      });
    };

    const interval = setInterval(moveCharacter, 200); // Move every second
    return () => clearInterval(interval);
  }, [updateMapDimensions, characterPos.x, characterPos.y]);

  return (
    <Stage
      width={gameSize.width}
      height={gameSize.height}
      options={{ backgroundColor: 0x000000 }}
    >
      <ScrollWindow
        centerX={gameSize.width / 2}
        centerY={gameSize.height / 2}
        maxX={mapDimensions.maxx}
        maxY={mapDimensions.maxy}
        minX={mapDimensions.minx}
        minY={mapDimensions.miny}
      >
        <Map
          updateMapDimensions={updateMapDimensions}
          characterPosition={characterPos}
        />
        <Character x={characterPos.x} y={characterPos.y} />
      </ScrollWindow>
    </Stage>
  );
};
