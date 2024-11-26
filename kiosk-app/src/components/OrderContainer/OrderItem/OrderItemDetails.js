import React from 'react';
import { motion } from 'framer-motion';
import styles from './OrderItem.module.css';
import SizeButton from '../OptionButtons/SizeButton';
import TasteButton from '../OptionButtons/TasteButton';
import ToppingsButton from '../OptionButtons/ToppingsButton';
import CommonButton from '../../common/CommonButton';

function OrderItemDetails({
  isDetailOpen,
  sizeOptions,
  tasteOptions,
  toppingsOptions,
  selectedSize,
  selectedTaste,
  selectedToppings,
  openModal,
  getFormattedToppings,
  optionsVariants,
  onToggleDetail
}) {
  const containerVariants = {
    hidden: {
      opacity: 0,
      height: 0,
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      className={styles.optionsContainer}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className={styles.optionsRow}>
        <motion.div variants={itemVariants}>
          <SizeButton
            sizeOptions={sizeOptions}
            selectedSize={selectedSize}
            onClick={openModal}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <TasteButton
            tasteOptions={tasteOptions}
            selectedTaste={selectedTaste}
            onClick={openModal}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <ToppingsButton
            toppingsOptions={toppingsOptions}
            selectedToppings={selectedToppings}
            onClick={openModal}
            getFormattedToppings={getFormattedToppings}
          />
        </motion.div>
      </div>
      <div className={styles.closeButtonRow}>
        <div className={styles.closeButtonContainer}>
          <CommonButton
            variant="detail"
            onClick={onToggleDetail}
            isActive={isDetailOpen}
          >
            접기
          </CommonButton>
        </div>
      </div>
    </motion.div>
  );
}

export default OrderItemDetails; 