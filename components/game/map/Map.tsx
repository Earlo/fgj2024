'use client';
import { Tile } from './Tile';
import { TerrainType, TerrainTypes, NeighborWeights } from '@/lib/constants';
import { useState } from 'react';

type Coordinates = `${number},${number}`;

interface MapProps {
  updateMapDimensions: (x: number, y: number) => void;
}

export const Map = ({ updateMapDimensions }: MapProps) => {
  const [terrainMap, setTerrainMap] = useState<
    Record<Coordinates, TerrainType>
  >({
    '0,0': 'VOID',
  });
  const discoverTile = (x: number, y: number) => {
    const neighbours = [
      [x, y - 1],
      [x - 1, y],
      [x + 1, y],
      [x, y + 1],
    ];
    updateMapDimensions(x, y);
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
  return <>{tiles}</>;
};
