// MenuPanel.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './MenuPanel.module.css';
import CategoryModal from './OptionModals/CategoryModal';
import DeleteModal from './OptionModals/DeleteModal';
import OptionModal from './OptionModals/OptionModal';
import LeftSection from './LeftSection';
import RightSection from './RightSection';
import EditModal from './OptionModals/EditModal';
import SetSection from './SetSection';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, storage } from '../../../firebase/firebase';
import { POS_CONFIG } from '../../../config/constants';
import { fetchCurrentStore } from '../../../utils/firebase/storeUtils';
import {
  fetchCategories,
  fetchMenuItems,
  updateMenuItem,
  updateCategories,
  deleteMenuItem,
  updateCategoryItems,
} from '../../../utils/firebase/menuUtils';
import { v4 as uuidv4 } from 'uuid';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';

export default function MenuPanel({ isMenuEditing }) {
  // 사용자 및 스토어 정보
  const [user] = useAuthState(auth);
  const [currentStore, setCurrentStore] = useState(null);

  // 상태 변수들
  const [activeOption, setActiveOption] = useState('menu');
  const [categories, setCategories] = useState({ menu: [], beverage: [], set: [] });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuList, setMenuList] = useState({});
  const [selectedMenu, setSelectedMenu] = useState(null);

  // 모달 표시 여부
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMenuEditModal, setShowMenuEditModal] = useState(false);

  // 입력 필드 상태
  const [newCategoryName, setNewCategoryName] = useState('');
  const [menuName, setMenuName] = useState('');
  const [price, setPrice] = useState('');
  const [basicOrderQuantity, setBasicOrderQuantity] = useState('');
  const [menuDescription, setMenuDescription] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);

  // 옵션 데이터
  const [menuSizes, setMenuSizes] = useState({});
  const [menuTastes, setMenuTastes] = useState({});
  const [menuToppings, setMenuToppings] = useState({});

  // 기타 상태
  const [showMenuSection, setShowMenuSection] = useState(false);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [showFullForm, setShowFullForm] = useState(false);
  const menuNameInputRef = useRef(null);

  // 변경사항 추적을 위한 상태
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalData, setOriginalData] = useState({
    name: '',
    price: '',
    quantity: '',
    description: ''
  });

  // 단일 상태로 관리
  const [activeModal, setActiveModal] = useState(null); // 'size' | 'taste' | 'topping' | null

  // 모달 설정 객체
  const modalConfigs = {
    size: {
      title: "사이즈 추가",
      fieldName: "sizeName",
      fieldLabel: "사이즈",
      fieldPlaceholder: "사이즈를 입력하세요",
      initialData: menuSizes[selectedMenu?.name] || []
    },
    taste: {
      title: "맛 추가",
      fieldName: "tasteName",
      fieldLabel: "맛",
      fieldPlaceholder: "맛을 입력하세요",
      initialData: menuTastes[selectedMenu?.name] || []
    },
    topping: {
      title: "토핑 추가",
      fieldName: "toppingName",
      fieldLabel: "토핑",
      fieldPlaceholder: "토핑을 입력하세요",
      initialData: menuToppings[selectedMenu?.name] || [],
      isTopping: true
    }
  };

  // 메뉴 추가 핸들러
  const handleMenuAdd = useCallback(() => {
    if (!selectedCategory) {
      alert('카테고리를 선택해주세요.');
      return;
    }

    // 상태 초기화
    setSelectedMenu(null);
    setMenuName('');
    setPrice('');
    setBasicOrderQuantity('');
    setMenuDescription('');
    
    // 폼 표시 상태 설정
    setShowMenuForm(true);
    setShowFullForm(false);
    setShowMenuSection(true);
    
    // 임시 메뉴 아이템 생성하여 선택된 메뉴로 설정
    const tempMenuItem = {
      id: uuidv4(),
      name: '',
      price: '',
      order: menuList[selectedCategory.name]?.length || 0
    };
    setSelectedMenu(tempMenuItem);  // 이 부분이 중요합니다
    
    // 원본 데이터 초기화
    setOriginalData({
      name: '',
      price: '',
      quantity: '',
      description: ''
    });
    
    // 변경사항 추적 초기화
    setHasUnsavedChanges(false);

    console.log('메뉴 추가 시 - 카테고리:', selectedCategory.name);
    
    setTimeout(() => {
      menuNameInputRef.current?.focus();
    }, 0);
  }, [selectedCategory, menuList]);

  // 메뉴 저장 핸들러
  const handleSaveAndKeyPress = useCallback(
    async (e) => {
      if (e && e.key && e.key !== 'Enter') return;
      
      if (!menuName || !price) {
        alert('메뉴 이름과 가격을 입력해주세요.');
        return;
      }
      if (!selectedCategory) {
        alert('카테고리를 선택해주세요.');
        return;
      }

      try {
        // 기존 메뉴 데이터 가져오기
        const existingMenu = selectedMenu || {};
        
        // 메뉴 아이템 데이터 정리
        const menuItem = {
          id: existingMenu.id || uuidv4(),
          name: menuName.trim(),
          price: Number(price),
          order: existingMenu.order || (menuList[selectedCategory.name]?.length || 0),
          ...(basicOrderQuantity && { basicOrderQuantity: Number(basicOrderQuantity) }),
          ...(menuDescription && { description: menuDescription.trim() }),
          ...(existingMenu.imageUrl && { imageUrl: existingMenu.imageUrl }),
          ...(existingMenu.sizes && { sizes: existingMenu.sizes }),
          ...(existingMenu.tastes && { tastes: existingMenu.tastes }),
          ...(existingMenu.toppings && { toppings: existingMenu.toppings }),
          updatedAt: new Date().toISOString(),
          createdAt: existingMenu.createdAt || new Date().toISOString()
        };

        const updatedItems = await updateMenuItem(
          user,
          currentStore,
          activeOption,
          selectedCategory.id,
          menuItem
        );

        // 로컬 상태 업데이트
        setMenuList((prev) => ({
          ...prev,
          [selectedCategory.name]: updatedItems
        }));

        // 새로운 메뉴 추가 시에만 세부설정 폼 표시
        setSelectedMenu(menuItem);
        setShowFullForm(true);

        setOriginalData({
          name: menuName,
          price: price,
          quantity: basicOrderQuantity || '',
          description: menuDescription || ''
        });
        setHasUnsavedChanges(false);
        
      } catch (error) {
        console.error('메뉴 저장 실패:', error);
        alert('메뉴 저장에 실패했습니다.');
      }
    },
    [menuName, price, selectedMenu, basicOrderQuantity, menuDescription, user, currentStore, activeOption, selectedCategory, menuList]
  );

  // 변경사항 체크 함수
  const checkForChanges = useCallback(() => {
    const currentData = {
      name: menuName,
      price: price,
      quantity: basicOrderQuantity,
      description: menuDescription
    };
    return JSON.stringify(currentData) !== JSON.stringify(originalData);
  }, [menuName, price, basicOrderQuantity, menuDescription, originalData]);

  // 키보드 이벤트 핸들러
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isMenuEditing) return;

      switch (e.key) {
        case 'F9':
          e.preventDefault();
          handleMenuAdd();
          break;
        case 'F10':
          e.preventDefault();
          if (menuName && price) handleSaveAndKeyPress();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuEditing, menuName, price, handleSaveAndKeyPress, handleMenuAdd]);

  // 현재 스토어 정보 가져오기
  useEffect(() => {
    if (user) {
      const loadStore = async () => {
        try {
          const store = await fetchCurrentStore(user);
          console.log('스토어 정보 로드 시도:', {
            userId: user.uid,
            store: store
          });

          if (!store || typeof store === 'string') {
            console.error('스토어 정보가 바르지 않습니다:', store);
            // 문자열로 온 경우 객체로 변환
            const storeObject = {
              id: POS_CONFIG.STORE_NAME,
              name: POS_CONFIG.STORE_NAME
            };
            setCurrentStore(storeObject);
            return;
          }

          setCurrentStore(store);
          console.log('스토어 정보 로드 완료:', store);

        } catch (error) {
          console.error('스토어 정보 로드 실패:', error);
        }
      };
      loadStore();
    }
  }, [user]);

  // 카테고리 데이터 로드
  useEffect(() => {
    if (user && currentStore) {
      const loadCategories = async () => {
        console.log('카테고리 로딩 시작');
        try {
          const menuCategories = await fetchCategories(user, currentStore, 'menu');
          const beverageCategories = await fetchCategories(user, currentStore, 'beverage');

          console.log('로드된 카테고리:', {
            menu: menuCategories,
            beverage: beverageCategories
          });

          setCategories({
            menu: menuCategories,
            beverage: beverageCategories,
            set: [],
          });
        } catch (error) {
          console.error('카테고리 로딩 실패:', error);
        }
      };
      loadCategories();
    }
  }, [user, currentStore]);

  // 메뉴 삭제 들러
  const handleDelete = useCallback(async () => {
    if (!selectedMenu || !selectedCategory) return;

    const shouldDelete = window.confirm('메뉴를 삭제하시겠습니까?');
    if (!shouldDelete) return;

    try {
      await deleteMenuItem(
        user,
        currentStore,
        activeOption,
        selectedCategory.id,
        selectedMenu.id
      );
      setSelectedMenu(null);
      setMenuName('');
      setPrice('');
      setBasicOrderQuantity('');
      setMenuDescription('');
      setShowMenuForm(false);
      setShowDeleteModal(false);

      // 로컬 상태 업데이트
      setMenuList((prev) => ({
        ...prev,
        [selectedCategory.name]: prev[selectedCategory.name].filter(
          (menu) => menu.id !== selectedMenu.id
        ),
      }));
    } catch (error) {
      console.error('메뉴 삭제 실패:', error);
    }
  }, [selectedMenu, selectedCategory, user, currentStore, activeOption]);

  // 카테고리 선택 핸들러
  const handleCategorySelect = useCallback(
    async (category) => {
      if (hasUnsavedChanges && checkForChanges()) {
        const shouldSave = window.confirm('저장되지 않은 변경사항이 있습니다. 저장하시겠습니까?');
        if (shouldSave) {
          await handleSaveAndKeyPress();
        }
      }

      // 카테고리 변경 시 상 초기화
      setSelectedMenu(null);
      setShowMenuForm(false);
      setShowFullForm(false);
      setMenuName('');
      setPrice('');
      setBasicOrderQuantity('');
      setMenuDescription('');
      
      setSelectedCategory(category);
      setShowMenuSection(true);

      try {
        const items = await fetchMenuItems(
          user,
          currentStore,
          activeOption,
          category.id
        );
        console.log('카테고리의 메뉴 아이템 로드:', items);

        // 메뉴 아이템에 저장된 description과 basicOrderQuantity 포함
        const updatedItems = items.map(item => ({
          ...item,
          description: item.description || '',
          basicOrderQuantity: item.basicOrderQuantity || ''
        }));

        setMenuList((prev) => ({
          ...prev,
          [category.name]: updatedItems,
        }));

        // 옵션 데이터 로드
        const optionsData = {
          sizes: {},
          tastes: {},
          toppings: {},
        };

        updatedItems.forEach((menu) => {
          console.log('메뉴 옵션 데이터:', {
            menuName: menu.name,
            sizes: menu.sizes,
            tastes: menu.tastes,
            toppings: menu.toppings
          });

          if (menu.sizes) optionsData.sizes[menu.name] = menu.sizes;
          if (menu.tastes) optionsData.tastes[menu.name] = menu.tastes;
          if (menu.toppings) optionsData.toppings[menu.name] = menu.toppings;
        });

        console.log('로드된 옵션 데이터:', optionsData);

        setMenuSizes(optionsData.sizes);
        setMenuTastes(optionsData.tastes);
        setMenuToppings(optionsData.toppings);
      } catch (error) {
        console.error('메뉴 아이템 로드 실패:', error);
      }
    },
    [user, currentStore, activeOption, hasUnsavedChanges, handleSaveAndKeyPress, checkForChanges]
  );

  // 메뉴 클릭 핸들러
  const handleMenuClick = useCallback((menu) => {
    setSelectedMenu(menu);
    setMenuName(menu.name);
    setPrice(String(menu.price));
    setBasicOrderQuantity(menu.basicOrderQuantity ? String(menu.basicOrderQuantity) : '');
    setMenuDescription(menu.description || '');
    setUploadedImage(menu.imageUrl);
    setShowMenuForm(true);
    setShowFullForm(true);
    
    setOriginalData({
      name: menu.name,
      price: String(menu.price),
      quantity: menu.basicOrderQuantity ? String(menu.basicOrderQuantity) : '',
      description: menu.description || ''
    });
  }, []);

  // 카테고리 추가 핸들러
  const handleCategoryAdd = () => {
    if (categories[activeOption].length >= 6) {
      alert('카테고리는 최대 6개까지만 추가할 수 있습니다.');
      return;
    }
    setShowCategoryModal(true);
  };

  // 카테고리 저장 핸들러
  const handleCategorySubmit = async () => {
    if (newCategoryName.trim()) {
      console.log('카테고리 추가 시작:', {
        activeOption,
        currentCategories: categories[activeOption]
      });

      const newCategory = {
        id: uuidv4(),
        name: newCategoryName.trim(),
        order: categories[activeOption].length,
        items: []
      };

      console.log('새로운 카테고리:', newCategory);

      const updatedCategories = [...categories[activeOption], newCategory];

      try {
        console.log('카테고리 업데이트 시도:', {
          user: user?.uid,
          store: currentStore,
          type: activeOption,
          categories: updatedCategories
        });

        const result = await updateCategories(
          user,
          currentStore,
          activeOption,
          updatedCategories
        );

        console.log('✅ 카테고리 저장 성공:', result);

        setCategories((prev) => ({
          ...prev,
          [activeOption]: updatedCategories,
        }));

        setNewCategoryName('');
        setShowCategoryModal(false);
      } catch (error) {
        console.error(' 카테고리 저장 중 오류 발생:', error);
      }
    }
  };

  const handleOptionSubmit = async (modalType, data) => {
    if (!selectedMenu || !selectedCategory) {
      console.error('메뉴 또는 카테고리가 선택되지 않았습니다.');
      return;
    }

    try {
      console.log('옵션 저장 시작:', { modalType, data, selectedMenu });

      // 옵션 데이터 검증
      const validData = data.filter(item => {
        return item && typeof item === 'object' && 
               Object.values(item).some(value => value !== undefined && value !== '');
      });

      if (validData.length === 0) {
        console.warn('저장할 유효한 옵션 데이터가 없습니다.');
        return;
      }

      // 현재 메뉴의 모든 데이터를 포함한 업데이트된 메뉴 아이템 생성
      const updatedMenuData = {
        ...selectedMenu,
        [modalType === 'size' ? 'sizes' : 
         modalType === 'taste' ? 'tastes' : 
         'toppings']: validData
      };

      // 메뉴 아이템 업데이트
      const updatedItems = await updateMenuItem(
        user,
        currentStore,
        activeOption,
        selectedCategory.id,
        updatedMenuData
      );

      // 상태 업데이트
      const updatedMenu = updatedItems.find(item => item.id === selectedMenu.id);
      if (updatedMenu) {
        setSelectedMenu(updatedMenu);
        
        // 옵션 상태 업데이트
        switch (modalType) {
          case 'size':
            setMenuSizes(prev => ({
              ...prev,
              [updatedMenu.name]: validData
            }));
            break;
          case 'taste':
            setMenuTastes(prev => ({
              ...prev,
              [updatedMenu.name]: validData
            }));
            break;
          case 'topping':
            setMenuToppings(prev => ({
              ...prev,
              [updatedMenu.name]: validData
            }));
            break;
          default:
            break;
        }

        // 메뉴 리스트 업데이트
        setMenuList(prev => ({
          ...prev,
          [selectedCategory.name]: updatedItems
        }));

        console.log('✅ 옵션 저장 완료:', {
          modalType,
          menuName: selectedMenu.name,
          data: validData
        });
      }
    } catch (error) {
      console.error('❌ 옵션 저장 실패:', error);
      alert('옵션 저장에 실패했습니다.');
    }
  };

  // 통합된 모달 컴포넌트
  <OptionModal
    isOpen={!!activeModal}
    onClose={() => setActiveModal(null)}
    onSubmit={(data) => handleOptionSubmit(activeModal, data)}
    {...(modalConfigs[activeModal] || {})}
  />

  // 입력 필드 변경 핸들러
  const handleInputChange = (setter) => (value) => {
    const newValue = value?.target ? value.target.value : value;
    setter(newValue);
    setHasUnsavedChanges(true);
  };

  // 옵션 토글 핸들러
  const handleOptionToggle = (newOption) => {
    // 토글 변경  모든 상태 기화
    setSelectedMenu(null);
    setShowMenuForm(false);
    setShowFullForm(false);
    setMenuName('');
    setPrice('');
    setBasicOrderQuantity('');
    setMenuDescription('');
    setSelectedCategory(null);  // 선택된 카테고리 초기화
    setShowMenuSection(false);  // 메뉴 섹션 숨기기
    setMenuList({});  // 메뉴 리스트 초기화
    setActiveOption(newOption);

    console.log(`글 변경: ${newOption}`);
  };

  // EditModal 관련 핸들러 수정
  const handleEditModalSubmit = async (updatedItems, type) => {
    try {
      console.log('편집 저장 시작:', { type, updatedItems });

      if (type === 'category') {
        // 카테고리 데이터 준비
        const categoryData = updatedItems.map(item => ({
          id: item.id || uuidv4(),
          name: item.name.trim(),
          order: item.order,
          createdAt: item.createdAt || new Date().toISOString()
        }));

        console.log('카테고리 저장 데이터:', categoryData);

        // 카테고리 업데이트
        const updatedCategories = await updateCategories(
          user,
          currentStore,
          activeOption,
          categoryData
        );

        // 로컬 상태 업데이트
        setCategories(prev => ({
          ...prev,
          [activeOption]: updatedCategories
        }));

        console.log('✅ 카테고리 저장 완료');
      } else if (type === 'menu' && selectedCategory) {
        // 메뉴 아이템 업데이트
        await updateCategoryItems(
          user,
          currentStore,
          activeOption,
          selectedCategory.id,
          updatedItems
        );

        // 로컬 상태 업데이트
        setMenuList(prev => ({
          ...prev,
          [selectedCategory.name]: updatedItems
        }));
      }
    } catch (error) {
      console.error('❌ 편집 저장 실패:', error);
      alert('저장 중 오류가 발생했습니다.');
    }

    // 모달 닫기
    setShowCategoryModal(false);
    setShowMenuEditModal(false);
  };

  // 이미지 업로드 핸들러 수정
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const storeId = currentStore?.id || POS_CONFIG.STORE_NAME;
      
      console.log('이미지 업로드 시작:', {
        storeId,
        menuId: selectedMenu?.id,
        fileName: file.name
      });

      if (!storeId || !selectedMenu?.id) {
        console.error('필요한 정보가 없습니다:', { 
          storeId, 
          selectedMenuId: selectedMenu?.id,
          currentStore
        });
        alert('스토어 정보나 메뉴 정보가 올바르게 드되지 않았습니다.');
        return;
      }

      // 이미지 파일 크기 체크
      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 크기는 5MB를 초과할 수 없습니다.');
        return;
      }

      // 파일 확장자 확인
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
      if (!validExtensions.includes(fileExtension)) {
        alert('지원되는 이미지 형식은 jpg, jpeg, png, gif입니다.');
        return;
      }

      // 이미지 업로드
      const imagePath = `menu-images/${storeId}/${selectedMenu.id}.${fileExtension}`;
      console.log('이미지 저장 경로:', imagePath);

      const imageRef = ref(storage, imagePath);
      const uploadResult = await uploadBytes(imageRef, file);
      console.log('Storage 업로드 결과:', uploadResult);

      // 이미지 URL 가져오기
      const imageUrl = await getDownloadURL(imageRef);
      console.log('이미지 URL 획득:', imageUrl);

      // 기존 메뉴 데이터 가져오기
      const currentItems = menuList[selectedCategory.name] || [];
      const currentMenuItem = currentItems.find(item => item.id === selectedMenu.id);
      console.log('현재 메뉴 데이터:', currentMenuItem);

      // 메뉴 데이터에 이미지 URL 추가하여 업데이트
      const updatedMenuItem = {
        ...selectedMenu,
        ...currentMenuItem,  // 기존 데이터 보존
        imageUrl: imageUrl,  // 이미지 URL 추가
        order: currentMenuItem?.order || selectedMenu.order,
        updatedAt: new Date().toISOString()
      };

      console.log('업데이트할 메뉴 데이터:', updatedMenuItem);

      // 메뉴 아이템 업데이트
      const result = await updateMenuItem(
        user,
        currentStore,
        activeOption,
        selectedCategory.id,
        updatedMenuItem
      );

      console.log('메뉴 업데이트 결과:', result);

      // 로컬 상태 업데이트
      setSelectedMenu(updatedMenuItem);
      setUploadedImage(imageUrl);
      setMenuList(prev => {
        const newList = {
          ...prev,
          [selectedCategory.name]: prev[selectedCategory.name].map(item => 
            item.id === selectedMenu.id ? updatedMenuItem : item
          )
        };
        console.log('업데이트된 메뉴 리스트:', newList);
        return newList;
      });

      console.log('이미지 업로드 프로세스 완료:', {
        imageUrl,
        menuItem: updatedMenuItem
      });

    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      console.error('에러 상세 정보:', {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      alert(`이미지 업로드 실패: ${error.message}`);
    }
  };

  // 이미지 삭제 핸들러 수정
  const handleImageRemove = async () => {
    if (!selectedMenu?.imageUrl || !currentStore?.id) return;

    try {
      // 이미지 URL에서 파일 이름과 확장자 추출
      const urlParts = selectedMenu.imageUrl.split('?')[0].split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      console.log('이미지 삭제 시도:', {
        currentStore,
        selectedMenu,
        imageUrl: selectedMenu.imageUrl,
        fileName
      });

      // Storage 경로 설정
      const imagePath = `menu-images/${currentStore.id}/${fileName}`;
      console.log('삭제할 이미지 경로:', imagePath);
      
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef);

      // 메뉴 데이터에서 이미지 URL 제거
      const updatedMenuItem = {
        ...selectedMenu,
        imageUrl: null
      };

      // Firestore 업데이트
      await updateMenuItem(
        user,
        currentStore,
        activeOption,
        selectedCategory.id,
        updatedMenuItem
      );

      // 로컬 상태 업데이트
      setSelectedMenu(updatedMenuItem);
      setUploadedImage(null);
      setMenuList(prev => ({
        ...prev,
        [selectedCategory.name]: prev[selectedCategory.name].map(item => 
          item.id === selectedMenu.id ? updatedMenuItem : item
        )
      }));

      console.log('이미지 삭제 완료');

    } catch (error) {
      console.error('이미지 삭제 실패:', error);
      
      // 에러가 object-not-found인 경우에도 메뉴 데이터에서 이미지 URL 제거
      if (error.code === 'storage/object-not-found') {
        const updatedMenuItem = {
          ...selectedMenu,
          imageUrl: null
        };

        await updateMenuItem(
          user,
          currentStore,
          activeOption,
          selectedCategory.id,
          updatedMenuItem
        );

        setSelectedMenu(updatedMenuItem);
        setUploadedImage(null);
        setMenuList(prev => ({
          ...prev,
          [selectedCategory.name]: prev[selectedCategory.name].map(item => 
            item.id === selectedMenu.id ? updatedMenuItem : item
          )
        }));

        console.log('이미지 URL 제거 완료 (파일이 존재하지 않음)');
      } else {
        alert('이미지 삭제에 실패했습니다.');
      }
    }
  };

  const handleSizeAdd = () => {
    setActiveModal('size');
  };

  const handleTasteAdd = () => {
    setActiveModal('taste');
  };

  const handleToppingAdd = () => {
    setActiveModal('topping');
  };

  if (!isMenuEditing) return null;

  return (
    <div className={styles.menuPanel}>
      <motion.div
        className={styles.menuSectionButtonContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {activeOption !== 'set' && (
          <div className={styles.categoryContainer}>
            {categories[activeOption].map((category) => (
              <div
                key={category.id}
                className={`${styles.categoryBox} ${
                  selectedCategory?.id === category.id ? styles.selected : ''
                }`}
                onClick={() => handleCategorySelect(category)}
              >
                {category.name}
              </div>
            ))}
            {categories[activeOption].length < 6 && (
              <div
                key="add-placeholder"
                className={`${styles.categoryPlaceholder} ${styles.firstPlaceholder}`}
                onClick={handleCategoryAdd}
              >
                + 카테고리 추가
              </div>
            )}
            {[...Array(Math.max(0, 5 - categories[activeOption].length))].map(
              (_, index) => (
                <div
                  key={`placeholder-${index}`}
                  className={`${styles.categoryPlaceholder}`}
                >
                  {/* 빈 placeholder */}
                </div>
              )
            )}
          </div>
        )}
        <div className={styles.toggleButtonContainer}>
          <button
            className={`${styles.toggleButton} ${
              activeOption === 'menu' ? styles.active : ''
            }`}
            onClick={() => handleOptionToggle('menu')}
          >
            메뉴
          </button>
          <button
            className={`${styles.toggleButton} ${
              activeOption === 'beverage' ? styles.active : ''
            }`}
            onClick={() => handleOptionToggle('beverage')}
          >
            음료
          </button>
          <button
            className={`${styles.toggleButton} ${
              activeOption === 'set' ? styles.active : ''
            }`}
            onClick={() => handleOptionToggle('set')}
          >
            세
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {showMenuSection && activeOption !== 'set' && (
          <motion.div>
            <div className={styles.divider}></div>
            <div className={styles.menuSection}>
              <LeftSection
                selectedCategory={selectedCategory}
                handleMenuAdd={handleMenuAdd}
                menuList={menuList}
                selectedMenu={selectedMenu}
                handleMenuClick={handleMenuClick}
              />
              <div className={styles.verticalDivider}></div>
              {selectedMenu && (
                <RightSection
                  showMenuForm={showMenuForm}
                  menuNameInputRef={menuNameInputRef}
                  menuName={menuName}
                  setMenuName={handleInputChange(setMenuName)}
                  price={price}
                  handlePriceChange={handleInputChange(setPrice)}
                  basicOrderQuantity={basicOrderQuantity}
                  handleQuantityChange={handleInputChange(setBasicOrderQuantity)}
                  uploadedImage={uploadedImage}
                  handleImageUpload={handleImageUpload}
                  handleImageRemove={handleImageRemove}
                  menuDescription={menuDescription}
                  setMenuDescription={handleInputChange(setMenuDescription)}
                  handleSave={handleSaveAndKeyPress}
                  showFullForm={showFullForm}
                  handleDelete={handleDelete}
                  handleCategoryEdit={() => setShowCategoryModal(true)}
                  handleMenuEdit={() => setShowMenuEditModal(true)}
                  menuSizes={menuSizes}
                  menuTastes={menuTastes}
                  selectedMenu={selectedMenu}
                  handleSizeAdd={handleSizeAdd}
                  handleTasteAdd={handleTasteAdd}
                  menuToppings={menuToppings}
                  handleToppingAdd={handleToppingAdd}
                  handleKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveAndKeyPress(e);
                    }
                  }}
                  imageUrl={selectedMenu?.imageUrl}
                />
              )}
            </div>
          </motion.div>
        )}
        {activeOption === 'set' && <SetSection />}
      </AnimatePresence>

      {/* 모달 컴포넌트들 */}
      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false);
          setNewCategoryName('');
        }}
        onSubmit={handleCategorySubmit}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />

      <OptionModal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        onSubmit={(data) => handleOptionSubmit(activeModal, data)}
        {...(modalConfigs[activeModal] || {})}
      />

      <EditModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSubmit={(updatedItems) => {
          handleEditModalSubmit(updatedItems, 'category');
        }}
        items={categories[activeOption]}
        title="카테고리 편집"
        type="category"
      />

      <EditModal
        isOpen={showMenuEditModal}
        onClose={() => setShowMenuEditModal(false)}
        onSubmit={(updatedItems) => {
          handleEditModalSubmit(updatedItems, 'menu');
        }}
        items={menuList[selectedCategory?.name] || []}
        title="메뉴 편집"
        type="menu"
      />
    </div>
  );
}
