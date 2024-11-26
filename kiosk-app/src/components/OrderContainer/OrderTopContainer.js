// src/components/OrderContainer/OrderTopContainer.js
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import styles from './OrderTopContainer.module.css';
import { HeightAdjustIcon } from '../svgIcon/svgIndex';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db, STORE_NAME } from '../../database/firebaseConfig';

function OrderTopContainer({ onHeightChange, orders, onOrderComplete }) {
  const [showOrderButtons, setShowOrderButtons] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [heightIndex, setHeightIndex] = useState(1);
  const dragStartY = useRef(0);
  const [searchParams] = useSearchParams();

  const heightSteps = useMemo(() => [6, 40, 71], []);

  useEffect(() => {
    if (onHeightChange) {
      onHeightChange(heightSteps[heightIndex]);
    }
  }, [heightIndex, heightSteps, onHeightChange]);

  const handleOrderCompleteClick = () => {
    setShowOrderButtons(true);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowOrderButtons(false);
    }
  };

  const handleToggleClick = () => {
    setIsToggled((prev) => !prev);
  };

  const handlePanStart = useCallback((event, info) => {
    event.preventDefault();
    event.stopPropagation();
    dragStartY.current = info.point.y;
    console.log('Pan Start');
  }, []);

  const handlePan = useCallback((event, info) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Pan Move');
  }, []);

  const handlePanEnd = useCallback(
    (event, info) => {
      event.preventDefault();
      event.stopPropagation();
      console.log('Pan End');
      const dragDistance = info.point.y - dragStartY.current;

      if (dragDistance < -30) {
        if (heightIndex < heightSteps.length - 1) {
          setHeightIndex((prev) => prev + 1);
        }
      } else if (dragDistance > 30) {
        if (heightIndex > 0) {
          setHeightIndex((prev) => prev - 1);
        }
      }
    },
    [heightIndex, heightSteps]
  );

  const handleOrderSubmit = async () => {
    try {
      const userId = searchParams.get('userId');
      const tableId = searchParams.get('tableId');
      const tableName = searchParams.get('tableName');
      const storeName = STORE_NAME;

      console.log('주문 시작:', {
        userId,
        tableId,
        tableName,
        storeName
      });

      if (!userId || !tableId) {
        console.error('URL 파라미터 누락:', { userId, tableId });
        throw new Error('필요한 테이블 정보가 없습니다.');
      }

      const orderData = {
        tableId,
        tableName,
        orders: orders.map(order => ({
          menuId: order.menuId,
          name: order.name,
          price: order.price,
          quantity: order.quantity,
          selectedSize: order.selectedSize,
          selectedTaste: order.selectedTaste,
          selectedToppings: order.selectedToppings,
          totalPrice: order.price * order.quantity
        })),
        status: 'pending',
        timestamp: new Date().toISOString(),
        totalAmount: orders.reduce((sum, order) => sum + (order.price * order.quantity), 0)
      };

      console.log('저장할 주문 데이터:', orderData);

      const ordersCollectionRef = collection(db, 'users', userId, 'stores', storeName, 'orders');
      const newOrderRef = doc(ordersCollectionRef);
      
      console.log('주문 저장 경로:', `users/${userId}/stores/${storeName}/orders/${newOrderRef.id}`);
      
      await setDoc(newOrderRef, orderData);
      console.log('주문 저장 완료');

      setShowOrderButtons(false);
      
      console.log('주문 초기화 시작 - 현재 주문 목록:', orders);
      
      if (onOrderComplete) {
        onOrderComplete();
      }
      
      alert('주문이 완료되었습니다.');
      
      // 페이지 새로고침으로 모든 상태 초기화
      window.location.reload();
      
    } catch (error) {
      console.error('주문 처리 중 오류 발생:', error);
      alert('주문 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <div className={styles.orderTopContainer}>
        <div className={styles.setToggleSwitch} onClick={handleToggleClick}>
          <div className={`${styles.setSlider} ${isToggled ? styles.active : ''}`}>
            <div className={styles.setHandle} />
          </div>
        </div>
        <motion.div
          className={styles.heightAdjustButton}
          onPanStart={handlePanStart}
          onPan={handlePan}
          onPanEnd={handlePanEnd}
          style={{ y: 0 }}
        >
          <HeightAdjustIcon />
        </motion.div>
        <button className={styles.orderCompleteButton} onClick={handleOrderCompleteClick}>
          주문완료
        </button>
      </div>

      <AnimatePresence>
        {showOrderButtons && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleOverlayClick}
          >
            <motion.div
              className={styles.buttonContainer}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className={styles.topButtons}>
                <button className={styles.squareButton}>기타주문</button>
                <button className={styles.squareButton}>주문내역</button>
              </div>
              <button 
                className={styles.rectangleButton}
                onClick={handleOrderSubmit}
              >
                주문
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default OrderTopContainer;
