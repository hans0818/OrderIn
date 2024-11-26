import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import Header from './components/Header/Header';
import MainContent from './components/MainContent/MainContent';
import { useSectionManager } from './hooks/SectionManager';
import styles from './Pos.module.css';
import KioskModal from './components/Header/PosFunction/KioskModal';

function Pos() {
  const {
    sections,
    selectedSection,
    addNewSection,
    deleteSection,
    handleSectionClick,
    handleSectionNameChange,
    moveSection,
    startEditingSection,
    stopEditingSection,
    editingSectionId,
  } = useSectionManager();

  const [isEditingSpace, setIsEditingSpace] = useState(false);
  const [isTableEditing, setIsTableEditing] = useState(false);
  const [saveTableChangesHandler, setSaveTableChangesHandler] = useState(() => async () => {
    console.log('초기 saveTableChangesHandler');
  });
  const [isMenuEditing, setIsMenuEditing] = useState(false);
  const [showKioskModal, setShowKioskModal] = useState(false);
  const [kioskTables, setKioskTables] = useState([]);

  const [sectionTables, setSectionTables] = useState([]);

  useEffect(() => {
    if (selectedSection) {
      const tables = selectedSection.tables || [];
      setSectionTables(tables);
    }
  }, [selectedSection]);

  const handleEditSection = () => {
    setIsEditingSpace(true);
  };

  const handleTableEdit = () => {
    setIsTableEditing(true);
  };

  const handleMenuEdit = () => {
    setIsMenuEditing(true);
  };

  const resetSpaceEditing = async () => {
    console.log('resetSpaceEditing 시작', { isEditingSpace, isTableEditing, isMenuEditing });
    try {
      if (isTableEditing && saveTableChangesHandler) {
        console.log('테이블 변경사항 저장 시도');
        await saveTableChangesHandler();
        console.log('테이블 변경사항 저장 성공');
      }
      
      setIsEditingSpace(false);
      setIsTableEditing(false);
      setIsMenuEditing(false);
      console.log('편집 모드 상태 변경 완료');
    } catch (error) {
      console.error('resetSpaceEditing 실패:', error);
      setIsEditingSpace(false);
      setIsTableEditing(false);
      setIsMenuEditing(false);
    }
  };

  const handleSaveTableChanges = useCallback((saveFunction) => {
    setSaveTableChangesHandler(() => saveFunction);
  }, []);

  const handleOpenKioskModal = (tables) => {
    setKioskTables(tables);
    setShowKioskModal(true);
  };

  const handleCloseKioskModal = () => {
    setShowKioskModal(false);
    setKioskTables([]);
  };

  return (
    <div className={styles.pos}>
      <Header
        resetSpaceEditing={resetSpaceEditing}
        isEditingSpace={isEditingSpace}
        isTableEditing={isTableEditing}
        isMenuEditing={isMenuEditing}
        onEditSection={handleEditSection}
        onMenuEdit={handleMenuEdit}
        onTableEdit={handleTableEdit}
        tables={sectionTables}
        onOpenKioskModal={handleOpenKioskModal}
      />
      <Sidebar
        onEditSection={handleEditSection}
        onTableEdit={handleTableEdit}
        onMenuEdit={handleMenuEdit}
        isEditingSpace={isEditingSpace}
        isTableEditing={isTableEditing}
        isMenuEditing={isMenuEditing}
      />
      <main className={styles.main}>
        <MainContent
          sections={sections}
          addNewSection={addNewSection}
          deleteSection={deleteSection}
          isEditingSpace={isEditingSpace}
          isTableEditing={isTableEditing}
          selectedSection={selectedSection}
          onSectionClick={handleSectionClick}
          moveSection={moveSection}
          handleSectionNameChange={handleSectionNameChange}
          startEditingSection={startEditingSection}
          stopEditingSection={stopEditingSection}
          editingSectionId={editingSectionId}
          resetSpaceEditing={resetSpaceEditing}
          onSaveTableChanges={handleSaveTableChanges}
          isMenuEditing={isMenuEditing}
        />
        {isEditingSpace && <div className={styles.overlay}></div>}
      </main>
      <KioskModal 
        isOpen={showKioskModal}
        onClose={handleCloseKioskModal}
        tables={kioskTables}
      />
    </div>
  );
}

export default Pos;
