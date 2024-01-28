'use client';
import { Tile } from './Tile';
import { TerrainType, TerrainTypes, NeighborWeights } from '@/lib/constants';
import { getNeighbours } from '@/lib/utils';
import { useState, useMemo, useCallback, useEffect } from 'react';

type Coordinates = `${number},${number}`;

interface MapProps {
  updateMapDimensions: (x: number, y: number) => void;
  characterPosition: { x: number; y: number };
}

export const Map = ({ updateMapDimensions, characterPosition }: MapProps) => {
  const [terrainMap, setTerrainMap] = useState<
    Record<Coordinates, TerrainType>
  >({
    '0,0': 'VOID',
  });

  const discoverTile = useCallback(
    (x: number, y: number) => {
      updateMapDimensions(x, y);
      const key = `${x},${y}`;
      const weights = getNeighbours(x, y)
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
    },
    [terrainMap, updateMapDimensions],
  );
  useEffect(() => {
    if (
      terrainMap[`${characterPosition.x},${characterPosition.y}`] === 'VOID' ||
      !terrainMap[`${characterPosition.x},${characterPosition.y}`]
    ) {
      discoverTile(characterPosition.x, characterPosition.y);
    }
  }, [characterPosition, discoverTile, terrainMap]);

  const tiles = useMemo(() => {
    return Object.entries(terrainMap).map(([key, terrainType]) => {
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
  }, [terrainMap, discoverTile]);
  return <>{tiles}</>;
};
