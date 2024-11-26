import React, { useEffect } from 'react';
import styles from './MainContent.module.css';
import SectionPanel from './SectionPanel';
import TablePanel from './TablePanel';
import MenuPanel from './MenuPanel/MenuPanel';
import useViewSettings from '../../hooks/useViewSettings';

function MainContent({
  sections,
  addNewSection,
  deleteSection,
  isEditingSpace,
  isTableEditing,
  selectedSection,
  onSectionClick,
  moveSection,
  handleSectionNameChange,
  startEditingSection,
  stopEditingSection,
  editingSectionId,
  resetSpaceEditing,
  onSaveTableChanges,
  isMenuEditing,
}) {
  const {
    viewMode,
    setViewMode,
    fontSize,
    fontSizeToggle,
    handleFontSizeToggle,
  } = useViewSettings();

  useEffect(() => {
    if (sections.length > 0 && !selectedSection) {
      onSectionClick(sections[0].name);
    }
  }, [sections, selectedSection, onSectionClick]);

  return (
    <div
      className={styles.mainContent}
      style={{ backgroundColor: viewMode === 'light' ? '#e7e6e6' : '#333333' }}
    >
      {isMenuEditing ? (
        <MenuPanel isMenuEditing={isMenuEditing} />
      ) : (
        <>
          <SectionPanel
            sections={sections}
            addNewSection={addNewSection}
            deleteSection={deleteSection}
            isEditingSpace={isEditingSpace}
            selectedSection={selectedSection}
            onSectionClick={onSectionClick}
            moveSection={moveSection}
            handleSectionNameChange={handleSectionNameChange}
            startEditingSection={startEditingSection}
            stopEditingSection={stopEditingSection}
            editingSectionId={editingSectionId}
            viewMode={viewMode}
          />
          <TablePanel
            isEditingSpace={isEditingSpace}
            isTableEditing={isTableEditing}
            viewMode={viewMode}
            setViewMode={setViewMode}
            fontSize={fontSize}
            fontSizeToggle={fontSizeToggle}
            handleFontSizeToggle={handleFontSizeToggle}
            onSaveTableChanges={onSaveTableChanges}
            selectedSection={selectedSection}
          />
        </>
      )}
    </div>
  );
}

export default MainContent;
