import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SelectionModal.module.css';

function SelectionModal({ isOpen, onClose, title, options, selectedOption, onSelect, multiSelect = false }) {
  const handleOptionClick = (option) => {
    onSelect(option);
    // multiSelect가 false일 때만 (size, taste 선택 시) 자동으로 닫힘
    if (!multiSelect) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modalContent}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{title}</h2>
            <div className={styles.optionsList}>
              {options.map((option, index) => {
                const isSelected = multiSelect 
                  ? Array.isArray(selectedOption) && selectedOption.includes(option.label)
                  : selectedOption === option.label;
                return (
                  <button
                    key={index}
                    className={`${styles.optionButton} ${isSelected ? styles.selected : ''}`}
                    onClick={() => handleOptionClick(option)}
                  >
                    {option.label === '기본' ? '기본' : option.label}
                    {option.price ? ` (+${option.price}원)` : ''}
                    {isSelected && <span className={styles.checkmark}>✓</span>}
                  </button>
                );
              })}
            </div>
            {multiSelect && (
              <button 
                className={styles.closeButton} 
                onClick={onClose}
              >
                완료
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SelectionModal;
