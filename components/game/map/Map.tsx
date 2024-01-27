'use client';
import { Tile } from './Tile';
import { ScrollWindow } from './ScrollWindow';
import {
  TerrainType,
  TerrainTypes,
  NeighborWeights,
  TILE_WIDTH,
  TILE_HEIGHT,
} from '@/lib/constants';
import { toIso } from '@/lib/utils';
import { Rect } from '@/components/Rect';
import { useState } from 'react';

type Coordinates = `${number},${number}`;

export const Map = () => {
  const [terrainMap, setTerrainMap] = useState<
    Record<Coordinates, TerrainType>
  >({
    '0,0': 'VOID',
  });
  const [mapDimensions, setMapDimensions] = useState({
    maxx: 0,
    maxy: 0,
    minx: 0,
    miny: 0,
  });
  const discoverTile = (x: number, y: number) => {
    const neighbours = [
      [x, y - 1],
      [x - 1, y],
      [x + 1, y],
      [x, y + 1],
    ];
    const { isoX, isoY } = toIso(x, y);
    setMapDimensions({
      maxx: Math.max(mapDimensions.maxx, isoX),
      maxy: Math.max(mapDimensions.maxy, isoY),
      minx: Math.min(mapDimensions.minx, isoX),
      miny: Math.min(mapDimensions.miny, isoY),
    });
    const key = `${x},${y}`;
    const weights = neighbours
      .map(([nx, ny]) => {
        if (!terrainMap[`${nx},${ny}`]) {
          setTerrainMap((prev) => {
            return { ...prev, [`${nx},${ny}`]: 'VOID' };
          });
        }
        return NeighborWeights[terrainMap[`${nx},${ny}`] || 'VOID'];
      })
      .reduce(
        (acc, nw) => {
          TerrainTypes.forEach((terrain) => {
            acc[terrain] = (acc[terrain] || 0) + nw[terrain];
          });
          return acc;
        },
        {} as Record<TerrainType, number>,
      );
    const totalWeight: number = Object.values(weights).reduce(
      (acc: number, weight: number) => acc + weight,
      0,
    );
    if (totalWeight === 0) {
      setTerrainMap((prev) => {
        return { ...prev, [key]: 'Grassland' };
      });
      return;
    }
    const random = Math.random() * totalWeight;
    let cumulativeWeight = 0;
    for (const [terrain, weight] of Object.entries(weights)) {
      cumulativeWeight += weight;
      if (random <= cumulativeWeight) {
        setTerrainMap((prev) => {
          return { ...prev, [key]: terrain };
        });
        break;
      }
    }
  };

  const tiles = Object.entries(terrainMap).map(([key, terrainType]) => {
    const [x, y] = key.split(',').map(Number);
    return (
      <Tile
        key={`${x}-${y}`}
        x={x}
        y={y}
        terrain={terrainType}
        level={0}
        onClick={discoverTile}
      />
    );
  });
  return (
    <ScrollWindow
      maxX={mapDimensions.maxx}
      maxY={mapDimensions.maxy}
      minX={mapDimensions.minx}
      minY={mapDimensions.miny}
    >
      {tiles}
      <Rect
        x={mapDimensions.minx - TILE_WIDTH}
        y={mapDimensions.miny - TILE_HEIGHT / 2}
        w={mapDimensions.maxx - mapDimensions.minx + TILE_WIDTH * 2}
        h={mapDimensions.maxy - mapDimensions.miny + TILE_HEIGHT * 2}
        color={0xff000f}
      />
      <Rect
        x={mapDimensions.minx}
        y={mapDimensions.miny}
        w={mapDimensions.maxx - mapDimensions.minx}
        h={mapDimensions.maxy - mapDimensions.miny}
        color={0xf0ff00}
      />
    </ScrollWindow>
  );
};
