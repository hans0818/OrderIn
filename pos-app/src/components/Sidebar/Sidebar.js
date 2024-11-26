import React, { useState } from 'react';
import styles from './Sidebar.module.css';

function Sidebar() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <div 
        className={styles.hoverArea}
        onMouseEnter={() => setIsVisible(true)}
      />
      <div 
        className={`${styles.sidebar} ${isVisible ? styles.expanded : ''}`}
        onMouseLeave={() => setIsVisible(false)}
      >
        <div className={styles.sidebarContent}>
          <div className={styles.quickButtonContainer}>
            <h2 className={styles.quickButtonTitle}>퀵버튼</h2>
            <div className={styles.placeholderGrid}>
              {[...Array(6)].map((_, index) => (
                <div key={index} className={styles.quickButtonPlaceholder}></div>
              ))}
            </div>
            <button className={styles.addButton}>+ 버튼 추가</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;