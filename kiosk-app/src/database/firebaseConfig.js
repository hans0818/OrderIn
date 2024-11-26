import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, limit } from "firebase/firestore";
import { POS_CONFIG } from '../config/constants';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// 스토어 이름을 상수로 추가
export const STORE_NAME = POS_CONFIG.STORE_NAME;

// POS 유저 및 스토어 데이터 확인 함수
async function checkPosData() {
    try {
        // users 컬렉션 확인
        console.log('=== POS 데이터 확인 시작 ===');
        const usersRef = collection(db, 'users');
        const usersQuery = query(usersRef, limit(5));
        const usersSnapshot = await getDocs(usersQuery);
        
        console.log('사용 가능한 유저 목록:');
        usersSnapshot.forEach(doc => {
            console.log('- User ID:', doc.id);
        });

        // 현재 설정된 값 확인
        console.log('\n현재 설정된 값:');
        console.log('POS_USER_ID:', POS_CONFIG.USER_ID);
        console.log('STORE_NAME:', POS_CONFIG.STORE_NAME);
        
        // 특정 유저의 스토어 확인
        if (POS_CONFIG.USER_ID) {
            const storesRef = collection(db, `users/${POS_CONFIG.USER_ID}/stores`);
            const storesSnapshot = await getDocs(storesRef);
            
            console.log('\n해당 유저의 스토어 목록:');
            storesSnapshot.forEach(doc => {
                console.log('- Store:', doc.id);
            });
        }
        
        console.log('=== POS 데이터 확인 완료 ===\n');
    } catch (error) {
        console.error('POS 데이터 확인 중 에러:', error);
    }
}

// 초기 데이터 확인 실행
checkPosData();

// Firestore에서 메뉴 데이터를 가져오는 함수
export async function fetchMenuData() {
    try {
        await checkPosData();
        const menuCategoriesRef = collection(db, `users/${POS_CONFIG.USER_ID}/stores/${POS_CONFIG.STORE_NAME}/menus/menu/categories`);
        const querySnapshot = await getDocs(menuCategoriesRef);
        
        const data = [];
        for (const categoryDoc of querySnapshot.docs) {
            const categoryData = categoryDoc.data();
            console.log('카테고리 데이터:', categoryData);
            
            const items = categoryData.items || [];
            items.forEach(item => {
                console.log('원본 메뉴 아이템 데이터:', {
                    name: item.name,
                    sizes: item.sizes,
                    tastes: item.tastes,
                    toppings: item.toppings
                });

                const formattedSizes = (item.sizes || []).map(size => ({
                    label: size.sizeName,  // sizeName을 label로 변환
                    price: Number(size.additionalPrice) || 0,  // additionalPrice를 숫자로 변환
                    selected: false
                }));

                const formattedTastes = (item.tastes || []).map(taste => ({
                    label: taste.tasteName,  // tasteName을 label로 변환
                    price: Number(taste.additionalPrice) || 0,
                    selected: false
                }));

                const formattedToppings = (item.toppings || []).map(topping => ({
                    label: topping.toppingName,  // toppingName을 label로 변환
                    price: Number(topping.additionalPrice) || 0,
                    selected: false
                }));

                console.log('변환된 옵션 데이터:', {
                    sizes: formattedSizes,
                    tastes: formattedTastes,
                    toppings: formattedToppings
                });

                data.push({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    category: categoryData.name,
                    order: item.order || 0,
                    categoryOrder: categoryData.order || 0,
                    basicOrderQuantity: item.basicOrderQuantity,
                    description: item.description,
                    imageUrl: item.imageUrl,
                    sizes: formattedSizes,
                    tastes: formattedTastes,
                    toppings: formattedToppings,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt
                });
            });
        }

        console.log('최종 변환된 메뉴 데이터:', data);
        return data;
    } catch (error) {
        console.error('메뉴 데이터 가져오기 실패:', error);
        return [];
    }
}

// Firestore에서 카테고리 데이터를 가져오는 함수
export async function fetchCategories() {
    try {
        console.log('POS 카테고리 데이터 가져오기 시작');
        const menuCategoriesRef = collection(db, `users/${POS_CONFIG.USER_ID}/stores/${POS_CONFIG.STORE_NAME}/menus/menu/categories`);
        const querySnapshot = await getDocs(menuCategoriesRef);
        const categories = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            categories.push({
                id: doc.id,
                name: data.name,
                order: data.order
            });
        });

        categories.sort((a, b) => a.order - b.order);
        console.log('변환된 카테고리 데이터:', categories);
        return categories;
    } catch (error) {
        console.error('카테고리 데이터 가져오기 실패:', error);
        return [];
    }
}

// Firestore에서 음료 데이터를 가져오는 함수
export async function fetchBeverageData() {
    try {
        console.log('POS 음료 데이터 가져오기 시작');
        const beverageCategoriesRef = collection(db, `users/${POS_CONFIG.USER_ID}/stores/${POS_CONFIG.STORE_NAME}/menus/beverage/categories`);
        const querySnapshot = await getDocs(beverageCategoriesRef);
        const data = [];

        for (const categoryDoc of querySnapshot.docs) {
            const categoryData = categoryDoc.data();
            console.log('음료 카테고리 데이터:', categoryData);

            const items = categoryData.items || [];
            items.forEach(item => {
                const formattedSizes = (item.sizes || []).map(size => ({
                    label: size.name,  // name을 label로 변환
                    price: size.price,
                    selected: false
                }));

                const formattedTastes = (item.tastes || []).map(taste => ({
                    label: taste.name,  // name을 label로 변환
                    price: taste.price || 0,
                    selected: false
                }));

                data.push({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    category: categoryData.name,
                    order: item.order,
                    basicOrderQuantity: item.basicOrderQuantity,
                    beverageDescription: item.beverageDescription,
                    sizes: formattedSizes,
                    tastes: formattedTastes,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt
                });
            });
        }

        console.log('변환된 음료 데이터:', data);
        return data;
    } catch (error) {
        console.error('음료 데이터 가져오기 실패:', error);
        return [];
    }
}

// Firestore에서 음료 카테고리를 가져오는 함수
export async function fetchBeverageCategories() {
    try {
        console.log('POS 음료 카테고리 데이터 가져오기 시작');
        const beverageCategoriesRef = collection(db, `users/${POS_CONFIG.USER_ID}/stores/${POS_CONFIG.STORE_NAME}/menus/beverage/categories`);
        const querySnapshot = await getDocs(beverageCategoriesRef);
        const categories = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            categories.push({
                id: doc.id,
                name: data.name,
                order: data.order
            });
        });

        categories.sort((a, b) => a.order - b.order);
        console.log('변환된 음료 카테고리 데이터:', categories);
        return categories;
    } catch (error) {
        console.error('음료 카테고리 데이터 가져오기 실패:', error);
        return [];
    }
}
