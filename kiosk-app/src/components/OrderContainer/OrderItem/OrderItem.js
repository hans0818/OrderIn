// src/components/OrderContainer/OrderItem.js
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import styles from './OrderItem.module.css';

import OptionSelectionModal from '../Modal/OptionSelectionModal';
import QuantityControl from './QuantityControl';
import OrderItemDetails from './OrderItemDetails';

import { calculateTotalPrice } from '../../../utils/orderUtils';
import CommonButton from '../../common/CommonButton';
import useOrderItem from '../../../hooks/order/useOrderItem';

function OrderItem({
  menuId,
  id,
  itemName,
  price,
  sizeOptions = [],
  tasteOptions = [],
  toppingsOptions = [],
  selectedSize: initialSelectedSize,
  selectedTaste: initialSelectedTaste,
  selectedToppings: initialSelectedToppings,
  onRemove,
  onClick,
  onSizeChange,
  onTasteChange,
  onToppingsChange,
  selectedItems,
  isDetailOpen: initialIsDetailOpen,
  quantity,
  onIncreaseQuantity,
  onDecreaseQuantity,
}) {
  console.log('OrderItem 렌더링:', {
    menuId,
    itemName,
    sizeOptions,
    tasteOptions,
    toppingsOptions
  });

  const {
    selectedSize,
    selectedTaste,
    selectedToppings,
    isDetailOpen,
    isModalOpen,
    modalType,
    handleRemove,
    handleItemClick,
    handleOptionSelect,
    handleToppingsComplete,
    getFormattedToppings,
    toggleDetail,
    openModal,
    closeModal,
    optionsVariants
  } = useOrderItem({
    menuId,
    id,
    propSelectedSize: initialSelectedSize,
    propSelectedTaste: initialSelectedTaste,
    propSelectedToppings: initialSelectedToppings,
    propIsDetailOpen: initialIsDetailOpen,
    sizeOptions,
    tasteOptions,
    toppingsOptions,
    onRemove,
    onClick,
    onSizeChange,
    onTasteChange,
    onToppingsChange,
  });

  // 세부주문 버튼 표시 여부 결정
  const showDetailOrderButton =
    sizeOptions.length > 0 ||
    tasteOptions.length > 0 ||
    toppingsOptions.length > 0;

  const totalPrice = calculateTotalPrice(
    {
      price,
      selectedSize,
      selectedTaste,
      selectedToppings,
      quantity
    },
    tasteOptions,
    toppingsOptions
  );

  const getDisabledOptions = () => {
    if (modalType === 'size' || modalType === 'taste') {
      return selectedItems
        .filter((item) => item.menuId === menuId && item.id !== id)
        .map((item) =>
          modalType === 'size' ? item.selectedSize?.label : item.selectedTaste
        );
    }
    return [];
  };

  return (
    <div className={styles.orderItem} onClick={handleItemClick}>
      <span className={styles.itemName}>{itemName}</span>
      <QuantityControl
        quantity={quantity}
        onIncrease={() => {
          onIncreaseQuantity();
        }}
        onDecrease={() => {
          onDecreaseQuantity();
        }}
        onRemove={(e) => {
          e.stopPropagation();
          handleRemove(e);
        }}
      />
      <span className={styles.price}>{totalPrice}원</span>
      {showDetailOrderButton && !isDetailOpen && (
        <div className={styles.detailButtonContainer}>
          <CommonButton
            variant="detail"
            onClick={toggleDetail}
            isActive={false}
          >
            세부주문
          </CommonButton>
        </div>
      )}
      <AnimatePresence>
        {isDetailOpen && (
          <OrderItemDetails
            isDetailOpen={isDetailOpen}
            sizeOptions={sizeOptions}
            tasteOptions={tasteOptions}
            toppingsOptions={toppingsOptions}
            selectedSize={selectedSize}
            selectedTaste={selectedTaste}
            selectedToppings={selectedToppings}
            openModal={openModal}
            getFormattedToppings={getFormattedToppings}
            optionsVariants={optionsVariants}
            onToggleDetail={toggleDetail}
          />
        )}
      </AnimatePresence>
      <OptionSelectionModal
        isOpen={isModalOpen}
        modalType={modalType}
        selectedSize={selectedSize}
        selectedTaste={selectedTaste}
        selectedToppings={selectedToppings}
        sizeOptions={sizeOptions}
        tasteOptions={tasteOptions}
        toppingsOptions={toppingsOptions}
        onClose={closeModal}
        onSelect={handleOptionSelect}
        disabledOptions={getDisabledOptions()}
        handleToppingsComplete={handleToppingsComplete}
      />
    </div>
  );
}

export default OrderItem;

