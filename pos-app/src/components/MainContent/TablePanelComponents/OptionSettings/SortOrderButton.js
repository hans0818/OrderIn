import React from 'react';
import styles from './SortOrderButton.module.css';

const SortOrderButton = ({ onClick }) => {
  return (
    <button className={styles.sortOrderButton} onClick={onClick}>
      순서 정렬
    </button>
  );
};

export default SortOrderButton; 