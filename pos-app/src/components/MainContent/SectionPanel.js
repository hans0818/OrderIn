// src/components/MainContent/SectionPanel.jsx
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './MainContent.module.css';
import LeftArrowIcon from './Sectionicons/LeftArrowIcon';
import RightArrowIcon from './Sectionicons/RightArrowIcon';
import AddIcon from './Sectionicons/AddIcon';
import DeleteIcon from './Sectionicons/DeleteIcon';
import SectionDeleteIcon from './Sectionicons/SectionDeleteIcon';
import SortIcon from './Sectionicons/SortIcon';

export default function SectionPanel({
  sections,
  addNewSection,
  deleteSection,
  isEditingSpace,
  selectedSection,
  onSectionClick,
  moveSection,
  handleSectionNameChange,
  startEditingSection,
  stopEditingSection,
  editingSectionId,
  viewMode,
}) {
  const [tempName, setTempName] = useState('');
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  // 섹션 이름 수정 후 저장
  const handleBlur = useCallback(
    async (id) => {
      handleSectionNameChange(id, tempName);
      stopEditingSection();
    },
    [tempName, handleSectionNameChange, stopEditingSection]
  );

  // 더블 클릭 시 섹션 이름 수정
  const handleDoubleClick = useCallback(
    (id, name) => {
      if (isEditingSpace) {
        startEditingSection(id);
        setTempName(name);
      }
    },
    [startEditingSection, isEditingSpace]
  );

  const handleKeyDown = useCallback(
    (e, id) => {
      if (e.key === 'Enter') {
        handleBlur(id);
      }
    },
    [handleBlur]
  );

  const handleSectionClickWrapper = useCallback(
    (name) => {
      onSectionClick(name);
    },
    [onSectionClick]
  );

  // 딜리트 모드와 기본 모드를 토글하는 함수
  const toggleDeleteMode = () => {
    setIsDeleteMode((prev) => !prev);
  };

  return (
    <div
      className={`${styles.sectionPanel} ${
        viewMode === 'dark' ? styles.darkMode : styles.lightMode
      }`}
    >
      <AnimatePresence>
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={`${styles.sectionBox} ${
              !isEditingSpace && selectedSection?.name === section.name
                ? styles.selected
                : ''
            }`}
            onClick={() => handleSectionClickWrapper(section.name)}
            onDoubleClick={() => handleDoubleClick(section.id, section.name)}
          >
            {/* 공간 편집 모드일 때만 좌우 화살표와 삭제 버튼 표시 */}
            {isEditingSpace && (
              <>
                {!isDeleteMode && index !== 0 && (
                  <LeftArrowIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSection(index, 'left');
                    }}
                  />
                )}

                {editingSectionId === section.id ? (
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onBlur={() => handleBlur(section.id)}
                    onKeyDown={(e) => handleKeyDown(e, section.id)}
                    autoFocus
                    className={styles.sectionInput}
                  />
                ) : (
                  <p className={styles.sectionText}>{section.name}</p>
                )}

                {!isDeleteMode && index !== sections.length - 1 && (
                  <RightArrowIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSection(index, 'right');
                    }}
                  />
                )}

                {/* 딜리트 모드일 때만 삭제 버튼 표시 */}
                {isDeleteMode && (
                  <button
                    className={styles.deleteSectionButton}
                    onClick={() => deleteSection(section.id)}
                  >
                    <SectionDeleteIcon />
                  </button>
                )}
              </>
            )}
            {/* 공간 편집 모드가 아닐 때는 이름만 표시 */}
            {!isEditingSpace && (
              <p className={styles.sectionText}>{section.name}</p>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 공간 편집 모드일 때만 하단 버튼들 표시 */}
      {isEditingSpace && (
        <div className={styles.buttonContainer}>
          {sections.length < 5 && (
            <button className={styles.addButton} onClick={addNewSection}>
              <AddIcon />
            </button>
          )}
          <button className={styles.deleteButton} onClick={toggleDeleteMode}>
            {isDeleteMode ? <SortIcon /> : <DeleteIcon />}
          </button>
        </div>
      )}
    </div>
  );
}
