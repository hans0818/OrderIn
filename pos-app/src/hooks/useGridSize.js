// src/hooks/useGridSize.js
import { useState, useEffect, useRef } from 'react';

const useGridSize = (columns, rows) => {
  const [gridSize, setGridSize] = useState([0, 0]);
  const gridRef = useRef(null);

  useEffect(() => {
    const calculateGridSize = () => {
      if (gridRef.current) {
        const { width, height } = gridRef.current.getBoundingClientRect();

        const cellWidth = Math.floor(width / columns);
        const cellHeight = Math.floor(height / rows);

        setGridSize([cellWidth, cellHeight]);
        gridRef.current.style.backgroundSize = `${cellWidth}px ${cellHeight}px`;
      }
    };

    calculateGridSize();
    window.addEventListener('resize', calculateGridSize);
    return () => window.removeEventListener('resize', calculateGridSize);
  }, [columns, rows]);

  return { gridSize, gridRef };
};

export default useGridSize;
