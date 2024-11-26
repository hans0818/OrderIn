// Grid.js
import React from 'react';
import Table from './Table';
import styles from './Grid.module.css';

export default function Grid({
  gridSize,
  gridRef,
  tables,
  selectTable,
  editTable,
  deleteTable,
  optionPannelId,
  setOptionPannelId,
  viewMode,
  setViewMode,
  fontSize,
  fontSizeToggle,
  handleFontSizeToggle,
  isTableEditing,
  handleAddTable,
  children,
}) {
  const handleBackgroundClick = () => {
    selectTable(null);
    setOptionPannelId(null);
  };

  return (
    <div
      className={styles.gridContainer}
      style={{
        backgroundColor: isTableEditing
          ? viewMode === 'dark' ? '#333333' : '#F9F8FF'
          : viewMode === 'light'
          ? '#F9F8FF'
          : '#333333',
      }}
    >
      <div
        className={`${styles.gridContent} ${isTableEditing ? styles.editing : ''}`}
        style={{
          backgroundSize: `${gridSize[0]}px ${gridSize[1]}px`,
          backgroundColor: isTableEditing
            ? viewMode === 'dark' ? '#333333' : '#F9F8FF'
            : viewMode === 'light'
            ? 'transparent'
            : '#333333',
        }}
        ref={gridRef}
        onClick={handleBackgroundClick}
      >
        {tables
          .filter((table) => table !== undefined)
          .map((table) => (
            <Table
              key={table.key || table.id}
              id={table.id}
              gridSize={gridSize}
              gridRef={gridRef}
              position={table.position}
              size={table.size}
              isSelected={table.isSelected}
              onSelect={selectTable}
              onUpdate={editTable}
              onDelete={deleteTable}
              showOptionPannel={table.showOptionPannel}
              setOptionPannelId={setOptionPannelId}
              onAddTable={handleAddTable}
              isEditable={isTableEditing}
              color={table.color}
              text={table.text}
              fontSize={fontSize}
              fontSizeToggle={fontSizeToggle}
              handleFontSizeToggle={handleFontSizeToggle}
              viewMode={viewMode}
              setViewMode={setViewMode}
              isBranch={false}
            />
          ))}
        {children}
      </div>
    </div>
  );
}
