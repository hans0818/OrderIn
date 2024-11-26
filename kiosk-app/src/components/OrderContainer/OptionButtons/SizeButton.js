import React from 'react';
import CommonButton from '../../common/CommonButton';

function SizeButton({ sizeOptions, selectedSize, onClick }) {
  if (sizeOptions.length === 0) return null;

  return (
    <CommonButton
      variant="option"
      onClick={() => onClick('size')}
      isActive={selectedSize && selectedSize !== sizeOptions[0]}
    >
      {selectedSize ? selectedSize.label : '사이즈 선택'}
    </CommonButton>
  );
}

export default SizeButton; 