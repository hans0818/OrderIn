// src/components/TablePanel.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './TablePanel.module.css';
import Grid from './TablePanelComponents/Grid';
import TableAddButton from './TablePanelComponents/TableAddButton';
import useTableManager from '../../hooks/useTableManager';
import useGridSize from '../../hooks/useGridSize';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebase';
import { fetchCurrentStore } from '../../utils/firebase/storeUtils';
// eslint-disable-next-line no-unused-vars
import {
  syncTablesData,
  saveTables,
  addTable,
} from '../../utils/firebase/tableUtils';
import { v4 as uuidv4 } from 'uuid';

export default function TablePanel({
  isEditingSpace,
  isTableEditing,
  viewMode,
  setViewMode,
  fontSize,
  fontSizeToggle,
  handleFontSizeToggle,
  onSaveTableChanges,
  selectedSection,
}) {
  const [user] = useAuthState(auth);
  const [currentStore, setCurrentStore] = useState(null);
  const [optionPannelId, setOptionPannelId] = useState(null);
  const [selectedTablePosition, setSelectedTablePosition] = useState(null);
  const [tableCount, setTableCount] = useState(0);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const addButtonRef = useRef(null);
  const columns = 60;
  const rows = 30;

  const { gridSize, gridRef } = useGridSize(columns, rows);
  const { tables, setTables, editTable, deleteTable } = useTableManager();

  // 현재 스토어 정보 가져오기
  useEffect(() => {
    if (user) {
      fetchCurrentStore(user).then(setCurrentStore);
    }
  }, [user]);

  // 테이블 데이터 실시간 동기화
  useEffect(() => {
    if (user && currentStore && selectedSection) {
      const unsubscribe = syncTablesData(
        user,
        currentStore,
        selectedSection,
        isTableEditing,
        (newTables) => {
          setTables((prevTables) => {
            const updatedTables = newTables.map((newTable) => {
              const existingTable = prevTables.find((t) => t.id === newTable.id);
              return {
                ...newTable,
                isSelected: existingTable?.isSelected || false,
                showOptionPannel: existingTable?.showOptionPannel || false,
                position: existingTable?.position || newTable.position,
                size: existingTable?.size || newTable.size,
              };
            });

            const selectedTable = updatedTables.find((table) => table.isSelected);
            if (selectedTable) {
              const otherTables = updatedTables.filter((table) => !table.isSelected);
              return [...otherTables, selectedTable];
            } else {
              return updatedTables;
            }
          });
        },
        gridSize,
        optionPannelId
      );
      return () => unsubscribe();
    }
  }, [user, currentStore, selectedSection, gridSize, isTableEditing, optionPannelId, setTables]);

  // 테이블 변경 사항 저장
  const saveTableChanges = useCallback(async () => {
    try {
      await saveTables(user, currentStore, selectedSection, tables, gridSize);
      setUnsavedChanges(false);
    } catch (error) {
      console.error('테이블 저장 실패:', error);
    }
  }, [user, currentStore, selectedSection, tables, gridSize]);

  // saveTableChanges 함수를 상위 컴포넌트로 전달
  useEffect(() => {
    if (onSaveTableChanges) {
      onSaveTableChanges(saveTableChanges);
    }
  }, [onSaveTableChanges, saveTableChanges]);

  // 테이블 변경 감지
  const handleTableChange = useCallback(() => {
    if (isTableEditing) {
      setUnsavedChanges(true);
    }
  }, [isTableEditing]);

  const handleAddTable = async (newTableData) => {
    const { size, color, position } = newTableData;
    let gridPosition;

    // 현재 섹션의 테이블 중 가장 큰 숫자를 가진 테이블 찾기
    const maxTableNumber = tables.reduce((max, table) => {
      const match = table.text?.match(/(\d+)번 테이블/);
      if (match) {
        const number = parseInt(match[1], 10);
        return Math.max(max, number);
      }
      return max;
    }, 0);

    const newTableNumber = maxTableNumber + 1;

    if (position) {
      // 전달받은 위치 사용
      gridPosition = {
        x: Math.round(position.x / gridSize[0]),
        y: Math.round(position.y / gridSize[1]),
      };
    } else if (selectedTablePosition) {
      gridPosition = {
        x: Math.round(selectedTablePosition.x / gridSize[0]) + 1,
        y: Math.round(selectedTablePosition.y / gridSize[1]) + 1,
      };

      // 화면 경계 체크
      if (gridPosition.x > columns - 15) {
        gridPosition.x = Math.round(selectedTablePosition.x / gridSize[0]);
        gridPosition.y = Math.round(selectedTablePosition.y / gridSize[1]) + 2;
      }
      if (gridPosition.y > rows - 10) {
        gridPosition = { x: 5, y: 3 };
      }
    } else {
      // 선택된 테이블이 없으면 기본 위치에서 시작
      if (tables.length > 0) {
        const lastTable = tables[tables.length - 1];
        const lastPosition = {
          x: Math.round(lastTable.position.x / gridSize[0]),
          y: Math.round(lastTable.position.y / gridSize[1]),
        };
        gridPosition = {
          x: lastPosition.x + 1,
          y: lastPosition.y + 1,
        };
      } else {
        gridPosition = { x: 5, y: 3 };
      }
    }

    const uniqueId = uuidv4();
    const newTable = {
      id: uniqueId,
      gridPosition,
      gridSize: {
        width: Math.round(size.width / gridSize[0]),
        height: Math.round(size.height / gridSize[1]),
      },
      color,
      text: `${newTableNumber}번 테이블`,
      fontSize: fontSize,
      sectionId: selectedSection?.id,
    };

    try {
      const displayTable = await addTable(
        user,
        currentStore,
        selectedSection,
        newTable,
        gridSize
      );

      // 배열의 맨 뒤에 추가하도록 수정
      setTables((prevTables) => [...prevTables, displayTable]);
      setSelectedTablePosition(displayTable.position);
      setTableCount(tableCount + 1);
      handleTableChange();

      // 새로 추가된 테이블을 활성화
      handleSelectTable(displayTable.id, displayTable.position);
    } catch (error) {
      console.error('테이블 추가 실패:', error);
    }
  };

  const handleSelectTable = (id, position) => {
    console.log('TablePanel - handleSelectTable:', { id, position });

    setTables((prevTables) => {
      const updatedTables = prevTables.map((table) => ({
        ...table,
        isSelected: table.id === id,
        showOptionPannel: table.id === id,
      }));

      // 선택된 테이블을 배열의 끝으로 이동
      const selectedTable = updatedTables.find((table) => table.id === id);
      const otherTables = updatedTables.filter((table) => table.id !== id);

      // selectedTable이 존재할 때만 배열에 추가
      if (selectedTable) {
        return [...otherTables, selectedTable];
      } else {
        return updatedTables;
      }
    });

    setOptionPannelId(id);

    // position이 undefined일 경우 테이블에서 position 찾기
    const selectedTable = tables.find((table) => table.id === id);
    setSelectedTablePosition(position || selectedTable?.position);
  };

  const handleEditTable = async (id, updates) => {
    editTable(id, updates);
    handleTableChange();
  };

  const handleDeleteTable = async (id) => {
    deleteTable(id);
    handleTableChange();
  };

  // 테이블 편집 모드가 변경될 때마다 상태 업데이트
  useEffect(() => {
    if (!isTableEditing) {
      setUnsavedChanges(false);
      // 편 모드 종료 시에만 선택 상태 초기화
      setTables((prevTables) =>
        prevTables.map((table) => ({
          ...table,
          isSelected: false,
        }))
      );
      setOptionPannelId(null);
    }
  }, [isTableEditing, setTables]);

  // 섹션이 변경될 때 현재 테이블 변경사항 저장
  useEffect(() => {
    if (isTableEditing && unsavedChanges) {
      saveTableChanges();
    }
    setOptionPannelId(null);
    setSelectedTablePosition(null);
  }, [selectedSection, isTableEditing, unsavedChanges, saveTableChanges]);

  return (
    <div className={styles.tableContainer}>
      {isEditingSpace && <div className={styles.overlay}></div>}
      <div className={styles.gridWrapper}>
        <Grid
          gridSize={gridSize}
          gridRef={gridRef}
          tables={tables}
          selectTable={handleSelectTable}
          editTable={handleEditTable}
          deleteTable={handleDeleteTable}
          optionPannelId={optionPannelId}
          setOptionPannelId={setOptionPannelId}
          viewMode={viewMode}
          setViewMode={setViewMode}
          fontSize={fontSize}
          fontSizeToggle={fontSizeToggle}
          handleFontSizeToggle={handleFontSizeToggle}
          isTableEditing={isTableEditing}
          handleAddTable={handleAddTable}
        >
          {isTableEditing && tables.length === 0 && (
            <TableAddButton
              ref={addButtonRef}
              gridRef={gridRef}
              gridSize={gridSize}
              onAddTable={handleAddTable}
            />
          )}
        </Grid>
      </div>
    </div>
  );
}
