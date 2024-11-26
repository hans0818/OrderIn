import { useState, useEffect } from 'react';
import {
  calculateToppingsPrice,
  formatToppings,
} from '../../utils/orderUtils';
import useModal from './useModal';

function useOrderItem({
  menuId,
  id,
  propSelectedSize,
  propSelectedTaste,
  propSelectedToppings,
  propIsDetailOpen,
  toppingsOptions,
  onRemove,
  onClick,
  onSizeChange,
  onTasteChange,
  onToppingsChange,
}) {
  const [selectedSize, setSelectedSize] = useState(propSelectedSize || null);
  const [selectedTaste, setSelectedTaste] = useState('맛 선택');
  const [selectedToppings, setSelectedToppings] = useState(
    Array.isArray(propSelectedToppings) ? propSelectedToppings : []
  );
  const [isDetailOpen, setIsDetailOpen] = useState(propIsDetailOpen);

  const { isModalOpen, modalType, openModal, closeModal } = useModal();

  useEffect(() => {
    if (propSelectedSize) setSelectedSize(propSelectedSize);
    if (propSelectedTaste && propSelectedTaste !== '맛 선택') setSelectedTaste(propSelectedTaste);
    if (propSelectedToppings && propSelectedToppings !== 'Toppings선택') setSelectedToppings(propSelectedToppings);
  }, [propSelectedSize, propSelectedTaste, propSelectedToppings]);

  useEffect(() => {
    setIsDetailOpen(propIsDetailOpen);
  }, [propIsDetailOpen]);

  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove(id, menuId);
  };

  const handleItemClick = () => {
    onClick(menuId);
  };

  const handleOptionSelect = (option) => {
    switch (modalType) {
      case 'size':
        setSelectedSize(option);
        onSizeChange(option);
        break;
      case 'taste':
        setSelectedTaste(option.label || '기본');
        onTasteChange(option.label || '기본');
        break;
      case 'toppings':
        const updatedToppings = selectedToppings.includes(option.label)
          ? selectedToppings.filter(t => t !== option.label)
          : [...selectedToppings, option.label];
        setSelectedToppings(updatedToppings);
        break;
      default:
        break;
    }
  };

  const handleToppingsComplete = () => {
    const totalToppingsPrice = calculateToppingsPrice(selectedToppings, toppingsOptions);
    onToppingsChange(selectedToppings, selectedToppings.length > 0, totalToppingsPrice);
    closeModal();
  };

  const getFormattedToppings = () => formatToppings(selectedToppings, toppingsOptions);

  const toggleDetail = () => {
    setIsDetailOpen(!isDetailOpen);
  };

  const optionsVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' },
    exit: { opacity: 0, height: 0 }
  };

  return {
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
  };
}

export default useOrderItem; 