import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './EditModal.module.css';

export default function EditModal({ isOpen, onClose, onSubmit, items, title, type }) {
  const [localItems, setLocalItems] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (items) {
      setLocalItems([...items]);
      setHasChanges(false);
      inputRefs.current = items.map(() => React.createRef());
    }
  }, [items]);

  const moveItem = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= localItems.length) return;
    const updatedItems = [...localItems];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    setLocalItems(updatedItems);
    setHasChanges(true);
  };

  const handleDelete = (index) => {
    const updatedItems = localItems.filter((_, i) => i !== index);
    setLocalItems(updatedItems);
    setHasChanges(true);
  };

  const handleNameChange = (index, newName) => {
    const updatedItems = [...localItems];
    updatedItems[index] = { ...updatedItems[index], name: newName };
    setLocalItems(updatedItems);
    setHasChanges(true);
  };

  const handlePriceChange = (index, newPrice) => {
    const updatedItems = [...localItems];
    updatedItems[index] = { 
      ...updatedItems[index], 
      price: newPrice.replace(/[^0-9]/g, '')
    };
    setLocalItems(updatedItems);
    setHasChanges(true);
  };

  const handleAddItem = () => {
    if (type !== 'menu' && localItems.length >= 6) {
      alert('카테고리는 최대 6개까지만 추가할 수 있습니다.');
      return;
    }

    const newItem = type === 'menu' 
      ? { id: Date.now(), name: '', price: '' }
      : { id: Date.now(), name: '' };
    
    setLocalItems(prev => {
      const newItems = [...prev, newItem];
      inputRefs.current.push(React.createRef());
      
      setTimeout(() => {
        const newIndex = newItems.length - 1;
        inputRefs.current[newIndex]?.current?.focus();
      }, 0);
      
      return newItems;
    });
    setHasChanges(true);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddItem();
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      const shouldClose = window.confirm('변경사항이 있습니다. 저장하지 않고 닫으시겠습니까?');
      if (shouldClose) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleSubmit = () => {
    if (type === 'category') {
      const invalidItems = localItems.filter(item => !item.name.trim());
      if (invalidItems.length > 0) {
        alert('카테고리 이름은 필수 항목입니다.');
        return;
      }
    } else if (type === 'menu') {
      const invalidItems = localItems.filter(item => !item.name.trim() || !item.price);
      if (invalidItems.length > 0) {
        alert('메뉴 이름과 가격은 필수 항목입니다.');
        return;
      }
    }

    const filteredItems = localItems.filter(item => {
      if (type === 'menu') {
        return item.name.trim() !== '' && item.price !== '';
      } else {
        return item.name.trim() !== '';
      }
    });

    if (filteredItems.length === 0) {
      alert('저장할 항목이 없습니다.');
      return;
    }

    const itemsWithOrder = filteredItems.map((item, index) => ({
      ...item,
      order: index,
      name: item.name.trim(),
      ...(type === 'menu' && { price: item.price })
    }));

    console.log(`${type} 편집 완료:`, itemsWithOrder);
    onSubmit(itemsWithOrder, type);
    setHasChanges(false);
  };

  const handleItemClick = (itemId) => {
    setSelectedItemId(itemId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className={styles.modalOverlay}>
          <motion.div
            className={`${styles.modalContent} ${type === 'menu' ? styles.menuModalContent : ''}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            tabIndex={-1}
          >
            <h3>{title}</h3>
            <div className={styles.categoryEditContainer}>
              {type === 'menu' && (
                <div className={styles.headerLabels}>
                  <div className={styles.indexLabel}>#</div>
                  <div className={styles.nameLabel}>메뉴 이름</div>
                  <div className={styles.priceLabel}>가격</div>
                </div>
              )}
              <AnimatePresence>
                {localItems.map((item, index) => (
                  <motion.div 
                    key={item.id || `${type}-${index}`} 
                    className={`${styles.categoryEditRow} ${
                      selectedItemId === item.id ? styles.selected : ''
                    }`}
                    onClick={() => handleItemClick(item.id)}
                    layout
                  >
                    <div className={styles.categoryIndex}>{index + 1}</div>
                    {type === 'menu' ? (
                      <div className={styles.inputGroup}>
                        <input
                          type="text"
                          className={styles.categoryEditInput}
                          value={item.name}
                          onChange={(e) => handleNameChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          ref={inputRefs.current[index]}
                        />
                        <div className={styles.priceInputContainer}>
                          <input
                            type="text"
                            className={styles.categoryEditInput}
                            value={item.price}
                            onChange={(e) => handlePriceChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                          />
                          <div className={styles.currencyOverlay}>원</div>
                        </div>
                      </div>
                    ) : (
                      <input
                        type="text"
                        className={styles.categoryEditInput}
                        value={item.name}
                        onChange={(e) => handleNameChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        placeholder="카테고리 이름"
                        ref={inputRefs.current[index]}
                      />
                    )}
                    <div className={styles.categoryOrderButtons}>
                      <div className={styles.arrowButtons}>
                        <button
                          type="button"
                          className={styles.moveUpButton}
                          onClick={() => moveItem(index, index - 1)}
                          disabled={index === 0}
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          className={styles.moveDownButton}
                          onClick={() => moveItem(index, index + 1)}
                          disabled={index === localItems.length - 1}
                        >
                          ▼
                        </button>
                      </div>
                      {localItems.length > 1 && (
                        <button
                          type="button"
                          className={styles.categoryEditRemoveButton}
                          onClick={() => handleDelete(index)}
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <span 
                className={styles.addText}
                onClick={handleAddItem}
                role="button"
                tabIndex={0}
              >
                추가하기 <span className={styles.shortcutText}>[Enter]</span>
              </span>
            </div>
            <div className={styles.modalFooter}>
              <button 
                type="button" 
                className={styles.categoryEditCancelButton}
                onClick={handleClose}
              >
                취소
              </button>
              <button 
                type="button" 
                className={styles.categoryEditCompleteButton}
                onClick={handleSubmit}
              >
                완료
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
