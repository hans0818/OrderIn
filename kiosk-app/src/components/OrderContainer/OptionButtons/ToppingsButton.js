import React from 'react';
import CommonButton from '../../common/CommonButton';

function ToppingsButton({ toppingsOptions, selectedToppings, onClick }) {
  if (toppingsOptions.length === 0) return null;

  const selectedCount = selectedToppings.length;

  return (
    <CommonButton
      variant="option"
      onClick={() => onClick('toppings')}
      isActive={selectedCount > 0}
    >
      토핑 선택
      {selectedCount > 0 && ` (${selectedCount})`}
    </CommonButton>
  );
}

export default ToppingsButton; 