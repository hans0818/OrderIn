export default function TablePanel({ isEditingSpace, isTableEditing, /* ... other props ... */ }) {
  // ... existing state ...

  const handleAddTable = async (newTableData) => {
    try {
      const displayTable = await addTable(
        user,
        currentStore,
        selectedSection,
        newTableData,
        gridSize
      );

      // 테이블 추가 후 상태 업데이트
      setTables(prevTables => [...prevTables, displayTable]);
      setSelectedTablePosition(displayTable.position);
      handleTableChange(); // 변경 사항 감지
      
      // 새로 추가된 테이블 선택
      handleSelectTable(displayTable.id, displayTable.position);
      
      console.log('테이블 추가 완료:', displayTable);
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
        position: table.id === id ? (position || table.position) : table.position // position 유지
      }));

      const selectedTable = updatedTables.find((table) => table.id === id);
      const otherTables = updatedTables.filter((table) => table.id !== id);

      return selectedTable ? [...otherTables, selectedTable] : updatedTables;
    });

    setOptionPannelId(id);
    setSelectedTablePosition(position || tables.find(t => t.id === id)?.position);
  };

  const debouncedSaveTableChanges = useCallback(
    debounce(async () => {
      try {
        await saveTables(user, currentStore, selectedSection, tables, gridSize);
        setUnsavedChanges(false);
      } catch (error) {
        console.error('테이블 저장 실패:', error);
      }
    }, 500),
    [user, currentStore, selectedSection, tables, gridSize]
  );

  const saveTableChanges = useCallback(async () => {
    if (!unsavedChanges) return; // 변경사항이 없으면 저장하지 않음
    
    try {
      console.log('테이블 저장 시작:', tables);
      await saveTables(user, currentStore, selectedSection, tables, gridSize);
      setUnsavedChanges(false);
      console.log('테이블 저장 완료');
    } catch (error) {
      console.error('테이블 저장 실패:', error);
    }
  }, [user, currentStore, selectedSection, tables, gridSize, unsavedChanges]);

  const handleTableChange = useCallback(() => {
    if (isTableEditing) {
      setUnsavedChanges(true);
      console.log('테이블 변경 감지, 저장 대기');
    }
  }, [isTableEditing]);

  const handleTableUpdate = useCallback((tableId, updates, localOnly = false) => {
    setTables(prevTables => {
      const updatedTables = prevTables.map(table => 
        table.id === tableId ? { ...table, ...updates } : table
      );
      
      if (!localOnly) {
        handleTableChange(); // 변경 사항 감지
      }
      
      return updatedTables;
    });
  }, [handleTableChange]);

  // ... rest of the code ...
} 