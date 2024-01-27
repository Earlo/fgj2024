import React, { useState, useEffect } from 'react';
import { Container } from '@pixi/react';

interface ScrollWindowProps {
  maxX: number;
  maxY: number;
  minX: number;
  minY: number;
  children: React.ReactNode;
}

export const ScrollWindow = ({
  maxX,
  maxY,
  minX,
  minY,
  children,
}: ScrollWindowProps) => {
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });
  const [scrollSpeed, setScrollSpeed] = useState({ dx: 0, dy: 0 });
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollSpeed.dx !== 0 || scrollSpeed.dy !== 0) {
        setScrollPosition((prev) => ({
          x: Math.max(Math.min(prev.x + scrollSpeed.dx, maxX), minX),
          y: Math.max(Math.min(prev.y + scrollSpeed.dy, maxY), minY),
        }));
      }
    }, 50);
    return () => clearInterval(interval);
  }, [scrollSpeed, maxX, maxY, minX, minY]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const threshold = 50; // Distance in pixels from the edge to start scrolling
      let dx = 0;
      let dy = 0;
      if (clientX < threshold) dx = -5;
      else if (window.innerWidth - clientX < threshold) dx = 5;
      if (clientY < threshold) dy = -5;
      else if (window.innerHeight - clientY < threshold) dy = 5;
      setScrollSpeed({ dx, dy });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <Container x={-scrollPosition.x} y={-scrollPosition.y}>
      {children}
    </Container>
  );
};
