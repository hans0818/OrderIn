import React from 'react';
import styles from './FontSizeToggle.module.css';

const FontSizeToggle = ({ fontSizeToggle, handleFontSizeToggle }) => {
  const getFontSizeSquarePosition = () => {
    switch (fontSizeToggle) {
      case 0:
        return '1%';
      case 1:
        return 'calc(33.33%)';
      case 2:
        return 'calc(66.66% - 1%)';
      default:
        return '1%';
    }
  };

  const handleFontSizeButtonClick = (idx) => {
    handleFontSizeToggle(idx);
  };

  return (
    <div className={styles.fontSizeToggleContainer}>
      <div className={styles.fontSizeToggleTrack}>
        <div
          className={styles.toggleSquareFontSize}
          style={{ left: getFontSizeSquarePosition() }}
        />
        <button
          className={`${styles.fontSizeToggleButton} ${styles.fontSizeToggleSmall}`}
          onClick={() => handleFontSizeButtonClick(0)}
        >
          가
        </button>
        <button
          className={`${styles.fontSizeToggleButton} ${styles.fontSizeToggleMedium}`}
          onClick={() => handleFontSizeButtonClick(1)}
        >
          가
        </button>
        <button
          className={`${styles.fontSizeToggleButton} ${styles.fontSizeToggleLarge}`}
          onClick={() => handleFontSizeButtonClick(2)}
        >
          가
        </button>
      </div>
    </div>
  );
};

export default FontSizeToggle;
