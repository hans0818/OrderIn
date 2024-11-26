import { useState, useCallback } from 'react';
import {
  useSwitchHandler,
  useSizeHandler,
  useTasteHandler,
  useToppingsHandler,
  useQuantityHandlers,
  useRemoveHandler
} from './useItemHandlers';

const useSelectedItems = (menuData) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

  const handleSwitchChange = useSwitchHandler(menuData, setSelectedItems, setCheckedItems);
  const handleSizeChange = useSizeHandler(selectedItems, menuData, setSelectedItems, setCheckedItems);
  const handleTasteChange = useTasteHandler(selectedItems, setSelectedItems, setCheckedItems);
  const handleToppingsChange = useToppingsHandler(selectedItems, setSelectedItems, setCheckedItems);
  const { handleIncreaseQuantity, handleDecreaseQuantity } = useQuantityHandlers(setSelectedItems);
  const handleRemoveItem = useRemoveHandler(setSelectedItems, setCheckedItems);

  const handleOrderComplete = useCallback(() => {
    console.log('주문 완료 - 상태 초기화 시작');
    console.log('이전 상태:', { selectedItems, checkedItems });
    
    setSelectedItems([]);
    setCheckedItems({});  // 메뉴 스위치 상태도 초기화
    
    console.log('상태 초기화 완료');
  }, [selectedItems, checkedItems]);

  return {
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
  };
};

export default useSelectedItems;
