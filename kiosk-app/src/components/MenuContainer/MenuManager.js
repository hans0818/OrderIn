// src/components/MenuContainer/MenuManager.js
import React, { useCallback, useState, useEffect } from 'react';
import useMenuData from '../../hooks/menu/useMenuData';
import useSelectedItems from '../../hooks/order/useSelectedItems';
import useMenuScroll from '../../hooks/menu/useMenuScroll';
import MenuSwitch from './MenuSwitch';
import Disclaimer from './Disclaimer';
import OrderContainer from '../OrderContainer/OrderContainer';
import styles from './MenuManager.module.css';
import { AnimatePresence } from 'framer-motion';

function MenuManager({
  categoryRefs,
  isBeverage,
  setIsProgrammaticScroll,
  menuContainerRef,
  setCategories,
  orders,
  setOrders,
  onOrderComplete,
}) {
  const [orderContainerHeight, setOrderContainerHeight] = useState(0);

  // 메뉴 스크롤 훅 사용
  const { menuRefs, handleScrollToMenuItem } = useMenuScroll(
    menuContainerRef,
    orderContainerHeight,
    setIsProgrammaticScroll
  );

  // 메뉴 데이터를 가져옵니다.
  const menuData = useMenuData(isBeverage, setCategories, categoryRefs);

  // 선택된 아이템들을 관리합니다.
  const {
    selectedItems,
    checkedItems,
    handleSwitchChange,
    handleSizeChange,
    handleTasteChange,
    handleToppingsChange,
    handleRemoveItem,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleOrderComplete,
  } = useSelectedItems(menuData);

  const [menuSwitchStates, setMenuSwitchStates] = useState({});

  // 메뉴 스위치의 상태를 업데이트합니다.
  useEffect(() => {
    const newMenuSwitchStates = {};
    menuData.forEach((group) => {
      group.items.forEach((item) => {
        newMenuSwitchStates[item.id] =
          checkedItems[item.id] === false ? false : checkedItems[item.id] || false;
      });
    });
    setMenuSwitchStates(newMenuSwitchStates);
  }, [checkedItems, menuData]);

  // OrderContainer의 높이가 변경될 때 호출됩니다.
  const handleOrderContainerHeightChange = useCallback((height) => {
    setOrderContainerHeight(height);
  }, []);

  // selectedItems가 변경될 때마다 orders 업데이트
  useEffect(() => {
    if (setOrders) {
      console.log('MenuManager - orders 업데이트:', selectedItems);
      setOrders(selectedItems);
    }
  }, [selectedItems, setOrders]);

  // 주문 완료 핸들러
  const handleOrderCompleted = useCallback(() => {
    console.log('MenuManager - 주문 완료 처리 시작');
    handleOrderComplete();
    if (onOrderComplete) {
      onOrderComplete();
    }
    console.log('MenuManager - 주문 완료 처리 끝');
  }, [handleOrderComplete, onOrderComplete]);

  return (
    <div className={styles.menuContainer} ref={menuContainerRef}>
      {menuData.map((group, groupIndex) => (
        <div
          key={group.navId || `group-${groupIndex}`}
          id={group.navId}
          ref={(el) => {
            if (el) {
              categoryRefs.current[groupIndex] = el;
            }
          }}
          className={styles.nav}
        >
          {group.items.map((menuItem, itemIndex) => (
            <MenuSwitch
              key={menuItem.id || `${menuItem.name}-${itemIndex}`}
              menuId={menuItem.id}
              menuName={menuItem.name}
              menuPrice={menuItem.price}
              description={menuItem.description}
              imageUrl={menuItem.imageUrl} 
              isChecked={menuSwitchStates[menuItem.id] || false}
              onSwitchChange={handleSwitchChange}
              ref={(el) => {
                if (el && menuItem.id) {
                  menuRefs.current[menuItem.id] = el;
                }
              }}
            />
          ))}
        </div>
      ))}

      <AnimatePresence mode="wait">
        <OrderContainer
          key="order-container"
          isVisible={selectedItems.length > 0}
          orders={selectedItems.map((item) => ({
            ...item,
            sizeOptions: item.sizes || [],
            tasteOptions: item.tastes || [],
            toppingsOptions: item.toppings || [],
            selectedSize: item.selectedSize || '',
            selectedTaste: item.selectedTaste || '',
            selectedToppings: item.selectedToppings || [],
          }))}
          scrollToMenuItem={handleScrollToMenuItem}
          onRemoveItem={handleRemoveItem}
          onHeightChange={handleOrderContainerHeightChange}
          onSizeChange={handleSizeChange}
          onTasteChange={handleTasteChange}
          onToppingsChange={handleToppingsChange}
          handleIncreaseQuantity={handleIncreaseQuantity}
          handleDecreaseQuantity={handleDecreaseQuantity}
          onOrderComplete={handleOrderCompleted}
        />
      </AnimatePresence>

      <Disclaimer />
    </div>
  );
}

export default MenuManager;
