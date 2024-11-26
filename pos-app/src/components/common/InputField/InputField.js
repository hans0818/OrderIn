import React from 'react';
import { motion } from 'framer-motion';
import styles from './InputField.module.css';

const InputField = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  success,
  hint,
  autoFocus = false,
  className,
  isSSN = false,
  ssnValues,
  onSsnChange,
  ...props
}) => {
  const renderSsnInput = () => {
    return (
      <div className={styles.inputGroup}>
        <input
          type="text"
          name="ssn"
          value={`${ssnValues?.ssn || ''}${ssnValues?.ssnGender || ''}`}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, '');
            if (value.length <= 7) {
              const ssn = value.slice(0, 6);
              const gender = value.slice(6, 7);
              onSsnChange({
                target: {
                  name: 'ssnFirst',
                  value: ssn
                }
              });
              if (gender) {
                onSsnChange({
                  target: {
                    name: 'ssnLast',
                    value: gender
                  }
                });
              }
            }
          }}
          maxLength={7}
          placeholder="주민번호 7자리를 입력하세요"
          className={styles.input}
          autoFocus={autoFocus}
        />
      </div>
    );
  };

  return (
    <motion.div
      className={`${styles.inputGroup} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      <label htmlFor={name}>{label}</label>
      {isSSN ? renderSsnInput() : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          {...props}
        />
      )}
      {error && <span className={styles.error}>{error}</span>}
      {success && <span className={styles.success}>{success}</span>}
      {hint && <p className={styles.hint}>{hint}</p>}
    </motion.div>
  );
};

export default InputField; 