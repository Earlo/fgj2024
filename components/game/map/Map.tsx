'use client';
import { Tile } from './Tile';
import { Container } from '@pixi/react';
import { useState } from 'react';

export enum TerrainType {
  VOID = 'VOID',
  Grassland = 'Grassland',
  Water = 'Water',
  Plains = 'Plains',
  Mountain = 'Mountain',
  Sand = 'Sand',
  // ... add other terrain types here
}
type Coordinates = `${number},${number}`;
interface MapProps {
  width: number;
  height: number;
}

const NeighborWeights = {
  [TerrainType.Grassland]: {
    [TerrainType.Grassland]: 1,
    [TerrainType.Water]: 0,
    [TerrainType.Plains]: 0.5,
    [TerrainType.Sand]: 0.05,
    [TerrainType.Mountain]: 0.01,
  },
  [TerrainType.Water]: {
    [TerrainType.Grassland]: 0,
    [TerrainType.Water]: 1,
    [TerrainType.Plains]: 0,
    [TerrainType.Sand]: 0.1,
    [TerrainType.Mountain]: 0,
  },
  [TerrainType.Plains]: {
    [TerrainType.Grassland]: 0.5,
    [TerrainType.Water]: 0,
    [TerrainType.Plains]: 1,
    [TerrainType.Sand]: 0.2,
    [TerrainType.Mountain]: 0.2,
  },
  [TerrainType.Sand]: {
    [TerrainType.Grassland]: 0.5,
    [TerrainType.Water]: 1,
    [TerrainType.Plains]: 0.5,
    [TerrainType.Sand]: 0.2,
    [TerrainType.Mountain]: 0.2,
  },
  [TerrainType.Mountain]: {
    [TerrainType.Grassland]: 0.15,
    [TerrainType.Water]: -0.1,
    [TerrainType.Plains]: 0.3,
    [TerrainType.Sand]: -0.05,
    [TerrainType.Mountain]: 1,
  },
  [TerrainType.VOID]: {
    [TerrainType.Grassland]: 0,
    [TerrainType.Water]: 0,
    [TerrainType.Plains]: 0,
    [TerrainType.Sand]: 0,
    [TerrainType.Mountain]: 0,
  },
};

export const Map = ({ width, height }: MapProps) => {
  const [terrainMap, setTerrainMap] = useState<
    Record<Coordinates, TerrainType>
  >({
    '0,0': TerrainType.VOID,
  });

  const discoverTile = (x: number, y: number) => {
    const neighbours = [
      [x, y - 1],
      [x - 1, y],
      [x + 1, y],
      [x, y + 1],
    ];
    const key = `${x},${y}`;
    const weights: { TerrainType: number } = neighbours
      .flatMap(([nx, ny]) => {
        // if neighbour doesn't exist, create a new void tile
        if (!terrainMap[`${nx},${ny}`]) {
          setTerrainMap((prev) => {
            return { ...prev, [`${nx},${ny}`]: TerrainType.VOID };
          });
        }
        return NeighborWeights[terrainMap[`${nx},${ny}`] || TerrainType.VOID];
      })
      .reduce(
        //eslint-disable-next-line
        (acc: any, weights: any) => {
          Object.keys(weights).forEach((key) => {
            acc[key] = (acc[key] || 0) + weights[key];
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
        return { ...prev, [key]: TerrainType.Grassland };
      });
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
  console.log(tiles);
  return <Container>{tiles}</Container>;
};
