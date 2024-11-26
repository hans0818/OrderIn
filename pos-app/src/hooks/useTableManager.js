import { useState } from 'react';

const useTableManager = (initialTables = []) => {
  const [tables, setTables] = useState(initialTables);

  const addTable = (newTable) => {
    setTables((prevTables) => {
      const updatedTables = prevTables.map((table) => ({
        ...table,
        isSelected: false,
        showOptionPannel: false,
      }));
      return [...updatedTables, newTable];
    });
  };

  const editTable = (id, updatedProperties) => {
    setTables((prevTables) =>
      prevTables.map((table) =>
        table.id === id ? { ...table, ...updatedProperties } : table
      )
    );
  };  

  const deleteTable = (id) => {
    setTables((prevTables) => prevTables.filter((table) => table.id !== id));
  };

  const selectTable = (id) => {
    setTables((prevTables) => {
      if (!id) {
        return prevTables.map(table => ({
          ...table,
          isSelected: false,
          showOptionPannel: false,
        }));
      }

      return prevTables.map(table => ({
        ...table,
        isSelected: table.id === id,
        showOptionPannel: table.id === id,
      }));
    });
  };

  return {
    tables,
    setTables,
    addTable,
    editTable,
    deleteTable,
    selectTable,
  };
};

export default useTableManager;
