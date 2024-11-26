import React from 'react';
import styles from '../Header.module.css';

export const SpaceEdit = ({ onEditSection, isEditingSpace, isTableEditing, isMenuEditing, setShowDropdown }) => {
  const handleSpaceEdit = () => {
    if (!isTableEditing && !isMenuEditing) {
      setShowDropdown(false);
      onEditSection();
    }
  };

  return (
    <span 
      className={`${styles.functionButton} ${isEditingSpace ? styles.active : ''}`}
      onClick={handleSpaceEdit}
    >
      공간 편집
    </span>
  );
};

export const TableEdit = ({ onTableEdit, isEditingSpace, isTableEditing, isMenuEditing, setShowDropdown }) => {
  const handleTableEdit = () => {
    if (!isEditingSpace && !isMenuEditing) {
      setShowDropdown(false);
      onTableEdit();
    }
  };

  return (
    <span 
      className={`${styles.functionButton} ${isTableEditing ? styles.active : ''}`}
      onClick={handleTableEdit}
    >
      테이블 편집
    </span>
  );
};

export const MenuEdit = ({ onMenuEdit, isEditingSpace, isTableEditing, isMenuEditing, setShowDropdown }) => {
  const handleMenuEdit = () => {
    if (!isEditingSpace && !isTableEditing) {
      setShowDropdown(false);
      onMenuEdit();
    }
  };

  return (
    <span 
      className={`${styles.functionButton} ${isMenuEditing ? styles.active : ''}`}
      onClick={handleMenuEdit}
    >
      메뉴 편집
    </span>
  );
}; 