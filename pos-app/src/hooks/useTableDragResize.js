// useTableDragResize.js
import { useState } from 'react';

const useTableDragResize = ({ id, gridSize, isEditable, isBranch, onUpdate }) => {
  const [isDraggingOrResizing, setIsDraggingOrResizing] = useState(false);

  const handleDragStart = () => {
    if (!isEditable || isBranch) return;
    setIsDraggingOrResizing(true);
  };

  const handleDragStop = (e, d) => {
    if (!isEditable || isBranch) return;

    const adjustedX = Math.round(d.x / gridSize[0]) * gridSize[0];
    const adjustedY = Math.round(d.y / gridSize[1]) * gridSize[1];

    onUpdate(id, {
      position: { x: adjustedX, y: adjustedY },
    });

    setIsDraggingOrResizing(false);
  };

  const handleResizeStart = () => {
    if (!isEditable || isBranch) return;
    setIsDraggingOrResizing(true);
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    if (!isEditable || isBranch) return;

    const adjustedWidth = Math.round(ref.offsetWidth / gridSize[0]) * gridSize[0];
    const adjustedHeight = Math.round(ref.offsetHeight / gridSize[1]) * gridSize[1];
    
    const currentPosition = { ...position };
    
    if (direction.includes('left')) {
      currentPosition.x = Math.round(position.x / gridSize[0]) * gridSize[0];
    }
    if (direction.includes('top')) {
      currentPosition.y = Math.round(position.y / gridSize[1]) * gridSize[1];
    }

    onUpdate(id, {
      size: { width: adjustedWidth, height: adjustedHeight },
      position: currentPosition
    });

    setIsDraggingOrResizing(false);
  };

  const handleResize = (e, direction, ref, delta, position) => {
    if (!isEditable || isBranch) return;
  
    console.log('Resize Input:', { direction, delta, currentPosition: position });
  
    let newSize = {
      width: ref.offsetWidth,
      height: ref.offsetHeight,
    };
    let newPosition = {
      x: position.x,
      y: position.y,
    };
  
    // 최소 크기 적용
    if (newSize.width < gridSize[0] * 7) {
      newSize.width = gridSize[0] * 7;
    }
    if (newSize.height < gridSize[1] * 8) {
      newSize.height = gridSize[1] * 8;
    }
  
    // 그리드에 맞게 스냅
    newSize.width = Math.round(newSize.width / gridSize[0]) * gridSize[0];
    newSize.height = Math.round(newSize.height / gridSize[1]) * gridSize[1];
  
    // 방향에 따라 위치 조정
    if (direction.includes('left')) {
      newPosition.x = position.x + (ref.offsetWidth - newSize.width);
    }
    if (direction.includes('top')) {
      newPosition.y = position.y + (ref.offsetHeight - newSize.height);
    }
  
    console.log('Resize Output:', { newSize, newPosition });
  
    return {
      position: newPosition,
      size: newSize,
    };
  };
  
  
  

  return {
    isDraggingOrResizing,
    handleDragStart,
    handleDragStop,
    handleResizeStart,
    handleResizeStop,
    handleResize
  };
};

export default useTableDragResize;
