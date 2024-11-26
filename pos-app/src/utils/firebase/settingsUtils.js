import { setDoc, getDoc } from 'firebase/firestore';
import { getSettingsRef } from './paths';

export const loadSettings = async (user, currentStore) => {
  if (!user || !currentStore) return null;

  const settingsRef = getSettingsRef(user.uid, currentStore);
  const settingsSnap = await getDoc(settingsRef);

  if (settingsSnap.exists()) {
    return settingsSnap.data();
  } else {
    const defaultSettings = {
      viewMode: 'light',
      fontSize: 14
    };
    await setDoc(settingsRef, defaultSettings);
    return defaultSettings;
  }
};

export const saveSettings = async (user, currentStore, settingsData) => {
  if (!user || !currentStore) return;

  const settingsRef = getSettingsRef(user.uid, currentStore);
  await setDoc(settingsRef, settingsData);
}; 