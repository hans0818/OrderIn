import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  hasBasicOptionsOnly,
  hasAnyOptions,
  handleDuplicate,
} from '../../utils/orderUtils';

export const useSwitchHandler = (menuData, setSelectedItems, setCheckedItems) => {
  return useCallback((menuId, menuName, menuPrice, isChecked) => {
    if (!isChecked) {
      setSelectedItems(prev => prev.filter(item => {
        if (item.menuId !== menuId) return true;
        return hasAnyOptions(item);
      }));
    } else {
      setSelectedItems(prev => {
        const hasBasicOption = prev.some(item => 
          item.menuId === menuId && hasBasicOptionsOnly(item)
        );

        if (hasBasicOption) return prev;

        const menuItem = menuData
          .flatMap((group) => group.items)
          .find((item) => item.id === menuId);

        return [
          {
            id: uuidv4(),
            menuId,
            name: menuName,
            price: menuPrice,
            quantity: 1,
            selectedSize: '',
            selectedTaste: '맛 선택',
            selectedToppings: [],
            sizes: menuItem?.sizes || [],
            tastes: menuItem?.tastes || [],
            toppings: menuItem?.toppings || [],
            isDetailOpen: false,
          },
          ...prev,
        ];
      });
    }

    setCheckedItems(prev => ({
      ...prev,
      [menuId]: isChecked,
    }));
  }, [menuData, setSelectedItems, setCheckedItems]);
};

export const useSizeHandler = (selectedItems, menuData, setSelectedItems, setCheckedItems) => {
  return useCallback((orderItemId, newSize) => {
    setSelectedItems((prevItems) => {
      const updatedItems = prevItems.map(item => {
        if (item.id === orderItemId) {
          return {
            ...item,
            selectedSize: newSize,
            isDetailOpen: true,
          };
        }
        return item;
      });

      return handleDuplicate(updatedItems, orderItemId);
    });

    setCheckedItems((prevCheckedItems) => {
      const changedItem = selectedItems.find(item => item.id === orderItemId);
      if (changedItem) {
        const menuItem = menuData
          .flatMap(group => group.items)
          .find(item => item.id === changedItem.menuId);
        const isFirstSizeOption = menuItem?.sizeOptions?.[0]?.label === newSize?.label;

        return {
          ...prevCheckedItems,
          [changedItem.menuId]: isFirstSizeOption ? true : false
        };
      }
      return prevCheckedItems;
    });
  }, [selectedItems, menuData, setSelectedItems, setCheckedItems]);
};

export const useTasteHandler = (selectedItems, setSelectedItems, setCheckedItems) => {
  return useCallback((orderItemId, newTaste) => {
    setSelectedItems((prevItems) => {
      const updatedItems = prevItems.map(item => {
        if (item.id === orderItemId) {
          return {
            ...item,
            selectedTaste: newTaste,
            isDetailOpen: true,
          };
        }
        return item;
      });

      return handleDuplicate(updatedItems, orderItemId);
    });

    setCheckedItems((prevCheckedItems) => {
      const changedItem = selectedItems.find(item => item.id === orderItemId);
      if (changedItem) {
        return { ...prevCheckedItems, [changedItem.menuId]: false };
      }
      return prevCheckedItems;
    });
  }, [selectedItems, setSelectedItems, setCheckedItems]);
};

export const useToppingsHandler = (selectedItems, setSelectedItems, setCheckedItems) => {
  return useCallback((orderItemId, newToppings) => {
    setSelectedItems((prevItems) => {
      const updatedItems = prevItems.map(item => {
        if (item.id === orderItemId) {
          return {
            ...item,
            selectedToppings: newToppings,
            isDetailOpen: true,
          };
        }
        return item;
      });

      return handleDuplicate(updatedItems, orderItemId);
    });

    setCheckedItems((prevCheckedItems) => {
      const changedItem = selectedItems.find(item => item.id === orderItemId);
      if (changedItem) {
        return { ...prevCheckedItems, [changedItem.menuId]: false };
      }
      return prevCheckedItems;
    });
  }, [selectedItems, setSelectedItems, setCheckedItems]);
};

export const useQuantityHandlers = (setSelectedItems) => {
  const handleIncreaseQuantity = useCallback((itemId) => {
    setSelectedItems((prevItems) =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.min(item.quantity + 1, 99) }
          : item
      )
    );
  }, [setSelectedItems]);

  const handleDecreaseQuantity = useCallback((itemId) => {
    setSelectedItems((prevItems) =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      )
    );
  }, [setSelectedItems]);

  return { handleIncreaseQuantity, handleDecreaseQuantity };
};

export const useRemoveHandler = (setSelectedItems, setCheckedItems) => {
  return useCallback((itemId) => {
    setSelectedItems((prevItems) => {
      const removedItem = prevItems.find(item => item.id === itemId);
      const updatedItems = prevItems.filter(item => item.id !== itemId);

      if (removedItem) {
        setCheckedItems((prevCheckedItems) => ({
          ...prevCheckedItems,
          [removedItem.menuId]: false,
        }));
      }

      return updatedItems;
    });
  }, [setSelectedItems, setCheckedItems]);
}; 