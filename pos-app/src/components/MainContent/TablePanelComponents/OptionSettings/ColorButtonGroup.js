import React from 'react';
import styles from './ColorButtonGroup.module.css';

const ColorButtonGroup = ({ handleColorChange, color }) => {
  const handleColorButtonClick = (newColor) => {
    handleColorChange(newColor);
  };

  return (
    <div className={styles.colorButtonContainer}>
      <div
        className={`${styles.colorButton} ${styles.colorButton1}`}
        onClick={() => handleColorButtonClick('#4F75FF')}
      >
        {color === '#4F75FF' && (
          <span className={styles.checkMark}>✔</span>
        )}
      </div>
      <div
        className={`${styles.colorButton} ${styles.colorButton2}`}
        onClick={() => handleColorButtonClick('#E74800')}
      >
        {color === '#E74800' && (
          <span className={styles.checkMark}>✔</span>
        )}
      </div>
      <div
        className={`${styles.colorButton} ${styles.colorButton3}`}
        onClick={() => handleColorButtonClick('#00A06A')}
      >
        {color === '#00A06A' && (
          <span className={styles.checkMark}>✔</span>
        )}
      </div>
      <div
        className={`${styles.colorButton} ${styles.colorButton4}`}
        onClick={() => handleColorButtonClick('#FFA500')}
      >
        {color === '#FFA500' && (
          <span className={styles.checkMark}>✔</span>
        )}
      </div>
    </div>
  );
};

export default ColorButtonGroup;
