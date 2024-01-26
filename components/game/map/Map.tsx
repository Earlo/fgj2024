'use client';
import { Tile } from './Tile';
import { Container } from '@pixi/react';
import { useState } from 'react';

export const TerrainTypes = [
  'VOID',
  'Grassland',
  'Water',
  'Plains',
  'Mountain',
  'Sand',
] as const;
export type TerrainType = (typeof TerrainTypes)[number];
type Coordinates = `${number},${number}`;
interface MapProps {
  width: number;
  height: number;
}

const NeighborWeights: {
  [K in TerrainType]: {
    [K in TerrainType]: number;
  };
} = {
  Grassland: {
    Grassland: 1,
    Water: 0,
    Plains: 0.5,
    Sand: 0.05,
    Mountain: 0.01,
    VOID: 0,
  },
  Water: {
    Grassland: 0,
    Water: 1,
    Plains: 0,
    Sand: 0.1,
    Mountain: 0,
    VOID: 0,
  },
  Plains: {
    Grassland: 0.5,
    Water: 0,
    Plains: 1,
    Sand: 0.2,
    Mountain: 0.2,
    VOID: 0,
  },
  Sand: {
    Grassland: 0.5,
    Water: 1,
    Plains: 0.5,
    Sand: 0.2,
    Mountain: 0.2,
    VOID: 0,
  },
  Mountain: {
    Grassland: 0.15,
    Water: -0.1,
    Plains: 0.3,
    Sand: -0.05,
    Mountain: 1,
    VOID: 0,
  },
  VOID: {
    Grassland: 0,
    Water: 0,
    Plains: 0,
    Sand: 0,
    Mountain: 0,
    VOID: 0,
  },
};

export const Map = ({ width, height }: MapProps) => {
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
    console.log(x, y, weights);
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
  return <Container>{tiles}</Container>;
};
