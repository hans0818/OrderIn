import { getDocs, doc, setDoc } from 'firebase/firestore';
import { getStoreRef } from './paths';
import { POS_CONFIG } from '../../config/constants';

export const fetchCurrentStore = async (user) => {
  if (!user) return null;
  
  try {
    const storesRef = getStoreRef(user.uid);
    const storesSnapshot = await getDocs(storesRef);
    
    if (storesSnapshot.empty) {
      const defaultStore = {
        id: POS_CONFIG.STORE_NAME,
        name: POS_CONFIG.STORE_NAME,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const storeDoc = doc(storesRef, POS_CONFIG.STORE_NAME);
      await setDoc(storeDoc, defaultStore);
      
      return defaultStore;
    }

    const storeDoc = storesSnapshot.docs[0];
    return {
      id: storeDoc.id,
      name: storeDoc.id,
      ...storeDoc.data()
    };

  } catch (error) {
    console.error('스토어 정보 로드 실패:', error);
    return {
      id: POS_CONFIG.STORE_NAME,
      name: POS_CONFIG.STORE_NAME
    };
  }
}; 