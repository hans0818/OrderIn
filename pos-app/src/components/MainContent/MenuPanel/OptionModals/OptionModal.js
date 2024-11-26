import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './OptionModal.module.css';

const OptionModal = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  title,
  fieldName,
  fieldLabel,
  fieldPlaceholder,
  additionalPriceLabel,
  initialData = [],
  isTopping = false
}) => {
  const defaultField = React.useMemo(() => ({
    [fieldName]: '',
    additionalPrice: '',
    type: isTopping ? 'add' : undefined
  }), [fieldName, isTopping]);

  const [tempInputFields, setTempInputFields] = useState([defaultField]);

  useEffect(() => {
    if (isOpen) {
      if (initialData && initialData.length > 0) {
        const formattedData = initialData.map(item => ({
          [fieldName]: item[fieldName] || '',
          additionalPrice: (item.additionalPrice || '').toString(),
          type: isTopping ? (item.type || 'add') : undefined
        }));
        setTempInputFields(formattedData);
      } else {
        setTempInputFields([defaultField]);
      }
    }
  }, [isOpen, initialData, fieldName, isTopping, defaultField]);

  const addNewField = useCallback(() => {
    setTempInputFields(prev => [...prev, defaultField]);
  }, [defaultField]);

  const handleSubmit = (e) => {
    e.preventDefault();
    addNewField();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addNewField();
    }
  };

  const handleInputChange = (index, field, value) => {
    setTempInputFields(prev => {
      const newFields = [...prev];
      newFields[index] = {
        ...newFields[index],
        [field]: value
      };
      return newFields;
    });
  };

  const handleComplete = () => {
    const validFields = tempInputFields.filter(
      field => field[fieldName].trim() !== ''
    );
    onSubmit(validFields);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`${styles.modalContent} ${isTopping ? styles.toppingModal : ''}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h3>{title}</h3>
            <div className={styles.optionModalContainer}>
              <div className={styles.optionModalHeader}>
                <div className={styles.optionModalGroup}>
                  <label>
                    {fieldLabel}
                    <span className={styles.required}>*</span>
                  </label>
                </div>
                <div className={styles.optionModalPriceGroup}>
                  <label>{additionalPriceLabel}</label>
                </div>
                {isTopping && (
                  <div className={styles.optionModalTypeGroup}>
                    <label>추가/제거</label>
                  </div>
                )}
              </div>
              {tempInputFields.map((field, index) => (
                <motion.div
                  key={index}
                  className={styles.optionModalRow}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={styles.optionModalGroup}>
                    <input
                      type="text"
                      className={styles.optionModalInput}
                      value={field[fieldName] || ''}
                      onChange={(e) => handleInputChange(index, fieldName, e.target.value)}
                      placeholder={fieldPlaceholder}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      autoFocus={index === tempInputFields.length - 1}
                    />
                  </div>
                  <div className={styles.optionModalPriceGroup}>
                    <div className={styles.optionModalPriceInput}>
                      <input
                        type="text"
                        className={styles.optionModalPriceField}
                        value={field.additionalPrice || ''}
                        onChange={(e) => handleInputChange(index, 'additionalPrice', e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="0"
                        onKeyDown={(e) => handleKeyDown(e, index)}
                      />
                      <span className={styles.won}>원</span>
                    </div>
                  </div>
                  {isTopping && (
                    <div className={styles.optionModalSelectGroup}>
                      <select
                        value={field.type || 'add'}
                        onChange={(e) => handleInputChange(index, 'type', e.target.value)}
                        className={styles.optionModalSelect}
                      >
                        <option value="add">추가</option>
                        <option value="remove">제거</option>
                      </select>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            <button type="button" className={styles.addText} onClick={handleSubmit}>
              + 추가하기[Enter]
            </button>
            <p className={styles.priceHint}>금액은 꼭 적으실 필요없어요</p>
            {isTopping && (
              <p className={styles.toppingHint}>알레르기 심한 음식은 제거가 도움이 되요</p>
            )}

            <div className={styles.modalFooter}>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={handleClose}
              >
                취소
              </button>
              <button 
                type="button" 
                className={styles.completeButton}
                onClick={handleComplete}
              >
                저장
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OptionModal;
