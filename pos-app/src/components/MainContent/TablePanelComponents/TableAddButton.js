import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useMotionTemplate, animate } from 'framer-motion';
import AddIcon from '../Sectionicons/AddIcon';
import { v4 as uuidv4 } from 'uuid';

const TableAddButton = React.forwardRef(({ gridRef, gridSize, onAddTable }, ref) => {
  const [clicked, setClicked] = useState(false);
  const buttonRef = ref;

  const scale = useMotionValue(0);
  const clickScale = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const clickX = useMotionValue(0);
  const clickY = useMotionValue(0);

  const scalePercent = useTransform(scale, [0, 1], [0, 100]);
  const clickScalePercent = useTransform(clickScale, [0, 1], [0, 100]);
  const textOpacity = useTransform(clickScale, [0, 1], [1, 0]);

  const createTablePosition = { x: gridSize[0] * 5, y: gridSize[1] * 3 }; // 고정된 위치

  const handleClick = (e) => {
    e.stopPropagation();

    setClicked(true);
    clickScale.set(0);
    animate(clickScale, 1, { duration: 0.8 });

    setTimeout(() => {
      const newTable = {
        id: uuidv4(),
        gridPosition: {
          x: 5,  // 고정된 그리드 위치
          y: 3
        },
        gridSize: {
          width: 10,  // 그리드 단위로 크기 지정
          height: 10
        },
        position: createTablePosition, // 실제 픽셀 위치
        size: {
          width: gridSize[0] * 10,  // 실제 픽셀 크기
          height: gridSize[1] * 10
        },
        isSelected: true,
        color: '#4F75FF',
        text: '새 테이블',
        fontSize: 14,
      };

      onAddTable(newTable);
      setClicked(false);
      console.log('새 테이블 추가됨:', newTable);
    }, 800);
  };

  const handleMouseMove = (e) => {
    const gridRect = gridRef.current.getBoundingClientRect();
    const relativeX = e.clientX - gridRect.left;
    const relativeY = e.clientY - gridRect.top;
    mouseX.set(relativeX);
    mouseY.set(relativeY);
  };

  const handleMouseEnter = () => {
    animate(scale, 1, { duration: 0.8 });
  };

  const handleMouseLeave = () => {
    animate(scale, 0, { duration: 0.8 });
  };

  const hoverBackground = useMotionTemplate`radial-gradient(circle at ${mouseX}px ${mouseY}px, #4F75FF ${scalePercent}%, #FFFFFF 0%)`;
  const clickBackground = useMotionTemplate`radial-gradient(circle at ${clickX}px ${clickY}px, #FFFFFF ${clickScalePercent}%, #4F75FF 0%)`;

  return (
    <motion.button
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={buttonRef}
      style={{
        position: 'absolute',
        left: createTablePosition.x,
        top: createTablePosition.y,
        width: gridSize[0] * 10,
        height: gridSize[1] * 10,
        border: '3px solid',
        borderColor: clicked ? '#4F75FF' : '#d5d5d5',
        overflow: 'hidden',
        background: clicked ? clickBackground : hoverBackground,
        borderRadius: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#000',
        fontWeight: 'bold',
        cursor: 'pointer',
        zIndex: 3,
      }}
    >
      <motion.span
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          opacity: textOpacity,
        }}
      >
        테이블 추가
      </motion.span>
      <motion.div
        style={{
          marginLeft: '12px',
          opacity: textOpacity,
        }}
      >
        <AddIcon width={32} height={32} />
      </motion.div>
    </motion.button>
  );
});

export default TableAddButton;
