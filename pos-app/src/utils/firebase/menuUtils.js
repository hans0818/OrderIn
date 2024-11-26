import { collection, doc, getDocs, writeBatch, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { v4 as uuidv4 } from 'uuid';

// 메뉴 컬렉션 참조 가져오기
const getMenuRef = (user, store, menuType) => {
  // user가 객체가 아닌 문자열(userId)로 전달된 경우 처리
  const userId = typeof user === 'string' ? user : user?.uid;
  const storeId = typeof store === 'string' ? store : store?.id;

  if (!userId || !storeId || !menuType) {
    console.error('필수 정보 누락:', { userId, storeId, menuType });
    throw new Error('메뉴 참조를 가져오는데 필요한 정보가 누락되었습니다.');
  }

  // Firestore 경로 수정
  const path = `users/${userId}/stores/${storeId}/menus/${menuType}/categories`;
  console.log('메뉴 참조 경로:', path);
  
  return collection(db, path);
};

// 카테고리 관련 함수
export const updateCategories = async (user, currentStore, menuType, categories) => {
  if (!user || !currentStore || !menuType) {
    console.error('필수 정보 누락:', { user, currentStore, menuType });
    throw new Error('필수 정보가 누락되었습니다.');
  }

  try {
    const userId = typeof user === 'string' ? user : user.uid;
    const storeId = typeof currentStore === 'string' ? currentStore : currentStore.id;

    console.log('카테고리 저장 시작:', {
      userId,
      storeId,
      menuType,
      categories
    });

    const menuRef = getMenuRef(userId, storeId, menuType);
    console.log('menuRef:', menuRef);

    const batch = writeBatch(db);

    // 기존 데이터 가져오기
    const snapshot = await getDocs(menuRef);
    const existingData = {};

    snapshot.docs.forEach(docSnap => {
      existingData[docSnap.id] = docSnap.data().items || [];
      batch.delete(docSnap.ref);
    });

    // 카테고리 데이터 검증 및 ID 문자열화
    const validCategories = categories
      .filter(category => category && category.name && category.name.trim() !== '')
      .map((category, index) => {
        const categoryId = String(category.id || uuidv4());
        console.log('Category ID:', categoryId);

        return {
          id: categoryId,
          name: category.name.trim(),
          order: index,
          updatedAt: new Date().toISOString(),
          createdAt: category.createdAt || new Date().toISOString()
        };
      });

    // 새 카테고리 저장
    for (const category of validCategories) {
      console.log('Saving category:', category);
      console.log('Category ID type:', typeof category.id);
      console.log('Category ID value:', category.id);

      const categoryRef = doc(menuRef, category.id);
      batch.set(categoryRef, {
        ...category,
        items: existingData[category.id] || []
      });
    }

    await batch.commit();
    console.log('✅ 카테고리 저장 완료:', validCategories);
    return validCategories;

  } catch (error) {
    console.error('❌ 카테고리 저장 실패:', error);
    console.error('에러 상세 정보:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw error;
  }
};


// 단일 메뉴 아이템 업데이트
// 유틸리티 함수
function removeUndefined(obj) {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  } else if (obj && typeof obj === 'object') {
    const newObj = {};
    Object.keys(obj).forEach(key => {
      const value = obj[key];
      if (value !== undefined) {
        newObj[key] = removeUndefined(value);
      }
    });
    return newObj;
  } else {
    return obj;
  }
}

// 단일 메뉴 아이템 업데이트
export const updateMenuItem = async (user, currentStore, menuType, categoryId, menuItem) => {
  try {
    console.log('단일 메뉴 아이템 업데이트 시작:', { categoryId, menuItem });

    // 필수 필드 검증
    if (!categoryId || !menuItem || !menuItem.id) {
      throw new Error('필수 정보가 누락되었습니다.');
    }

    const menuRef = getMenuRef(user.uid, currentStore, menuType);
    const categoryDoc = doc(menuRef, categoryId);
    const snapshot = await getDocs(menuRef);
    const categoryData = snapshot.docs.find(doc => doc.id === categoryId)?.data() || {};
    const items = categoryData.items || [];

    const existingItemIndex = items.findIndex(item => item.id === menuItem.id);
    const existingItem = existingItemIndex >= 0 ? items[existingItemIndex] : null;

    // 메뉴 아이템 데이터 클린업
    const cleanedMenuItem = {
      id: menuItem.id,
      name: menuItem.name?.trim() || existingItem?.name || '',
      price: menuItem.price !== undefined ? Number(menuItem.price) : existingItem?.price || 0,
      order: existingItemIndex >= 0 ? items[existingItemIndex].order : items.length,
      updatedAt: new Date().toISOString(),
      createdAt: menuItem.createdAt || existingItem?.createdAt || new Date().toISOString(),
      // 옵션 데이터
      ...(menuItem.sizes !== undefined && { sizes: menuItem.sizes }),
      ...(menuItem.tastes !== undefined && { tastes: menuItem.tastes }),
      ...(menuItem.toppings !== undefined && { toppings: menuItem.toppings }),
      // 선택적 필드들
      ...(menuItem.basicOrderQuantity !== undefined && { basicOrderQuantity: Number(menuItem.basicOrderQuantity) }),
      ...(menuItem.description !== undefined && { description: menuItem.description.trim() }),
      ...(menuItem.imageUrl !== undefined && { imageUrl: menuItem.imageUrl })
    };

    // 기존 아이템 배열 업데이트
    const updatedItems = existingItemIndex >= 0
      ? items.map(item => item.id === menuItem.id ? cleanedMenuItem : item)
      : [...items, cleanedMenuItem];

    const sortedItems = [...updatedItems].sort((a, b) => (a.order || 0) - (b.order || 0));

    // 저장할 데이터 생성
    const dataToSave = {
      ...categoryData,
      items: sortedItems,
      updatedAt: new Date().toISOString()
    };

    // 데이터에서 undefined 값 제거
    const cleanedDataToSave = removeUndefined(dataToSave);

    console.log('저장할 데이터:', cleanedDataToSave);

    await setDoc(categoryDoc, cleanedDataToSave);

    console.log('✅ 메뉴 아이템 저장 성공:', cleanedMenuItem);
    return sortedItems;
  } catch (error) {
    console.error('❌ 메뉴 아이템 저장 실패:', error);
    throw error;
  }
};


// 카테고리의 전체 메뉴 아이템 업데이트 (메뉴 편집용)
export const updateCategoryItems = async (user, currentStore, menuType, categoryId, items) => {
  if (!user || !currentStore || !categoryId) return;

  try {
    console.log('카테고리 메뉴 아이템 순서 업데이트 시작:', { categoryId, items });

    const menuRef = getMenuRef(user.uid, currentStore, menuType);
    const categoryDoc = doc(menuRef, categoryId);
    const snapshot = await getDocs(menuRef);
    const categoryData = snapshot.docs.find(doc => doc.id === categoryId)?.data();

    if (!categoryData) {
      throw new Error('카테고리를 찾을 수 없습니다.');
    }

    // 기존 아이템 데이터 가져오기
    const existingItems = categoryData.items || [];

    // 새로운 순서로 정렬된 아이템 배열 생성
    const updatedItems = items.map((newItem, index) => {
      // 기존 아이템 찾기
      const existingItem = existingItems.find(item => item.id === newItem.id);
      
      if (!existingItem) {
        console.warn(`아이템을 찾을 수 없음: ${newItem.id}`);
        return null;
      }

      // 기존 데이터는 유지하고 order만 업데이트
      return {
        ...existingItem,
        order: index,
        updatedAt: new Date().toISOString()
      };
    }).filter(Boolean); // null 값 제거

    await setDoc(categoryDoc, {
      ...categoryData,
      items: updatedItems,
      updatedAt: new Date().toISOString()
    });

    console.log('✅ 메뉴 순서 업데이트 성공:', updatedItems);
    return updatedItems;
  } catch (error) {
    console.error('❌ 메뉴 순서 업데이트 실패:', error);
    throw error;
  }
};

// 카테고리 조회
export const fetchCategories = async (user, store, menuType) => {
  try {
    const userId = typeof user === 'string' ? user : user?.uid;
    const storeId = typeof store === 'string' ? store : store?.id;

    console.log('카테고리 조회 시작:', { 
      userId, 
      storeId, 
      menuType
    });

    if (!userId || !storeId) {
      console.error('사용자 또는 스토어 정보 누락:', { userId, storeId });
      return [];
    }

    const menuRef = getMenuRef(userId, storeId, menuType);
    const snapshot = await getDocs(menuRef);
    
    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`✅ ${menuType} 카테고리 조회 성공:`, categories);
    return categories;

  } catch (error) {
    console.error(`❌ ${menuType} 카테고리 조회 실패:`, error);
    return [];
  }
};

// 메뉴 아이템 조회
export const fetchMenuItems = async (user, currentStore, menuType, categoryId) => {
  if (!categoryId) return [];

  try {
    // user와 store 정보 처리
    const userId = typeof user === 'string' ? user : user?.uid;
    const storeId = typeof currentStore === 'string' ? currentStore : currentStore?.id;

    if (!userId || !storeId) {
      console.error('사용자 또는 스토어 정보 누락:', { userId, storeId });
      return [];
    }

    const menuRef = getMenuRef(userId, storeId, menuType);
    const snapshot = await getDocs(menuRef);
    const categoryData = snapshot.docs.find(doc => doc.id === categoryId)?.data();
    
    // 순서대로 정렬하여 반환
    const items = categoryData?.items || [];
    const sortedItems = [...items].sort((a, b) => (a.order || 0) - (b.order || 0));
    
    console.log(`${categoryId} 카테고리의 메뉴 아이템 조회 성공:`, sortedItems);
    return sortedItems;
  } catch (error) {
    console.error('메뉴 아이템 조회 실패:', error);
    return [];
  }
};

// 메뉴 아이템 삭제
export const deleteMenuItem = async (user, currentStore, menuType, categoryId, menuItemId) => {
  if (!user || !currentStore || !categoryId || !menuItemId) return;

  try {
    const menuRef = getMenuRef(user.uid, currentStore, menuType);
    const categoryDoc = doc(menuRef, categoryId);
    const snapshot = await getDocs(menuRef);
    const categoryData = snapshot.docs.find(doc => doc.id === categoryId)?.data();

    if (!categoryData) return;

    const updatedItems = categoryData.items.filter(item => item.id !== menuItemId);

    await setDoc(categoryDoc, {
      ...categoryData,
      items: updatedItems,
      updatedAt: new Date().toISOString()
    });

    console.log('메뉴 아이템 삭제 성공:', menuItemId);
    return updatedItems;
  } catch (error) {
    console.error('메뉴 아이템 삭제 실패:', error);
    throw error;
  }
};

// 사이즈 옵션 저장
export const saveSizeOption = async (user, currentStore, menuType, categoryId, selectedMenu, sizeData) => {
  if (!selectedMenu) return;

  try {
    const updatedMenuItem = {
      ...selectedMenu,
      sizes: sizeData
    };

    await updateMenuItem(user, currentStore, menuType, categoryId, updatedMenuItem);
    console.log('사이즈 옵션 저장 완료:', sizeData);
    return updatedMenuItem;
  } catch (error) {
    console.error('사이즈 옵션 저장 실패:', error);
    throw error;
  }
};

// 맛 옵션 저장
export const saveTasteOption = async (user, currentStore, menuType, categoryId, selectedMenu, tasteData) => {
  if (!selectedMenu) return;

  try {
    const updatedMenuItem = {
      ...selectedMenu,
      tastes: tasteData
    };

    await updateMenuItem(user, currentStore, menuType, categoryId, updatedMenuItem);
    console.log('맛 옵션 저장 완료:', tasteData);
    return updatedMenuItem;
  } catch (error) {
    console.error('맛 옵션 저장 실패:', error);
    throw error;
  }
};

// 토핑 옵션 저장
export const saveToppingOption = async (user, currentStore, menuType, categoryId, selectedMenu, toppingData) => {
  if (!selectedMenu) return;

  try {
    const updatedMenuItem = {
      ...selectedMenu,
      toppings: toppingData
    };

    await updateMenuItem(user, currentStore, menuType, categoryId, updatedMenuItem);
    console.log('토핑 옵션 저장 완료:', toppingData);
    return updatedMenuItem;
  } catch (error) {
    console.error('토핑 옵션 저장 실패:', error);
    throw error;
  }
};

// 메뉴 기본 정보 저장
export const saveMenuBasicInfo = async (user, currentStore, menuType, categoryId, menuData) => {
  try {
    const menuItem = {
      id: menuData.id,
      name: menuData.name,
      price: menuData.price,
      order: menuData.order,
      ...(menuData.basicOrderQuantity && { basicOrderQuantity: Number(menuData.basicOrderQuantity) }),
      ...(menuData.description && { description: menuData.description.trim() }),
      ...(menuData.sizes && { sizes: menuData.sizes }),
      ...(menuData.tastes && { tastes: menuData.tastes }),
      ...(menuData.toppings && { toppings: menuData.toppings }),
      createdAt: menuData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await updateMenuItem(user, currentStore, menuType, categoryId, menuItem);
    console.log('메뉴 저장 완료:', menuItem);
    return menuItem;
  } catch (error) {
    console.error('메뉴 저장 실패:', error);
    throw error;
  }
};

// 카테고리 추가
export const addCategory = async (user, currentStore, menuType, categoryName, existingCategories) => {
  if (!categoryName.trim()) return;

  try {
    const newCategory = {
      id: uuidv4(),
      name: categoryName.trim(),
    };

    const updatedCategories = [...existingCategories, newCategory];
    await updateCategories(user, currentStore, menuType, updatedCategories);
    
    console.log('카테고리 저장 완료:', newCategory);
    return updatedCategories;
  } catch (error) {
    console.error('카테고리 저장 실패:', error);
    throw error;
  }
}; 