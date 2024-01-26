'use client';
import { Tile } from './Tile';
import { Container } from '@pixi/react';
import { useState } from 'react';

interface MapProps {
  width: number;
  height: number;
}

enum TerrainType {
  VOID = 'VOID',
  Grassland = 'Grassland',
  Water = 'Water',
  Plains = 'Plains',
  Mountain = 'Mountain',
  Sand = 'Sand',
  // ... add other terrain types here
}

const NeighborWeights = {
  [TerrainType.Grassland]: {
    [TerrainType.Grassland]: 1,
    [TerrainType.Water]: 0,
    [TerrainType.Plains]: 0.5,
    [TerrainType.Sand]: 0.2,
    [TerrainType.Mountain]: 0.2,
  },
  [TerrainType.Water]: {
    [TerrainType.Grassland]: 0,
    [TerrainType.Water]: 1,
    [TerrainType.Plains]: 0,
    [TerrainType.Sand]: 0.2,
    [TerrainType.Mountain]: 0,
  },
  [TerrainType.Plains]: {
    [TerrainType.Grassland]: 0.5,
    [TerrainType.Water]: 0,
    [TerrainType.Plains]: 1,
    [TerrainType.Sand]: 0.5,
    [TerrainType.Mountain]: 0.2,
  },
  [TerrainType.Sand]: {
    [TerrainType.Grassland]: 0.5,
    [TerrainType.Water]: 1,
    [TerrainType.Plains]: 0.5,
    [TerrainType.Sand]: 1,
    [TerrainType.Mountain]: 0.2,
  },
  [TerrainType.Mountain]: {
    [TerrainType.Grassland]: 0.2,
    [TerrainType.Water]: 0,
    [TerrainType.Plains]: 0.2,
    [TerrainType.Sand]: 0.2,
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

const getTerrainColor = (terrainType: TerrainType): number => {
  switch (terrainType) {
    case TerrainType.VOID:
      return 0x000000; // Black
    case TerrainType.Grassland:
      return 0x00ff00; // Green
    case TerrainType.Water:
      return 0x0000ff; // Blue
    case TerrainType.Plains:
      return 0xffff00; // Yellow
    case TerrainType.Sand:
      return 0xffd700; // Sand color
    case TerrainType.Mountain:
      return 0x808080; // Gray
    // ... add other cases for different terrain types
    default:
      return 0xffffff; // Default color if none match
  }
};

export const Map = ({ width, height }: MapProps) => {
  const [terrainMap, setTerrainMap] = useState<TerrainType[][]>(
    Array.from({ length: height }, () =>
      Array.from({ length: width }, () => TerrainType.VOID),
    ),
  );

  const discoverTile = (x: number, y: number) => {
    const neighbours = [
      [x, y - 1],
      [x - 1, y],
      [x + 1, y],
      [x, y + 1],
    ];
    const weights: { TerrainType: number } = neighbours
      .flatMap(([nx, ny]) => {
        if (nx < 0 || nx >= width || ny < 0 || ny >= height) {
          return {};
        }
        return NeighborWeights[terrainMap[ny][nx]];
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
        const copy = [...prev];
        copy[y][x] = TerrainType.Grassland;
        return copy;
      });
    }
    const random = Math.random() * totalWeight;
    let cumulativeWeight = 0;
    for (const [terrain, weight] of Object.entries(weights)) {
      cumulativeWeight += weight;
      if (random <= cumulativeWeight) {
        setTerrainMap((prev) => {
          const copy = [...prev];
          copy[y][x] = terrain as TerrainType;
          return copy;
        });
        break;
      }
    }
    console.log(x, y, weights);
  };

  const tiles = terrainMap.flatMap((row, y) =>
    row.map((terrainType, x) => (
      <Tile
        key={`${x}-${y}`}
        x={x}
        y={y}
        color={getTerrainColor(terrainType)}
        level={0}
        onClick={discoverTile}
      />
    )),
  );

  return <Container>{tiles}</Container>;
};
