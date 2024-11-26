// hooks/useMenuData.js
import { useState, useEffect } from 'react';
import { fetchMenuData, fetchBeverageData } from '../../database/firebaseConfig';
import { groupAndSortMenuData } from '../../services/MenuService';

const useMenuData = (isBeverage, setCategories, categoryRefs) => {
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = isBeverage ? await fetchBeverageData() : await fetchMenuData();
        const sortedData = groupAndSortMenuData(data);
        setMenuData(sortedData);

        // 카테고리 추출
        const extractedCategories = sortedData.map((group) => ({
          name: group.category,
          navId: group.navId,
        }));
        setCategories(extractedCategories);
        categoryRefs.current = [];
      } catch (error) {
        console.error('Error fetching menu data:', error);
      }
    };
    getData();
  }, [isBeverage, setCategories, categoryRefs]);

  return menuData;
};

export default useMenuData;
