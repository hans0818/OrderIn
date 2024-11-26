// LeftSection.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './LeftSection.module.css';

const LeftSection = ({
  selectedCategory,
  handleMenuAdd,
  menuList,
  selectedMenu,
  handleMenuClick,
}) => {
  return (
    <div className={styles.leftSection}>
      <div className={styles.menuActionButtons}>
        <button 
          className={styles.addButton} 
          onClick={handleMenuAdd}
        >
          메뉴 추가 [F9]
        </button>
      </div>
      {selectedCategory?.name && (
        <>
          <div className={styles.menuListContainer}>
            <AnimatePresence>
              {menuList[selectedCategory?.name]?.map((menu, index) => (
                <motion.button 
                  key={index} 
                  className={`${styles.menuListButton} ${selectedMenu?.name === menu.name ? styles.selected : ''}`}
                  onClick={() => handleMenuClick(menu)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className={styles.menuName}>{menu.name}</span>
                  <span className={styles.menuPrice}>{menu.price}원</span>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};

export default LeftSection;
