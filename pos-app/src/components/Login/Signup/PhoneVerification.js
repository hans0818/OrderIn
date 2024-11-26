import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { auth, db } from '../../../firebase/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import styles from './PhoneVerification.module.css';

function PhoneVerification({ phone, onVerificationComplete, userData }) {
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState('send');

  const handleSendVerification = async () => {
    try {
      setStep('verify');
      setError('');
      console.log('개발 환경: 인증번호 전송 시뮬레이션');
    } catch (err) {
      setError('인증번호 전송에 실패했습니다. 다시 시도해주세요.');
      console.error(err);
    }
  };

  const saveUserData = async () => {
    try {
      console.log('저장할 사용자 데이터:', userData);

      // Firebase Authentication에 사용자 생성
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      // Firestore에 사용자 추가 정보 저장
      const userDocData = {
        name: userData.name,
        ssn: userData.ssn,
        ssnGender: userData.ssnGender,
        phone: userData.phone,
        email: userData.email,
        username: userData.username.toLowerCase(),
        createdAt: new Date().toISOString(),
      };

      console.log('Firestore에 저장되는 데이터:', userDocData);

      await setDoc(doc(db, 'users', userCredential.user.uid), userDocData);

      console.log('데이터 저장 성공:', userCredential.user.uid);
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('이미 사용 중인 이메일입니다.');
      } else {
        setError('회원가입 중 오류가 발생했습니다.');
      }
      return false;
    }
  };

  const handleVerifyCode = async () => {
    try {
      if (verificationCode.length === 6) {
        console.log('개발 환경: 인증 완료 시뮬레이션');
        
        // 사용자 데이터 저장
        const success = await saveUserData();
        
        if (success) {
          alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
          navigate('/login');
        }
      } else {
        setError('6자리 인증번호를 입력해주세요.');
      }
    } catch (err) {
      setError('잘못된 인증번호입니다. 다시 확인해주세요.');
      console.error(err);
    }
  };

  return (
    <div className={styles.verificationContainer}>
      {step === 'send' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.verificationStep}
        >
          <h3>휴대폰 인증</h3>
          <p>입력하신 번호: {phone}</p>
          <div className={styles.notice}>
            <p>⚠ 현재 개발 환경에서는 실제 인증이 진행되지 않습니다.</p>
            <p>정식 서비스에서는 실제 인증이 진행됩니다.</p>
          </div>
          <button 
            onClick={handleSendVerification} 
            className={styles.sendButton}
            type="button"
          >
            인증번호 전송
          </button>
        </motion.div>
      )}

      {step === 'verify' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.verificationStep}
        >
          <h3>인증번호 입력</h3>
          <p>휴대폰으로 전송된 6자리 인증번호를 입력해주세요</p>
          <div className={styles.notice}>
            <p>⚠️ 개발 환경: 아무 6자리 숫자나 입력하세요.</p>
          </div>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
            maxLength={6}
            placeholder="인증번호 6자리"
            className={styles.codeInput}
          />
          <div className={styles.buttonGroup}>
            <button onClick={() => setStep('send')} className={styles.resendButton}>
              다시 받기
            </button>
            <button onClick={handleVerifyCode} className={styles.verifyButton}>
              확인
            </button>
          </div>
        </motion.div>
      )}

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default PhoneVerification;
