import React from 'react';
import styles from './CategorySwitch.module.css'; // CSS 모듈 임포트

function CategorySwitch({ isBeverage, handleToggle }) {
  return (
    <div className={styles.categorySwitchContainer}>
      <label className={styles.categorySwitch}>
        <input type="checkbox" checked={isBeverage} onChange={handleToggle} />
        <span className={styles.categorySlider}></span>
      </label>
    </div>
  );
}

export default CategorySwitch;
