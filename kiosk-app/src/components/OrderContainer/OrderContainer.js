// src/components/OrderContainer/OrderContainer.js
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './OrderContainer.module.css';
import OrderItem from './OrderItem/OrderItem';
import OrderTopContainer from './OrderTopContainer';

function OrderContainer({
  orders,
  onRemoveItem,
  scrollToMenuItem,
  onHeightChange,
  onSizeChange,
  onTasteChange,
  onToppingsChange,
  handleIncreaseQuantity,
  handleDecreaseQuantity,
  isVisible,
}) {
  const [height, setHeight] = useState(40); // 기본 높이값 설정

  const handleHeightChange = useCallback((newHeight) => {
    setHeight(newHeight);
  }, []);

  console.log('OrderContainer에 전달된 orders:', orders); // 디버깅 로그 추가

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className={styles.orderContainer}
          initial={{ opacity: 0, height: `${height}vh` }}
          animate={{ opacity: 1, height: `${height}vh` }}
          exit={{ opacity: 0, height: `${height}vh` }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
        >
          <OrderTopContainer 
            onHeightChange={handleHeightChange} 
            orders={orders} 
          />
          <div className={styles.orderBottomContainer}>
            <div className={styles.orderContentWrapper}>
              <ul>
                {orders.map((order) => {
                  console.log('각 주문 아이템의 옵션 데이터:', {
                    itemName: order.name,
                    sizes: order.sizes,
                    tastes: order.tastes,
                    toppings: order.toppings
                  }); // 디버깅 로그 추가
                  
                  return (
                    <li key={order.id}>
                      <OrderItem
                        menuId={order.menuId}
                        id={order.id}
                        itemName={order.name}
                        price={order.price}
                        sizeOptions={order.sizes || []}
                        tasteOptions={order.tastes || []}
                        toppingsOptions={order.toppings || []}
                        selectedSize={order.selectedSize}
                        selectedTaste={order.selectedTaste}
                        selectedToppings={order.selectedToppings}
                        onRemove={() => onRemoveItem(order.id)}
                        onClick={() => scrollToMenuItem(order.menuId)}
                        onSizeChange={(size) => onSizeChange(order.id, size)}
                        onTasteChange={(taste) => onTasteChange(order.id, taste)}
                        onToppingsChange={(toppings, hasSelectedToppings, totalToppingsPrice) =>
                          onToppingsChange(order.id, toppings, hasSelectedToppings, totalToppingsPrice)
                        }
                        selectedItems={orders}
                        isDetailOpen={order.isDetailOpen}
                        quantity={order.quantity}
                        onIncreaseQuantity={() => handleIncreaseQuantity(order.id)}
                        onDecreaseQuantity={() => handleDecreaseQuantity(order.id)}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default React.memo(OrderContainer);
