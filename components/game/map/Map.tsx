'use client';
import { Tile } from './Tile';
import { ScrollWindow } from './ScrollWindow';
import { TerrainType, TerrainTypes, NeighborWeights } from '@/lib/constants';
import { toIso } from '@/lib/utils';
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
    const newMaxX = Math.max(mapDimensions.maxx, isoX);
    const newMaxY = Math.max(mapDimensions.maxy, isoY);
    const newMinX = Math.min(mapDimensions.minx, isoX);
    const newMinY = Math.min(mapDimensions.miny, isoY);
    setMapDimensions({
      maxx: newMaxX,
      maxy: newMaxY,
      minx: newMinX,
      miny: newMinY,
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
      console.log('No neighbors, setting to grasslands', key);
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
  console.log(terrainMap);
  return (
    <ScrollWindow
      maxX={mapDimensions.maxx + 100}
      maxY={mapDimensions.maxy + 100}
      minX={mapDimensions.minx - 100}
      minY={mapDimensions.miny - 100}
    >
      {tiles}
    </ScrollWindow>
  );
};
