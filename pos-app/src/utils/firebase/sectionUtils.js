import { doc, setDoc, writeBatch, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { getSectionRef, getTableRef } from './paths';
import { v4 as uuidv4 } from 'uuid';
import { POS_CONFIG } from '../../config/constants';

export const syncSections = (user, currentStore, setSections, setSelectedSection, isInitialLoadRef) => {
  if (!user) return () => {};

  try {
    const storeId = currentStore?.id || POS_CONFIG.STORE_NAME;
    const sectionsRef = getSectionRef(user.uid, storeId);
    
    console.log('섹션 동기화 시작:', {
      userId: user.uid,
      storeId: storeId,
      sectionsRef: sectionsRef
    });

    const unsubscribe = onSnapshot(sectionsRef, async (snapshot) => {
      if (snapshot.empty) {
        // 섹션이 없는 경우 기본 섹션 생성
        const sectionId = uuidv4();
        const sectionData = {
          id: sectionId,
          name: '섹션 1',
          order: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await setDoc(doc(sectionsRef, sectionId), sectionData);
        setSections([sectionData]);

        if (isInitialLoadRef.current) {
          setSelectedSection(sectionData);
        }
      } else {
        const sectionsData = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => a.order - b.order);

        console.log('섹션 데이터 로드:', sectionsData);
        setSections(sectionsData);

        if (isInitialLoadRef.current && setSelectedSection && sectionsData.length > 0) {
          setSelectedSection(sectionsData[0]);
        }
      }
    });

    return unsubscribe;
  } catch (error) {
    console.error('섹션 동기화 실패:', error);
    return () => {};
  }
};

export const addSection = async (user, currentStore, sectionName, order) => {
  if (!user || !currentStore) return;
  
  const newSectionId = uuidv4();
  const newSection = {
    id: newSectionId,
    name: sectionName,
    order,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const sectionsRef = getSectionRef(user.uid, currentStore);
  await setDoc(doc(sectionsRef, newSectionId), newSection);

  return newSection;
};

export const deleteSectionWithTables = async (user, currentStore, sectionId) => {
  if (!user || !currentStore) return;

  const batch = writeBatch(db);
  const sectionsRef = getSectionRef(user.uid, currentStore);
  const tablesRef = getTableRef(user.uid, currentStore, sectionId);

  const tablesSnapshot = await getDocs(tablesRef);
  tablesSnapshot.docs.forEach((doc) => batch.delete(doc.ref));
  batch.delete(doc(sectionsRef, sectionId));

  await batch.commit();
};

export const updateSectionOrder = async (user, currentStore, sections) => {
  if (!user || !currentStore) return;

  const batch = writeBatch(db);
  const sectionsRef = getSectionRef(user.uid, currentStore);

  sections.forEach((section, index) => {
    const sectionRef = doc(sectionsRef, section.id);
    batch.update(sectionRef, {
      order: index,
      updatedAt: new Date().toISOString(),
    });
  });

  await batch.commit();
};

export const updateSectionName = async (user, currentStore, sectionId, newName) => {
  if (!user || !currentStore) return;

  const sectionsRef = getSectionRef(user.uid, currentStore);
  await setDoc(
    doc(sectionsRef, sectionId),
    { name: newName, updatedAt: new Date().toISOString() },
    { merge: true }
  );
};