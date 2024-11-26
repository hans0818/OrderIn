// src/hooks/SectionManager.js
import { useState, useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebase';
import {
  syncSections,
  addSection,
  deleteSectionWithTables,
  updateSectionOrder,
  updateSectionName,
} from '../utils/firebase/sectionUtils';
import { fetchCurrentStore } from '../utils/firebase/storeUtils';

export function useSectionManager() {
  const [user] = useAuthState(auth);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [currentStore, setCurrentStore] = useState(null);
  const isInitialLoadRef = useRef(true);

  // 현재 스토어 정보 가져오기
  useEffect(() => {
    if (user) {
      fetchCurrentStore(user).then(setCurrentStore);
    }
  }, [user]);

  // 섹션 데이터 초기화 및 동기화
  useEffect(() => {
    if (user && currentStore) {
      const unsubscribe = syncSections(
        user,
        currentStore,
        setSections,
        setSelectedSection,
        isInitialLoadRef
      );
      return () => unsubscribe();
    }
  }, [user, currentStore]);

  // 섹션 추가
  const addNewSection = async () => {
    if (sections.length >= 5) {
      console.log('섹션은 최대 5개까지만 생성 가능합니다.');
      return;
    }

    const newSection = await addSection(
      user,
      currentStore,
      `섹션 ${sections.length + 1}`,
      sections.length
    );
    setSections([...sections, newSection]);
  };

  // 섹션 삭제
  const deleteSection = async (id) => {
    if (sections.length <= 1) return;

    await deleteSectionWithTables(user, currentStore, id);
    setSections((prev) => prev.filter((section) => section.id !== id));

    if (selectedSection?.id === id) {
      setSelectedSection(sections[0]);
    }
  };

  // 섹션 순서 변경
  const moveSection = async (index, direction) => {
    const newSections = [...sections];
    if (direction === 'left' && index > 0) {
      [newSections[index - 1], newSections[index]] = [
        newSections[index],
        newSections[index - 1],
      ];
    } else if (direction === 'right' && index < newSections.length - 1) {
      [newSections[index + 1], newSections[index]] = [
        newSections[index],
        newSections[index + 1],
      ];
    }

    await updateSectionOrder(user, currentStore, newSections);
    setSections(newSections);
  };

  // 섹션 이름 변경
  const handleSectionNameChange = async (id, newName) => {
    await updateSectionName(user, currentStore, id, newName);
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, name: newName } : section
      )
    );

    if (selectedSection?.id === id) {
      setSelectedSection((prev) => ({ ...prev, name: newName }));
    }
  };

  // 섹션 선택 처리
  const handleSectionClick = (sectionName) => {
    const section = sections.find((s) => s.name === sectionName);
    if (section) {
      setSelectedSection(section);
    }
  };

  return {
    sections,
    selectedSection,
    addNewSection,
    deleteSection,
    handleSectionClick,
    handleSectionNameChange,
    moveSection,
    startEditingSection: setEditingSectionId,
    stopEditingSection: () => setEditingSectionId(null),
    editingSectionId,
  };
}
