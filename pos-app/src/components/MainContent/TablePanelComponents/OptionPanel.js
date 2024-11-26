import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './OptionPanel.module.css';
import ArrowDownIcon from '../Sectionicons/ArrowDownIcon';
import useExpandPanel from '../../../hooks/useExpandPanel';
import ColorButtonGroup from './OptionSettings/ColorButtonGroup'; 
import FontSizeToggle from './OptionSettings/FontSizeToggle'; 
import ViewModeToggle from './OptionSettings/ViewModeToggle';
import TextArea from './OptionSettings/TextArea';
import TableControl from './OptionSettings/TableControl';
import SortOrderButton from './OptionSettings/SortOrderButton';

const OptionPanel = ({
  position,
  size,
  textValue,
  handleTextChange,
  fontSizeToggle,
  handleFontSizeToggle,
  viewMode,
  setViewMode,
  handleDelete,
  showOptionPannel,
  handleAddTable,
  handleAddBranch,
  handleColorChange,
  color,
  gridSize,
}) => {
  const { isExpanded, handleExpandClick } = useExpandPanel();
  const [selectedColor, setSelectedColor] = useState(color || '#4F75FF');

  useEffect(() => {
    setSelectedColor(color || '#4F75FF');
  }, [color]);

  const windowWidth = window.innerWidth;
  const panelWidth = windowWidth * 0.14;

  const onAddButtonClick = () => {
    const basePosition = {
      x: Math.round(position.x / gridSize[0]) * gridSize[0],
      y: Math.round(position.y / gridSize[1]) * gridSize[1],
    };

    const alignedPosition = {
      x: basePosition.x + gridSize[0],
      y: basePosition.y + gridSize[1],
    };

    const alignedSize = {
      width: Math.ceil(size.width / gridSize[0]) * gridSize[0],
      height: Math.ceil(size.height / gridSize[1]) * gridSize[1],
    };

    console.log('OptionPanel - Add Table Button Clicked:', {
      currentTablePosition: position,
      basePosition,
      alignedPosition,
      alignedSize,
      gridSize,
      newTableData: {
        position: alignedPosition,
        size: alignedSize,
        color: selectedColor,
        text: textValue
      }
    });

    handleAddTable({
      position: alignedPosition,
      size: alignedSize,
      color: selectedColor,
      text: textValue,
    });
  };

  return (
    <AnimatePresence>
      {showOptionPannel && (
        <motion.div
          className={`${styles.optionPannel} ${
            viewMode === 'dark' ? styles.darkModeBackground : ''
          }`}
          style={{
            left: position.x + size.width + panelWidth > windowWidth 
              ? `${position.x - panelWidth - 25}px`
              : `${position.x + size.width + 10}px`,
            top: `${position.y}px`,
            backgroundColor: viewMode === 'dark' ? '#333333' : '#FAFAFA',
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className={styles.optionMain}>
            <TextArea
              textValue={textValue}
              handleTextChange={handleTextChange}
            />

            <ColorButtonGroup
              handleColorChange={handleColorChange}
              color={color}
              setSelectedColor={setSelectedColor}
            />

            <TableControl
              onAddButtonClick={onAddButtonClick}
              handleDelete={handleDelete}
            />
          </div>

          {isExpanded && (
            <motion.div
              className={styles.expandPanelContainer}
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FontSizeToggle
                fontSizeToggle={fontSizeToggle}
                handleFontSizeToggle={handleFontSizeToggle}
              />

              <ViewModeToggle
                viewMode={viewMode}
                handleViewModeToggle={setViewMode}
              />

              <motion.div
                className={styles.blockContainer}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <button className={styles.blockButton} onClick={handleAddBranch}>
                  지점 표시
                </button>
                <SortOrderButton />
              </motion.div>
            </motion.div>
          )}

          <div className={styles.ExpandPanelIconWrapper} onClick={handleExpandClick}>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowDownIcon />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OptionPanel;
