import React from 'react';
import CommonButton from '../../common/CommonButton';

function TasteButton({ tasteOptions, selectedTaste, onClick }) {
  if (tasteOptions.length === 0) return null;

  return (
    <CommonButton
      variant="option"
      onClick={() => onClick('taste')}
      isActive={selectedTaste !== '맛 선택'}
    >
      {selectedTaste === '맛 선택' ? '맛 선택' : selectedTaste}
    </CommonButton>
  );
}

export default TasteButton; 