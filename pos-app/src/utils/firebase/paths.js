import { collection, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { POS_CONFIG } from '../../config/constants';

export const getStorePath = (userId) => 
  `users/${userId}/stores`;

export const getSectionPath = (userId, storeId) => 
  `users/${userId}/stores/${storeId}/sections`;

export const getTablePath = (userId, storeId, sectionId) => 
  `users/${userId}/stores/${storeId}/sections/${sectionId}/tables`;

export const getSettingsPath = (userId, storeId) => 
  `users/${userId}/stores/${storeId}/settings/global`;

// Firestore 참조 생성 헬퍼 함수
export const getCollectionRef = (db, path) => collection(db, path);
export const getDocRef = (db, path, docId) => doc(db, path, docId);

// 컬렉션 참조 생성 헬퍼 함수
export const getStoreRef = (userId) => 
  collection(db, 'users', userId, 'stores');

export const getSectionRef = (userId, store) => {
  const storeId = typeof store === 'string' ? store : store?.id || POS_CONFIG.STORE_NAME;
  return collection(db, 'users', userId, 'stores', storeId, 'sections');
};

export const getTableRef = (userId, store, sectionId) => {
  const storeId = typeof store === 'string' ? store : store?.id || POS_CONFIG.STORE_NAME;
  return collection(db, 'users', userId, 'stores', storeId, 'sections', sectionId, 'tables');
};

export const getSettingsRef = (userId, storeId) => 
  doc(db, getSettingsPath(userId, storeId));