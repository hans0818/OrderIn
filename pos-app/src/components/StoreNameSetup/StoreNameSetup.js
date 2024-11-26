import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebase';
import styles from './StoreNameSetup.module.css';

function StoreNameSetup() {
  const [storeName, setStoreName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!storeName) {
      setError('가게 이름을 입력해주세요.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const storesRef = collection(userRef, 'stores');
        const storeDoc = doc(storesRef, storeName);
        await setDoc(storeDoc, { storeName });
        navigate('/pos');
      }
    } catch (error) {
      console.error('가게 이름 저장 실패:', error);
      setError('가게 이름 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className={styles.storeNameSetupContainer}>
      <form className={styles.storeNameForm} onSubmit={handleSubmit}>
        <h2 className={styles.title}>가게 이름 설정</h2>
        <input className={styles.input} type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="가게 이름을 입력하세요" required />
        {error && <div className={styles.error}>{error}</div>}
        <button className={styles.button} type="submit">확인</button>
      </form>
    </div>
  );
}

export default StoreNameSetup; 