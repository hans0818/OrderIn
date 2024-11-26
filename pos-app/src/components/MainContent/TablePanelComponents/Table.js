// Table.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import { motion } from 'framer-motion';
import { db, auth } from '../../../firebase/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import OptionPanel from './OptionPanel';
import styles from './Table.module.css';
import { POS_CONFIG } from '../../../config/constants';
import PaymentScreen from './PaymentScreen';
import useTableDragResize from '../../../hooks/useTableDragResize';

export default function Table(props) {
  const {
    id,
    gridSize,
    position = { x: 0, y: 0 },
    size = { width: gridSize[0], height: gridSize[1] },
    isSelected,
    onSelect,
    onUpdate,
    onDelete,
    showOptionPannel,
    setOptionPannelId,
    onAddTable,
    isEditable = true,
    color = '#4F75FF',
    text = '새 테이블',
    fontSize = 14,
    fontSizeToggle = 0,
    handleFontSizeToggle,
    viewMode,
    setViewMode,
  } = props;

  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showPaymentScreen, setShowPaymentScreen] = useState(false);
  const [orderStartTime, setOrderStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState('00:00');
  const contentRef = useRef(null);

  const processOrders = (ordersList) => {
    const menuQuantities = {};
    let total = 0;

    ordersList.forEach((order) => {
      order.orders.forEach((item) => {
        const menuKey = `${item.name}-${JSON.stringify(item.selectedSize)}-${item.selectedTaste}-${JSON.stringify(
          item.selectedToppings
        )}`;

        if (!menuQuantities[menuKey]) {
          menuQuantities[menuKey] = {
            ...item,
            quantity: 0,
          };
        }
        menuQuantities[menuKey].quantity += item.quantity;
        total += item.price * item.quantity;
      });
    });

    return {
      combinedOrders: Object.values(menuQuantities),
      totalAmount: total,
    };
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      return;
    }

    const ordersRef = collection(db, `users/${user.uid}/stores/${POS_CONFIG.STORE_NAME}/orders`);
    const tableOrdersQuery = query(ordersRef, where('tableId', '==', id));

    const unsubscribe = onSnapshot(tableOrdersQuery, (snapshot) => {
      const latestOrders = [];

      snapshot.forEach((doc) => {
        const orderData = doc.data();

        if (orderData.status === 'pending') {
          latestOrders.push({
            id: doc.id,
            ...orderData,
          });
        }
      });

      const { combinedOrders, totalAmount } = processOrders(latestOrders);

      setOrders([{ id: 'combined', orders: combinedOrders }]);
      setTotalAmount(totalAmount);
    });

    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    if (orders.length > 0 && orders[0].orders.length > 0) {
      const oldestOrder = orders[0].orders.reduce((oldest, current) => {
        const currentTime = new Date(current.timestamp || Date.now()).getTime();
        return oldest ? Math.min(oldest, currentTime) : currentTime;
      }, null);

      setOrderStartTime(oldestOrder);
    } else {
      setOrderStartTime(null);
      setElapsedTime('00:00');
    }
  }, [orders]);

  useEffect(() => {
    let intervalId;

    if (orderStartTime) {
      intervalId = setInterval(() => {
        const now = Date.now();
        const diff = now - orderStartTime;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        setElapsedTime(
          `${hours > 0 ? `${String(hours).padStart(2, '0')}:` : ''}${String(remainingMinutes).padStart(2, '0')}:${String(
            Math.floor((diff % 60000) / 1000)
          ).padStart(2, '0')}`
        );
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [orderStartTime]);

  useEffect(() => {
    if (contentRef.current) {
      // 사용하지 않는 변수 제거
    }
  }, [orders, fontSize, id]);

  const {
    handleDragStart,
    handleDragStop,
    handleResizeStart,
    handleResizeStop,
    handleResize
  } = useTableDragResize({
    id,
    gridSize,
    isEditable,
    isBranch: false,
    onUpdate,
    setOptionPannelId
  });

   const onResize = (e, direction, ref, delta, position) => {
    const result = handleResize(e, direction, ref, delta, position);
    if (!result) return;
  
    const { position: newPosition, size: newSize } = result;
  
    if (!newPosition || !newSize) {
      console.warn('리사이즈 결과 데이터 누락:', { newPosition, newSize });
      return;
    }
  
    // 스타일 적용
    ref.style.width = `${newSize.width}px`;
    ref.style.height = `${newSize.height}px`;
    ref.style.transform = `translate(${newPosition.x}px,${newPosition.y}px)`;
  
    // 상태 업데이트
    onUpdate(id, {
      position: newPosition,
      size: newSize,
    }, true);
  };
  

  const handleClick = (event) => {
    if (!isEditable) {
      if (orders.length > 0 && orders[0].orders.length > 0) {
        setShowPaymentScreen(true);
      }
      return;
    }

    event.stopPropagation();
    onSelect(id);
  };

  const calculateTableSize = () => {
    return {
      width: size.width,
      height: size.height,
    };
  };

  const animatedSize = calculateTableSize();

  const getTableStyle = useCallback(() => {
    if (isEditable) {
      return {
        backgroundColor: isSelected ? color : '#FFFFFF',
        border: `3px dashed ${color}`,
        cursor: 'move',
      };
    } else {
      return {
        backgroundColor: orders.length > 0 && orders[0].orders.length > 0 ? color : '#FFFFFF',
        border: `3px solid ${color}`,
        cursor: 'default',
      };
    }
  }, [isEditable, isSelected, color, orders]);

  const renderTableContent = () => {
    if (isEditable) {
      return (
        <div
          className={styles.tableHeader}
          style={{
            fontSize: `${fontSize}px`,
            color: isSelected ? '#FFFFFF' : '#000000',
          }}
        >
          <div className={styles.tableHeaderContent}>
            <span className={styles.tableName}>{text || '새 테이블'}</span>
          </div>
        </div>
      );
    } else {
      return (
        <>
          <div
            className={styles.tableHeader}
            style={{
              fontSize: `${fontSize}px`,
              color: orders.length > 0 && orders[0].orders.length > 0 ? '#FFFFFF' : 'inherit',
            }}
          >
            <div className={styles.tableHeaderContent}>
              <span className={styles.tableName}>{text || '새 테이블'}</span>
              {orderStartTime && <span className={styles.orderTime}>{elapsedTime}</span>}
            </div>
          </div>
          <div className={styles.tableBodyWrapper}>
            <div
              className={styles.tableBody}
              style={{
                fontSize: `${fontSize - 2}px`,
                color: orders.length > 0 && orders[0].orders.length > 0 ? '#FFFFFF' : 'inherit',
              }}
              ref={contentRef}
            >
              {orders.length > 0 ? (
                <div className={styles.ordersList}>
                  {orders[0].orders.map((item, index) => (
                    <div key={index} className={styles.orderItem}>
                      {item.name}
                      {item.selectedSize && `(${item.selectedSize.label})`} x{item.quantity}
                      {item.selectedTaste &&
                        item.selectedTaste.trim() !== '' &&
                        item.selectedTaste !== '맛 선택' &&
                        ` - ${item.selectedTaste}`}
                      {item.selectedToppings &&
                        item.selectedToppings.length > 0 &&
                        ` + ${item.selectedToppings.join(', ')}`}
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noOrders}>주문 대기중</div>
              )}
            </div>
          </div>
          {orders.length > 0 && (
            <div
              className={styles.tableFooter}
              style={{
                color: '#FFFFFF',
              }}
            >
              총액: {totalAmount.toLocaleString()}원
            </div>
          )}
        </>
      );
    }
  };

  return (
    <>
      <Rnd
        size={animatedSize}
        position={position}
        onDragStart={handleDragStart}
        onDragStop={handleDragStop}
        onResizeStart={(e, direction, ref) => {
          console.log('Resize Start:', { direction, currentSize: animatedSize, currentPosition: position });
          handleResizeStart(e, direction, ref);
        }}
        onResize={(e, direction, ref, delta, position) => {
          console.log('Resizing:', { 
            direction, 
            delta, 
            currentSize: { width: ref.offsetWidth, height: ref.offsetHeight },
            position 
          });
          onResize(e, direction, ref, delta, position);
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          console.log('Resize Stop:', {
            direction,
            finalSize: { width: ref.offsetWidth, height: ref.offsetHeight },
            finalPosition: position
          });
          handleResizeStop(e, direction, ref, delta, position);
        }}
        bounds="parent"
        className={styles.table}
        enableResizing={{
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: true,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true
        }}
        resizeHandleStyles={{
          top: { cursor: 'n-resize', height: '10px', top: '-5px' },
          right: { cursor: 'e-resize', width: '10px', right: '-5px' },
          bottom: { cursor: 's-resize', height: '10px', bottom: '-5px' },
          left: { cursor: 'w-resize', width: '10px', left: '-5px' },
          topRight: { cursor: 'ne-resize', width: '10px', height: '10px', right: '-5px', top: '-5px' },
          bottomRight: { cursor: 'se-resize', width: '10px', height: '10px', right: '-5px', bottom: '-5px' },
          bottomLeft: { cursor: 'sw-resize', width: '10px', height: '10px', left: '-5px', bottom: '-5px' },
          topLeft: { cursor: 'nw-resize', width: '10px', height: '10px', left: '-5px', top: '-5px' }
        }}
        dragGrid={[gridSize[0], gridSize[1]]}
        resizeGrid={[gridSize[0], gridSize[1]]}
        minWidth={gridSize[0] * 7}
        minHeight={gridSize[1] * 8}
      >
        <motion.div
          className={styles.dragHandle}
          style={{
            ...getTableStyle(),
            width: '100%',
            height: '100%',
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            userSelect: 'none',
            boxSizing: 'border-box',
            padding: '10px',
            overflow: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          onClick={handleClick}
          initial={false}
          animate={{ width: animatedSize.width, height: animatedSize.height }}
          transition={{ duration: 0.3 }}
        >
          {renderTableContent()}
        </motion.div>
      </Rnd>

      {isEditable && showOptionPannel && (
        <OptionPanel
          gridSize={gridSize}
          position={position}
          size={size}
          textValue={text}
          handleTextChange={(e) => onUpdate(id, { text: e.target.value })}
          fontSizeToggle={fontSizeToggle}
          handleFontSizeToggle={handleFontSizeToggle}
          handleDelete={() => onDelete(id)}
          showOptionPannel={showOptionPannel}
          handleAddTable={onAddTable}
          handleColorChange={(newColor) => onUpdate(id, { color: newColor })}
          viewMode={viewMode}
          setViewMode={setViewMode}
          color={color}
        />
      )}

      {showPaymentScreen && <PaymentScreen onClose={() => setShowPaymentScreen(false)} tableId={id} />}
    </>
  );
}
