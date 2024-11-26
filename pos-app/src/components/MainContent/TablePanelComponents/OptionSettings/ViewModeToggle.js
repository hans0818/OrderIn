// OptionSettings/ViewModeToggle.js
import React from 'react';
import { motion } from 'framer-motion';
import styles from './ViewModeToggle.module.css'; // Create corresponding CSS

const ViewModeToggle = ({ viewMode, handleViewModeToggle }) => {
  const getViewModeSquarePosition = () => {
    switch (viewMode) {
      case 'light':
        return '1%';
      case 'dark':
        return 'calc(49%)';
      default:
        return '1%';
    }
  };

  return (
    <motion.div
      className={styles.viewModeToggleContainer}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.viewModeToggleTrack}>
        <motion.div
          className={styles.toggleSquareViewMode}
          style={{ left: getViewModeSquarePosition() }}
          animate={{ left: getViewModeSquarePosition() }}
          transition={{ duration: 0.3 }}
        />
        <button onClick={() => handleViewModeToggle('light')}>
          밝게
        </button>
        <button onClick={() => handleViewModeToggle('dark')}>
          어둡게
        </button>
      </div>
    </motion.div>
  );
};

export default ViewModeToggle;
