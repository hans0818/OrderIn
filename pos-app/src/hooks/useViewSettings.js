import { useState, useEffect, useCallback } from 'react';
import { auth } from '../firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { fetchCurrentStore } from '../utils/firebase/storeUtils';
import { loadSettings, saveSettings } from '../utils/firebase/settingsUtils';

const useViewSettings = () => {
  const [user] = useAuthState(auth);
  const [viewMode, setViewMode] = useState('light');
  const [fontSize, setFontSize] = useState(14);
  const [fontSizeToggle, setFontSizeToggle] = useState(0);
  const [currentStore, setCurrentStore] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 현재 스토어 정보 가져오기
  useEffect(() => {
    if (user) {
      fetchCurrentStore(user).then(setCurrentStore);
    }
  }, [user]);

  // 설정 로드
  useEffect(() => {
    const initializeSettings = async () => {
      if (!user || !currentStore || isInitialized) return;

      try {
        const settings = await loadSettings(user, currentStore);
        if (settings) {
          if (settings.viewMode) {
            setViewMode(settings.viewMode);
          }
          if (settings.fontSize) {
            setFontSize(settings.fontSize);
            setFontSizeToggle(Math.floor((settings.fontSize - 14) / 4));
          }
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('설정 로드 실패:', error);
      }
    };

    initializeSettings();
  }, [user, currentStore, isInitialized]);

  // 설정 저장
  const saveSettingsCallback = useCallback(async () => {
    if (!user || !currentStore || !isInitialized) return;

    try {
      const settingsData = { viewMode, fontSize };
      await saveSettings(user, currentStore, settingsData);
    } catch (error) {
      console.error('설정 저장 실패:', error);
    }
  }, [user, currentStore, viewMode, fontSize, isInitialized]);

  // 설정 변경 시 저장
  useEffect(() => {
    if (isInitialized) {
      const timeoutId = setTimeout(() => {
        saveSettingsCallback();
      }, 500); // 디바운스 추가

      return () => clearTimeout(timeoutId);
    }
  }, [isInitialized, saveSettingsCallback]);

  return {
    viewMode,
    setViewMode: useCallback((mode) => {
      setViewMode(mode);
    }, []),
    fontSize,
    fontSizeToggle,
    handleFontSizeToggle: useCallback((idx) => {
      const size = idx === 0 ? 14 : idx === 1 ? 18 : 22;
      setFontSize(size);
      setFontSizeToggle(idx);
    }, []),
  };
};

export default useViewSettings;
