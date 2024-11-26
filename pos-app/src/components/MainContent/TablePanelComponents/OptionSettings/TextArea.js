// OptionSettings/TextArea.js
import React from 'react';
import styles from './TextArea.module.css';

const TextArea = ({ textValue, handleTextChange }) => {
  return (
    <textarea
      value={textValue}
      onChange={handleTextChange}
      className={styles.textBox}
      placeholder="새 테이블"
    />
  );
};

export default TextArea;
