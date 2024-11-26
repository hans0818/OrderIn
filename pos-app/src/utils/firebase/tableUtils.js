import { doc,  writeBatch, getDocs, setDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { getTableRef } from './paths';
import { v4 as uuidv4 } from 'uuid';

export const syncTablesData = (user, currentStore, selectedSection, isTableEditing, setTables, gridSize) => {
  if (!user || !currentStore || !selectedSection) return () => {};

  const tablesRef = getTableRef(user.uid, currentStore, selectedSection.id);

  // 초기 데이터 로드만 수행
  getDocs(tablesRef).then((snapshot) => {
    const tablesData = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        if (!data.gridPosition || !data.gridSize) return null;

        return {
          ...data,
          id: doc.id,
          key: uuidv4(),
          position: {
            x: data.gridPosition.x * gridSize[0],
            y: data.gridPosition.y * gridSize[1],
          },
          size: {
            width: data.gridSize.width * gridSize[0],
            height: data.gridSize.height * gridSize[1],
          },
          isSelected: false,
          showOptionPannel: false,
        };
      })
      .filter(Boolean);
    setTables(tablesData || []);
  });

  return () => {};
};

export const saveTables = async (user, currentStore, selectedSection, tables, gridSize) => {
  if (!user || !currentStore || !selectedSection) return;

  try {
    const batch = writeBatch(db);
    const tablesRef = getTableRef(user.uid, currentStore, selectedSection.id);

    // 기존 테이블 삭제
    const snapshot = await getDocs(tablesRef);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // 새로운 테이블 저장
    tables.forEach((table) => {
      const newDocRef = doc(tablesRef, table.id);
      const { isSelected, key, showOptionPannel, ...tableData } = table;

      // 실제 픽셀 위치와 크기를 그리드 단위로 변환
      const gridData = {
        ...tableData,
        sectionId: selectedSection.id,
        gridPosition: {
          x: Math.round(table.position.x / gridSize[0]),
          y: Math.round(table.position.y / gridSize[1])
        },
        gridSize: {
          width: Math.round(table.size.width / gridSize[0]),
          height: Math.round(table.size.height / gridSize[1])
        },
        // 실제 픽셀 위치와 크기도 함께 저장
        position: table.position,
        size: table.size,
        updatedAt: new Date().toISOString()
      };

      batch.set(newDocRef, gridData);
    });

    await batch.commit();
    console.log('테이블 저장 완료:', tables);
  } catch (error) {
    console.error('테이블 저장 실패:', error);
    throw error;
  }
};

export const addTable = async (user, currentStore, selectedSection, newTable, gridSize) => {
  if (!user || !currentStore || !selectedSection) {
    console.error('필수 정보 누락:', { user, currentStore, selectedSection });
    return;
  }

  try {
    // Firestore에 테이블 데이터 저장
    const tableRef = doc(collection(db, 
      `users/${user.uid}/stores/${currentStore.id}/sections/${selectedSection.id}/tables`
    ), newTable.id);

    const tableData = {
      ...newTable,
      position: {
        x: newTable.gridPosition.x * gridSize[0],
        y: newTable.gridPosition.y * gridSize[1],
      },
      size: {
        width: newTable.gridSize.width * gridSize[0],
        height: newTable.gridSize.height * gridSize[1],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(tableRef, tableData);
    console.log('테이블 저장 완료:', tableData);

    return tableData;
  } catch (error) {
    console.error('테이블 저장 실패:', error);
    throw error;
  }
};

export const updateTable = async (user, currentStore, selectedSection, tableId, updates, gridSize) => {
  if (!user || !currentStore || !selectedSection || !tableId) return;

  try {
    const tableRef = doc(collection(db, 
      `users/${user.uid}/stores/${currentStore.id}/sections/${selectedSection.id}/tables`
    ), tableId);

    // 위치와 크기 정보를 그리드 단위로 변환
    const updatedData = {
      ...updates,
      gridPosition: updates.position ? {
        x: Math.round(updates.position.x / gridSize[0]),
        y: Math.round(updates.position.y / gridSize[1])
      } : undefined,
      gridSize: updates.size ? {
        width: Math.round(updates.size.width / gridSize[0]),
        height: Math.round(updates.size.height / gridSize[1])
      } : undefined,
      updatedAt: new Date().toISOString()
    };

    await setDoc(tableRef, updatedData, { merge: true });
    console.log('테이블 업데이트 완료:', updatedData);

    return updatedData;
  } catch (error) {
    console.error('테이블 업데이트 실패:', error);
    throw error;
  }
};