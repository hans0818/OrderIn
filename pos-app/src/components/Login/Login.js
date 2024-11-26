import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import { db } from '../../firebase/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import styles from './Login.module.css';

function Login() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 먼저 username으로 사용자의 이메일 찾기
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', credentials.username.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('등록되지 않은 아이디입니다.');
        return;
      }

      // 찾은 사용자의 이메일로 로그인
      const userDoc = querySnapshot.docs[0];
      const userEmail = userDoc.data().email;

      await signInWithEmailAndPassword(auth, userEmail, credentials.password);

      // 가게 이름 확인
      const userRef = doc(db, 'users', userDoc.id);
      const userDocSnapshot = await getDoc(userRef);
      if (userDocSnapshot.exists()) {
        const storesRef = collection(userRef, 'stores');
        const storeSnapshot = await getDocs(storesRef);
        if (storeSnapshot.empty) {
          navigate('/store-name-setup');
          return;
        }
      }

      navigate('/pos');
    } catch (error) {
      console.error('로그인 실패:', error);
      switch (error.code) {
        case 'auth/wrong-password':
          setError('비밀번호가 올바르지 않습니다.');
          break;
        case 'auth/too-many-requests':
          setError('너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.');
          break;
        default:
          setError('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="username">아이디</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.loginButton}>
            로그인
          </button>
          <div className={styles.links}>
            <Link to="/find-account">아이디/비밀번호 찾기</Link>
            <Link to="/terms">회원가입</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
