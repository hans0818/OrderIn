// 중복 아이템 확인
export const findDuplicateItem = (items, targetItem) => {
  return items.find(item =>
    item.id !== targetItem.id &&
    item.menuId === targetItem.menuId &&
    item.selectedSize?.label === targetItem.selectedSize?.label &&
    item.selectedTaste === targetItem.selectedTaste &&
    areArraysEqualIgnoreOrder(item.selectedToppings || [], targetItem.selectedToppings || [])
  );
};

// 배열 순서 무시하고 비교하는 헬퍼 함수 추가
const areArraysEqualIgnoreOrder = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  
  const set1 = new Set(arr1);
  return arr2.every(item => set1.has(item));
};

// 토핑 가격을 계산하는 공통 함수
const computeToppingsPrice = (selectedToppings, toppingsOptions) => {
  return selectedToppings.reduce(
    (sum, topping) =>
      sum + (toppingsOptions.find(option => option.label === topping)?.price || 0),
    0
  );
};

// 가격 계산
export const calculateTotalPrice = (item, tasteOptions, toppingsOptions) => {
  const basePrice = item.price || 0;
  const sizePrice = item.selectedSize?.price || 0;
  const tastePrice = item.selectedTaste !== '맛 선택'
    ? tasteOptions.find(option => option.label === item.selectedTaste)?.price || 0
    : 0;
  const toppingsPrice = computeToppingsPrice(item.selectedToppings || [], toppingsOptions);

  return (basePrice + sizePrice + tastePrice + toppingsPrice) * (item.quantity || 1);
};

// 토핑 가격 계산
export const calculateToppingsPrice = computeToppingsPrice;

// 토핑 포맷팅
export const formatToppings = (selectedToppings, toppingsOptions) => {
  if (!selectedToppings?.length) return '';
  
  return selectedToppings.map(topping => {
    if (typeof topping === 'object' && topping.label) {
      return topping.label;
    }
    const toppingOption = toppingsOptions.find(option => option.label === topping);
    return toppingOption ? toppingOption.label : topping;
  }).join(', ');
};

// 기본 옵션 체크
export const hasBasicOptionsOnly = (item) => {
  return (
    (!item.selectedSize || Object.keys(item.selectedSize).length === 0) &&
    (!item.selectedTaste || item.selectedTaste === '맛 선택') &&
    (!item.selectedToppings || item.selectedToppings.length === 0)
  );
};

// 옵션 선택 여부 체크
export const hasAnyOptions = (item) => {
  const hasSize = item.selectedSize && Object.keys(item.selectedSize).length > 0;
  const hasTaste = item.selectedTaste && item.selectedTaste !== '맛 선택';
  const hasToppings = item.selectedToppings && item.selectedToppings.length > 0;
  return hasSize || hasTaste || hasToppings;
};

// 중복 처리 헬퍼 함수 추가
export const handleDuplicate = (updatedItems, changedItemId) => {
  const changedItem = updatedItems.find(item => item.id === changedItemId);
  const duplicateItem = findDuplicateItem(updatedItems, changedItem);

  if (duplicateItem) {
    const updatedItemsCopy = [...updatedItems];
    const duplicateIndex = updatedItemsCopy.findIndex(item => item.id === duplicateItem.id);
    updatedItemsCopy[duplicateIndex].quantity += changedItem.quantity;
    return updatedItemsCopy.filter(item => item.id !== changedItemId);
  }

  const changedItemIndex = updatedItems.findIndex(item => item.id === changedItemId);
  if (changedItemIndex !== -1) {
    const [changedItem] = updatedItems.splice(changedItemIndex, 1);
    return [changedItem, ...updatedItems];
  }

  return updatedItems;
}; 