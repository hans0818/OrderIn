// DeleteModal.js
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './DeleteModal.module.css';

export default function DeleteModal({ isOpen, onClose, onConfirm }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className={styles.deleteModalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className={styles.deleteModalContent}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p>정말 이 메뉴를 삭제하시겠습니까?</p>
            <div className={styles.deleteModalButtons}>
              <button 
                onClick={onClose} 
                className={styles.cancelButton}
              >
                취소
              </button>
              <button 
                onClick={onConfirm} 
                className={styles.deleteButton}
              >
                삭제
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
