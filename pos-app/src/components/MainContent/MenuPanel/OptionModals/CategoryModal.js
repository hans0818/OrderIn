// CategoryModal.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './CategoryModal.module.css';

export default function CategoryModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  newCategoryName, 
  setNewCategoryName 
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className={styles.modalContent}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h3>카테고리 추가</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="카테고리 이름을 입력하세요"
                className={styles.categoryInput}
                autoFocus
              />
              <div className={styles.modalButtons}>
                <button 
                  type="button" 
                  onClick={onClose} 
                  className={styles.cancelButton}
                >
                  취소
                </button>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                >
                  추가
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
