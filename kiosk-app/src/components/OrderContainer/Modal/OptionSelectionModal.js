import React from 'react';
import SelectionModal from './SelectionModal';

function OptionSelectionModal({
  isOpen,
  modalType,
  selectedSize,
  selectedTaste,
  selectedToppings,
  sizeOptions,
  tasteOptions,
  toppingsOptions,
  onClose,
  onSelect,
  disabledOptions,
  handleToppingsComplete
}) {
  const getTitle = () => {
    switch (modalType) {
      case 'size':
        return '사이즈 선택';
      case 'taste':
        return '맛 선택';
      default:
        return '토핑 선택';
    }
  };

  const getOptions = () => {
    if (modalType === 'size') return sizeOptions;
    if (modalType === 'taste') return [{ label: '기본' }, ...tasteOptions];
    return toppingsOptions;
  };

  const getSelectedOption = () => {
    if (modalType === 'size') return selectedSize?.label;
    if (modalType === 'taste') return selectedTaste === '맛 택' ? '기본' : selectedTaste;
    return selectedToppings;
  };

  return (
    <SelectionModal
      isOpen={isOpen}
      onClose={modalType === 'toppings' ? handleToppingsComplete : onClose}
      title={getTitle()}
      options={getOptions()}
      selectedOption={getSelectedOption()}
      onSelect={onSelect}
      multiSelect={modalType === 'toppings'}
      disabledOptions={disabledOptions}
    />
  );
}

export default OptionSelectionModal; 