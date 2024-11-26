import React, { useState } from 'react';
import styles from './CompletedField.module.css';

const CompletedField = ({
  label,
  value,
  name,
  type = 'text',
  onChange,
  isSSN = false,
  isPassword = false,
  maxLength,
  placeholder,
  ssnValues,
  onSsnChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState('');

  const handleEditStart = () => {
    if (!isEditing) {
      if (isSSN) {
        const initialValue = `${ssnValues?.ssn || ''}${ssnValues?.ssnGender || ''}`;
        setTempValue(initialValue);
      }
      setIsEditing(true);
    }
  };

  const handleEditChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 7) {
      setTempValue(value);
    }
  };

  const handleEditComplete = () => {
    if (tempValue.length === 7) {
      onSsnChange({
        target: {
          name: 'ssnFirst',
          value: tempValue.slice(0, 6)
        }
      });
      onSsnChange({
        target: {
          name: 'ssnLast',
          value: tempValue.charAt(6)
        }
      });
    }
    setIsEditing(false);
    setTempValue('');
  };

  const renderEditInput = () => {
    if (isSSN) {
      return (
        <input
          type="text"
          name="ssn"
          value={tempValue}
          onChange={handleEditChange}
          onBlur={handleEditComplete}
          maxLength={7}
          placeholder="주민번호 7자리"
          className={styles.editInput}
          autoFocus
        />
      );
    }

    return (
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        onBlur={() => setIsEditing(false)}
        maxLength={maxLength}
        placeholder={placeholder}
        className={styles.editInput}
        autoFocus
      />
    );
  };

  const displayValue = () => {
    if (isPassword) {
      return '●'.repeat(value?.length || 0);
    }
    if (isSSN && ssnValues) {
      return `${ssnValues.ssn}-${ssnValues.ssnGender}******`;
    }
    return value;
  };

  return (
    <div className={styles.completedField} onClick={handleEditStart}>
      <div className={styles.labelWrapper}>
        <span className={styles.label}>{label}</span>
      </div>
      {isEditing ? renderEditInput() : <div className={styles.value}>{displayValue()}</div>}
    </div>
  );
};

export default CompletedField; 