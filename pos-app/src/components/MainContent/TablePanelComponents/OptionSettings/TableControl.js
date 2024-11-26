// OptionSettings/TableControl.js
import React from 'react';
import TableDeleteIcon from '../../Sectionicons/TableDeleteIcon';
import styles from './TableControl.module.css';

const TableControl = ({ onAddButtonClick, handleDelete }) => {
  return (
    <div className={styles.tableControlContainer}>
      <button className={styles.addButton} onClick={onAddButtonClick}>
        추가
      </button>
      <button className={styles.deleteButton} onClick={handleDelete}>
        <TableDeleteIcon />
      </button>
    </div>
  );
};

export default TableControl;
