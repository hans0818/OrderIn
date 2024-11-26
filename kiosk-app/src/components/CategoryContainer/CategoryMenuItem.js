// src/components/CategoryContainer/CategoryMenuItem.js
import React from 'react';
import { motion } from 'framer-motion';
import styles from './CategoryMenu.module.css';

function CategoryMenuItem({
  category,
  index,
  activeIndex,
  categoryItemRefs,
  handleCategoryClick,
}) {
  return (
    <motion.span
      ref={(el) => {
        categoryItemRefs.current[index] = el;
      }}
      onClick={() => {
        handleCategoryClick(index);
      }}
      animate={{
        fontSize: activeIndex === index ? '24px' : '16px',
        color: activeIndex === index ? '#000000' : '#7d7d7d',
      }}
      transition={{ duration: 0.3 }}
      className={styles.categoryItem}
    >
      {category.name}
    </motion.span>
  );
}

export default CategoryMenuItem;
